import DataTable from "@/components/DataTable";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  return (
    <main className="flex bg-[#E1DED9] w-full min-h-screen flex-col items-center justify-between">
      <ScrollArea className="h-screen w-full rounded-md border">
        <DataTable />
      </ScrollArea>
    </main>
  );
}
