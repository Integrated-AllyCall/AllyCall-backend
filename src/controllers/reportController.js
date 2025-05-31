import prisma from "../configs/prisma.js";
import { report_tag } from "@prisma/client";
import dotenv from "dotenv";
import { getCityFromCoords } from "../utils/locationUtils.js";
dotenv.config();

export const getReportTags = (req, res) => {
  try {
    const tags = Object.values(report_tag).map(tag => tag.replace(/_/g, ' '));
    res.json(tags);
  } catch (error) {
    console.error("Failed to fetch report tags:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createReport = async (req, res) => {
  const { tag, title, description, latitude, longitude, user_id } = req.body;
  let { shortAddress, longAddress, name } = req.body;
  try {
    let tagEnum;
    if (tag) {
      tagEnum = tag.replace(/ /g, '_');
    }

    if (!longAddress && !shortAddress && !name) {
      const geoRes = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GOOGLE_MAPS_API_KEY}`
      );
      const geoData = await geoRes.json();

      if (geoData.status === "OK" && geoData.results.length > 0) {
        const result = geoData.results[0];
        const components = result.address_components;

        const get = (type) =>
          components.find((c) => c.types.includes(type))?.short_name;

        longAddress = result.formatted_address;
        const district = get("sublocality") || get("sublocality_level_1");
        const city =
          get("locality") ||
          get("administrative_area_level_2") ||
          get("administrative_area_level_1");
        const country = get("country");

        shortAddress = [district, city, country].filter(Boolean).join(", ");

        const streetNumber = get("street_number");
        const route = get("route");
        name =
          get("premise") ||
          (streetNumber && route ? `${streetNumber} ${route}` : null);
      }
    }

    const report = await prisma.reports.create({
      data: {
        tag: tagEnum,
        title,
        description,
        name,
        latitude,
        longitude,
        short_address: shortAddress,
        long_address: longAddress,
        user_id,
      },
    });
    res.status(201).json({
      ...report,
      tag: report.tag.replace(/_/g, ' '),
    });

  } catch (error) {
    console.error("Failed to create report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateReport = async (req, res) => {
  const id = parseInt(req.params.id);
  const { tag, title, description, latitude, longitude } = req.body;
  let { shortAddress, longAddress, name } = req.body;
  try {
    let tagEnum;
    if (tag) {
      tagEnum = tag.replace(/ /g, '_');
    }

    if (!longAddress && !shortAddress && !name) {
      const geoRes = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GOOGLE_MAPS_API_KEY}`
      );
      const geoData = await geoRes.json();

      if (geoData.status === "OK" && geoData.results.length > 0) {
        const result = geoData.results[0];
        const components = result.address_components;

        const get = (type) =>
          components.find((c) => c.types.includes(type))?.short_name;

        longAddress = result.formatted_address;
        const district = get("sublocality") || get("sublocality_level_1");
        const city =
          get("locality") ||
          get("administrative_area_level_2") ||
          get("administrative_area_level_1");
        const country = get("country");

        shortAddress = [district, city, country].filter(Boolean).join(", ");

        const streetNumber = get("street_number");
        const route = get("route");
        name =
          get("premise") ||
          (streetNumber && route ? `${streetNumber} ${route}` : null);
      }
    }

    const report = await prisma.reports.update({
      where: {
        id,
      },
      data: {
        tag: tagEnum,
        title,
        description,
        latitude,
        longitude,
        name,
        short_address: shortAddress,
        long_address: longAddress,
      },
    });
    res.status(201).json({
      ...report,
      tag: report.tag.replace(/_/g, ' '),
    });

  } catch (error) {
    console.error("Failed to create report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getReport = async (req, res) => {
  try {
    let reports = await prisma.reports.findMany({
      orderBy: { id: "desc" },
    });
    res.json(reports.map((report) => ({
      ...report,
      tag: report.tag.replace(/_/g, ' '),
    })));
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};

export const getNearbyReports = async (req, res) => {
  const { lat, lng } = req.query;
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({
      error: "Latitude and longitude are required and must be numbers.",
    });
  }

  const city = await getCityFromCoords(latitude, longitude);
  const radiusKm = 10;

  try {
    let reports = await prisma.$queryRawUnsafe(`
      SELECT 
        r.*, 
        u.id as user_id,
        u.username as username,
        (
          6371 * acos(
            cos(radians($1))
            * cos(radians(r.latitude))
            * cos(radians(r.longitude) - radians($2))
            + sin(radians($1)) * sin(radians(r.latitude))
          )
        ) AS distance
      FROM reports r
      JOIN users u ON r.user_id = u.id
      WHERE (
        6371 * acos(
          cos(radians($1))
          * cos(radians(r.latitude))
          * cos(radians(r.longitude) - radians($2))
          + sin(radians($1)) * sin(radians(r.latitude))
        )
      ) < $3
      ORDER BY distance ASC
    `, latitude, longitude, radiusKm);

    // Format tag and attach nested user object
    reports = reports.map((report) => ({
      ...report,
      tag: report.tag.replace(/_/g, ' '),
      users: {
        id: report.user_id,
        username: report.username,
      },
    }));

    res.json({
      city: city ?? '',
      reports,
    });
  } catch (error) {
    console.error("Failed to fetch nearby reports:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const getReportByUserId = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const reports = await prisma.reports.findMany({
      where: { user_id: id },
      include: {
        users: {
          select: {
            id: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    res.json(reports.map((report) => ({
      ...report,
      tag: report.tag.replace(/_/g, ' '),
    })));
  } catch (error) {
    console.error("Failed to fetch reports by user ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getReportById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ error: "Id is required." });
    }
    const reportId = parseInt(id, 10);
    if (isNaN(reportId)) {
      return res.status(400).json({ error: "Invalid report ID." });
    }
    const report = await prisma.reports.findUnique({
      where: {
        id: reportId
      },
      include: {
        users: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
    if (!report) {
      return res.status(404).json({ error: "Report not found." });
    }

    res.json({
      ...report,
      tag: report.tag.replace(/_/g, ' '),
    });

  } catch (error) {
    console.error("Failed to fetch report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteReportById = async (req, res) => {
  const { id } = req.params;

  try {
    const reportId = parseInt(id, 10);
    if (isNaN(reportId)) {
      return res.status(400).json({ error: "Invalid report ID." });
    }

    const report = await prisma.reports.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      return res.status(404).json({ error: "Report not found." });
    }

    await prisma.reports.delete({
      where: { id: reportId },
    });

    return res.status(200).json({
      message: "Report deleted successfully.",
      deletedVideo: {
        ...report,
        tag: report.tag.replace(/_/g, ' '),
      },
    });
  } catch (error) {
    console.error(`Error deleting report with ID ${id}:`, error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
