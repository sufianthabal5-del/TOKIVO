import { AdminShell } from "@/components/admin/AdminShell";

export const metadata = { title: "Admin | Tokiva", robots: { index: false } };

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <AdminShell>{children}</AdminShell>;
}
