import express from "express";
import { Prisma } from "../config/db.js";
import { protect } from "../middleware/authMiddleware.js";

export const orderRoute = Route();

/**
 * @swagger
 * /api/orders/my-orders:
 *   get:
 *     summary: Get logged-in user's orders
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 */

// @route   GET /api/orders/my-orders
// @desc    Get logged-in user's orders
// @access  Private
orderRoute.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Prisma.order.findMany({
      where: {
        userId: req.user.id,
      },
      data: {},
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Get user orders error:", error);

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

orderRoute.get("/:id", protect, async (req, res) => {
  try {
    const order = await Prisma.order.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Prevent a user from viewing another user's order
    if (order.userId !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to view this order",
      });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error("Get order details error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});
