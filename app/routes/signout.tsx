// import type { LoaderArgs } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { logout } from "~/server/session.server";

export async function loader({ request }: LoaderArgs) {
  return logout(request);
}

export default function SignOut() {
  return (
    <div>
      <h1>Sign out</h1>
      <p>Signing out...</p>
    </div>
  );
}
