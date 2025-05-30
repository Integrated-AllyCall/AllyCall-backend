import prisma from "../configs/prisma.js";
import { getCountryFromCoords } from "../utils/locationUtils.js";

export const getLegal = async (req, res) => {
  try {
    const { code } = req.query;

    const whereClause = {
      ...(code ? { code } : {}),
      country_legals: {
        some: {},
      },
    };

    const legals = await prisma.countries.findMany({
      where: whereClause,
      include: {
        country_legals: {
          orderBy: { id: "desc" },
        },
      },
      orderBy: { code: "asc" },
    });

    res.json(legals);
  } catch (error) {
    console.error("Failed to fetch legals:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getLegalByCoordinates = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ error: "Latitude and longitude are required." });
    }    
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ error: "Latitude and longitude must be valid numbers." });
    }

    const country = await getCountryFromCoords(latitude, longitude);
    const legals = await prisma.country_legals.findMany({
      where: { country_code: country.short_name },
      orderBy: { id: "desc" } 
    });

    res.json({code: country.short_name, name: country.long_name,legal: legals});
  } catch (error) {
    console.error("Failed to fetch legals:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
