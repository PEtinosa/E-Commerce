import { Router } from "express";
import { Prisma } from "../config/db.js";
import { protect } from "../middleware/authMiddleware.js";

export const checkoutRoute = Router();

/**
 * @swagger
 * /checkout:
 *   post:
 *     summary: Create a new checkout
 *     description: Creates a checkout session for the authenticated user.
 *     tags:
 *       - Checkout
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - checkoutItems
 *               - shippingAddress
 *               - paymentMethod
 *               - totalPrice
 *             properties:
 *               checkoutItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     image:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                     price:
 *                       type: number
 *                     size:
 *                       type: string
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   address:
 *                     type: string
 *                   city:
 *                     type: string
 *                   postalCode:
 *                     type: string
 *                   country:
 *                     type: string
 *               paymentMethod:
 *                 type: string
 *                 example: Paystack
 *               totalPrice:
 *                 type: number
 *                 example: 25000
 *     responses:
 *       201:
 *         description: Checkout created successfully
 *       400:
 *         description: Invalid checkout data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

checkoutRoute.post("/", protect, async (req, res) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } =
    req.body;

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({
      message: "No items in checkout",
    });
  }

  if (!shippingAddress || !paymentMethod || !totalPrice) {
    return res.status(400).json({
      message: "Shipping address, payment method, and total price are required",
    });
  }

  try {
    const newCheckout = await Prisma.checkout.create({
      data: {
        userId: req.user.id,
        checkoutItems,
        shippingAddress,
        paymentMethod,
        totalPrice,
        paymentStatus: "pending",
        isPaid: false,
        isFinalized: false,
      },
    });

    console.log(`Checkout created for user: ${req.user.id}`);

    return res.status(201).json(newCheckout);
  } catch (error) {
    console.error("Error creating checkout session:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});

/**
 * @swagger
 * /checkout/{id}:
 *   get:
 *     summary: Get checkout by ID
 *     description: Returns details of a checkout session.
 *     tags:
 *       - Checkout
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Checkout ID
 *     responses:
 *       200:
 *         description: Checkout retrieved successfully
 *       404:
 *         description: Checkout not found
 *       401:
 *         description: Unauthorized
 */

checkoutRoute.get("/:id", protect, async (req, res) => {
  const checkout = await prisma.checkout.findUnique({
    where: {
      id: Number(req.params.id),
    },
    include: {
      checkoutItems: true,
    },
  });

  if (!checkout) {
    return res.status(404).json({
      message: "Checkout not found",
    });
  }

  res.json(checkout);
});

/**
 * @swagger
 * /checkout/{id}/pay:
 *   put:
 *     summary: Update payment status
 *     description: Marks a checkout as paid after successful payment.
 *     tags:
 *       - Checkout
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Checkout ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentStatus:
 *                 type: string
 *                 example: PAID
 *               paymentDetails:
 *                 type: object
 *     responses:
 *       200:
 *         description: Payment updated successfully
 *       400:
 *         description: Invalid payment status
 *       404:
 *         description: Checkout not found
 *       500:
 *         description: Server error
 */

checkoutRoute.put("/:id/pay", protect, async (req, res) => {
  const { paymentStatus, paymentDetails } = req.body;

  try {
    const checkout = await Prisma.checkout.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!checkout) {
      return res.status(404).json({
        message: "Checkout not found",
      });
    }

    if (checkout.userId !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to update this checkout",
      });
    }

    if (paymentStatus !== "paid") {
      return res.status(400).json({
        message: "Invalid payment status",
      });
    }

    const updatedCheckout = await Prisma.checkout.update({
      where: {
        id: req.params.id,
      },
      data: {
        isPaid: true,
        paymentStatus: "paid",
        paymentDetails,
        paidAt: new Date(),
      },
    });

    return res.status(200).json(updatedCheckout);
  } catch (error) {
    console.error("Payment update error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});

/**
 * @swagger
 * /checkout/{id}/finalize:
 *   post:
 *     summary: Finalize checkout
 *     description: Converts a paid checkout into an order.
 *     tags:
 *       - Checkout
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Checkout ID
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Checkout is unpaid or already finalized
 *       404:
 *         description: Checkout not found
 *       500:
 *         description: Server error
 */

checkoutRoute.post("/:id/finalize", protect, async (req, res) => {
  try {
    const checkout = await Prisma.checkout.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!checkout) {
      return res.status(404).json({
        message: "Checkout not found",
      });
    }

    if (checkout.userId !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to finalize this checkout",
      });
    }

    if (!checkout.isPaid) {
      return res.status(400).json({
        message: "Checkout is not paid",
      });
    }

    if (checkout.isFinalized) {
      return res.status(400).json({
        message: "Checkout already finalized",
      });
    }

    // Create order, finalize checkout, and delete cart in one transaction
    const finalOrder = await Prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: checkout.userId,
          orderItems: checkout.checkoutItems,
          shippingAddress: checkout.shippingAddress,
          paymentMethod: checkout.paymentMethod,
          totalPrice: checkout.totalPrice,
          isPaid: true,
          paidAt: checkout.paidAt,
          isDelivered: false,
          paymentStatus: "paid",
          paymentDetails: checkout.paymentDetails,
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

      return order;
    });

    return res.status(201).json(finalOrder);
  } catch (error) {
    console.error("Checkout finalize error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});

/**
 * @swagger
 * /checkout/{id}:
 *   delete:
 *     summary: Delete a checkout
 *     description: Deletes a checkout belonging to the authenticated user.
 *     tags:
 *       - Checkout
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Checkout ID
 *     responses:
 *       200:
 *         description: Checkout deleted successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Checkout not found
 *       500:
 *         description: Server error
 */

checkoutRoute.delete("/:id", protect, async (req, res) => {
  try {
    const checkoutId = Number(req.params.id);

    // Find the checkout
    const checkout = await prisma.checkout.findUnique({
      where: {
        id: checkoutId,
      },
    });

    if (!checkout) {
      return res.status(404).json({
        message: "Checkout not found",
      });
    }

    // Ensure the logged-in user owns the checkout
    if (checkout.userId !== req.user.id) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    // Delete checkout
    await prisma.checkout.delete({
      where: {
        id: checkoutId,
      },
    });

    return res.status(200).json({
      message: "Checkout deleted successfully",
    });
  } catch (error) {
    console.error("Delete checkout error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});
