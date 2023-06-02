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
  const price = formData.get("price");

  const listing = {
    title,
    slug,
    description,
    price,
  };

  console.log(listing);

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
            Price
            <input type="text" name="price" />
          </label>
        </p>
        <p>
          <button type="submit">Create</button>
        </p>
      </Form>
    </div>
  );
}
