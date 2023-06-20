import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import {
  createListing,
  editListing,
  getFirstNListingMedia,
  uploadListingMedia,
} from "~/server/listing.server";

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
  const startsAt = formData.get("startsAt");
  const endsAt = formData.get("endsAt");
  const soldTo = formData.get("soldTo");
  const soldAt = formData.get("soldAt");

  const mediaFiles = formData.getAll("media");

  const listing = {
    title,
    slug,
    description,
    openingBid,
    currentBid,
    incrementBid,
    instantBuyPrice,
    startsAt,
    endsAt,
    soldTo,
    soldAt,
    thumbnail: "",
    bids: [],
  };

  // !! fix this typing !! //
  // @ts-ignore
  await createListing({ request, listing }).then(async (listingID: any) => {
    for (let blob of mediaFiles) {
      await uploadListingMedia({
        listingID,
        blob,
      });
    }

    const thumbnail = await getFirstNListingMedia(listingID, 1);

    console.log(thumbnail);

    await editListing({
      request,
      listing: { id: listingID, thumbnail: thumbnail[0] },
    });
  });

  return redirect(`/admin`);
}

export default function AdminNew() {
  return (
    <>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold mb-6">New Listing</h1>
        <div>
          <Form
            method="POST"
            encType="multipart/form-data"
            className="space-y-4"
          >
            <p>
              <label className="block">
                <span className="text-lg font-semibold">Title</span>
                <input
                  type="text"
                  name="title"
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </label>
            </p>
            <p>
              <label className="block">
                <span className="text-lg font-semibold">Slug</span>
                <input
                  type="text"
                  name="slug"
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </label>
            </p>
            <p>
              <label className="block">
                <span className="text-lg font-semibold">Description</span>
                <textarea
                  name="description"
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                ></textarea>
              </label>
            </p>
            <p>
              <label className="block">
                <span className="text-lg font-semibold">Opening Bid</span>
                <input
                  type="number"
                  name="openingBid"
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </label>
            </p>
            <p className="hidden">
              <label className="block">
                <span className="text-lg font-semibold">Current Bid</span>
                <input
                  type="number"
                  name="currentBid"
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </label>
            </p>
            <p>
              <label className="block">
                <span className="text-lg font-semibold">Increment Bid</span>
                <input
                  type="number"
                  name="incrementBid"
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </label>
            </p>
            <p>
              <label className="block">
                <span className="text-lg font-semibold">Instant Buy Price</span>
                <input
                  type="number"
                  name="instantBuyPrice"
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </label>
            </p>
            <p>
              <label className="block">
                <span className="text-lg font-semibold">Starts At</span>
                <input
                  type="datetime-local"
                  name="startsAt"
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </label>
            </p>
            <p>
              <label className="block">
                <span className="text-lg font-semibold">Ends At</span>
                <input
                  type="datetime-local"
                  name="endsAt"
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </label>
            </p>
            <p className="hidden">
              <label className="block">
                <span className="text-lg font-semibold">Sold At</span>
                <input
                  type="datetime-local"
                  name="soldAt"
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </label>
            </p>
            <p className="hidden">
              <label className="block">
                <span className="text-lg font-semibold">Sold To</span>
                <input
                  type="text"
                  name="soldTo"
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </label>
            </p>
            <p>
              <label className="block">
                <span className="text-lg font-semibold">Media</span>
                <input
                  type="file"
                  name="media"
                  multiple
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </label>
            </p>
            <p>
              <button
                type="submit"
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded"
              >
                Create
              </button>
            </p>
          </Form>
        </div>
      </div>
    </>
  );
}
