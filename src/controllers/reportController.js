import prisma from "../configs/prisma.js";
import { report_tag } from "@prisma/client";
import dotenv from "dotenv";
import { getCityFromCoords } from "../utils/locationUtils.js";
dotenv.config();

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
  let { shortAddress, longAddress, name } = req.body;
  try {
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
        tag,
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
    res.status(201).json(report);
  } catch (error) {
    console.error("Failed to create report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateReport = async (req, res) => {
  const id = parseInt(req.params.id);
  const { tag, title, description, latitude, longitude } = req.body;
  try {
    const report = await prisma.reports.update({
      where: {
        id,
      },
      data: {
        tag,
        title,
        description,
        latitude,
        longitude,
      },
    });
    res.status(201).json(report);
  } catch (error) {
    console.error("Failed to create report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getNearbyReports = async (req, res) => {
  const { lat, lng } = req.query;

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  console.log(latitude, longitude);
  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({
      error: "Latitude and longitude are required and must be numbers.",
    });
  }

  const city = await getCityFromCoords(latitude, longitude);

  const radiusKm = 10;

  try {
    // Haversine SQL
    const reports = await prisma.$queryRawUnsafe(`
    SELECT *, (
      6371 * acos(
        cos(radians($1))
        * cos(radians(latitude))
        * cos(radians(longitude) - radians($2))
        + sin(radians($1)) * sin(radians(latitude))
      )
    ) AS distance
    FROM reports
    WHERE (
      6371 * acos(
        cos(radians($1))
        * cos(radians(latitude))
        * cos(radians(longitude) - radians($2))
        + sin(radians($1)) * sin(radians(latitude))
      )
    ) < $3
    ORDER BY distance ASC
  `, latitude, longitude, radiusKm);
  
    res.json({
      city: city ?? '',
      reports: reports
  });
  } catch (error) {
    console.error("Failed to fetch nearby reports:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
