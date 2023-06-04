import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { createListing } from "~/server/listing.server";

import type { LoaderArgs } from "@remix-run/node";
import { isUserAdmin } from "~/server/auth.server";
export async function loader({ request, params }: LoaderArgs) {
  const isAdmin = await isUserAdmin();

  if (!isAdmin) {
    return redirect("/signin");
  }

  return null;
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  const title = formData.get("title");
  const slug = formData.get("slug");
  const description = formData.get("description");
  const openingBid = formData.get("openingBid");
  const currentBid = formData.get("currentBid");
  const incrementBid = formData.get("incrementBid");
  const instantBuyPrice = formData.get("instantBuyPrice");
  const media = formData.get("media");
  const startsAt = formData.get("startsAt");
  const endsAt = formData.get("endsAt");
  const soldTo = formData.get("soldTo");
  const soldAt = formData.get("soldAt");

  const listing = {
    title,
    slug,
    description,
    openingBid,
    currentBid,
    incrementBid,
    instantBuyPrice,
    media,
    startsAt,
    endsAt,
    soldTo,
    soldAt,
    bids: []
  };

  console.log(listing);

  // !! fix this typing !! //
  // @ts-ignore
  await createListing({ request, listing });

  return redirect(`/admin`);
}

export default function AdminNew() {
  return (
    <div>
      <Form method="POST">
        <p>
          <label>
            Title
            <input type="text" name="title" />
          </label>
        </p>
        <p>
          <label>
            Slug
            <input type="text" name="slug" />
          </label>
        </p>
        <p>
          <label>
            Description
            <textarea name="description" />
          </label>
        </p>
        <p>
          <label>
            Opening Bid
            <input type="number" name="openingBid" />
          </label>
        </p>
        <p>
          <label>
            Current Bid
            <input type="number" name="currentBid" disabled readOnly/>
          </label>
        </p>
        <p>
          <label>
            Increment Bid
            <input type="number" name="incrementBid" />
          </label>
        </p>
        <p>
          <label>
            Instant Buy Price
            <input type="number" name="instantBuyPrice" />
          </label>
        </p>
        <p>
          <label>
            Media
            <input type="text" name="media" />
          </label>
        </p>
        <p>
          <label>
            Starts At
            <input type="datetime-local" name="startsAt" />
          </label>
        </p>
        <p>
          <label>
            Ends At
            <input type="datetime-local" name="endsAt" />
          </label>
        </p>
        <p>
          <label>
            Sold To
            <input type="text" name="soldTo" disabled readOnly />
          </label>
        </p>
        <p>
          <label>
            Sold At
            <input type="datetime-local" name="soldAt" disabled readOnly />
          </label>
        </p>
        <p>
          <button type="submit">Create</button>
        </p>
      </Form>
    </div>
  );
}
