import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { updateUserPassword } from "~/server/account.server";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (password !== confirmPassword) {
    return new Response("Passwords do not match", {
      status: 400,
    });
  }

  if (!password || !confirmPassword) {
    return new Response("Missing password or confirmPassword", {
      status: 400,
    });
  }

  await updateUserPassword(request, password.toString()).catch((err) => {
    console.log(err);
    return new Response(err.code, { status: 500 });
  });

  return redirect(`/account`);
}
export default function AccountUpdatePassword() {
  return (
    <div>
      <h1>Change Password</h1>
      <Form method="POST">
        <label>
          New Password
          <input type="password" name="password" />
        </label>
        <br />
        <label>
          Confirm New Password
          <input type="password" name="confirmPassword" />
        </label>
        <br />
        <button type="submit">Change Password</button>
      </Form>
    </div>
  );
}
