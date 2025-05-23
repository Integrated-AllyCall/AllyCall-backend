import axios from "axios";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getCountryFromCoordinates = async (lat, lng) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
  const { data } = await axios.get(url);

  const countryComponent = data.results
    ?.flatMap((r) => r.address_components)
    .find((comp) => comp.types.includes("country"));

  return countryComponent?.short_name || null;
};

export const getLegal = async (req, res) => {
  try {
    const legals = await prisma.countries.findMany({
      include: {
        legal_guide: {
          orderBy: { id: "desc" },
        },
      },
      orderBy: { code: "asc" },
    });
    res.json(legals);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch legals" });
  }
};

export const getLegalByCoordinates = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const code = await getCountryFromCoordinates(lat, lng);
    const legals = await prisma.countries.findMany({
      include: {
        legal_guide: {
          orderBy: { id: "desc" },
        },
      },
      where: {
        code: code,
      },
      orderBy: { code: "asc" },
    });

    res.json(legals);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch legals" });
  }
};
