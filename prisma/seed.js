import bcrypt from "bcrypt";
import { prisma } from "../src/config/db.js";

async function main() {
  const existingAdmin = await prisma.user.findUnique({
    where: {
      email: "emperorzandria@gmail.com",
    },
  });

  if (existingAdmin) {
    console.log("Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash("Admin123@", 10);

  await prisma.user.create({
    data: {
      firstName: "Admin",
      lastName: "User",
      email: "emperorzandria@gmail.com",
      password: hashedPassword,
      role: "ADMIN",
      isVerified: true,
    },
  });

  console.log("Admin created successfully");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
