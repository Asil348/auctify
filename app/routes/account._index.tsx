import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { getUserAccount } from "~/server/account.server";
import { getUser } from "~/server/auth.server";
import { getUserToken } from "~/server/session.server";

export async function loader({ request, params }: LoaderArgs) {
  // if there's a user token in the cookies, the user is already signed in
  const userToken = await getUserToken(request);

  const FBUser = await getUser();

  if (!userToken && !FBUser) return redirect("/");
  return await getUserAccount(request);
}

export default function Account() {
  const userAccount = useLoaderData();

  useEffect(() => {
    console.log(userAccount);

    return () => {};
  }, []);

  return (
    <div>
      <h1>Account</h1>
      <p>
        <strong>First Name:</strong> {userAccount.fullname ? userAccount.fullname : "(empty)"}
      </p>
      <p>
        <strong>Email:</strong> {userAccount.email ? userAccount.email : "(empty)"}
      </p>
      <p>
        <strong>Phone:</strong> {userAccount.phone ? userAccount.phone : "(empty)"}
      </p>
      <p>
        <strong>Address:</strong> {userAccount.address ? userAccount.address : "(empty)"}
      </p>
      <Link to="/account/edit">Change account details</Link>
    </div>
  );
}
