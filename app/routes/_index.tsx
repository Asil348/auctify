// import type { V2_MetaFunction } from "@remix-run/node";

import { Link } from "@remix-run/react";

// export const meta: V2_MetaFunction = () => {
//   return [
//     { title: "New Remix App" },
//     { name: "description", content: "Welcome to Remix!" },
//   ];
// };

export default function Index() {
  return (
    <div>
      <h1>Welcome to Auctify</h1>
      <Link to="/listings">Listings</Link>
      <br />
      <Link to="/admin">Admin</Link>
      <br />
      <Link to="/signin">Sign in</Link>
      <br />
      <Link to="/signout">Sign out</Link>
    </div>
  );
}
