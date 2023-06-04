// import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import stylesheet from "~/tailwind.css";
import Navbar from "./components/Navbar";
import type { LoaderArgs } from "@remix-run/node";
import { getUser, isUserAdmin } from "./server/auth.server";
import { checkSessionValidity } from "./server/session.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

// export const links: LinksFunction = () => [
//   ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
// ];
export async function loader({ params, request }: LoaderArgs) {
  const user = await getUser();

  const isAdmin = await isUserAdmin();

  checkSessionValidity(request);

  return { user, isAdmin };
}

export default function App() {
  const { user, isAdmin } = useLoaderData();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Navbar user={user} isAdmin={isAdmin} />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
