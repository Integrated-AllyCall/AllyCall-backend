import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GOOGLE_MAPS_API_KEY;

export const isValidCoords = (lat, lng) => {
  return !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng));
};

export const getCountryFromCoords = async (lat, lng) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
  let { data } = await axios.get(url);
  const components = data.results.flatMap(result => result.address_components);
  let country = components.find(comp => comp.types.includes("country"));

  if (!country) {
    country = {
      long_name: 'Thailand',
      short_name: 'TH'
    }
  };

  return {
    long_name: country.long_name,
    short_name: country.short_name,
  };
};

export const getCityFromCoords = async (lat, lng) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
  const { data } = await axios.get(url);
  const components = data.results.flatMap(result => result.address_components);

  const sublocality = components.find(comp =>
    comp.types.includes("sublocality") || comp.types.includes("neighborhood")
  );

  const locality = components.find(comp =>
    comp.types.includes("locality")
  );

  // if (!locality && !sublocality) {
  //   re
  // };

  return [sublocality?.long_name, locality?.long_name]
    .filter(Boolean)
    .join(", ");
};
