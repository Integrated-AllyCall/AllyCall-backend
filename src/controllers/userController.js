import prisma from "../configs/prisma.js";

export const getUser = async (req, res) => {
  try {
    const user = await prisma.users.findMany({
      orderBy: { id: 'asc' },
    });
    res.json(user);
  } catch (error) {
    console.error("Failed to fetch users data:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.users.findUnique({
      where: { id: id },
    });
    res.json(user);
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    res.status(500).json({ error: "Something went wrong" });
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
