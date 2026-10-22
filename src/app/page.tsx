'use client'

import * as React from 'react'
import { Building2, CheckCircle2, Copy, Mail, MapPin, MoreHorizontal, RefreshCw, UserRound, XCircle } from 'lucide-react'
import { toast } from 'sonner'

import { DataTable, type Column } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// One mixed dummy dataset demonstrates strings, numbers, booleans, dates, nested objects and rendered cells.
type DemoUser = {
  id: number
  name: string
  email: string
  phone: string
  company: { name: string; department: string }
  location: { city: string; country: string }
  role: 'Admin' | 'Editor' | 'Viewer'
  status: 'Active' | 'Pending' | 'Suspended'
  projects: number
  monthlySpend: number
  joinedAt: string
  verified: boolean
}

const demoUsers: DemoUser[] = [
  { id: 1, name: 'Ava Thompson', email: 'ava.thompson@example.com', phone: '+1 202-555-0101', company: { name: 'Northstar Labs', department: 'Engineering' }, location: { city: 'Austin', country: 'USA' }, role: 'Admin', status: 'Active', projects: 12, monthlySpend: 420, joinedAt: '2025-01-12', verified: true },
  { id: 2, name: 'Noah Williams', email: 'noah.williams@example.com', phone: '+1 202-555-0102', company: { name: 'Brightside Co.', department: 'Marketing' }, location: { city: 'Seattle', country: 'USA' }, role: 'Editor', status: 'Pending', projects: 5, monthlySpend: 180, joinedAt: '2025-02-04', verified: false },
  { id: 3, name: 'Mia Chen', email: 'mia.chen@example.com', phone: '+1 202-555-0103', company: { name: 'Orbit Systems', department: 'Product' }, location: { city: 'Toronto', country: 'Canada' }, role: 'Viewer', status: 'Active', projects: 3, monthlySpend: 75, joinedAt: '2025-02-19', verified: true },
  { id: 4, name: 'Liam Patel', email: 'liam.patel@example.com', phone: '+1 202-555-0104', company: { name: 'Northstar Labs', department: 'Sales' }, location: { city: 'Chicago', country: 'USA' }, role: 'Editor', status: 'Suspended', projects: 8, monthlySpend: 230, joinedAt: '2025-03-02', verified: false },
  { id: 5, name: 'Isabella Garcia', email: 'isabella.garcia@example.com', phone: '+1 202-555-0105', company: { name: 'Cedar Digital', department: 'Design' }, location: { city: 'Madrid', country: 'Spain' }, role: 'Admin', status: 'Active', projects: 16, monthlySpend: 510, joinedAt: '2025-03-15', verified: true },
  { id: 6, name: 'Ethan Brown', email: 'ethan.brown@example.com', phone: '+1 202-555-0106', company: { name: 'Brightside Co.', department: 'Support' }, location: { city: 'London', country: 'UK' }, role: 'Viewer', status: 'Pending', projects: 2, monthlySpend: 60, joinedAt: '2025-04-01', verified: false },
  { id: 7, name: 'Sophia Kim', email: 'sophia.kim@example.com', phone: '+1 202-555-0107', company: { name: 'Orbit Systems', department: 'Engineering' }, location: { city: 'Seoul', country: 'South Korea' }, role: 'Editor', status: 'Active', projects: 9, monthlySpend: 305, joinedAt: '2025-04-11', verified: true },
  { id: 8, name: 'Lucas Martin', email: 'lucas.martin@example.com', phone: '+1 202-555-0108', company: { name: 'Cedar Digital', department: 'Finance' }, location: { city: 'Paris', country: 'France' }, role: 'Viewer', status: 'Suspended', projects: 1, monthlySpend: 25, joinedAt: '2025-04-25', verified: false },
  { id: 9, name: 'Amelia Wilson', email: 'amelia.wilson@example.com', phone: '+1 202-555-0109', company: { name: 'Northstar Labs', department: 'Product' }, location: { city: 'Denver', country: 'USA' }, role: 'Admin', status: 'Pending', projects: 7, monthlySpend: 260, joinedAt: '2025-05-07', verified: true },
  { id: 10, name: 'James Anderson', email: 'james.anderson@example.com', phone: '+1 202-555-0110', company: { name: 'Brightside Co.', department: 'Engineering' }, location: { city: 'Dublin', country: 'Ireland' }, role: 'Editor', status: 'Active', projects: 11, monthlySpend: 390, joinedAt: '2025-05-21', verified: true },
  { id: 11, name: 'Harper Lee', email: 'harper.lee@example.com', phone: '+1 202-555-0111', company: { name: 'Orbit Systems', department: 'Marketing' }, location: { city: 'Singapore', country: 'Singapore' }, role: 'Viewer', status: 'Active', projects: 4, monthlySpend: 95, joinedAt: '2025-06-02', verified: true },
  { id: 12, name: 'Benjamin Clark', email: 'benjamin.clark@example.com', phone: '+1 202-555-0112', company: { name: 'Cedar Digital', department: 'Sales' }, location: { city: 'Melbourne', country: 'Australia' }, role: 'Editor', status: 'Pending', projects: 6, monthlySpend: 210, joinedAt: '2025-06-16', verified: false },
  { id: 13, name: 'Evelyn Lewis', email: 'evelyn.lewis@example.com', phone: '+1 202-555-0113', company: { name: 'Northstar Labs', department: 'Design' }, location: { city: 'Boston', country: 'USA' }, role: 'Admin', status: 'Active', projects: 14, monthlySpend: 480, joinedAt: '2025-07-03', verified: true },
  { id: 14, name: 'Daniel Walker', email: 'daniel.walker@example.com', phone: '+1 202-555-0114', company: { name: 'Orbit Systems', department: 'Support' }, location: { city: 'Amsterdam', country: 'Netherlands' }, role: 'Viewer', status: 'Suspended', projects: 0, monthlySpend: 0, joinedAt: '2025-07-18', verified: false },
  { id: 15, name: 'Abigail Hall', email: 'abigail.hall@example.com', phone: '+1 202-555-0115', company: { name: 'Brightside Co.', department: 'Product' }, location: { city: 'Vancouver', country: 'Canada' }, role: 'Editor', status: 'Active', projects: 10, monthlySpend: 330, joinedAt: '2025-08-01', verified: true },
  { id: 16, name: 'Henry Young', email: 'henry.young@example.com', phone: '+1 202-555-0116', company: { name: 'Cedar Digital', department: 'Engineering' }, location: { city: 'Berlin', country: 'Germany' }, role: 'Viewer', status: 'Pending', projects: 2, monthlySpend: 55, joinedAt: '2025-08-14', verified: false },
  { id: 17, name: 'Ella King', email: 'ella.king@example.com', phone: '+1 202-555-0117', company: { name: 'Northstar Labs', department: 'Marketing' }, location: { city: 'Miami', country: 'USA' }, role: 'Admin', status: 'Active', projects: 18, monthlySpend: 620, joinedAt: '2025-09-05', verified: true },
  { id: 18, name: 'Alexander Wright', email: 'alexander.wright@example.com', phone: '+1 202-555-0118', company: { name: 'Orbit Systems', department: 'Finance' }, location: { city: 'Zurich', country: 'Switzerland' }, role: 'Editor', status: 'Suspended', projects: 3, monthlySpend: 110, joinedAt: '2025-09-19', verified: false },
  { id: 19, name: 'Scarlett Scott', email: 'scarlett.scott@example.com', phone: '+1 202-555-0119', company: { name: 'Brightside Co.', department: 'Design' }, location: { city: 'Copenhagen', country: 'Denmark' }, role: 'Viewer', status: 'Active', projects: 6, monthlySpend: 190, joinedAt: '2025-10-02', verified: true },
  { id: 20, name: 'Michael Green', email: 'michael.green@example.com', phone: '+1 202-555-0120', company: { name: 'Cedar Digital', department: 'Support' }, location: { city: 'Tokyo', country: 'Japan' }, role: 'Editor', status: 'Pending', projects: 4, monthlySpend: 145, joinedAt: '2025-10-20', verified: false },
  { id: 21, name: 'Grace Baker', email: 'grace.baker@example.com', phone: '+1 202-555-0121', company: { name: 'Northstar Labs', department: 'Product' }, location: { city: 'Phoenix', country: 'USA' }, role: 'Admin', status: 'Active', projects: 13, monthlySpend: 445, joinedAt: '2025-11-08', verified: true },
  { id: 22, name: 'Sebastian Adams', email: 'sebastian.adams@example.com', phone: '+1 202-555-0122', company: { name: 'Orbit Systems', department: 'Sales' }, location: { city: 'Lisbon', country: 'Portugal' }, role: 'Viewer', status: 'Pending', projects: 1, monthlySpend: 40, joinedAt: '2025-11-22', verified: false },
  { id: 23, name: 'Chloe Nelson', email: 'chloe.nelson@example.com', phone: '+1 202-555-0123', company: { name: 'Brightside Co.', department: 'Engineering' }, location: { city: 'Stockholm', country: 'Sweden' }, role: 'Editor', status: 'Active', projects: 8, monthlySpend: 285, joinedAt: '2025-12-03', verified: true },
  { id: 24, name: 'Jack Carter', email: 'jack.carter@example.com', phone: '+1 202-555-0124', company: { name: 'Cedar Digital', department: 'Finance' }, location: { city: 'Auckland', country: 'New Zealand' }, role: 'Viewer', status: 'Suspended', projects: 2, monthlySpend: 70, joinedAt: '2025-12-18', verified: false },
]

const statusVariant: Record<DemoUser['status'], 'default' | 'secondary' | 'destructive'> = {
  Active: 'default', Pending: 'secondary', Suspended: 'destructive',
}

export default function Home() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilters, setStatusFilters] = React.useState<string[]>([])
  const [roleFilters, setRoleFilters] = React.useState<string[]>([])
  const [selectedUsers, setSelectedUsers] = React.useState<DemoUser[]>([])
  const [loading, setLoading] = React.useState(false)
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)

  // Parent owns search/filter logic. DataTable only reports interactions and renders supplied rows.
  const filteredUsers = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return demoUsers.filter((user) => {
      const matchesSearch = !query || [
        user.name, user.email, user.phone, user.company.name, user.company.department,
        user.location.city, user.location.country, user.role, user.status,
      ].some((value) => value.toLowerCase().includes(query))
      const matchesStatus = statusFilters.length === 0 || statusFilters.includes(user.status)
      const matchesRole = roleFilters.length === 0 || roleFilters.includes(user.role)
      return matchesSearch && matchesStatus && matchesRole
    })
  }, [searchQuery, statusFilters, roleFilters])

  const columns = React.useMemo<Column<DemoUser>[]>(() => [
    {
      key: 'name', header: 'User', width: '220px', sortable: true,
      accessor: (row) => <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted"><UserRound className="h-4 w-4" /></div><div><div className="font-medium">{row.name}</div><div className="text-xs text-muted-foreground">ID: {row.id}</div></div></div>,
      sortValue: (row) => row.name,
      searchValue: (row) => row.name,
      exportValue: (row) => row.name,
    },
    {
      key: 'email', header: 'Contact', width: '250px', sortable: true,
      accessor: (row) => <button type="button" className="flex items-center gap-2 text-left hover:text-primary" onClick={(event) => { event.stopPropagation(); void navigator.clipboard.writeText(row.email); toast.success('Email copied') }}><Mail className="h-4 w-4 text-muted-foreground" /><span>{row.email}</span><Copy className="h-3 w-3 opacity-50" /></button>,
      sortValue: (row) => row.email,
      searchValue: (row) => row.email,
      exportValue: (row) => row.email,
    },
    {
      key: 'company', header: 'Company', width: '210px', sortable: true,
      accessor: (row) => <div className="flex items-start gap-2"><Building2 className="mt-0.5 h-4 w-4 text-muted-foreground" /><div><div className="font-medium">{row.company.name}</div><div className="text-xs text-muted-foreground">{row.company.department}</div></div></div>,
      sortValue: (row) => row.company.name,
      searchValue: (row) => `${row.company.name} ${row.company.department}`,
      exportValue: (row) => `${row.company.name} — ${row.company.department}`,
    },
    {
      key: 'location', header: 'Location', sortable: true,
      accessor: (row) => <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /><span>{row.location.city}, {row.location.country}</span></div>,
      sortValue: (row) => row.location.city,
      searchValue: (row) => `${row.location.city} ${row.location.country}`,
      exportValue: (row) => `${row.location.city}, ${row.location.country}`,
    },
    {
      key: 'role', header: 'Role', sortable: true,
      accessor: (row) => <Badge variant="outline">{row.role}</Badge>,
      sortValue: (row) => row.role,
      filterValue: (row) => row.role,
      exportValue: (row) => row.role,
      filter: {
        options: [{ label: 'Admin', value: 'Admin' }, { label: 'Editor', value: 'Editor' }, { label: 'Viewer', value: 'Viewer' }],
        onChange: setRoleFilters, // Column-level filter action. Parent filters data above.
      },
    },
    {
      key: 'status', header: 'Status', sortable: true,
      accessor: (row) => <Badge variant={statusVariant[row.status]} className="gap-1">{row.status === 'Active' ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}{row.status}</Badge>,
      sortValue: (row) => row.status,
      filterValue: (row) => row.status,
      exportValue: (row) => row.status,
      filter: {
        options: [{ label: 'Active', value: 'Active' }, { label: 'Pending', value: 'Pending' }, { label: 'Suspended', value: 'Suspended' }],
        onChange: setStatusFilters, // This callback runs when Status filter changes.
      },
    },
    {
      key: 'projects', header: 'Projects', width: '100px', sortable: true,
      accessor: (row) => <span className="tabular-nums">{row.projects}</span>,
      sortValue: (row) => row.projects,
      exportValue: (row) => row.projects,
    },
    {
      key: 'monthlySpend', header: 'Monthly spend', width: '140px', sortable: true,
      accessor: (row) => <span className="font-medium tabular-nums">${row.monthlySpend.toLocaleString()}</span>,
      sortValue: (row) => row.monthlySpend,
      exportValue: (row) => row.monthlySpend,
    },
    {
      key: 'joinedAt', header: 'Joined', sortable: true,
      accessor: (row) => new Date(`${row.joinedAt}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      sortValue: (row) => row.joinedAt,
      exportValue: (row) => row.joinedAt,
    },
    {
      key: 'verified', header: 'Verified', sortable: true,
      accessor: (row) => <Badge variant={row.verified ? 'default' : 'outline'}>{row.verified ? 'Verified' : 'Unverified'}</Badge>,
      sortValue: (row) => row.verified,
      exportValue: (row) => row.verified ? 'Yes' : 'No',
    },
  ], [])

  const refreshDemo = () => {
    setLoading(true) // Skeleton UI appears while loading is true.
    window.setTimeout(() => setLoading(false), 700)
  }

  const handleBulkAction = (action: 'activate' | 'remove') => {
    toast.success(`${action === 'activate' ? 'Activate' : 'Remove'} action requested`, {
      description: `${selectedUsers.length} selected row(s). Connect this handler to your real API action.`,
    })
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-2"><h1 className="text-3xl font-bold tracking-tight">DataTable feature showcase</h1><p className="text-muted-foreground">One generic table. Dummy records cover nested objects, rendered cells, filters, sorting, export and row selection.</p></div>
          <Button variant="outline" onClick={refreshDemo} disabled={loading}><RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Show skeleton</Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card><CardHeader className="pb-2"><CardDescription>Total users</CardDescription><CardTitle className="text-2xl">{demoUsers.length}</CardTitle></CardHeader></Card>
          <Card><CardHeader className="pb-2"><CardDescription>Matching rows</CardDescription><CardTitle className="text-2xl">{filteredUsers.length}</CardTitle></CardHeader></Card>
          <Card><CardHeader className="pb-2"><CardDescription>Selected rows</CardDescription><CardTitle className="text-2xl">{selectedUsers.length}</CardTitle></CardHeader></Card>
          <Card><CardHeader className="pb-2"><CardDescription>Active users</CardDescription><CardTitle className="text-2xl">{demoUsers.filter((user) => user.status === 'Active').length}</CardTitle></CardHeader></Card>
        </div>

        <Card>
          <CardHeader><CardTitle>User directory</CardTitle><CardDescription>Search and filtering are handled by parent component. Sorting is configured per column. Select rows to reveal bulk actions.</CardDescription></CardHeader>
          <CardContent>
            <DataTable
              data={filteredUsers}
              columns={columns}
              loading={loading} // Always uses skeleton rows while loading; no loadingMessage prop needed.
              searchable // Requires onSearch; table emits query but does not filter data itself.
              searchPlaceholder="Search name, email, company, city, role..."
              onSearch={(query) => { setSearchQuery(query); setPage(1) }}
              paginated
              pageSize={pageSize}
              pageSizeOptions={[5, 10, 20, 50]}
              currentPage={page}
              totalCount={filteredUsers.length}
              onPageChange={setPage}
              onPageSizeChange={(size) => { setPageSize(size); setPage(1) }}
              selectable // Enables multi-row selection and header select-all.
              selectedRows={selectedUsers}
              onSelectionChange={setSelectedUsers}
              getRowId={(row) => String(row.id)} // Stable identity required for reliable selection.
              columnVisibility // Lets user hide/show columns.
              exportable // CSV uses each column's exportValue to avoid [object Object].
              exportFileName="demo-users"
              onRowClick={(row) => toast(`Selected ${row.name}`, { description: `${row.company.name} · ${row.status}` })}
              rowClassName={(row) => row.status === 'Suspended' ? 'opacity-70' : ''}
              emptyMessage="No users match current search and filters."
              toolbarActions={selectedUsers.length > 0 ? <><Button size="sm" onClick={() => handleBulkAction('activate')}>Activate selected ({selectedUsers.length})</Button><Button size="sm" variant="destructive" onClick={() => handleBulkAction('remove')}><MoreHorizontal className="mr-1 h-4 w-4" />Bulk action</Button></> : null}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Column configuration guide</CardTitle><CardDescription>Configure behavior where it belongs: on each column.</CardDescription></CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p><code>sortable: true</code> adds sorting control to that column. Table handles local sorting using <code>sortValue</code>; no multi-sort or manual-sorting flags.</p>
            <p><code>filter: &#123; options, onChange &#125;</code> adds filter menu to that column. Callback receives selected values; parent applies filtering and passes updated <code>data</code>.</p>
            <p><code>exportValue</code> maps complex or rendered data to CSV-friendly text. Add it for nested objects, badges, formatted values, and custom cells.</p>
            <p><code>onCellClick</code> handles cell-specific actions. <code>onRowClick</code> handles row actions. Stop event propagation inside interactive cell controls when row click should not fire.</p>
            <p><code>selectable</code> enables multi-row selection. Use <code>selectedRows</code>, <code>onSelectionChange</code>, and stable <code>getRowId</code> to add bulk actions.</p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
