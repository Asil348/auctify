import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { db } from "./db.server";

const sessionStorage = createCookieSessionStorage({
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

async function getSession(request: Request) {
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

export async function logout(request: Request) {
  const session = await getSession(request);

  if (!session) return false;

  signOut(getAuth());
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

export async function signIn(
  request: Request,
  email: string,
  password: string
) {
  const { user } = await signInWithEmailAndPassword(getAuth(), email, password);

  return user;
}

export async function signUp(
  request: Request,
  email: string,
  password: string
) {
  const { user } = await createUserWithEmailAndPassword(getAuth(), email, password);

  db.collection("users").doc(user.uid).set({
    uid: user.uid,
    email: user.email,
    admin: false,
  });

  return user;
}
