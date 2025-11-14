import { getAllSims } from "@/actions/sim.action";

export default async function SimPage() {
  const sims = await getAllSims();

  return (
    <main className="container flex h-screen flex-col items-center justify-center gap-2">
      {/* <DataTable columns={simColumns} data={sims} /> */}
      hi
    </main>
  );
}
