"use client"

import * as React from "react"
import { DataTable, type Column } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Phone, Globe, Building2, MapPin, CheckCircle2, XCircle, RefreshCw } from "lucide-react"
import { apiService, type User, type Post, type Todo } from "@/lib/api"
import { toast } from "sonner"

export default function Home() {
  const [users, setUsers] = React.useState<User[]>([])
  const [posts, setPosts] = React.useState<Post[]>([])
  const [todos, setTodos] = React.useState<Todo[]>([])
  const [loading, setLoading] = React.useState(false)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const [searchQuery, setSearchQuery] = React.useState("")

  React.useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      const [usersData, postsData, todosData] = await Promise.all([
        apiService.getUsers(),
        apiService.getPosts(),
        apiService.getTodos(),
      ])
      setUsers(usersData)
      setPosts(postsData)
      setTodos(todosData)
      toast("Data loaded successfully", {
        description: `Loaded ${usersData.length} users, ${postsData.length} posts, and ${todosData.length} todos`
      })
    } catch (error) {
      console.error("[v0] Error fetching data:", error)
      toast.error("Error loading data", {
        description: "Failed to fetch data from API. Please try again.",
      })

    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = React.useMemo(() => {
    if (!searchQuery) return users
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.address.city.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [users, searchQuery])

  const filteredPosts = React.useMemo(() => {
    if (!searchQuery) return posts
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.body.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [posts, searchQuery])

  const filteredTodos = React.useMemo(() => {
    if (!searchQuery) return todos
    return todos.filter((todo) => todo.title.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [todos, searchQuery])

  // ====================================================
  // Column Definitions
  // ====================================================
  const userColumns: Column<User>[] = [
    {
      key: "name",
      header: "Name",
      accessor: (row) => (
        <div className="font-medium">
          <div>{row.name}</div>
          <div className="text-xs text-muted-foreground">@{row.username}</div>
        </div>
      ),
      sortable: true,
      width: "200px",
    },
    {
      key: "email",
      header: "Email",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{row.email}</span>
        </div>
      ),
      sortable: true,
      onCellClick: (row) => {
        navigator.clipboard.writeText(row.email)
        toast("Email copied", {
          description: `${row.email} copied to clipboard`,
        })
      },
    },
    {
      key: "phone",
      header: "Phone",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{row.phone}</span>
        </div>
      ),
      width: "180px",
    },
    {
      key: "company",
      header: "Company",
      accessor: (row) => (
        <div>
          <div className="flex items-center gap-2 font-medium">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{row.company.name}</span>
          </div>
          <div className="text-xs text-muted-foreground italic">{row.company.catchPhrase}</div>
        </div>
      ),
      sortable: true,
      width: "250px",
    },
    {
      key: "city",
      header: "Location",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{row.address.city}</span>
        </div>
      ),
      sortable: true,
      width: "150px",
    },
    {
      key: "website",
      header: "Website",
      accessor: (row) => (
        <a
          href={`https://${row.website}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-primary hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          <Globe className="h-4 w-4" />
          <span className="text-sm">{row.website}</span>
        </a>
      ),
      width: "180px",
    },
  ]

  const postColumns: Column<Post>[] = [
    {
      key: "id",
      header: "ID",
      accessor: (row) => <Badge variant="outline">{row.id}</Badge>,
      sortable: true,
      width: "80px",
    },
    {
      key: "title",
      header: "Title",
      accessor: (row) => <div className="font-medium line-clamp-2">{row.title}</div>,
      sortable: true,
      width: "300px",
    },
    {
      key: "body",
      header: "Content",
      accessor: (row) => <div className="text-sm text-muted-foreground line-clamp-2">{row.body}</div>,
      width: "400px",
    },
    {
      key: "userId",
      header: "Author",
      accessor: (row) => {
        const user = users.find((u) => u.id === row.userId)
        return (
          <div className="text-sm">
            {user ? (
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground">{user.email}</div>
              </div>
            ) : (
              `User ${row.userId}`
            )}
          </div>
        )
      },
      sortable: true,
      width: "200px",
    },
  ]

  const todoColumns: Column<Todo>[] = [
    {
      key: "id",
      header: "ID",
      accessor: (row) => <Badge variant="outline">{row.id}</Badge>,
      sortable: true,
      width: "80px",
    },
    {
      key: "title",
      header: "Task",
      accessor: (row) => <div className="font-medium">{row.title}</div>,
      sortable: true,
      width: "400px",
    },
    {
      key: "completed",
      header: "Status",
      accessor: (row) => (
        <Badge variant={row.completed ? "default" : "secondary"} className="gap-1">
          {row.completed ? (
            <>
              <CheckCircle2 className="h-3 w-3" />
              Completed
            </>
          ) : (
            <>
              <XCircle className="h-3 w-3" />
              Pending
            </>
          )}
        </Badge>
      ),
      sortable: true,
      width: "150px",
    },
    {
      key: "userId",
      header: "Assigned To",
      accessor: (row) => {
        const user = users.find((u) => u.id === row.userId)
        return (
          <div className="text-sm">
            {user ? (
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground">@{user.username}</div>
              </div>
            ) : (
              `User ${row.userId}`
            )}
          </div>
        )
      },
      sortable: true,
      width: "200px",
    },
  ]

  // ====================================================
  // Event Handlers
  // ====================================================
  const handleRowClick = (row: User | Post | Todo) => {
    console.log("[v0] Row clicked:", row)
    alert(JSON.stringify(row, null, 2))
    toast.success("Row clicked", {
      description: `You clicked on ${("name" in row && row.name) || ("title" in row && row.title) || `ID: ${row.id}`}`,
    })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Professional Data Table</h1>
          <p className="text-lg text-muted-foreground">
            Real-world data from JSONPlaceholder API with advanced table features
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={fetchAllData} disabled={loading} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
          <div className="text-sm text-muted-foreground">
            {users.length} users • {posts.length} posts • {todos.length} todos
          </div>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
            <TabsTrigger value="posts">Posts ({posts.length})</TabsTrigger>
            <TabsTrigger value="todos">Todos ({todos.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Directory</CardTitle>
                <CardDescription>Browse and manage user information from the API</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={filteredUsers}
                  columns={userColumns}
                  loading={loading}
                  searchable
                  searchPlaceholder="Search users by name, email, company, or city..."
                  onSearch={handleSearch}
                  paginated
                  pageSize={pageSize}
                  currentPage={currentPage}
                  totalCount={filteredUsers.length}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  onRowClick={handleRowClick}
                  emptyMessage="No users found"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="posts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Blog Posts</CardTitle>
                <CardDescription>View all blog posts with author information</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={filteredPosts}
                  columns={postColumns}
                  loading={loading}
                  searchable
                  searchPlaceholder="Search posts by title or content..."
                  onSearch={handleSearch}
                  paginated
                  pageSize={pageSize}
                  currentPage={currentPage}
                  totalCount={filteredPosts.length}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  onRowClick={handleRowClick}
                  emptyMessage="No posts found"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="todos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Task Management</CardTitle>
                <CardDescription>Track todos and their completion status</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={filteredTodos}
                  columns={todoColumns}
                  loading={loading}
                  searchable
                  searchPlaceholder="Search todos by title..."
                  onSearch={handleSearch}
                  paginated
                  pageSize={pageSize}
                  currentPage={currentPage}
                  totalCount={filteredTodos.length}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  onRowClick={handleRowClick}
                  rowClassName={(row) => (row.completed ? "opacity-60" : "")}
                  emptyMessage="No todos found"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Features Showcase</CardTitle>
            <CardDescription>All features demonstrated with real API data</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-3 text-sm md:grid-cols-2">
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>
                  <strong>Real API Integration:</strong> Data fetched from JSONPlaceholder using Axios
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>
                  <strong>Multiple Data Sources:</strong> Users, Posts, and Todos in separate tabs
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>
                  <strong>Column Sorting:</strong> Click headers to sort data ascending/descending
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>
                  <strong>Interactive Cells:</strong> Click email to copy, click website to visit
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>
                  <strong>Real-time Search:</strong> Filter across all columns instantly
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>
                  <strong>Pagination:</strong> Navigate large datasets efficiently
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>
                  <strong>Loading States:</strong> Elegant loading indicators during data fetch
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>
                  <strong>Error Handling:</strong> Toast notifications for success and errors
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>
                  <strong>Responsive Design:</strong> Works beautifully on all screen sizes
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>
                  <strong>TypeScript:</strong> Fully typed with generics for type safety
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
