import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolved = searchParams ? await searchParams : undefined;
  const error = typeof resolved?.error === "string" ? resolved.error : "";
  const query = error ? `?error=${encodeURIComponent(error)}` : "";
  redirect(`/student/login${query}`);
}
