import { Header } from "@/components/layout/header";

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      <main className=" gap-2 py-5 max-h-[calc(100vh-4rem)] overflow-auto">
        <div className="container">{children}</div>
      </main>
    </>
  );
}
