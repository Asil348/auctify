import { Form, Link, useLoaderData } from "@remix-run/react";
import { redirect } from "@remix-run/node";

import type { LoaderArgs, ActionArgs } from "@remix-run/node";
import { deleteListing } from "~/lib/listing";
export async function loader({ request, params }: LoaderArgs) {
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
    <div>
      Are you sure? 🤔
      <Form method="POST">
        <input type="hidden" name="id" value={id} />
        <button type="submit">Delete</button>
      </Form>
      <Link to="/admin">Cancel</Link>
    </div>
  );
}
