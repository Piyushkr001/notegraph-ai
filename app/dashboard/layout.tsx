import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/app/dashboard/_shared/Sidebar";
import Footer from "../_shared/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex w-full flex-col md:flex-row overflow-hidden">
        <DashboardSidebar />
        <SidebarInset className="md:mt-16 flex-1 overflow-auto bg-muted/20">
          <header className="flex h-14 items-center gap-4 border-b bg-background px-4 md:hidden">
            <SidebarTrigger className="-ml-1" />
            <span className="font-semibold">Dashboard Menu</span>
          </header>
          <main className="mx-auto w-full max-w-7xl p-4 md:p-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
