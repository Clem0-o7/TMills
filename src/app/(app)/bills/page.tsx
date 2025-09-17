import BillsTable from "@/components/bills/bills-table";

export default function BillsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Bills</h1>
      </div>
      <BillsTable />
    </div>
  );
}
