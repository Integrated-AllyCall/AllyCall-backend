import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

export const getVideoTags = (req, res) => {
  const tags = Object.values(Prisma.video_tag);
  res.json(tags);
};
