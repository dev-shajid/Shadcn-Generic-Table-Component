'use client'

import * as React from 'react'
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  Columns3,
  Download,
  Search,
  SlidersHorizontal,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

export type SortDirection = 'asc' | 'desc' | null

export interface SortState {
  id: string
  direction: Exclude<SortDirection, null>
}

export interface ColumnFilterOption {
  label: string
  value: string
}

export interface ColumnFilterConfig {
  /** Options shown in this column's filter menu. */
  options: ColumnFilterOption[]
  /** Called whenever selected filter values change. Filter data in parent and pass filtered rows back. */
  onChange: (values: string[]) => void
}

export interface Column<T> {
  /** Stable column identifier; also used by sort/filter callbacks. */
  key: string
  header: React.ReactNode
  /** Rendered cell content. Keep this for compatibility with the old API. */
  accessor: (row: T) => React.ReactNode
  /** Raw value used for sorting, filtering and CSV. Prefer this over parsing JSX. */
  sortValue?: (row: T) => string | number | boolean | Date | null | undefined
  /** Raw value used by column filtering. Defaults to sortValue, then row[key]. */
  filterValue?: (row: T) => string | number | boolean | null | undefined
  /** Raw value used for global search. Defaults to filterValue, sortValue, then row[key]. */
  searchValue?: (row: T) => unknown
  /** Raw value exported to CSV. Defaults to sortValue, then filterValue, then row[key]. */
  exportValue?: (row: T) => unknown
  sortable?: boolean
  searchable?: boolean
  hideable?: boolean
  width?: string
  className?: string
  headerClassName?: string
  cellClassName?: string
  onCellClick?: (row: T, value: React.ReactNode) => void
  /** Adds filter menu to this column. Parent owns filtering; onChange receives selected values. */
  filter?: ColumnFilterConfig
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]

  /** Features are individually opt-in. A plain table needs only data + columns. */
  loading?: boolean
  emptyMessage?: string
  className?: string
  tableClassName?: string
  rowClassName?: (row: T) => string
  onRowClick?: (row: T) => void
  getRowId?: (row: T, index: number) => string

  searchable?: boolean
  searchPlaceholder?: string
  searchValue?: string
  onSearch?: (query: string) => void


  paginated?: boolean
  pageSize?: number
  totalCount?: number
  currentPage?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
  pageSizeOptions?: number[]

  /** Sorting can be enabled column-by-column using sortable: true. */
  sortBy?: string
  sortDirection?: SortDirection
  onSort?: (key: string, direction: SortDirection) => void

  selectable?: boolean
  selectedRows?: T[]
  onSelectionChange?: (rows: T[]) => void

  columnVisibility?: boolean
  hiddenColumns?: string[]
  onHiddenColumnsChange?: (hiddenColumns: string[]) => void

  exportable?: boolean
  exportFileName?: string

  /** Optional top-right custom actions, e.g. Create button. */
  toolbarActions?: React.ReactNode
}

function defaultRowId<T>(row: T, index: number, getRowId?: (row: T, index: number) => string) {
  if (getRowId) return getRowId(row, index)
  const id = (row as Record<string, unknown> | null)?.id
  return id !== undefined && id !== null ? String(id) : `row-${index}`
}

function rawValue<T>(row: T, column: Column<T>, kind: 'sort' | 'filter' | 'search' | 'export'): unknown {
  if (kind === 'sort' && column.sortValue) return column.sortValue(row)
  if (kind === 'filter' && column.filterValue) return column.filterValue(row)
  if (kind === 'search' && column.searchValue) return column.searchValue(row)
  if (kind === 'export' && column.exportValue) return column.exportValue(row)
  if (kind === 'filter' && column.sortValue) return column.sortValue(row)
  if (kind === 'search' && column.filterValue) return column.filterValue(row)
  if (kind === 'search' && column.sortValue) return column.sortValue(row)
  if (kind === 'export' && column.sortValue) return column.sortValue(row)
  if (kind === 'export' && column.filterValue) return column.filterValue(row)
  return (row as Record<string, unknown> | null)?.[column.key] ?? ''
}

function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0
  if (a == null) return -1
  if (b == null) return 1
  if (a instanceof Date || b instanceof Date) {
    const at = a instanceof Date ? a.getTime() : new Date(String(a)).getTime()
    const bt = b instanceof Date ? b.getTime() : new Date(String(b)).getTime()
    if (Number.isFinite(at) && Number.isFinite(bt)) return at - bt
  }
  if (typeof a === 'number' && typeof b === 'number') return a - b
  if (typeof a === 'boolean' && typeof b === 'boolean') return Number(a) - Number(b)
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' })
}

function exportCsv<T>(rows: T[], columns: Column<T>[], filename: string) {
  const escapeCsv = (value: unknown) => {
    const text = value instanceof Date ? value.toISOString() : String(value ?? '')
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
  }
  const csv = [
    columns.map((column) => escapeCsv(typeof column.header === 'string' ? column.header : column.key)).join(','),
    ...rows.map((row) => columns.map((column) => escapeCsv(rawValue(row, column, 'export'))).join(',')),
  ].join('\r\n')
  const blob = new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename.toLowerCase().endsWith('.csv') ? filename : `${filename}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export function DataTable<T>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No data available',
  className,
  tableClassName,
  rowClassName,
  onRowClick,
  getRowId,
  searchable = false,
  searchPlaceholder = 'Search...',
  searchValue,
  onSearch,
  paginated = false,
  pageSize = 10,
  totalCount,
  currentPage = 1,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  sortBy,
  sortDirection,
  onSort,
  selectable = false,
  selectedRows,
  onSelectionChange,
  columnVisibility = false,
  hiddenColumns: controlledHiddenColumns,
  onHiddenColumnsChange,
  exportable = false,
  exportFileName = 'data-table',
  toolbarActions,
}: DataTableProps<T>) {
  const [internalSearch, setInternalSearch] = React.useState('')
  const [internalSortBy, setInternalSortBy] = React.useState<string | null>(null)
  const [internalSortDirection, setInternalSortDirection] = React.useState<SortDirection>(null)
  const [columnFilterSelections, setColumnFilterSelections] = React.useState<Record<string, string[]>>({})
  const [internalPage, setInternalPage] = React.useState(1)
  const [internalPageSize, setInternalPageSize] = React.useState(pageSize)
  const [internalSelectedIds, setInternalSelectedIds] = React.useState<Set<string>>(new Set())
  const [internalHiddenColumns, setInternalHiddenColumns] = React.useState<string[]>([])

  const activeSearch = searchValue ?? internalSearch
  const activeHiddenColumns = controlledHiddenColumns ?? internalHiddenColumns
  const activePage = onPageChange ? currentPage : internalPage
  const activePageSize = onPageSizeChange ? pageSize : internalPageSize
  // Sorting is single-column and enabled per column with sortable: true.
  const activeSorts: SortState[] = sortBy !== undefined || sortDirection !== undefined
    ? sortBy && sortDirection ? [{ id: sortBy, direction: sortDirection }] : []
    : internalSortBy && internalSortDirection ? [{ id: internalSortBy, direction: internalSortDirection }] : []


  const setSearch = (value: string) => {
    if (searchValue === undefined) setInternalSearch(value)
    onSearch?.(value)
    setInternalPage(1)
    onPageChange?.(1)
  }

  const visibleColumns = React.useMemo(
    () => columns.filter((column) => !activeHiddenColumns.includes(column.key)),
    [columns, activeHiddenColumns],
  )

  const processedRows = React.useMemo(() => {
    // Search and column filters are callback-driven. Parent filters data and passes result here.
    const result = [...data]
    if (activeSorts.length) {
      result.sort((a, b) => {
        const sort = activeSorts[0]
        const column = columns.find((item) => item.key === sort.id)
        if (!column) return 0
        const compared = compareValues(rawValue(a, column, 'sort'), rawValue(b, column, 'sort'))
        return sort.direction === 'asc' ? compared : -compared
      })
    }
    return result
  }, [data, columns, activeSorts])

  const effectiveTotal = totalCount ?? processedRows.length
  const totalPages = Math.max(1, Math.ceil(effectiveTotal / Math.max(1, activePageSize)))
  const safePage = Math.min(Math.max(1, activePage), totalPages)
  const displayedRows = paginated
    ? processedRows.slice((safePage - 1) * activePageSize, safePage * activePageSize)
    : processedRows

  const resolveId = (row: T, index: number) => defaultRowId(row, index, getRowId)
  const selectedIdSet = React.useMemo(() => {
    if (selectedRows) return new Set(selectedRows.map((row, index) => resolveId(row, index)))
    return internalSelectedIds
  // resolveId only depends on getRowId.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRows, internalSelectedIds, getRowId])

  const updateSelection = (nextIds: Set<string>) => {
    if (selectedRows === undefined) setInternalSelectedIds(nextIds)
    if (onSelectionChange) {
      const allRowsById = new Map(data.map((row, index) => [resolveId(row, index), row]))
      onSelectionChange([...nextIds].map((id) => allRowsById.get(id)).filter((row): row is T => row !== undefined))
    }
  }

  const changeSort = (key: string) => {
    const active = activeSorts[0]
    const direction: SortDirection = active?.id !== key ? 'asc' : active.direction === 'asc' ? 'desc' : null
    if (sortBy === undefined) {
      setInternalSortBy(direction ? key : null)
      setInternalSortDirection(direction)
    }
    onSort?.(key, direction)
    setInternalPage(1)
    onPageChange?.(1)
  }

  const toggleColumnFilter = (column: Column<T>, value: string, checked: boolean) => {
    const current = columnFilterSelections[column.key] ?? []
    const nextValues = checked
      ? [...new Set([...current, value])]
      : current.filter((item) => item !== value)
    setColumnFilterSelections((currentSelections) => ({ ...currentSelections, [column.key]: nextValues }))
    column.filter?.onChange(nextValues)
  }

  const changePage = (page: number) => {
    const next = Math.max(1, Math.min(totalPages, page))
    if (onPageChange) onPageChange(next)
    else setInternalPage(next)
  }

  const changePageSize = (size: number) => {
    if (onPageSizeChange) onPageSizeChange(size)
    else setInternalPageSize(size)
    setInternalPage(1)
    onPageChange?.(1)
  }

  const toggleHiddenColumn = (key: string, visible: boolean) => {
    const next = visible ? activeHiddenColumns.filter((item) => item !== key) : [...activeHiddenColumns, key]
    if (controlledHiddenColumns === undefined) setInternalHiddenColumns(next)
    onHiddenColumnsChange?.(next)
  }


  const allDisplayedSelected = displayedRows.length > 0 && displayedRows.every((row, index) => selectedIdSet.has(resolveId(row, index)))
  const someDisplayedSelected = displayedRows.some((row, index) => selectedIdSet.has(resolveId(row, index)))
  const columnCount = visibleColumns.length + (selectable ? 1 : 0)

  return (
    <div className={cn('w-full space-y-4', className)}>
      {(searchable || columns.some((column) => column.filter) || columnVisibility || exportable || toolbarActions) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            {searchable && onSearch && (
              <div className="relative w-full min-w-48 sm:max-w-sm">
                <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  aria-label="Search table"
                  placeholder={searchPlaceholder}
                  value={activeSearch}
                  onChange={(event) => setSearch(event.target.value)}
                  className="pl-9"
                />
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {toolbarActions}
            {columnVisibility && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="outline" size="sm"><Columns3 className="mr-2 h-4 w-4" /> Columns</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {columns.filter((column) => column.hideable !== false).map((column) => (
                    <DropdownMenuCheckboxItem key={column.key} checked={!activeHiddenColumns.includes(column.key)} onCheckedChange={(checked) => toggleHiddenColumn(column.key, checked === true)}>
                      {column.header}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {exportable && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button type="button" variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Export</Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => exportCsv(processedRows, visibleColumns, exportFileName)}>Export current results (CSV)</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportCsv(data, visibleColumns, `${exportFileName}-all`)}>Export all loaded rows (CSV)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      )}

      {selectable && selectedIdSet.size > 0 && (
        <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2 text-sm">
          <span>{selectedIdSet.size} selected</span>
          <Button type="button" variant="ghost" size="sm" onClick={() => updateSelection(new Set())}>Clear selection</Button>
        </div>
      )}

      <div className="overflow-x-auto rounded-md border">
        <Table className={tableClassName}>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    aria-label="Select all rows on this page"
                    checked={allDisplayedSelected ? true : someDisplayedSelected ? 'indeterminate' : false}
                    onCheckedChange={(checked) => {
                      const next = new Set(selectedIdSet)
                      displayedRows.forEach((row, index) => {
                        const id = resolveId(row, index)
                        if (checked === true) next.add(id)
                        else next.delete(id)
                      })
                      updateSelection(next)
                    }}
                  />
                </TableHead>
              )}
              {visibleColumns.map((column) => {
                const active = activeSorts.find((sort) => sort.id === column.key)
                const canSort = column.sortable === true
                return (
                  <TableHead key={column.key} style={{ width: column.width }} className={cn('whitespace-nowrap', column.className, column.headerClassName)}>
                    {canSort ? (
                      <Button type="button" variant="ghost" size="sm" onClick={() => changeSort(column.key)} className="-ml-3 h-8 gap-1.5 px-3">
                        <span>{column.header}</span>
                        {active?.direction === 'asc' ? <ArrowUp className="h-4 w-4" /> : active?.direction === 'desc' ? <ArrowDown className="h-4 w-4" /> : <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />}
                      </Button>
                    ) : column.header}
                    {column.filter && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button type="button" variant="ghost" size="icon" aria-label={`Filter ${String(column.header)}`} className="ml-1 h-7 w-7">
                            <SlidersHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-56 p-2">
                          <div className="mb-2 px-2 text-sm font-medium">Filter {String(column.header)}</div>
                          <div className="max-h-64 space-y-1 overflow-auto">
                            {column.filter.options.map((option) => (
                              <label key={option.value} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted">
                                <Checkbox
                                  checked={(columnFilterSelections[column.key] ?? []).includes(option.value)}
                                  onCheckedChange={(checked) => toggleColumnFilter(column, option.value, checked === true)}
                                />
                                <span>{option.label}</span>
                              </label>
                            ))}
                          </div>
                          {(columnFilterSelections[column.key]?.length ?? 0) > 0 && (
                            <Button type="button" variant="ghost" size="sm" className="mt-2 w-full" onClick={() => {
                              setColumnFilterSelections((current) => ({ ...current, [column.key]: [] }))
                              column.filter?.onChange([])
                            }}>Clear filter</Button>
                          )}
                        </PopoverContent>
                      </Popover>
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: Math.max(1, Math.min(activePageSize, 8)) }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {selectable && <TableCell><Skeleton className="h-4 w-4" /></TableCell>}
                  {visibleColumns.map((column) => <TableCell key={column.key}><Skeleton className="h-4 w-3/4" /></TableCell>)}
                </TableRow>
              ))
            ) : displayedRows.length === 0 ? (
              <TableRow><TableCell colSpan={Math.max(1, columnCount)} className="h-28 text-center text-muted-foreground">{emptyMessage}</TableCell></TableRow>
            ) : displayedRows.map((row, rowIndex) => {
              const rowId = resolveId(row, rowIndex + (paginated ? (safePage - 1) * activePageSize : 0))
              const isSelected = selectedIdSet.has(rowId)
              return (
                <TableRow key={rowId} data-state={isSelected ? 'selected' : undefined} onClick={() => onRowClick?.(row)} className={cn(onRowClick && 'cursor-pointer', 'hover:bg-muted/50', isSelected && 'bg-muted/40', rowClassName?.(row))}>
                  {selectable && (
                    <TableCell onClick={(event) => event.stopPropagation()}>
                      <Checkbox aria-label={`Select row ${rowIndex + 1}`} checked={isSelected} onCheckedChange={(checked) => {
                        const next = new Set(selectedIdSet)
                        if (checked === true) next.add(rowId)
                        else next.delete(rowId)
                        updateSelection(next)
                      }} />
                    </TableCell>
                  )}
                  {visibleColumns.map((column) => {
                    const value = column.accessor(row)
                    return <TableCell key={column.key} className={cn(column.className, column.cellClassName)} onClick={(event) => {
                      if (column.onCellClick) {
                        event.stopPropagation()
                        column.onCellClick(row, value)
                      }
                    }}>{value}</TableCell>
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {paginated && !loading && effectiveTotal > activePageSize && (
        <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span>Rows per page</span>
            <Select value={String(activePageSize)} onValueChange={(value) => changePageSize(Number(value))}>
              <SelectTrigger className="h-8 w-[76px]"><SelectValue /></SelectTrigger>
              <SelectContent>{pageSizeOptions.map((size) => <SelectItem key={size} value={String(size)}>{size}</SelectItem>)}</SelectContent>
            </Select>
            <span>
              {effectiveTotal === 0 ? '0' : `${(safePage - 1) * activePageSize + 1}-${Math.min(safePage * activePageSize, effectiveTotal)}`} of {effectiveTotal}
            </span>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button type="button" variant="outline" size="icon" className="h-8 w-8" aria-label="First page" onClick={() => changePage(1)} disabled={safePage <= 1}><ChevronsLeft className="h-4 w-4" /></Button>
            <Button type="button" variant="outline" size="icon" className="h-8 w-8" aria-label="Previous page" onClick={() => changePage(safePage - 1)} disabled={safePage <= 1}><ChevronLeft className="h-4 w-4" /></Button>
            <span className="min-w-24 text-center">Page {safePage} of {totalPages}</span>
            <Button type="button" variant="outline" size="icon" className="h-8 w-8" aria-label="Next page" onClick={() => changePage(safePage + 1)} disabled={safePage >= totalPages}><ChevronRight className="h-4 w-4" /></Button>
            <Button type="button" variant="outline" size="icon" className="h-8 w-8" aria-label="Last page" onClick={() => changePage(totalPages)} disabled={safePage >= totalPages}><ChevronsRight className="h-4 w-4" /></Button>
          </div>
        </div>
      )}
    </div>
  )
}
