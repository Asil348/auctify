import { adminDB } from "~/server/firebaseAdmin.server";

export interface IListing {
  title: string;
  slug: string;
  description: string;
  openingBid: number;
  currentBid: number;
  incrementBid: number;
  instantBuyPrice: number;
  media: any; // !! change this !! //
  startsAt: Date;
  endsAt: Date;
  soldTo: null | string;
  soldAt: null | Date;
  id: string;
}

interface IGetListing {
  request: any;
  id: string;
}

export async function getListings() {
  const querySnapshot = await adminDB.collection("listings").get();

  const data: any[] = [];
  querySnapshot.forEach((doc: any) => {
    data.push({ ...doc.data(), id: doc.id });
  });

  return data;
}

export async function getListing({ request, id }: IGetListing) {
  const docSnapshot = await adminDB.collection("listings").doc(id).get();

  if (!docSnapshot.exists) {
    throw Error("No such document exists");
  } else {
    const listing = docSnapshot.data();
    return listing;
  }
}

export async function createListing({
  request,
  listing,
}: {
  request: any;
  listing: IListing;
}) {
  const res = await adminDB.collection("listings").add(listing);

  return getListing({ request, id: res.id });
}

export async function editListing({ request, listing }: any) {
  const { title, slug, description, price, id } = listing;

  await adminDB.collection("listings").doc(id).update({
    title,
    slug,
    description,
    price,
  });

  return getListing({ request, id });
}

export async function deleteListing({ request, id }: any) {
  await adminDB.collection("listings").doc(id).delete();

  return { id };
}

export async function listenToListing({ listingID }: any) {
  const docRef = adminDB.collection("listings").doc(listingID);

  docRef.onSnapshot((doc: any) => {
    console.log("Current data: ", doc.data());
  });
}
