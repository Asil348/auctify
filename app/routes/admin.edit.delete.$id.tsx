import { Form, Link, useLoaderData } from "@remix-run/react";
import { redirect } from "@remix-run/node";

import type { LoaderArgs, ActionArgs } from "@remix-run/node";
import { deleteListing } from "~/server/listing.server";
import { isUserAdmin } from "~/server/auth.server";
export async function loader({ request, params }: LoaderArgs) {
  const isAdmin = await isUserAdmin();

  if (!isAdmin) {
    return redirect("/signin");
  }

  return params.id;
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  const id = formData.get("id");

  // @ts-ignore
  await deleteListing({ request, id: id.toString() });

  return redirect(`/admin`);
}

export default function AdminDelete() {
  const id = useLoaderData();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Are you sure?</h1>
      <Form method="POST" className="space-y-4">
        <input type="hidden" name="id" value={id} />
        <p>
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
          >
            Delete
          </button>
        </p>
        <p>
          <Link to="/admin">
            <button
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded"
            >
              Cancel
            </button>
          </Link>
        </p>
      </Form>
    </div>
  );
}
