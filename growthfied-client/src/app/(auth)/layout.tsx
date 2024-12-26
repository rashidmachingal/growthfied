import { AuthLayout, AuthProtection } from "@/interface/components";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
    <AuthProtection/>
    <AuthLayout>{children}</AuthLayout>
    </>
  );
}
