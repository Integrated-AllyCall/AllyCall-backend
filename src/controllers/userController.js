import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getUser = async (req, res) => {
  try {
    const id = req.body;
    const user = await prisma.users.findFirst({
      where: { firebase_uid: id },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user data" });
  }
};

export const createUser = async (req, res) => {
  const { id, username, email } = req.body;
  try {
    const user = await prisma.users.create({
      data: {
        id,
        username,
        email,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    console.error("Failed to create user:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
