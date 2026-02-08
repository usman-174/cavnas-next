import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth";
import { AuthForm } from "@/components/auth/auth-form";
import { getTierCapacity } from "@/app/actions/tiers";

/**
 * Login Page - Server Component
 *
 * This page serves as both login and registration.
 * The interactive form is handled by the client component AuthForm.
 */
export default async function LoginPage() {
  // Check if user is already authenticated on the server
  const user = await getServerUser();

  // Redirect authenticated users to appropriate dashboard
  if (user) {
    if (user.role === "ADMIN") {
      redirect("/admin");
    }
    redirect("/dashboard");
  }

  const tierOptions = await getTierCapacity();

  // Render the client-side auth form
  return <AuthForm tierOptions={tierOptions} />;
}
