import prisma from "../configs/prisma.js";

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
