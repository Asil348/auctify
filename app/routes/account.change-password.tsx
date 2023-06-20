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
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Change Password</h1>
      <Form method="POST" className="space-y-4">
        <p>
          <label className="block">
            <span className="text-lg font-semibold">New Password</span>
            <input
              id="password"
              name="password"
              type="password"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </label>
        </p>
        <p>
          <label className="block">
            <span className="text-lg font-semibold">Confirm New Password</span>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </label>
        </p>
        <p>
          <button
            type="submit"
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded"
          >
            Change Password
          </button>
        </p>
      </Form>
    </div>
  );
}
