import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const livestock = [
  { id: "PL001", type: "Krowa", status: "Zdrowy", weight: "540kg" },
  { id: "PL002", type: "Jałówka", status: "Leczenie", weight: "420kg" },
  { id: "PL003", type: "Byk", status: "Zdrowy", weight: "850kg" },
]

export function LivestockList() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Typ</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Waga</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {livestock.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.id}</TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>
                <Badge
                  variant={item.status === "Zdrowy" ? "default" : "destructive"}
                >
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">{item.weight}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
