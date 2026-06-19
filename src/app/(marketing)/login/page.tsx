import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { AuthForm } from "@/features/auth/auth-form";

export const metadata: Metadata = {
  title: "Acceder",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <div className="rounded-[18px] border border-sand-200 bg-white p-8 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.3)] sm:p-10">
          <AuthForm oauthError={error === "oauth"} />
        </div>
        <p className="mt-6 text-center text-[14px] text-muted">
          <Link href="/" className="hover:text-forest">
            ← Volver al inicio
          </Link>
        </p>
      </div>
    </Container>
  );
}
