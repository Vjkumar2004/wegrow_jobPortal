import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-[#FFF6EE]">
      <h1 className="text-6xl font-extrabold text-[#0B1F4B] mb-4">404</h1>
      <h2 className="text-2xl font-bold text-[#0B1F4B] mb-2">Page Not Found</h2>
      <p className="text-slate-600 max-w-md mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-[#FF6B00] text-white font-semibold hover:bg-[#e05f00] transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
