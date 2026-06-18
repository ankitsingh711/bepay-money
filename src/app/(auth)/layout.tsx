import { AuthLayout } from "@/components/auth/auth-layout";
import { GuestGuard } from "@/components/auth/auth-guard";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <GuestGuard>
      <AuthLayout>{children}</AuthLayout>
    </GuestGuard>
  );
}
