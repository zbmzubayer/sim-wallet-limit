import { getCookie } from "@/actions/cookie.action";
import { getAllSims } from "@/actions/sim.action";
import { SimDataTable } from "@/components/sim/sim-table";
import { simColumns } from "@/components/sim/sim-table-columns";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { DataTableProvider } from "@/components/ui/data-table/data-table-provider";

export default async function SimPage() {
  const sims = await getAllSims();
  const sortOrder = (await getCookie("sim_sort_order")) || "asc";

  return (
    <main>
      <div className="flex flex-col gap-2">
        <DataTableProvider
          columns={simColumns}
          data={sims}
          initialSorting={[{ id: "lastCashedInDate", desc: sortOrder === "desc" }]}
          tableOptions={{ enableSortingRemoval: false }}
          paginationOptions={{ pageSize: 50, pageIndex: 0 }}
        >
          <SimDataTable />
          <DataTablePagination />
        </DataTableProvider>
      </div>
    </main>
  );
}
