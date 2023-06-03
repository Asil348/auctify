import { Link, useLoaderData } from "@remix-run/react";
import { getListing } from "~/server/listing.server";
import type { IListing } from "~/server/listing.server";
import type { LoaderArgs } from "@remix-run/node";
import { clientDB } from "../utils/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

// import invariant from "tiny-invariant";

export let loader = async ({ params, request }: LoaderArgs) => {
  // invariant(params.slug, "expected params.slug");

  if (!params.id) throw new Error("expected params.id");

  const listing = await getListing({ request, id: params.id });

  return { ...listing, id: params.id };
};

export default function Listing() {
  let loaderListing = useLoaderData<IListing>();

  const [listing, setListing] = useState(loaderListing);

  useEffect(() => {
    const unsub = onSnapshot(doc(clientDB, "listings", listing.id), (doc) => {
      console.log("Current data: ", doc.data());
      setListing({ ...listing, ...doc.data() });
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <div>
      <h2>{listing.title}</h2>
      <p>{listing.id}</p>
      <p>{listing.description}</p>
      <p>{listing.openingBid} TRY</p>
      <Link to="../listings">Go back</Link>
    </div>
  );
}
