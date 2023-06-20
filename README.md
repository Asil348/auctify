# Auctify
Auctify is an auction website. Admins can create auctions and users can bid on them. The highest bidder wins the auction.

## Setup
Place your `serviceAccountKey.json` file you acquired from your Firebase panel in the root directory of the project. You can edit your .env file accordingly.

The `SESSION_SECRET` is used to sign the session ID cookie. You can use any string you want.

Run `npm install`.

To create an admin, simply add the `admin: true` field to the desired user document in the `users` collection.

## Development
Simply run `npm run dev` to start the development server.

## Production
Run `npm run build` to build the project. Then run `npm start` to start the production server.