import type { MetaFunction } from "@remix-run/node";
import BusinessList from "~/components/BusinessList";


export const meta: MetaFunction = () => {
  return [
    { title: "Outpost Leads" },
    { name: "description", content: "Your guide to getting the Google Business Leads you have been looking for." },
  ];
};

export default function Index() {
  return (
    <div>
      <BusinessList />
    </div>
  );
}
