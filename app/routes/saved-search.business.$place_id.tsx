import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {  fetchBusinessFromDB } from "../lib/api";

export const loader: LoaderFunction = async ({ params }) => {
    console.log("Received params:", params);
    const { place_id } = params;
    if (!place_id) {
      console.log("No place_id found in params");
      throw new Response("Not Found", { status: 404 });
    }
    try {
        const business = await fetchBusinessFromDB(user.uid, searchId, place_id);
        if (!business) {
          // If not found in DB, you could optionally fall back to fetchBusiness here
          // const freshBusiness = await fetchBusiness(place_id);
          // return json({ business: freshBusiness });
          throw new Response("Business not found", { status: 404 });
        }
        return json({ business });
      } catch (error) {
        console.error("Error fetching business:", error);
        return json({ error: "Error fetching business details" }, { status: 500 });
      }
  };
  

  export default function BusinessDetails() {
    const data = useLoaderData<typeof loader>();
  
    if ('error' in data) {
      return <div>Error: {data.error}</div>;
    }
  
    const { business } = data;
  
    return (
      <div>
        <h1>{business.name}</h1>
        {/* Add more business details */}
      </div>
    );
  }