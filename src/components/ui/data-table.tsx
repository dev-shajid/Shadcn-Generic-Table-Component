"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Checkbox } from '@/components/ui/checkbox'

export type SortDirection = "asc" | "desc" | null

export interface Column<T> {
  key: string
  header: string
  accessor: (row: T) => React.ReactNode
  sortable?: boolean
  width?: string
  className?: string
  onCellClick?: (row: T, value: React.ReactNode) => void
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  emptyMessage?: string
  searchable?: boolean
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  paginated?: boolean
  pageSize?: number
  totalCount?: number
  currentPage?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
  pageSizeOptions?: number[]
  onRowClick?: (row: T) => void
  rowClassName?: (row: T) => string
  sortBy?: string
  sortDirection?: SortDirection
  onSort?: (key: string, direction: SortDirection) => void
  className?: string
  selectable?: boolean
  selectedRows?: T[]
  onSelectionChange?: (rows: T[]) => void
}

export function DataTable<T>({
  data,
  columns,
  loading = false,
  emptyMessage = "No data available",
  searchable = false,
  searchPlaceholder = "Search...",
  onSearch,
  paginated = false,
  pageSize = 10,
  totalCount,
  currentPage = 1,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  onRowClick,
  rowClassName,
  sortBy,
  sortDirection,
  onSort,
  className,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
}: DataTableProps<T>) {
  const [internalSortBy, setInternalSortBy] = React.useState<string | null>(null)
  const [internalSortDirection, setInternalSortDirection] = React.useState<SortDirection>(null)
  const [searchQuery, setSearchQuery] = React.useState("")

  const activeSortBy = sortBy ?? internalSortBy
  const activeSortDirection = sortDirection ?? internalSortDirection

  const handleSort = (key: string) => {
    let newDirection: SortDirection = "asc"

    if (activeSortBy === key) {
      if (activeSortDirection === "asc") {
        newDirection = "desc"
      } else if (activeSortDirection === "desc") {
        newDirection = null
      }
    }

    if (onSort) {
      onSort(key, newDirection)
    } else {
      setInternalSortBy(newDirection ? key : null)
      setInternalSortDirection(newDirection)
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  const sortedData = React.useMemo(() => {
    if (!activeSortBy || !activeSortDirection) return data

    return [...data].sort((a, b) => {
      const column = columns.find((col) => col.key === activeSortBy)
      if (!column) return 0

      const aValue = column.accessor(a)
      const bValue = column.accessor(b)

      const aString = String(aValue ?? "")
      const bString = String(bValue ?? "")

      if (activeSortDirection === "asc") {
        return aString.localeCompare(bString, undefined, { numeric: true })
      } else {
        return bString.localeCompare(aString, undefined, { numeric: true })
      }
    })
  }, [data, activeSortBy, activeSortDirection, columns])

  const displayData = sortedData

  const totalPages = totalCount ? Math.ceil(totalCount / pageSize) : Math.ceil(displayData.length / pageSize)

  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedData = paginated ? displayData.slice(startIndex, endIndex) : displayData

  const getSortIcon = (columnKey: string) => {
    if (activeSortBy !== columnKey) {
      return <ChevronsUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
    }
    if (activeSortDirection === "asc") {
      return <ChevronUp className="ml-2 h-4 w-4" />
    }
    return <ChevronDown className="ml-2 h-4 w-4" />
  }

  const isRowSelected = (row: T) => {
    return selectedRows.some((selected) => JSON.stringify(selected) === JSON.stringify(row))
  }

  const handleRowSelection = (row: T) => {
    if (!onSelectionChange) return

    if (isRowSelected(row)) {
      onSelectionChange(selectedRows.filter((selected) => JSON.stringify(selected) !== JSON.stringify(row)))
    } else {
      onSelectionChange([...selectedRows, row])
    }
  }

  const handleSelectAll = () => {
    if (!onSelectionChange) return

    if (selectedRows.length === paginatedData.length) {
      onSelectionChange([])
    } else {
      onSelectionChange([...paginatedData])
    }
  }

  const allSelected = paginatedData.length > 0 && selectedRows.length === paginatedData.length

  return (
    <div className={cn("w-full space-y-4", className)}>
      {searchable && (
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead key={column.key} style={{ width: column.width }} className={cn(column.className)}>
                  {column.sortable ? (
                    <Button
                      variant="ghost"
                      onClick={() => handleSort(column.key)}
                      className="-ml-3 h-8 data-[state=open]:bg-accent"
                    >
                      <span>{column.header}</span>
                      {getSortIcon(column.key)}
                    </Button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0)} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    <span className="text-muted-foreground">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0)} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-muted-foreground">{emptyMessage}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    onRowClick && "cursor-pointer hover:bg-muted/50",
                    isRowSelected(row) && "bg-muted/50",
                    rowClassName?.(row)
                  )}
                >
                  {selectable && (
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isRowSelected(row)}
                        onCheckedChange={() => handleRowSelection(row)}
                        aria-label="Select all"
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => {
                    const value = column.accessor(row)
                    return (
                      <TableCell
                        key={column.key}
                        className={cn(column.className)}
                        onClick={(e) => {
                          if (column.onCellClick) {
                            e.stopPropagation()
                            column.onCellClick(row, value)
                          }
                        }}
                      >
                        {value}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {paginated && !loading && paginatedData.length > 0 && (
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Rows per page</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 w-16 bg-transparent">
                  {pageSize}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {pageSizeOptions.map((size) => (
                  <DropdownMenuItem key={size} onClick={() => onPageSizeChange?.(size)}>
                    {size}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-6">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-transparent"
                onClick={() => onPageChange?.(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-transparent"
                onClick={() => onPageChange?.(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-transparent"
                onClick={() => onPageChange?.(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-transparent"
                onClick={() => onPageChange?.(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}