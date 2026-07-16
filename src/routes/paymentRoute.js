import { Router } from "express";
import { Prisma } from "../config/db.js";
import { protect } from "../middleware/authMiddleware.js";
import { router } from "./adminProductRoute.js";
import paystack from "../config/paystack.js";

export const paymentRoute = Router();

/**
 * @swagger
 * /payment/initialize:
 *   post:
 *     summary: Initialize a Paystack payment
 *     description: Creates a payment transaction and returns the Paystack authorization URL.
 *     tags:
 *       - Payment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - checkoutId
 *             properties:
 *               checkoutId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Payment initialized successfully
 *       400:
 *         description: Invalid checkout
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

paymentRoute.post("/initialize", protect, async (req, res) => {
  const { checkoutId } = req.body;

  try {
    const checkout = await Prisma.checkout.findUnique({
      where: {
        id: checkoutId,
      },
      include: {
        user: true,
      },
    });

    if (!checkout) {
      return res.status(404).json({
        message: "Checkout not found",
      });
    }

    const response = await paystack.post("/transaction/initialize", {
      email: checkout.user.email,
      amount: Math.round(checkout.totalPrice * 100), // Kobo
      metadata: {
        checkoutId: checkout.id,
        userId: checkout.userId,
      },
    });

    res.json(response.data.data);
  } catch (error) {
    console.error(error.response?.data || error);

    res.status(500).json({
      message: "Unable to initialize payment",
    });
  }
});

/**
 * @swagger
 * /payment/verify/{reference}:
 *   get:
 *     summary: Verify a Paystack payment
 *     description: Verifies a payment using the Paystack transaction reference.
 *     tags:
 *       - Payment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reference
 *         required: true
 *         schema:
 *           type: string
 *         description: Paystack payment reference
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *       400:
 *         description: Invalid reference
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Server error
 */

router.get("/verify/:reference", protect, async (req, res) => {
  try {
    const response = await paystack.get(
      `/transaction/verify/${req.params.reference}`,
    );

    const payment = response.data.data;

    if (payment.status !== "success") {
      return res.status(400).json({
        message: "Payment failed",
      });
    }

    const checkoutId = payment.metadata.checkoutId;

    const checkout = await Prisma.checkout.findUnique({
      where: {
        id: checkoutId,
      },
    });

    if (!checkout) {
      return res.status(404).json({
        message: "Checkout not found",
      });
    }

    if (checkout.isFinalized) {
      return res.json({
        message: "Order already created",
      });
    }

    const order = await Prisma.$transaction(async (tx) => {
      const updatedCheckout = await tx.checkout.update({
        where: {
          id: checkout.id,
        },
        data: {
          isPaid: true,
          paymentStatus: "paid",
          paidAt: new Date(),
        },
      });

      const newOrder = await tx.order.create({
        data: {
          userId: updatedCheckout.userId,
          orderItems: updatedCheckout.checkoutItems,
          shippingAddress: updatedCheckout.shippingAddress,
          paymentMethod: updatedCheckout.paymentMethod,
          totalPrice: updatedCheckout.totalPrice,
          isPaid: true,
          paidAt: new Date(),
          paymentStatus: "paid",
          status: "processing",
        },
      });

      await tx.checkout.update({
        where: {
          id: checkout.id,
        },
        data: {
          isFinalized: true,
          finalizedAt: new Date(),
        },
      });

      await tx.cart.deleteMany({
        where: {
          userId: checkout.userId,
        },
      });

      return newOrder;
    });

    res.json({
      message: "Payment verified successfully",
      order,
    });
  } catch (error) {
    console.error(error.response?.data || error);

    res.status(500).json({
      message: "Payment verification failed",
    });
  }
});
