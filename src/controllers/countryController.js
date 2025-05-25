import axios from "axios";
import prisma from "../configs/prisma.js";

export const getCountryFromCoordinates = async (lat, lng) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
  const { data } = await axios.get(url);

  const countryComponent = data.results
    ?.flatMap((r) => r.address_components)
    .find((comp) => comp.types.includes("country"));

  return countryComponent || null;
};

export const getAllCountries = async (req, res) => {
  try {
    const countries = await prisma.countries.findMany({
      orderBy: { name: "asc" },
    });
    res.json(countries);
  } catch (error) {
    console.error("Failed to fetch countries:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCountriesWithLegals = async (req, res) => {
  try {
    const countries = await prisma.countries.findMany({
      where: {
        country_legals: {
          some: {},
        },
      },
      orderBy: { name: "asc" },
    });
    res.json(countries);
  } catch (error) {
    console.error("Failed to fetch countries:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
