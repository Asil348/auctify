import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { logout } from "./auth.server";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

const USER_SESSION_KEY = "userToken";

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function createUserSession({
  request,
  userToken,
}: {
  request: Request;
  userToken: string;
}) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, userToken);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: 60 * 60 * 24 * 7, // 7 days,
      }),
    },
  });
}

export async function getUserToken(request: Request): Promise<any> {
  const session = await getSession(request);
  const userToken = session.get(USER_SESSION_KEY);
  return userToken;
}

export async function checkSessionValidity(request: Request) {
  const userToken = await getUserToken(request);

  if (userToken) {
    return true;
  } else {
    // session expired or never even existed, log out of firebase
    // TODO: doesn't work at the first time, fix it
    logout(request);
    redirect("/");
  }
}
