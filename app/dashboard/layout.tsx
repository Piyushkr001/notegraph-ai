import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/app/dashboard/_shared/Sidebar";
import Footer from "@/app/_shared/Footer";

export const metadata = {
  title: "Dashboard - NoteGraph AI",
  description: "Dashboard - NoteGraph AI",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex w-full flex-col md:flex-row overflow-hidden bg-linear-to-br from-indigo-50/50 via-white to-cyan-50/50 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900 relative">
        <div className="absolute top-[-5%] left-[-10%] w-[500px] h-[500px] bg-purple-400/20 dark:bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-blue-400/20 dark:bg-blue-900/20 rounded-full blur-3xl pointer-events-none" />

        <DashboardSidebar />
        
        <SidebarInset className="md:mt-16 flex-1 overflow-auto bg-transparent relative z-10 w-full transition-colors border-l border-indigo-50 dark:border-indigo-950">
          <header className="flex h-14 items-center gap-4 border-b border-indigo-100 dark:border-slate-800 bg-white/60 dark:bg-gray-950/60 backdrop-blur-md px-4 md:hidden">
            <SidebarTrigger className="-ml-1 text-indigo-900 dark:text-indigo-100" />
            <span className="font-semibold text-indigo-900 dark:text-indigo-100">Dashboard Menu</span>
          </header>
          <main className="mx-auto w-full max-w-7xl min-h-[calc(100vh-4rem)] flex-1 p-4 md:p-8">
            <div className="relative w-full">
              {children}
            </div>
          </main>
          <Footer hideOnDashboard={false} />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
