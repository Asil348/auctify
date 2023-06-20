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
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Account</h1>
      <div>
        <div className="space-y-4">
          <p>
            <label className="block">
              <span className="text-lg font-semibold">First Name</span>
              <p className="mt-1 rounded-md w-full">
                {userAccount.fullname ? userAccount.fullname : "(empty)"}
              </p>
            </label>
          </p>
          <p>
            <label className="block">
              <span className="text-lg font-semibold">Email</span>
              <p className="mt-1 rounded-md w-full">
                {userAccount.email ? userAccount.email : "(empty)"}
              </p>
            </label>
          </p>
          <p>
            <label className="block">
              <span className="text-lg font-semibold">Phone</span>
              <p className="mt-1 rounded-md w-full">
                {userAccount.phone ? userAccount.phone : "(empty)"}
              </p>
            </label>
          </p>
          <p>
            <label className="block">
              <span className="text-lg font-semibold">Address</span>
              <p className="mt-1 rounded-md w-full">
                {userAccount.address ? userAccount.address : "(empty)"}
              </p>
            </label>
          </p>
          <p>
            <Link to={`/account/edit`}>
              <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded">
                Edit
              </button>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
