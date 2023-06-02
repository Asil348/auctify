import { Link, useLoaderData } from "@remix-run/react";
import { getListings } from "~/server/listing.server";

export let loader = ({ request }: any) => {
  return getListings();
};

export default function Listings() {
  let listings = useLoaderData();

  return (
    <div>
      {listings.map((listing: any) => (
        <div key={listing.id}>
          <h2>
            {listing.title} <Link to={listing.id}>{listing.id}</Link>
          </h2>
          <hr />
        </div>
      ))}
    </div>
  );
}
