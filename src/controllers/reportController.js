import prisma from "../configs/prisma.js";
import { report_tag } from "@prisma/client";

export const getReportTags = (req, res) => {
  try {
    const tags = Object.values(report_tag);
    res.json(tags);
  } catch (error) {
    console.error("Failed to fetch report tags:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getReport = async (req, res) => {
  try {
    const reports = await prisma.reports.findMany({
      orderBy: { id: "desc" },
    });
    res.json(reports);
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};

export const createReport = async (req, res) => {
  const { tag, title, description, latitude, longitude, user_id } = req.body;
  try {
    const report = await prisma.reports.create({
      data: {
        tag,
        title,
        description,
        latitude,
        longitude,
        user_id,
      },
    });
    res.status(201).json(report);
  } catch (error) {
    console.error("Failed to create report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const updateReport = async (req, res) => {
  const id = parseInt(req.params.id);
  const { tag, title, description, latitude, longitude } = req.body;
  try {
    const report = await prisma.reports.update({
      where: {
        id
      },
      data: {
        tag,
        title,
        description,
        latitude,
        longitude
      },
    });
    res.status(201).json(report);
  } catch (error) {
    console.error("Failed to create report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const getNearbyReports = async (req, res) => {
  const { lat, lng } = req.query;

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: "Latitude and longitude are required and must be numbers." });
  }

  const radiusKm = 10;

  try {
    // Haversine SQL
    const reports = await prisma.$queryRawUnsafe(`
      SELECT *, (
        6371 * acos(
          cos(radians(${latitude}))
          * cos(radians(latitude))
          * cos(radians(longitude) - radians(${longitude}))
          + sin(radians(${latitude})) * sin(radians(latitude))
        )
      ) AS distance
      FROM reports
      WHERE (
        6371 * acos(
          cos(radians(${latitude}))
          * cos(radians(latitude))
          * cos(radians(longitude) - radians(${longitude}))
          + sin(radians(${latitude})) * sin(radians(latitude))
        )
      ) < ${radiusKm}
      ORDER BY distance ASC
    `);

    res.json(reports);
  } catch (error) {
    console.error("Failed to fetch nearby reports:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
