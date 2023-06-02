import { Link, useLoaderData } from "@remix-run/react";
import { getListings } from "~/lib/listing";
import type { LoaderArgs } from "@remix-run/node";

export async function loader(params: LoaderArgs) {
  return await getListings();
}

export default function Admin() {
  const listings = useLoaderData();

  return (
    <div>
      <h1>Admin</h1>
      <Link to="new">New Listing</Link>
      <hr />
      {listings.map((listing: any) => (
        <div key={listing.id}>
          <Link to={`edit/${listing.id}`}>{listing.title}</Link>
        </div>
      ))}
    </div>
  );
}
