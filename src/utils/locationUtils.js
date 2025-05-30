import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GOOGLE_MAPS_API_KEY;

export const isValidCoords = (lat, lng) => {
  return !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng));
};

export const fetchGeocodeComponents = async (lat, lng, apiKey) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
  const { data } = await axios.get(url);

  if (!data.results || !data.results.length) {
    throw new Error("No geocoding results found.");
  }

  return data.results.flatMap(result => result.address_components);
};

export const getCountryFromCoords = async (lat, lng) => {
  const components = await fetchGeocodeComponents(lat, lng, apiKey);
  const country = components.find(comp => comp.types.includes("country"));
  if (!country) throw new Error("Country not found");
  return {
    long_name: country.long_name,
    short_name: country.short_name,
  };
};

export const getCityFromCoords = async (lat, lng) => {
  const components = await fetchGeocodeComponents(lat, lng, apiKey);

  const sublocality = components.find(comp =>
    comp.types.includes("sublocality") || comp.types.includes("neighborhood")
  );

  const locality = components.find(comp =>
    comp.types.includes("locality")
  );

  if (!locality && !sublocality) throw new Error("City not found");

  return [sublocality?.long_name, locality?.long_name]
    .filter(Boolean)
    .join(", ");
};
