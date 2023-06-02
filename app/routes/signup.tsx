import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { createUserSession, getUserToken } from "~/server/session.server";

import type { LoaderArgs } from "@remix-run/node";
import { signUp } from "~/server/auth.server";
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

  // !! THIS IS BAD PRACTICE, SEE 'signUp() @ auth.server.ts' !! //
  try {
    const user = await signUp(request, email.toString(), password.toString());
    return createUserSession({
      request,
      userToken: await user.getIdToken(),
    });
  } catch (err: any) {
    return new Response(err.code, { status: 500 });
  }
}

export default function SignUp() {
  const error = useActionData();

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

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit">Sign up</button>
    </Form>
  );
}
