import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { db } from "./db.server";
import { getSession } from "./session.server";
import { redirect } from "@remix-run/node";

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
  const { user } = await createUserWithEmailAndPassword(
    getAuth(),
    email,
    password
  );

  db.collection("users").doc(user.uid).set({
    uid: user.uid,
    email: user.email,
    admin: false,
  });

  return user;
}
