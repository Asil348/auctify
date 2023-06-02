import { db } from "~/utils/db.server";

interface IGetListing {
  request: any;
  id: string;
}

export async function getListings() {
  const querySnapshot = await db.collection("listings").get();

  const data: any[] = [];
  querySnapshot.forEach((doc: any) => {
    data.push({ ...doc.data(), id: doc.id });
  });

  return data;
}

export async function getListing({ request, id }: IGetListing) {
  const docSnapshot = await db.collection("listings").doc(id).get();

  if (!docSnapshot.exists) {
    throw Error("No such document exists");
  } else {
    const listing = docSnapshot.data();
    return listing;
  }
}

export async function createListing({ request, listing }: any) {
  const { title, slug, description, price } = listing;

  const res = await db.collection("listings").add({
    title,
    slug,
    description,
    price,
  });

  return getListing({ request, id: res.id });
}

export async function editListing({ request, listing }: any) {
  const { title, slug, description, price, id } = listing;

  await db.collection("listings").doc(id).update({
    title,
    slug,
    description,
    price,
  });

  return getListing({ request, id });
}

export async function deleteListing({ request, id }: any) {
  await db.collection("listings").doc(id).delete();

  return { id };
}