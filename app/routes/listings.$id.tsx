import { Link, useLoaderData } from "@remix-run/react";
import { getListing } from "~/lib/listing";
import type { LoaderArgs } from "@remix-run/node";
// import invariant from "tiny-invariant";

export let loader = async ({ params, request }: LoaderArgs) => {
  // invariant(params.slug, "expected params.slug");

  // @ts-ignore
  return getListing({ request, id: params.id });
};

interface IListing {
  currency: string;
  currentBid: number;
  description: string;
  ended: boolean;
  endsAt: string;
  incrementPrice: number;
  instantBuyPrice: number;
  slug: string;
  soldTo: string;
  started: boolean;
  startingPrice: number;
  startsAt: string;
  title: string;
}

export default function Listing() {
  let listing = useLoaderData<IListing>();
  return (
    <div>
      <h2>{listing.title}</h2>
      <p>{listing.description}</p>
      <p>{listing.startingPrice} {listing.currency}</p>
      <Link to="../listings">Go back</Link>
    </div>
  );
}
