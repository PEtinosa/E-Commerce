import { express } from "express";
import { product } from "../models/user.prisma";
import { protect, admin } from "../middleware,authMidleware";

export const router = Router();

// @route GET /api/admin/products
// @desc Get all products (Admin only)
// @access private
router.get("/", protect, admin, async (req, res) => {
  try {
    const product = await product.find({});
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});
