import { Link, useLoaderData } from "@remix-run/react";
import { getListings } from "~/server/listing.server";
import { Timestamp } from "firebase/firestore";

export let loader = ({ request }: any) => {
  return getListings();
};

export default function Listings() {
  let listings = useLoaderData();

  return (
    <div>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Listings
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {listings.map((listing: any) => (
              <div key={listing.id} className="group relative">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                  <img
                    src={
                      "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg"
                    }
                    alt={listing.title}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <Link to={"/listings/" + listing.id}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {listing.title}
                      </Link>
                    </h3>
                    {new Date(listing.endsAt) > new Date() &&
                    !listing.soldTo ? (
                      <p className="mt-1 text-sm font-bold text-green-500">
                        Active
                      </p>
                    ) : (
                      <p className="mt-1 text-sm text-gray-500">
                        Ended on{" "}
                        {listing.soldAt
                          ? JSON.stringify(
                              new Timestamp(
                                listing.soldAt._seconds,
                                listing.soldAt._nanoseconds
                              )
                                .toDate()
                                .toLocaleDateString()
                            )
                          : JSON.stringify(
                              new Timestamp(
                                listing.endsAt._seconds,
                                listing.endsAt._nanoseconds
                              )
                                .toDate()
                                .toLocaleDateString()
                            )}
                      </p>
                    )}
                  </div>
                  <p className="text-sm font-normal text-gray-900">
                    {listing.currentBid ? (
                      <>
                        <span>At </span>
                        <span className="font-medium">
                          {listing.currentBid} TRY
                        </span>
                      </>
                    ) : (
                      <>
                        <span>Starts at </span>
                        <span className="font-medium">
                          {listing.openingBid} TRY
                        </span>
                      </>
                    )}{" "}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
