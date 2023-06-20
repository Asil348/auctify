import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { useCallback, useState } from "react";
import { editListing, getListing } from "~/server/listing.server";
import { redirect } from "@remix-run/node";
import { isUserAdmin } from "~/server/auth.server";

export async function loader({ request, params }: LoaderArgs) {
  const isAdmin = await isUserAdmin();

  if (!isAdmin) {
    return redirect("/signin");
  }

  const docID = params.id;

  //@ts-ignore
  const listing = await getListing({ id: docID });

  return {
    ...listing,
    id: docID,
  };
}

export async function action({ request, params }: ActionArgs) {
  const formData = await request.formData();

  const id: any = params.id;

  const title = formData.get("title");
  const slug = formData.get("slug");
  const description = formData.get("description");
  const currentBid = formData.get("currentBid");
  const incrementBid = formData.get("incrementBid");
  const instantBuyPrice = formData.get("instantBuyPrice");
  const startsAt = formData.get("startsAt");
  const endsAt = formData.get("endsAt");

  const previousListing = await getListing({ id: id.toString() });

  const listing = {
    ...previousListing,
    title,
    slug,
    description,
    currentBid,
    incrementBid,
    instantBuyPrice,
    startsAt,
    endsAt,
    id,
  };

  await editListing({ request, listing });

  return redirect(`/admin`);
}

export default function AdminEdit() {
  const listing = useLoaderData();

  const [title, setTitle] = useState(listing.title);
  const [slug, setSlug] = useState(listing.slug);
  const [description, setDescription] = useState(listing.description);
  const [currentBid, setCurrentBid] = useState(listing.currentBid);
  const [incrementBid, setIncrementBid] = useState(listing.incrementBid);
  const [instantBuyPrice, setInstantBuyPrice] = useState(
    listing.instantBuyPrice
  );
  const [startsAt, setStartsAt] = useState(listing.startsAt);
  const [endsAt, setEndsAt] = useState(listing.endsAt);

  // some people just can't...
  const handleChange = useCallback((e: any) => {
    // da-dum tss

    switch (e.target.name) {
      case "title":
        setTitle(e.target.value);
        break;
      case "slug":
        setSlug(e.target.value);
        break;
      case "description":
        setDescription(e.target.value);
        break;
      case "currentBid":
        setCurrentBid(e.target.value);
        break;
      case "incrementBid":
        setIncrementBid(e.target.value);
        break;
      case "instantBuyPrice":
        setInstantBuyPrice(e.target.value);
        break;
      case "startsAt":
        setStartsAt(e.target.value);
        break;
      case "endsAt":
        setEndsAt(e.target.value);
        break;
    }
  }, []);

  return (
    <div>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Edit Listing</h1>
        <div>
          <Form method="POST" className="space-y-4">
            <p>
              <label className="block">
                <span className="text-lg font-semibold">ID</span>
                <input
                  type="text"
                  value={listing.id}
                  disabled
                  name="id"
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </label>
            </p>
            <p>
              <label className="block">
                <span className="text-lg font-semibold">Title</span>
                <input
                  type="text"
                  value={title}
                  onChange={handleChange}
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
                  value={slug}
                  onChange={handleChange}
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
                  value={description}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                ></textarea>
              </label>
            </p>
            <p>
              <label className="block">
                <span className="text-lg font-semibold">Current Bid</span>
                <input
                  type="number"
                  name="currentBid"
                  value={currentBid}
                  onChange={handleChange}
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
                  value={incrementBid}
                  onChange={handleChange}
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
                  value={instantBuyPrice}
                  onChange={handleChange}
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
                  value={startsAt}
                  onChange={handleChange}
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
                  value={endsAt}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </label>
            </p>
            <p>
              <button
                type="submit"
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded"
              >
                Edit
              </button>
            </p>
            <p>
              <Link to={`/admin/edit/delete/${listing.id}`}>
                <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">
                  Delete
                </button>
              </Link>
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
}
