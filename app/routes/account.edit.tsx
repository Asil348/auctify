import type { LoaderArgs, ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { getUserAccount, updateUserAccount } from "~/server/account.server";
import { getUser } from "~/server/auth.server";
import { getUserToken } from "~/server/session.server";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  const fullname = formData.get("fullname");
  // const email = formData.get("email");
  const phone = formData.get("phone");
  const address = formData.get("address");

  // Perform form validation
  // For example, check the email is a valid email
  // Return the errors if there are any

  // if (!fullname || !phone || !address) {
  //   return new Response("Missing fullname, phone or address", {
  //     status: 400,
  //   });
  // }

  await updateUserAccount(request, { fullname, phone, address });

  return redirect(`/account`);
}

export async function loader({ request, params }: LoaderArgs) {
  // if there's a user token in the cookies, the user is already signed in
  const userToken = await getUserToken(request);

  const FBUser = await getUser();

  if (!userToken && !FBUser) return redirect("/");
  return await getUserAccount(request);
}

export default function AccountEdit() {
  const userAccount = useLoaderData();

  return (
    <div>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Edit Account Details</h1>
        <Form method="post" className="space-y-4">
          <p>
            <label className="block">
              <span className="text-lg font-semibold">Full Name</span>
              <input
                id="fullname"
                name="fullname"
                type="text"
                defaultValue={userAccount.fullname}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </label>
          </p>
          <p>
            <label className="block">
              <span className="text-lg font-semibold">Email</span>
              <input
                id="email"
                name="email"
                type="text"
                defaultValue={userAccount.email}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </label>
          </p>
          <p>
            <label className="block">
              <span className="text-lg font-semibold">Phone</span>
              <input
                id="phone"
                name="phone"
                type="text"
                defaultValue={userAccount.phone}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </label>
          </p>
          <p>
            <label className="block">
              <span className="text-lg font-semibold">Address</span>
              <input
                id="address"
                name="address"
                type="text"
                defaultValue={userAccount.address}
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
            <Link to="/account/change-password">
              <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded">
                Change password
              </button>
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
}
