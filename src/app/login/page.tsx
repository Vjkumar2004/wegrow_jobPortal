import { redirect } from "next/navigation";

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const error = typeof searchParams?.error === "string" ? searchParams.error : "";
  const query = error ? `?error=${encodeURIComponent(error)}` : "";
  redirect(`/student/login${query}`);
}
