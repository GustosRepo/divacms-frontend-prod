import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-900 pt-16 lg:pt-16 text-white">
      <AdminSidebar />
      <main className="pt-24 lg:pt-8 lg:ml-80 p-4 lg:p-10">{children}</main>
    </div>
  );
}
