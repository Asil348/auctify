import { Form, useActionData, useLoaderData } from "@remix-run/react";
import {
  bidOnListing,
  getListing,
  getListingMedia,
} from "~/server/listing.server";
import type { IListing } from "~/server/listing.server";
import type { LoaderArgs, ActionArgs } from "@remix-run/node";
import { clientDB } from "../utils/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

// import invariant from "tiny-invariant";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  const id = formData.get("id");
  const bid = formData.get("bid");

  if (!id || !bid) return new Response("Missing id or bid", { status: 400 });

  return await bidOnListing({
    listingID: id.toString(),
    bid: bid.toString(),
  });
}

export let loader = async ({ params, request }: LoaderArgs) => {
  // invariant(params.slug, "expected params.slug");

  if (!params.id) throw new Error("expected params.id");

  const listing = await getListing({ request, id: params.id });

  const media = await getListingMedia(params.id);

  return { ...listing, id: params.id, media };
};

export default function Listing() {
  let loaderListing = useLoaderData<IListing>();
  const actionData = useActionData();

  const [listing, setListing] = useState(loaderListing);
  const [isListingActive, setIsListingActive] = useState(false);
  const [startsAt, setStartsAt] = useState(new Date(listing.startsAt));
  const [endsAt, setEndsAt] = useState(new Date(listing.endsAt));
  const [isListingExpired, setIsListingExpired] = useState(false);
  const [listingMedia, setListingMedia] = useState(loaderListing.media);

  const handleExpire = useCallback((docData: any) => {
    const startsAt = new Date(docData.startsAt);
    const endsAt = new Date(docData.endsAt);
    if (startsAt.getTime() < Date.now() && endsAt.getTime() > Date.now()) {
      setIsListingActive(true);
      setIsListingExpired(false);
    }

    if (endsAt.getTime() < Date.now()) {
      setIsListingExpired(true);
      setIsListingActive(false);
    }
    setStartsAt(startsAt);
    setEndsAt(endsAt);

    if (listing.soldTo) {
      setIsListingActive(false);
      setIsListingExpired(true);
    }
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(clientDB, "listings", listing.id), (doc) => {
      console.log("Current data: ", doc.data());
      setListing({ ...listing, ...doc.data() });
      handleExpire(doc.data());
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <div>
      <div className="bg-white">
        <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {listing.title}
            </h2>
            <p className="mt-4 text-gray-500">{listing.description}</p>
            {/* message if the listing is sold */}
            {isListingActive && (
              <p className="mt-4 font-medium text-indigo-500">
                This listing is currently active.
              </p>
            )}
            {isListingExpired && (
              <p className="mt-4 font-medium text-indigo-500">
                This listing has ended.
              </p>
            )}
            {/* card-like form with a back shadow for bidding with only one input, which is the bid. no error handling. */}
            <Form method="post">
              <input type="hidden" name="id" value={listing.id} />
              <input
                type="number"
                name="bid"
                placeholder="Bid"
                className="mt-8 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
              <button
                type="submit"
                className="mt-8 block w-full py-3 px-5 border border-transparent rounded-md shadow bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700"
              >
                Bid
              </button>
              {actionData && (
                <p className="mt-4 font-bold text-amber-500">{actionData}</p>
              )}
            </Form>
            <dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
              <div className="border-t border-gray-200 pt-4">
                <dt className="font-medium text-gray-900">Current Bid</dt>
                <dd className="mt-2 text-sm text-gray-500">
                  {listing.currentBid ? listing.currentBid + " TRY" : "N/A"}
                </dd>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <dt className="font-medium text-gray-900">Opening Bid</dt>
                <dd className="mt-2 text-sm text-gray-500">
                  {listing.openingBid} TRY
                </dd>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <dt className="font-medium text-gray-900">Increment Bid</dt>
                <dd className="mt-2 text-sm text-gray-500">
                  +{listing.incrementBid} TRY
                </dd>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <dt className="font-medium text-gray-900">Instant Buy Price</dt>
                <dd className="mt-2 text-sm text-gray-500">
                  {listing.instantBuyPrice} TRY
                </dd>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <dt className="font-medium text-gray-900">Auction start:</dt>
                <dd className="mt-2 text-sm text-gray-500">
                  {listing.startsAt}
                </dd>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <dt className="font-medium text-gray-900">Auction end:</dt>
                <dd className="mt-2 text-sm text-gray-500">{listing.endsAt}</dd>
              </div>
            </dl>
          </div>
          <div className="grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6 lg:gap-8">
            {listingMedia?.map((media: any) => (
              <img
                key={media}
                src={media}
                alt="media"
                className="rounded-lg bg-gray-100"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
