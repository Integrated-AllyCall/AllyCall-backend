import dotenv from "dotenv";
dotenv.config();
export const getAutoComplete = async (req, res) => {
  try {
    const input = req.query.input;
    console.log("Input: "+input);
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${process.env.GOOGLE_MAPS_API_KEY}&components=country:th`;
    const response = await fetch(url);
    const data = await response.json();
    return res.json(data);
  } catch (error) {
    console.error("Failed to fetch places:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getPlaceDetails = async (req, res) => {
  try {
    const placeId = req.query.place_id;
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return res.json(data);
  } catch (error) {
    console.error("Failed to fetch place details:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
