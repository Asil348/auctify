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
      <h1>Edit Account</h1>
      <Form method="post">
        <div>
          <label htmlFor="fullname">Full Name</label>
          <input
            id="fullname"
            name="fullname"
            type="text"
            defaultValue={userAccount.fullname}
          />
          <br />
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={userAccount.email}
            readOnly
            disabled
          />
          <br />

          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            type="text"
            defaultValue={userAccount.phone}
          />
          <br />

          <label htmlFor="address">Address</label>
          <input
            id="address"
            name="address"
            type="text"
            defaultValue={userAccount.address}
          />
          <br />

          <button type="submit">Save</button>

          <Link to="/account">Cancel</Link>
        </div>
      </Form>
      <br />
      <Link to="/account/change-password">Change password</Link>
    </div>
  );
}
