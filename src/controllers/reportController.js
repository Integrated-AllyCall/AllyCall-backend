import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

export const getReportTags = (req, res) => {
  const tags = Object.values(Prisma.report_tag);
  res.json(tags);
};

export const getReport = async (req, res) => {
  try {
    const reports = await prisma.reports.findMany({
      orderBy: { id: "desc" },
    });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};

export const createReport = async (req, res) => {
  const { tag, description, latitude, longitude, user_id } = req.body;
  try {
    const report = await prisma.reports.create({
      data: {
        tag,
        description,
        latitude,
        longitude,
        user_id,
      },
    });
    res.status(201).json(report);
  } catch (error) {
    console.error("Failed to create report:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

export const updateReport = async (req, res) => {
  const { tag, description, latitude, longitude, user_id} = req.body;
  try {
    const report = await prisma.reports.update({
      where: {
        user_id
      },
      data: {
        tag,
        description,
        latitude,
        longitude
      },
    });
    res.status(201).json(report);
  } catch (error) {
    console.error("Failed to create report:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
}