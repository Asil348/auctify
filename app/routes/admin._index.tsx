import { Link, useLoaderData } from "@remix-run/react";
import { getListings } from "~/server/listing.server";
import { redirect } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { isUserAdmin } from "~/server/auth.server";

export async function loader({ request, params }: LoaderArgs) {

  // !! this is a bad way to check if a user is an admin !! //
  // because we check it on every other admin screen
  // instead, we should check it once when the user signs in
  // and then store it in the session(?) or something
  const isAdmin = await isUserAdmin();

  if (!isAdmin) {
    return redirect("/signin");
  }

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
