import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { adminDB } from "./firebaseAdmin.server";
import { getSession } from "./session.server";
import { redirect } from "@remix-run/node";
import { sessionStorage } from "./session.server";

export async function getUser() {
  const { currentUser } = getAuth();

  return currentUser;
}

export async function getUserFromDB() {
  const user = await getUser();

  if (!user) return null;

  const userDoc = await adminDB.collection("users").doc(user.uid).get();

  return userDoc.data();
}

export async function isUserAdmin() {
  const DBUser = await getUserFromDB();

  return DBUser?.admin;
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
  const res = await signInWithEmailAndPassword(getAuth(), email, password);

  return res;
}

// !! NOTE TO FUTURE SELF !! //
// dear asil,
// this is a bad way to do this, because we cant pass the response to the client
// hence, we can't properly handle errors
// you should make it so that this function returns a promise, not a response
// i'm leaving this as is because if i try to fix it, ill waste a whole bunch of time
// please fix when able
// love, asil
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

  adminDB.collection("users").doc(user.uid).set({
    uid: user.uid,
    email: user.email,
    admin: false,
  });

  return user;
}
