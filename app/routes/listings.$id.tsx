import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { bidOnListing, getListing } from "~/server/listing.server";
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

  return { ...listing, id: params.id };
};

export default function Listing() {
  let loaderListing = useLoaderData<IListing>();
  const actionData = useActionData();

  const [listing, setListing] = useState(loaderListing);
  const [isListingActive, setIsListingActive] = useState(false);
  const [startsAt, setStartsAt] = useState(new Date(listing.startsAt));
  const [endsAt, setEndsAt] = useState(new Date(listing.endsAt));
  const [isListingExpired, setIsListingExpired] = useState(false);

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
      <h2>{listing.title}</h2>
      <p>
        ({listing.id} - {listing.slug})
      </p>
      <p>{listing.description}</p>
      {isListingActive && (
        <p style={{ color: "red", fontWeight: "bold" }}>
          THIS LISTING IS CURRENTLY ACTIVE, BID NOW!
        </p>
      )}
      {isListingExpired && (
        <p style={{ color: "red", fontWeight: "bold" }}>
          This listing has expired {":("}
        </p>
      )}
      <p>
        <strong>Auction starts at: </strong>
        {JSON.stringify(startsAt)}
      </p>
      <p>
        <strong>Auction ends at: </strong>
        {JSON.stringify(endsAt)}
      </p>
      <p>
        <strong>Opening bid: </strong>
        {listing.openingBid} TRY
      </p>
      <p>
        <strong>Increment bid:</strong> {listing.incrementBid} TRY
      </p>
      <p>
        <strong>Current bid: </strong>
        {listing.currentBid ? listing.currentBid + " TRY" : "N/A"}
      </p>
      <p>
        <strong>Instant buy price: </strong>
        {listing.instantBuyPrice} TRY
      </p>
      <Form method="post">
        <input type="hidden" name="id" value={listing.id} />
        <input type="number" name="bid" placeholder="Bid" />
        <button type="submit">Bid</button>
        {actionData && <p>{actionData}</p>}
      </Form>
      <Link to="../listings">Go back</Link>
    </div>
  );
}
