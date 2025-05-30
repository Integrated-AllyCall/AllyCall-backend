import prisma from "../configs/prisma.js";
import fetch from "node-fetch";

export const getUser = async (req, res) => {
  try {
    const user = await prisma.users.findMany({
      orderBy: { id: 'asc' },
    });
    res.json(user);
  } catch (error) {
    console.error("Failed to fetch users data:", error);
    res.status(500).json({ error: "Internal server error" });
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
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserImageById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const user = await prisma.users.findUnique({
      where: { id },
    });

    if (!user || !user.image_url) {
      return res.status(404).json({ message: "User or user image not found." });
    }

    const response = await fetch(user.image_url);

    if (!response.ok) {
      return res.status(502).json({ message: `Failed to fetch image. Status: ${response.status}` });
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const buffer = await response.arrayBuffer();

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error("Failed to fetch user image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const createUser = async (req, res) => {
  const { id, username, email, image_url } = req.body;
  try {
    const user = await prisma.users.create({
      data: {
        id,
        username,
        email,
        image_url
      },
    });
    res.status(201).json(user);
  } catch (error) {
    console.error("Failed to create user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
