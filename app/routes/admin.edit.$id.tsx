import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";
import { editListing, getListing } from "~/server/listing.server";
import { redirect } from "@remix-run/node";

export async function loader({ request, params }: LoaderArgs) {
  const docID = params.id;

  //@ts-ignore
  const listing = await getListing({ id: docID });

  return {
    ...listing,
    id: docID,
  };
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  // @ts-ignore

  const id: FormDataEntryValue = formData.get("id");
  const title = formData.get("title");
  const slug = formData.get("slug");
  const description = formData.get("description");
  const price = formData.get("price");

  const previousListing = await getListing({ request, id: id.toString() });

  const listing = {
    ...previousListing,
    title,
    slug,
    description,
    price,
    id,
  };

  await editListing({ request, listing });

  return redirect(`../`);
}

export default function AdminEdit() {
  const listing = useLoaderData();

  useEffect(() => {
    console.log(listing);
  }, []);

  const [title, setTitle] = useState(listing.title);
  const [slug, setSlug] = useState(listing.slug);
  const [description, setDescription] = useState(listing.description);
  const [price, setPrice] = useState(listing.price);

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
      case "price":
        setPrice(e.target.value);
        break;
    }
  }, []);

  return (
    <div>
      <h1>Edit Listing</h1>
      <div>
        <Form method="POST">
          <p>
            <label>
              ID
              <input type="text" value={listing.id} readOnly name="id" />
            </label>
          </p>
          <p>
            <label>
              Title
              <input
                type="text"
                value={title}
                onChange={handleChange}
                name="title"
              />
            </label>
          </p>
          <p>
            <label>
              Slug
              <input
                type="text"
                value={slug}
                onChange={handleChange}
                name="slug"
              />
            </label>
          </p>
          <p>
            <label>
              Description
              <textarea
                name="description"
                value={description}
                onChange={handleChange}
              />
            </label>
          </p>
          <p>
            <label>
              Price
              <input
                type="text"
                name="price"
                value={price}
                onChange={handleChange}
              />
            </label>
          </p>
          <p>
            <button type="submit">Edit</button>
          </p>
        </Form>
        <Link to={`/admin/edit/delete/${listing.id}`}>delete</Link>
      </div>
    </div>
  );
}
