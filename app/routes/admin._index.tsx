import { Link, useLoaderData } from "@remix-run/react";
import { getListings } from "~/server/listing.server";
import { redirect } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { isUserAdmin } from "~/server/auth.server";
import Icon from "@mdi/react";
import { mdiCubeOutline } from "@mdi/js";

export async function loader({ request, params }: LoaderArgs) {
  // !! this is a bad way to check if a user is an admin !! //
  // because we check it on every other admin screen
  // instead, we should check it once when the user signs in
  // and then store it in the session(?) or something
  const isAdmin = await isUserAdmin();

  if (!isAdmin) {
    return redirect("/");
  }

  return await getListings();
}

export default function Admin() {
  const listings = useLoaderData();

  return (
    <div>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Edit Listings
        </h1>
        <ul className="divide-y divide-gray-100">
          {listings.map((listing: any) => (
            <li
              key={listing.title}
              className="flex justify-between gap-x-6 py-5"
            >
              <div>
                <Link to={`edit/${listing.id}`} className="flex gap-x-4">
                  <Icon
                    className="h-12 w-12 flex-none rounded-full bg-gray-50 text-gray-200"
                    path={mdiCubeOutline}
                  />
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold leading-6 text-gray-900">
                      {listing.title}
                    </p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                      {listing.description}
                    </p>
                  </div>
                </Link>
              </div>
              <div className="hidden sm:flex sm:flex-col sm:items-end">
                <p className="text-sm leading-6 text-gray-900">
                  {listing.soldTo ? (
                    <>
                      <p className="font-medium text-right text-gray-900">
                        Sold at {listing.currentBid} TRY
                      </p>
                      <p className="font-normal text-right text-gray-900">
                        {listing.bids.length} bids
                      </p>
                    </>
                  ) : listing.bids.length > 0 ? (
                    <>
                      <p className="font-medium text-right text-gray-900">
                        At {listing.currentBid} TRY
                      </p>
                      <p className="font-normal text-right text-gray-900">
                        {listing.bids.length} bids so far
                      </p>
                    </>
                  ) : (
                    <span className="font-medium text-right text-gray-900">
                      Opening: {listing.openingBid} TRY
                    </span>
                  )}
                </p>
                {listing.soldTo ? (
                  <div className="mt-1 flex items-center gap-x-1.5">
                    <div className="flex-none rounded-full bg-red-500/20 p-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    </div>
                    <p className="text-xs leading-5 text-gray-500">Sold</p>
                  </div>
                ) : listing.bids.length > 0 ? (
                  <div className="mt-1 flex items-center gap-x-1.5">
                    <div className="flex-none rounded-full bg-amber-500/20 p-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    </div>
                    <p className="text-xs leading-5 text-gray-500">
                      In progress
                    </p>
                  </div>
                ) : (
                  <div className="mt-1 flex items-center gap-x-1.5">
                    <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <p className="text-xs leading-5 text-gray-500">Active</p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
