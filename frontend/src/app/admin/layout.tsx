import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-900 pt-16 text-white">
      <AdminSidebar />
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
