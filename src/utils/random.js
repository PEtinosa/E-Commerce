

// forgotpass
authRouter.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const code = generate_code(6);

    // Check if email was provided
    if (!email) {
      return res.status(400).json({
        message: "Email is required.",
      });
    }

    // Check if the user exists
    const exist_user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!exist_user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // Send the OTP to the user's email
    send_mail({
      recipient_email: exist_user.email,
      email_type: "forgot password",
      template: `${exist_user.first_name}, your password reset OTP is ${code}.`,
    });

    // Check if the user already has a verification record
    const verification = await prisma.verification.findFirst({
      where: {
        user_id: exist_user.id,
      },
    });

    // Update the existing verification code
    if (verification) {
      await prisma.verification.update({
        where: {
          id: verification.id,
        },
        data: {
          code: code,
        },
      });
    }

    // Create a new verification record if none exists
    else {
      await prisma.verification.create({
        data: {
          user_id: exist_user.id,
          code: code,
        },
      });
    }

    return res.status(200).json({
      message: "OTP sent successfully.",
    });

  } catch (error) {
    console.log("Error occurred:", error.message);

    return res.status(500).json({
      message: error.message,
    });
  }

});

authRouter.post("/reset-password", async (req, res) => {
  try {
    const { password, code } = req.body;

    // Check that all required fields were provided
    if (!password || !code) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    // Check if the verification code exists
    const actual_code = await prisma.verification.findUnique({
      where: {
        code: code,
      },
    });

    if (!actual_code) {
      return res.status(400).json({
        message: "Invalid code.",
      });
    }

    // Check if the user exists
    const exist_user = await prisma.user.findUnique({
      where: {
        id: actual_code.user_id,
      },
    });

    if (!exist_user) {
      return res.status(400).json({
        message: "Invalid code.",
      });
    }

    // Hash the new password
    const hashed_password = await bcrypt.hash(password, 5);

    // Update the user's password
    await prisma.user.update({
      where: {
        id: exist_user.id,
      },
      data: {
        password: hashed_password,
      },
    });

    // Delete the verification record so the code cannot be reused
    await prisma.verification.delete({
      where: {
        code: code,
      },
    });

    return res.status(200).json({
      message: "Password reset successfully.",
    });

  } catch (error) {
    console.log("Error occurred:", error.message);

    return res.status(500).json({
      message: error.message,
    });
  }
});

authRouter.put("/change-password", async (req, res) => {
  const { id, current_password, new_password } = req.body;

  try {
    // Check that all fields are provided
    if (!id || !current_password || !new_password) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    // Check if the user exists
    const exist_user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!exist_user) {
      return res.status(400).json({
        message: "Invalid user.",
      });
    }

    // Check if the current password is correct
    const is_match = await bcrypt.compare(
      current_password,
      exist_user.password
    );

    if (!is_match) {
      return res.status(401).json({
        message: "Current password is incorrect.",
      });
    }

    // Hash the new password
    const hashed_password = await bcrypt.hash(new_password, 5);

    // Update the user's password
    await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        password: hashed_password,
      },
    });

    return res.status(200).json({
      message: "Password changed successfully.",
    });

  } catch (error) {
    console.log("Error occurred:", error.message);

    return res.status(500).json({
      message: error.message,
    });
  }
});

authRouter.post("/reset-password", async (req, res) => {
  const { password, code } = req.body;

  try {
    // Check that all required fields are provided
    if (!password || !code) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    // Check if the verification code exists
    const actual_code = await prisma.verification.findUnique({
      where: {
        code: code,
      },
    });

    // Invalid or expired code
    if (!actual_code) {
      return res.status(400).json({
        message: "Invalid code.",
      });
    }

    // Find the user attached to the verification code
    const exist_user = await prisma.user.findUnique({
      where: {
        id: actual_code.user_id,
      },
    });

    // User no longer exists
    if (!exist_user) {
      return res.status(400).json({
        message: "Invalid code.",
      });
    }

    // Hash the new password
    const hashed_password = await bcrypt.hash(password, 5);

    // Update the user's password
    await prisma.user.update({
      where: {
        id: exist_user.id,
      },
      data: {
        password: hashed_password,
      },
    });

    // Delete the verification record so the code cannot be reused
    await prisma.verification.delete({
      where: {
        code: code,
      },
    });

    // Success response
    return res.status(200).json({
      message: "Password reset successfully.",
    });

  } catch (error) {
    console.log("Error occurred:", error.message);

    return res.status(500).json({
      message: error.message,
    });
  }
});

authRouter.put("/change-password", authMiddleware, async (req, res) => {
  const { current_password, new_password } = req.body;

  try {
    // Check that all fields are provided
    if (!current_password || !new_password) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    // Find the authenticated user
    const exist_user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    // Check if the user exists
    if (!exist_user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // Check if the current password is correct
    const is_match = await bcrypt.compare(
      current_password,
      exist_user.password
    );

    // Edge case
    if (!is_match) {
      return res.status(401).json({
        message: "Current password is incorrect.",
      });
    }

    // Hash the new password
    const hashed_password = await bcrypt.hash(new_password, 5);

    // Update the user's password
    await prisma.user.update({
      where: {
        id: req.user.id
      },
      data: {
        password: hashed_password,
      },
    });

    return res.status(200).json({
      message: "Password changed successfully.",
    });

  } catch (error) {
    console.log("error occurred:", error.message);

    return res.status(500).json({
      message: error.message,
    });
  }
});

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "tutorial api documentation",
            version: "1.0.0",
            description: "this shows a simple tutorial api documentation",
        },

        servers: [
            {
                url: "http://localhost:5001",
            },
            // production server
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },

    apis: ["./src/routes/*.js"],
};

// create an object of js docs
const swaggerSpecs = swaggerJSDoc(options);

export const swaggerSetup = (app) => {
    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpecs)
    );
};