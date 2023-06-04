import { getAuth } from "firebase-admin/auth";
import { getUser } from "./auth.server";
import { adminDB } from "./firebaseAdmin.server";

export async function getUserAccount(request: Request) {
  const user = await getUser();

  if (!user) return null;

  const userDoc = await adminDB.collection("users").doc(user.uid).get();

  return userDoc.data();
}

export async function updateUserAccount(request: Request, data: any) {
  const user = await getUser();

  if (!user) return null;

  const userDoc = await adminDB.collection("users").doc(user.uid).update(data);

  if (data.fullname)
    await getAuth().updateUser(user.uid, { displayName: data.fullname });

  return userDoc;
}

export async function updateUserPassword(request: Request, password: string) {
  const user = await getUser();

  if (!user) return null;

  await getAuth().updateUser(user.uid, {
    password: password,
  });

  return true;
}
