import { adminDB } from "~/server/firebaseAdmin.server";
import { getUser } from "./auth.server";
import { getUserAccount } from "./account.server";
import { FieldValue } from "firebase-admin/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";

export interface IListing {
  title: string;
  slug: string;
  description: string;
  openingBid: number | string;
  currentBid: number | string;
  incrementBid: number | string;
  instantBuyPrice: number | string;
  media: any; // !! change this !! //
  startsAt: Date;
  endsAt: Date;
  soldTo: null | string;
  soldAt: null | Date;
  id: string;
  bids: Object[];
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

  return res.id;
}

export async function uploadListingMedia({ listingID, blob }: any) {
  const storage = getStorage();
  const stream = await blob.arrayBuffer()
  const storageRef = ref(storage, `listings/${listingID}/${blob.name}`);
  await uploadBytes(storageRef, stream, { contentType: blob.type });

  return blob.name;
}

export async function editListing({ request, listing }: any) {
  const res = adminDB.collection("listings").doc(listing.id).update(listing);

  return getListing({ request, id: listing.id });
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

export async function bidOnListing({ request, listingID, bid }: any) {
  const docRef = adminDB.collection("listings").doc(listingID);

  const doc = await docRef.get();

  const user = await getUser();

  if (!user) return new Response("You are not logged in.", { status: 401 });

  const userAccount = await getUserAccount(request);
  //@ts-ignore
  if (!userAccount.address || !userAccount.phone)
    return new Response(
      "You need to enter your address and phone number in order to place a bid.",
      { status: 401 }
    );

  if (!doc.exists) {
    throw Error("No such document exists");
  } else {
    // @ts-ignore
    const listing: IListing = doc.data();

    if (listing.soldTo)
      return new Response("Listing has already been sold", { status: 400 });
    if (listing.endsAt < new Date())
      return new Response("Listing has expired", { status: 400 });
    if (listing.instantBuyPrice <= bid) {
      await docRef.update({
        currentBid: bid,
        soldTo: user.uid,
        soldAt: new Date(),
        bids: FieldValue.arrayUnion({ uid: user.uid, bid }),
      });
      return new Response(
        "Listing has been sold to you for instant buy price!",
        { status: 200 }
      );
    }

    if (!listing.currentBid && bid >= listing.openingBid) {
      if (
        bid > listing.openingBid &&
        bid - parseInt(listing.openingBid) < parseInt(listing.incrementBid)
      )
        return new Response(
          "Opening bid must be greater than increment bid or the same as opening bid.",
          { status: 400 }
        );
      await docRef.update({
        currentBid: bid,
        bids: FieldValue.arrayUnion({ uid: user.uid, bid }),
      });

      return new Response(
        "Bid has been placed and the auction has been started!",
        { status: 200 }
      );
    }

    // !! type check !!
    if (listing.currentBid >= bid || listing.openingBid > bid) {
      return new Response("Bid must be greater than current bid");
    } else if (
      parseInt(bid) - parseInt(listing.currentBid) <
      parseInt(listing.incrementBid)
    ) {
      return new Response("Your bid must be greater than the increment bid.", {
        status: 400,
      });
    } else {
      await docRef.update({
        currentBid: bid,
        bids: FieldValue.arrayUnion({ uid: user.uid, bid }),
      });
      return new Response("Bid has been placed!", { status: 200 });
    }
  }
}
