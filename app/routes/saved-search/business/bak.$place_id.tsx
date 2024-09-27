import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Business, fetchBusiness } from "../../../lib/api";

type LoaderData = {
  business: Business;
};

export const loader: LoaderFunction = async ({ params }) => {
  console.log("Received params:", params);
  const { place_id } = params;
  if (!place_id) {
    console.log("No place_id found in params");
    throw new Response("Not Found", { status: 404 });
  }
  console.log("Fetching business with place_id:", place_id);
  try {
    const business = await fetchBusiness(place_id);
    console.log("Fetched business:", business);
    return json({ business });
  } catch (error) {
    console.error("Error fetching business:", error);
    throw new Response("Error fetching business", { status: 500 });
  }
};
export default function BusinessDetails() {
  const { business } = useLoaderData<LoaderData>();

  // Render your business details here
  return (
    <div>
      <h1>{business.name}</h1>
      {/* Add more business details */}
    </div>
  );
}