import type { ActionArgs } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { createUserSession, getUserToken } from "~/server/session.server";
import { getUser, signIn } from "~/server/auth.server";

export async function loader({ request }: LoaderArgs) {
  // if there's a user token in the cookies, the user is already signed in
  const userToken = await getUserToken(request);

  const FBUser = await getUser();

  if (userToken && FBUser) return redirect("/");
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

  let user;

  return await signIn(request, email.toString(), password.toString())
    .then(async (res) => {
      user = res.user;
      return createUserSession({
        request,
        userToken: await user.getIdToken(),
      });
    })
    .catch((err) => {
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        return new Response("Invalid email or password", { status: 401 });
      } else {
        return new Response(err.message, { status: 500 });
      }
    });

  // If no user is returned, return the error

  // if (!user) return new Response("Invalid email or password", { status: 401 });
}

export default function SignIn() {
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

      <button type="submit">Log in</button>
    </Form>
  );
}
