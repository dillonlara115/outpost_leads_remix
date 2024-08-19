import Outscraper from "outscraper";
/* eslint-disable import/no-import-module-exports */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import cors from "cors";
import axios from "axios";
import NodeCache from "node-cache";


interface Business {
  query: string;
  name: string;
  description: string;
  verified: boolean;
  about: {
    "From the business"?: { [key: string]: boolean };
    Other?: { [key: string]: boolean };
  };
  full_address: string;
  photo: string;
  reviews_link: string;
  reviews: number;
  rating: number;
  phone: string;
  site: string;
  email: string;
  logo: string;
  location_link: string;
}

import dotenv from "dotenv";

dotenv.config(); // Non-default import

admin.initializeApp();
const db = admin.firestore();
const app = express();
app.use(cors({origin: true}));
app.use(express.json());

const cache = new NodeCache({stdTTL: 3600});

const {API_KEY} = process.env;
console.log("API Key:", API_KEY);

// Static list of business types
const businessTypes: string[] = [
  "Accountant", "Advertising Agency", "Airline", "Airport", "Amusement Park", "Aquarium", "Art Gallery", "Attorney",
  "Bakery", "Bank", "Bar", "Beauty Salon", "Bicycle Store", "Book Store", "Bowling Alley", "Bus Station", "Cafe",
  "Campground", "Car Dealer", "Car Rental", "Car Repair", "Car Wash", "Casino", "Cemetery", "Church", "City Hall",
  "Clothing Store", "Convenience Store", "Courthouse", "Dentist", "Department Store", "Doctor", "Electrician",
  "Electronics Store", "Embassy", "Fire Station", "Florist", "Funeral Home", "Furniture Store", "Gas Station", "Gym",
  "Hair Care", "Hardware Store", "Hindu Temple", "Home Goods Store", "Hospital", "Insurance Agency", "Jewelry Store",
  "Laundry", "Lawyer", "Library", "Liquor Store", "Local Government Office", "Locksmith", "Lodging", "Meal Delivery",
  "Meal Takeaway", "Mosque", "Movie Rental", "Movie Theater", "Moving Company", "Museum", "Night Club", "Painter",
  "Park", "Parking", "Pet Store", "Pharmacy", "Physiotherapist", "Plumber", "Police", "Post Office",
  "Real Estate Agency", "Restaurant", "Roofing Contractor", "RV Park", "School", "Shoe Store", "Shopping Mall", "Spa",
  "Stadium", "Storage", "Store", "Subway Station", "Supermarket", "Synagogue", "Taxi Stand", "Train Station",
  "Travel Agency", "University", "Veterinary Care", "Zoo",
];

app.get("/business-types", (req, res) => {
  res.json(businessTypes);
});

app.post("/outscraper", async (req, res) => {
  const {location, businessType} = req.body;
  const locationParam = location || "New York, USA";
  const businessTypeParam = businessType || "businesses";

  const cacheKey = `${locationParam}-${businessTypeParam}`;

  // Check cache first
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log("Serving from cache");
    return res.json({data: cachedData});
  }

  // Check Firestore next
  const firestoreData = await db.collection("searches").doc(cacheKey).get();
  if (firestoreData.exists) {
    const data = firestoreData.data();
    cache.set(cacheKey, data); // Update cache
    console.log("Serving from Firestore");
    return res.json({data});
  }
  console.log("Fetching businesses from Outscraper API...");
  const outscraper = new Outscraper(API_KEY);

  try {
    const response = await outscraper.googleMapsSearch(
      [`${businessTypeParam} near ${locationParam}`],
      20, // limit
      "en", // language (optional)
      "us" // region (optional)
    );

    console.log("Outscraper raw response:", JSON.stringify(response, null, 2));

    // Flatten the nested response
    const flattenedResponse = response.flat();

    if (!response || !Array.isArray(response)) {
      throw new Error("Invalid response format from Outscraper API");
    }

    const businesses = flattenedResponse.map((business: any) => ({
      query: business.query || "",
      name: business.name || "",
      description: business.description || "",
      verified: business.verified || false,
      about: business.about || {"From the business": {}, "Other": {}},
      full_address: business.full_address || "",
      photo: business.photo || "",
      reviews_link: business.reviews_link || "",
      reviews: business.reviews || 0,
      rating: business.rating || 0,
      phone: business.phone || "",
      site: business.site || "",
      logo: business.logo || "",
      location_link: business.location_link || "",
    }));

    cache.set(cacheKey, businesses);
    await db.collection("searches").doc(cacheKey).set({data: businesses});

    return res.json({data: businesses});
  } catch (error) {
    console.error("Error fetching businesses:", (error as Error)?.message || error);
    return res.status(500).json({error: "Internal Server Error"});
  }
});


app.post("/businesses", async (req, res) => {
  const {location, businessType} = req.body;
  const locationParam = location || "New York, USA";
  const businessTypeParam = businessType || "businesses";

  const cacheKey = `${locationParam}-${businessTypeParam}`;

  // Check cache first
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log("Serving from cache");
    return res.json({data: cachedData});
  }

  // Check Firestore next
  const firestoreData = await db.collection("searches").doc(cacheKey).get();
  if (firestoreData.exists) {
    const data = firestoreData.data();
    cache.set(cacheKey, data); // Update cache
    console.log("Serving from Firestore");
    return res.json({data});
  }

  try {
    console.log("Fetching businesses from API...");
    const response = await axios.get("https://api.app.outscraper.com/maps/search-v3", { // Replace with your actual API endpoint
      headers: {
        "X-API-KEY": API_KEY,
      },
      params: {
        query: `${businessTypeParam} near ${locationParam}`,
        radius: 5000,
        language: "en",
      },
    });

    if (!response.data || !response.data.results_location) {
      throw new Error("Unexpected response format");
    }

    const resultsUrl = response.data.results_location;
    let resultsResponse: any = undefined;
    let status = "Pending";
    const interval = 5000;

    while (status === "Pending") {
      await new Promise((resolve) => setTimeout(resolve, interval));
      resultsResponse = await axios.get(resultsUrl, {
        headers: {
          "X-API-KEY": API_KEY,
        },
      });

      status = resultsResponse.data.status;
    }

    if (!resultsResponse) {
      throw new Error("Failed to retrieve results");
    }

    const businessesData = Array.isArray(resultsResponse.data.data) ? resultsResponse.data.data[0] : resultsResponse.data.data;

    const businesses = businessesData.map((business: Business) => ({
      query: business.query,
      name: business.name,
      description: business.description,
      full_address: business.full_address,
      about: business.about,
      photo: business.photo,
      logo: business.logo,
      verified: business.verified,
      reviews_link: business.reviews_link,
      reviews: business.reviews,
      rating: business.rating,
      phone: business.phone,
      site: business.site,
      location_link: business.location_link,
      email: business.email,
    }));

    cache.set(cacheKey, businesses);
    await db.collection("searches").doc(cacheKey).set(businesses);

    return res.json({data: businesses});
  } catch (error) {
    const err = error as Error;
    console.error("Error fetching businesses:", err.message);
    return res.status(500).json({error: "Internal Server Error"});
  }
});

app.post("/save-search/:userId/:searchName", async (req, res) => {
  const {userId, searchName} = req.params;
  const businesses = req.body.businesses; // Assuming businesses are sent in the request body

  try {
    console.log("API Key:", process.env.API_KEY); // Log the API Key
    // Save the search metadata
    await db.collection("users").doc(userId).collection("savedSearches").doc(searchName).set({
      createdAt: new Date(),
    });
    // Save each business result
    const promises: Promise<FirebaseFirestore.DocumentReference>[] = businesses.map((business: Business) =>
      db.collection("users").doc(userId).collection("savedSearches").doc(searchName)
        .collection("results").add(business)
    );
    await Promise.all(promises);
    res.status(200).send("Search and business results saved successfully");
  } catch (error) {
    const err = error as Error;
    console.error("Error saving search and business results:", err.message);
    res.status(500).json({error: "Internal Server Error"});
  }
});

app.get("/saved-searches/:userId", async (req, res) => {
  const {userId} = req.params;

  try {
    const savedSearches = await db.collection("users").doc(userId).collection("savedSearches").get();
    const searches = savedSearches.docs.map((doc) => ({id: doc.id, ...doc.data()}));
    res.json(searches);
  } catch (error) {
    const err = error as Error;
    console.error("Error fetching saved searches:", err.message);
    res.status(500).json({error: "Internal Server Error"});
  }
});

exports.api = functions.https.onRequest(app);
