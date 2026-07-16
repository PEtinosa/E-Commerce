import express from "express";
import { Prisma } from "../config/db.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

export const router = Router();

// GET /api/admin/orders
// Get all orders (Admin only)
router.get("/orders", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
});

// @route PUT /api/admin/orders/:id
// @desc Update an order status
// @access Private/Admin
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Prisma.order.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const updatedOrder = await Prisma.order.update({
      where: {
        id: req.params.id,
      },
      data: {
        status: status || order.status,
        isDelivered: status === "Delivered",
        deliveredAt: status === "Delivered" ? new Date() : order.deliveredAt,
      },
    });

    return res.status(200).json(updatedOrder);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
});

// @route DELETE /api/admin/orders/:id
// @desc Delete an order
// @access Private/Admin
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const order = await Prisma.order.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    await Prisma.order.delete({
      where: {
        id: req.params.id,
      },
    });

    return res.status(200).json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
});
