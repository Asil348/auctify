// import type { V2_MetaFunction } from "@remix-run/node";

import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/node";
import { getUser, isUserAdmin } from "~/server/auth.server";
import { checkSessionValidity } from "~/server/session.server";

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
      <h1>Welcome to Auctify</h1>
      <Link to="/listings">Listings</Link>
      <br />
      {user && isAdmin ? (
        <>
          <Link to="/admin">Admin</Link>
          <br />
        </>
      ) : null}
      {!user ? (
        <>
          <Link to="/signin">Sign in</Link>
          <br />
          <Link to="/signup">Sign up</Link>
        </>
      ) : (
        <>
          <Link to="/signout">Sign out</Link>
          <br />
        </>
      )}
    </div>
  );
}
