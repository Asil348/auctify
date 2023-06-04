// import type { V2_MetaFunction } from "@remix-run/node";

import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/node";
import { getUser, isUserAdmin } from "~/server/auth.server";
import { checkSessionValidity } from "~/server/session.server";
import Navbar from "~/components/Navbar";

// export const meta: V2_MetaFunction = () => {
//   return [
//     { title: "New Remix App" },
//     { name: "description", content: "Welcome to Remix!" },
//   ];
// };

export async function loader({ request }: LoaderArgs) {
  const user = await getUser();

  const isAdmin = await isUserAdmin();

  checkSessionValidity(request);

  return { user, isAdmin };
}

export default function Index() {
  const { user, isAdmin } = useLoaderData();
  return (
    <div>
      <Navbar user={user} isAdmin={isAdmin} />
      {/* Welcome to auctify */}
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
          <h1 className="text-6xl font-bold">
            Welcome to <Link to="/">auctify</Link>
          </h1>

          <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
            <Link
              to="/listings"
              className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600"
            >
              <h3 className="text-2xl font-bold">Listings &rarr;</h3>
              <p className="mt-4 text-xl">
                View all the listings that are currently available.
              </p>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
