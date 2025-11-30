import { getCookie } from "@/actions/cookie.action";
import { getAllSims } from "@/actions/sim.action";
import { SimDataTable } from "@/components/sim/sim-table";
import { simColumns } from "@/components/sim/sim-table-columns";
import { DataTableProvider } from "@/components/ui/data-table/data-table-provider";

export default async function SimPage() {
  const sims = await getAllSims();
  const sortOrder = (await getCookie("sim_sort_order")) || "asc";

  return (
    <main>
      <DataTableProvider
        columns={simColumns}
        data={sims}
        initialSorting={[{ id: "lastCashedInDate", desc: sortOrder === "desc" }]}
        tableOptions={{ enableSortingRemoval: false }}
      >
        <SimDataTable />
      </DataTableProvider>
    </main>
  );
}
