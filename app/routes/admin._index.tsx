import { Link } from "@remix-run/react";

export default function Admin() {
  return (
    <div>
      <h1>Admin</h1>
      <Link to="new">New Listing</Link>
    </div>
  );
}
