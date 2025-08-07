"use client"

import { useState, useMemo, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Calendar, Filter, Download, Grid, List, MoreVertical, Plus, Clock, TrendingUp, Users, Film, Search, ArrowUpDown, ExternalLink } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AddProjectModal } from "@/components/add-project-modal"
import { EditProjectModal } from "@/components/edit-project-modal"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Project, KanbanColumn, ProjectStatus, TaskPriority } from "@/types/kanban"

const initialKanbanColumns: KanbanColumn[] = [
  { id: "1", title: "1. Project Initiation", count: 0 },
  { id: "2", title: "2. Pre-Production", count: 0 },
  { id: "3", title: "3. Production Planning", count: 0 },
  { id: "4", title: "4. Production", count: 0 },
  { id: "5", title: "5. Post-Production", count: 0 },
  { id: "6", title: "6. Client Review", count: 0 },
  { id: "7", title: "7. Final Delivery", count: 0 },
  { id: "8", title: "8. Quality Assurance", count: 0 },
  { id: "9", title: "9. Project Complete", count: 0 }
]

const initialProjects: Project[] = [
  {
    id: "1",
    title: "Mountain Echoes",
    client: "Discovery Channel",
    contact: "john@discovery.com",
    projectManager: "jane-smith",
    brief: "Documentary about mountain ecosystems",
    type: "documentary",
    genre: "documentary",
    duration: "90 minutes",
    description: "An in-depth exploration of mountain ecosystems",
    technicalRequirements: "4K, HDR",
    budget: "250000",
    currency: "USD",
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-03-30"),
    deliverables: ["Final Cut", "Raw Footage"],
    productionRequirements: "Mountain filming equipment",
    paymentNotes: "50% upfront, 50% on delivery",
    additionalNotes: "Weather dependent shooting",
    tags: ["nature", "documentary"],
    priority: "high" as TaskPriority,
    progress: 75,
    stage: "5",
    status: "active" as ProjectStatus,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20")
  },
  {
    id: "2",
    title: "City Lights",
    client: "Netflix",
    contact: "sarah@netflix.com",
    projectManager: "john-doe",
    brief: "Urban drama series",
    type: "series",
    genre: "drama",
    duration: "6 episodes",
    description: "A gripping urban drama series",
    technicalRequirements: "4K, Dolby Atmos",
    budget: "500000",
    currency: "USD",
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-06-15"),
    deliverables: ["Final Cut", "Web Version"],
    productionRequirements: "Urban locations",
    paymentNotes: "Monthly payments",
    additionalNotes: "Night shooting required",
    tags: ["drama", "urban"],
    priority: "medium" as TaskPriority,
    progress: 30,
    stage: "2",
    status: "active" as ProjectStatus,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18")
  },
  {
    id: "3",
    title: "Brand Story",
    client: "Apple",
    contact: "marketing@apple.com",
    projectManager: "mike-johnson",
    brief: "Corporate brand story",
    type: "commercial",
    genre: "promotional",
    duration: "60 seconds",
    description: "Apple's brand story commercial",
    technicalRequirements: "8K, Premium post",
    budget: "1000000",
    currency: "USD",
    startDate: new Date("2024-01-05"),
    endDate: new Date("2024-02-28"),
    deliverables: ["Final Cut", "Social Media Cuts"],
    productionRequirements: "Studio and outdoor shoots",
    paymentNotes: "Net 30",
    additionalNotes: "High production value required",
    tags: ["commercial", "brand"],
    priority: "high" as TaskPriority,
    progress: 90,
    stage: "7",
    status: "active" as ProjectStatus,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-22")
  }
]

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [viewMode, setViewMode] = useState("kanban")
  const [filterValue, setFilterValue] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [addCardModalOpen, setAddCardModalOpen] = useState(false)
  const [selectedStage, setSelectedStage] = useState<string | undefined>(undefined)

  // Sync URL parameters with local state on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const urlSearch = urlParams.get('search')
      const urlFilter = urlParams.get('filter')
      
      if (urlSearch) {
        setSearchQuery(urlSearch)
      }
      
      if (urlFilter && ['all', 'active', 'completed', 'on-hold', 'archived'].includes(urlFilter)) {
        setFilterValue(urlFilter)
      }
    }
  }, [])
  const [sortField, setSortField] = useState<keyof Project>('updatedAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // Filter and search projects
  const filteredProjects = useMemo(() => {
    let filtered = projects

    // Apply status filter
    if (filterValue !== "all") {
      filtered = filtered.filter(project => project.status === filterValue)
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(query) ||
        project.client.toLowerCase().includes(query) ||
        project.type.toLowerCase().includes(query) ||
        project.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [projects, filterValue, searchQuery])

  // Sorted projects for list view
  const sortedProjects = useMemo(() => {
    return [...filteredProjects].sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]

      // Handle different data types
      if (sortField === 'createdAt' || sortField === 'updatedAt') {
        aValue = new Date(aValue as Date).getTime()
        bValue = new Date(bValue as Date).getTime()
      } else if (sortField === 'progress') {
        aValue = Number(aValue) || 0
        bValue = Number(bValue) || 0
      } else if (sortField === 'budget') {
        aValue = Number(aValue as string) || 0
        bValue = Number(bValue as string) || 0
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      } else {
        // Fallback for other types
        aValue = String(aValue || '').toLowerCase()
        bValue = String(bValue || '').toLowerCase()
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredProjects, sortField, sortDirection])

  // Calculate column counts dynamically
  const kanbanColumns = useMemo(() => {
    return initialKanbanColumns.map(column => ({
      ...column,
      count: filteredProjects.filter(project => project.stage === column.id).length
    }))
  }, [filteredProjects])

  // Statistics
  const stats = useMemo(() => {
    const total = projects.length
    const active = projects.filter(p => p.status === 'active').length
    const onHold = projects.filter(p => p.status === 'on-hold').length
    const completed = projects.filter(p => p.status === 'completed').length
    
    return { total, active, onHold, completed }
  }, [projects])

  const handleCreateProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setProjects(prev => [...prev, newProject])
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setIsEditModalOpen(true)
  }

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => 
      p.id === updatedProject.id 
        ? { ...updatedProject, updatedAt: new Date() }
        : p
    ))
    setEditingProject(null)
    setIsEditModalOpen(false)
  }
  
  const handleArchiveProject = (projectId: string) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId 
        ? { ...p, status: 'archived' as ProjectStatus, updatedAt: new Date() }
        : p
    ))
  }
  
  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId))
  }

  const handleMoveProject = (projectId: string, newStage: string) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId 
        ? { ...p, stage: newStage, updatedAt: new Date() }
        : p
    ))
  }

  const handleAddCard = (stageId: string) => {
    setSelectedStage(stageId)
    setAddCardModalOpen(true)
  }

  const handleCreateProjectInStage = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    handleCreateProject(projectData)
    setAddCardModalOpen(false)
    setSelectedStage(undefined)
  }

  const handleSort = (field: keyof Project) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="container mx-auto py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">TFH Film Projects</h1>
            <p className="text-muted-foreground">
              Professional Film Production Management • {stats.total} Total Projects
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-[250px]"
              />
            </div>
            
            <Select value={filterValue} onValueChange={setFilterValue}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex rounded-lg border p-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === "kanban" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("kanban")}
                    className="px-2"
                  >
                    <Grid className="h-4 w-4" />
                    <span className="sr-only">Kanban View</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Kanban View</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="px-2"
                  >
                    <List className="h-4 w-4" />
                    <span className="sr-only">List View</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>List View</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === "calendar" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("calendar")}
                    className="px-2"
                  >
                    <Calendar className="h-4 w-4" />
                    <span className="sr-only">Calendar View</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Calendar View</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-9">
            <Tabs value={viewMode} className="space-y-4">
              <TabsContent value="kanban" className="space-y-4">
                <div className="overflow-x-auto">
                  <div className="flex gap-4 pb-4 min-w-fit">
                    {kanbanColumns.map((column) => (
                      <Card key={column.id} className="w-[320px] flex-shrink-0">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium">
                              {column.title}
                            </CardTitle>
                            <Badge variant="secondary">{column.count}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {filteredProjects
                            .filter((project) => project.stage === column.id)
                            .map((project) => (
                              <Card key={project.id} className="cursor-pointer hover:shadow-md transition-shadow">
                                <CardHeader className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="space-y-1 flex-1 min-w-0">
                                      <CardTitle className="text-sm font-medium line-clamp-1">
                                        {project.title}
                                      </CardTitle>
                                      <CardDescription className="text-xs">
                                        {project.client}
                                      </CardDescription>
                                    </div>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                                          <MoreVertical className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleEditProject(project)}>
                                          Edit Project
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleArchiveProject(project.id)}>
                                          Archive Project
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                          onClick={() => {
                                            if (confirm(`Are you sure you want to delete "${project.title}"? This action cannot be undone.`)) {
                                              handleDeleteProject(project.id)
                                            }
                                          }}
                                          className="text-destructive focus:text-destructive"
                                        >
                                          Delete Project
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                  <div className="flex items-center justify-between mb-2">
                                    <Badge
                                      variant={
                                        project.priority === "high"
                                          ? "destructive"
                                          : project.priority === "medium"
                                          ? "default"
                                          : "secondary"
                                      }
                                      className="text-xs"
                                    >
                                      {project.priority}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      {project.type}
                                    </Badge>
                                  </div>
                                  <Progress value={project.progress} className="h-2" />
                                  <div className="flex items-center justify-between mt-2">
                                    <p className="text-xs text-muted-foreground">
                                      {project.progress}% complete
                                    </p>
                                    <div className="flex gap-1">
                                      {project.tags.slice(0, 2).map(tag => (
                                        <Badge key={tag} variant="outline" className="text-xs px-1">
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start" 
                            size="sm"
                            onClick={() => handleAddCard(column.id)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add card
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="list">
                <Card>
                  <CardContent className="p-0">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[200px]">
                              <Button variant="ghost" onClick={() => handleSort('title')} className="h-auto p-0 font-semibold">
                                Project Title
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                              </Button>
                            </TableHead>
                            <TableHead>
                              <Button variant="ghost" onClick={() => handleSort('client')} className="h-auto p-0 font-semibold">
                                Client
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                              </Button>
                            </TableHead>
                            <TableHead>
                              <Button variant="ghost" onClick={() => handleSort('type')} className="h-auto p-0 font-semibold">
                                Type
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                              </Button>
                            </TableHead>
                            <TableHead>
                              <Button variant="ghost" onClick={() => handleSort('stage')} className="h-auto p-0 font-semibold">
                                Stage
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                              </Button>
                            </TableHead>
                            <TableHead>
                              <Button variant="ghost" onClick={() => handleSort('progress')} className="h-auto p-0 font-semibold">
                                Progress
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                              </Button>
                            </TableHead>
                            <TableHead>
                              <Button variant="ghost" onClick={() => handleSort('priority')} className="h-auto p-0 font-semibold">
                                Priority
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                              </Button>
                            </TableHead>
                            <TableHead>
                              <Button variant="ghost" onClick={() => handleSort('status')} className="h-auto p-0 font-semibold">
                                Status
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                              </Button>
                            </TableHead>
                            <TableHead>
                              <Button variant="ghost" onClick={() => handleSort('updatedAt')} className="h-auto p-0 font-semibold">
                                Last Updated
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                              </Button>
                            </TableHead>
                            <TableHead className="w-[50px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sortedProjects.length > 0 ? (
                            sortedProjects.map((project) => (
                              <TableRow key={project.id} className="hover:bg-muted/50">
                                <TableCell className="font-medium">
                                  <div className="space-y-1">
                                    <div>{project.title}</div>
                                    <div className="flex gap-1">
                                      {project.tags.slice(0, 2).map(tag => (
                                        <Badge key={tag} variant="outline" className="text-xs px-1">
                                          {tag}
                                        </Badge>
                                      ))}
                                      {project.tags.length > 2 && (
                                        <Badge variant="outline" className="text-xs px-1">
                                          +{project.tags.length - 2}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-1">
                                    <div>{project.client}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {project.projectManager}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="text-xs">
                                    {project.type}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-1">
                                    <div className="text-sm">
                                      Stage {project.stage}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {initialKanbanColumns.find(c => c.id === project.stage)?.title.replace(/^\d+\.\s*/, '')}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-2 min-w-[100px]">
                                    <Progress value={project.progress} className="h-2" />
                                    <span className="text-xs text-muted-foreground">
                                      {project.progress}%
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      project.priority === "high"
                                        ? "destructive"
                                        : project.priority === "medium"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className="text-xs"
                                  >
                                    {project.priority}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      project.status === "active"
                                        ? "default"
                                        : project.status === "completed"
                                        ? "secondary"
                                        : "outline"
                                    }
                                    className="text-xs"
                                  >
                                    {project.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">
                                  {formatDate(project.updatedAt)}
                                </TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => handleEditProject(project)}>
                                        Edit Project
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleArchiveProject(project.id)}>
                                        Archive Project
                                      </DropdownMenuItem>
                                      <DropdownMenuItem 
                                        onClick={() => {
                                          if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
                                            handleDeleteProject(project.id)
                                          }
                                        }}
                                        className="text-destructive"
                                      >
                                        Delete Project
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                                No projects found. Try adjusting your filters or create a new project.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="calendar">
                <div className="space-y-4">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Project Timeline</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span>Start Date</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span>End Date</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded"></div>
                        <span>Both Dates</span>
                      </div>
                    </div>
                  </div>

                  {/* Projects with Dates */}
                  <div className="grid gap-4">
                    {filteredProjects
                      .filter(project => project.startDate || project.endDate)
                      .length > 0 ? (
                      <div className="grid gap-6">
                        {/* Gantt-style Timeline */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">Project Timeline Overview</CardTitle>
                            <CardDescription>
                              Projects with scheduled start and end dates
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {filteredProjects
                                .filter(project => project.startDate || project.endDate)
                                .sort((a, b) => {
                                  const aDate = a.startDate || a.createdAt
                                  const bDate = b.startDate || b.createdAt
                                  return new Date(aDate).getTime() - new Date(bDate).getTime()
                                })
                                .map((project) => {
                                  const hasStartDate = !!project.startDate
                                  const hasEndDate = !!project.endDate
                                  const startDate = project.startDate ? new Date(project.startDate) : null
                                  const endDate = project.endDate ? new Date(project.endDate) : null
                                  
                                  return (
                                    <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                      <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-medium">{project.title}</h4>
                                            <Badge variant="outline" className="text-xs">
                                              {project.client}
                                            </Badge>
                                            <Badge
                                              variant={
                                                project.priority === "high" ? "destructive" :
                                                project.priority === "medium" ? "default" : "secondary"
                                              }
                                              className="text-xs"
                                            >
                                              {project.priority}
                                            </Badge>
                                          </div>
                                          <div className="text-sm text-muted-foreground mb-2">
                                            Stage {project.stage}: {initialKanbanColumns.find(c => c.id === project.stage)?.title.replace(/^\d+\.\s*/, '')}
                                          </div>
                                          <Progress value={project.progress} className="h-2 w-48" />
                                          <span className="text-xs text-muted-foreground mt-1">
                                            {project.progress}% complete
                                          </span>
                                        </div>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                              <MoreVertical className="h-4 w-4" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleEditProject(project)}>
                                              Edit Project
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleArchiveProject(project.id)}>
                                              Archive Project
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                              onClick={() => {
                                                if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
                                                  handleDeleteProject(project.id)
                                                }
                                              }}
                                              className="text-destructive"
                                            >
                                              Delete Project
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>
                                      
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Timeline Info */}
                                        <div className="space-y-2">
                                          <div className="text-sm font-medium">Timeline</div>
                                          <div className="space-y-1">
                                            {hasStartDate && (
                                              <div className="flex items-center gap-2 text-sm">
                                                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                                                <span>Start: {formatDate(startDate!)}</span>
                                              </div>
                                            )}
                                            {hasEndDate && (
                                              <div className="flex items-center gap-2 text-sm">
                                                <div className="w-3 h-3 bg-green-500 rounded"></div>
                                                <span>End: {formatDate(endDate!)}</span>
                                              </div>
                                            )}
                                            {hasStartDate && hasEndDate && (
                                              <div className="text-xs text-muted-foreground">
                                                Duration: {Math.ceil((endDate!.getTime() - startDate!.getTime()) / (1000 * 60 * 60 * 24))} days
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        {/* Project Details */}
                                        <div className="space-y-2">
                                          <div className="text-sm font-medium">Details</div>
                                          <div className="space-y-1">
                                            <div className="text-sm">Type: {project.type}</div>
                                            <div className="text-sm">Budget: {project.currency} {Number(project.budget).toLocaleString() || '0'}</div>
                                            <div className="text-sm">Updated: {formatDate(project.updatedAt)}</div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Tags */}
                                      {project.tags.length > 0 && (
                                        <div className="flex gap-1 mt-3">
                                          {project.tags.map(tag => (
                                            <Badge key={tag} variant="outline" className="text-xs px-1">
                                              {tag}
                                            </Badge>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Monthly Calendar View */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Upcoming Deadlines */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">Upcoming Deadlines</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {filteredProjects
                                  .filter(project => project.endDate && new Date(project.endDate) >= new Date())
                                  .sort((a, b) => new Date(a.endDate!).getTime() - new Date(b.endDate!).getTime())
                                  .slice(0, 5)
                                  .map((project) => {
                                    const daysUntilDeadline = Math.ceil(
                                      (new Date(project.endDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                                    )
                                    return (
                                      <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div>
                                          <div className="font-medium text-sm">{project.title}</div>
                                          <div className="text-xs text-muted-foreground">{project.client}</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="text-sm font-medium">
                                            {formatDate(new Date(project.endDate!))}
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            {daysUntilDeadline === 0 ? 'Due today' : 
                                             daysUntilDeadline === 1 ? 'Due tomorrow' :
                                             `${daysUntilDeadline} days left`}
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  })}
                                {filteredProjects.filter(p => p.endDate && new Date(p.endDate) >= new Date()).length === 0 && (
                                  <div className="text-center py-4 text-muted-foreground">
                                    No upcoming deadlines
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>

                          {/* Recent Starts */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">Recently Started</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {filteredProjects
                                  .filter(project => project.startDate && new Date(project.startDate) <= new Date())
                                  .sort((a, b) => new Date(b.startDate!).getTime() - new Date(a.startDate!).getTime())
                                  .slice(0, 5)
                                  .map((project) => {
                                    const daysStarted = Math.floor(
                                      (new Date().getTime() - new Date(project.startDate!).getTime()) / (1000 * 60 * 60 * 24)
                                    )
                                    return (
                                      <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div>
                                          <div className="font-medium text-sm">{project.title}</div>
                                          <div className="text-xs text-muted-foreground">{project.client}</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="text-sm font-medium">
                                            {formatDate(new Date(project.startDate!))}
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            {daysStarted === 0 ? 'Started today' : 
                                             daysStarted === 1 ? 'Started yesterday' :
                                             `Started ${daysStarted} days ago`}
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  })}
                                {filteredProjects.filter(p => p.startDate && new Date(p.startDate) <= new Date()).length === 0 && (
                                  <div className="text-center py-4 text-muted-foreground">
                                    No recently started projects
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="py-12">
                          <div className="text-center space-y-4">
                            <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
                            <div>
                              <h3 className="font-semibold mb-2">No Timeline Data</h3>
                              <p className="text-muted-foreground">
                                Add start and end dates to your projects to see them in calendar view.
                              </p>
                              <Button className="mt-4" onClick={() => setViewMode("kanban")}>
                                View Projects
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="xl:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Project Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Film className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Total Projects</span>
                  </div>
                  <span className="text-2xl font-bold">{stats.total}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">Active</span>
                  </div>
                  <span className="text-lg font-semibold text-green-500">{stats.active}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-muted-foreground">On Hold</span>
                  </div>
                  <span className="text-lg font-semibold text-yellow-500">{stats.onHold}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-muted-foreground">Completed</span>
                  </div>
                  <span className="text-lg font-semibold text-blue-500">{stats.completed}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>U{i}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm">
                            <span className="font-medium">User {i}</span>
                            {" "}updated project status
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {i} hours ago
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      className="w-full justify-start items-center" 
                      variant="outline" 
                      size="sm"
                      onClick={() => alert("Export functionality coming soon")}
                    >
                      <Download className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>Export Report</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Export project data as PDF or CSV</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      className="w-full justify-start items-center" 
                      variant="outline" 
                      size="sm"
                      onClick={() => alert("Meeting scheduling coming soon")}
                    >
                      <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>Schedule Meeting</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Schedule a team meeting</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      className="w-full justify-start items-center" 
                      variant="outline" 
                      size="sm"
                      onClick={() => alert("Team invitation coming soon")}
                    >
                      <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>Invite Team Member</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add new members to your team</p>
                  </TooltipContent>
                </Tooltip>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <EditProjectModal
        project={editingProject}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onUpdateProject={handleUpdateProject}
      />
      
      <AddProjectModal
        onCreateProject={handleCreateProjectInStage}
        initialStage={selectedStage}
        open={addCardModalOpen}
        onOpenChange={setAddCardModalOpen}
      />
    </div>
    </TooltipProvider>
  )
}