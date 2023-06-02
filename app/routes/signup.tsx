import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import {
  createUserSession,
  getUserToken,
  signUp,
} from "~/utils/session.server";

import type { LoaderArgs } from "@remix-run/node";
export async function loader({ request }: LoaderArgs) {
  // if there's a user token in the cookies, the user is already signed in
  const userToken = await getUserToken(request);

  if (userToken) return redirect("/");
  return null;
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  // Perform form validation
  // For example, check the email is a valid email
  // Return the errors if there are any

  if (!email || !password) {
    return new Response("Missing email or password", {
      status: 400,
    });
  }

  const user = await signUp(request, email.toString(), password.toString());

  // If no user is returned, return the error

  return createUserSession({
    request,
    userToken: await user.getIdToken(),
  });
}

export default function SignUp() {
  return (
    <Form method="post">
      <label htmlFor="email">Email address</label>
      <input
        id="email"
        required
        name="email"
        type="email"
        autoComplete="email"
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
      />

      <button type="submit">Sign up</button>
    </Form>
  );
}
