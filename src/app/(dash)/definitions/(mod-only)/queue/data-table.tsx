'use client';

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState
} from '@tanstack/react-table';
import { CheckIcon, CircleEllipsisIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { updatePendingDefinition } from './_actions';
import type { Definition } from './columns';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data
}: DataTableProps<TData, TValue>) {
  const [hiddenRowIndices, setHiddenRowIndices] = useState<number[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const table = useReactTable({
    data,
    columns,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      removeRow: (index: number) => {
        setHiddenRowIndices((prev) => [...prev, index]);
      }
    }
  });
  return (
    <div className="space-y-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="sm:absolute sm:right-0 sm:top-0" variant="outline">
            <CircleEllipsisIcon className="mr-2 size-4" />
            Bulk actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="text-green-600 focus:text-green-700"
            onClick={() => {
              table
                .getFilteredSelectedRowModel()
                .rows.filter((row) => !hiddenRowIndices.includes(row.index))
                .forEach((row) => {
                  updatePendingDefinition({
                    definitionId: (row.original as Definition).id,
                    action: 'approve'
                  });
                  // @ts-expect-error removeRow
                  table.options.meta.removeRow(row.index);
                });
              toast.success('Definitions approved!');
            }}
          >
            <CheckIcon className="mr-2 size-4" /> Approve selected
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive/80"
            onClick={() => {
              table
                .getFilteredSelectedRowModel()
                .rows.filter((row) => !hiddenRowIndices.includes(row.index))
                .forEach((row) => {
                  updatePendingDefinition({
                    definitionId: (row.original as Definition).id,
                    action: 'reject'
                  });
                  // @ts-expect-error removeRow
                  table.options.meta.removeRow(row.index);
                });
              toast.success('Definitions rejected!');
            }}
          >
            <XIcon className="mr-2 size-4" /> Reject selected
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              table
                .getFilteredSelectedRowModel()
                .rows.filter((row) => !hiddenRowIndices.includes(row.index))
                .forEach((row) => {
                  updatePendingDefinition({
                    definitionId: (row.original as Definition).id,
                    action: 'delete'
                  });
                  // @ts-expect-error removeRow
                  table.options.meta.removeRow(row.index);
                });
              toast.success('Definitions deleted!');
            }}
          >
            <CheckIcon className="mr-2 size-4" /> Trash selected
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table
                .getRowModel()
                .rows.filter((_, i) => !hiddenRowIndices.includes(i))
                .map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No data to display.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="text-right text-sm text-muted-foreground">
        {
          table
            .getFilteredSelectedRowModel()
            .rows.filter((row) => !hiddenRowIndices.includes(row.index)).length
        }{' '}
        of{' '}
        {
          table
            .getFilteredRowModel()
            .rows.filter((row) => !hiddenRowIndices.includes(row.index)).length
        }{' '}
        row(s) selected.
      </div>
    </div>
  );
}