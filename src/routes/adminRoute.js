import { Router } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../config/db.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

export const adminRoute = Route();

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users
 *     description: Returns a list of all registered users. Admin access only.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Server error
 */

// GET /api/admin/users
// Get all users
adminRoute.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error("Get users error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});

// @route POSt /api/admin/users
// desc Add a new user (admin only)
// @access private
// adminRoute.post("/", protect, adminOnly, async (req, res) => {
//   const { name, email, password, role } = req.body;

//   try {
//     // Check if user already exists
//     const existingUser = await Prisma.user.findUnique({
//       where: {
//         email,
//       },
//     });

//     if (existingUser) {
//       return res.status(400).json({
//         message: "User already exists",
//       });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user
//     const user = await Prisma.user.create({
//       data: {
//         name,
//         email,
//         password: hashedPassword,
//         role: role || "USER",
//       },
//     });

//     return res.status(201).json({
//       message: "User created successfully",
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error(error);

//     return res.status(500).json({
//       message: "Server Error",
//     });
//   }
// });

// PUT /api/admin/users/:id/role
// Change a user's role

adminRoute.put("/users/:id/role", protect, adminOnly, async (req, res) => {
  const { role } = req.body;

  if (!["USER", "ADMIN"].includes(role)) {
    return res.status(400).json({
      message: "Role must be USER or ADMIN",
    });
  }

  try {
    const user = await Prisma.user.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return res.status(200).json({
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "User not found",
      });
    }

    console.error("Update role error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Permanently delete a user account.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Cannot delete your own account
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

// DELETE /api/admin/users/:id
// Delete a user
adminRoute.delete("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    if (req.user.id === Number(req.params.id)) {
      return res.status(400).json({
        message: "You cannot delete your own admin account",
      });
    }

    await Prisma.user.delete({
      where: {
        id: req.params.id,
      },
    });

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "User not found",
      });
    }

    console.error("Delete user error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});
