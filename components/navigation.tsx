"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Film, Bell, Search, Plus, Settings, LogOut, User, LayoutDashboard, Calendar, Users, BarChart3, TrendingUp } from "lucide-react"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AddProjectModal } from "@/components/add-project-modal"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export function Navigation() {
  const router = useRouter()
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false)
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false)
  const [isTeamMembersModalOpen, setIsTeamMembersModalOpen] = useState(false)
  const [isTeamScheduleModalOpen, setIsTeamScheduleModalOpen] = useState(false)
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false)
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false)
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)
  
  const handleNavigation = (path: string) => {
    router.push(path)
  }
  
  const handleFilter = (filterValue: string) => {
    const url = `/dashboard?filter=${filterValue}`
    router.push(url)
    // Dispatch custom event to notify dashboard of filter change
    window.dispatchEvent(new CustomEvent('filterChange', { detail: { filter: filterValue } }))
  }
  
  const handleSearch = (query: string) => {
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    
    // Set a new timeout to debounce the search
    const timeout = setTimeout(() => {
      if (query.trim()) {
        const url = `/dashboard?search=${encodeURIComponent(query)}`
        router.push(url)
        // Dispatch custom event to notify dashboard of search change
        window.dispatchEvent(new CustomEvent('searchChange', { detail: { query } }))
      } else {
        router.push('/dashboard')
        window.dispatchEvent(new CustomEvent('searchChange', { detail: { query: '' } }))
      }
    }, 300) // 300ms debounce
    
    setSearchTimeout(timeout)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between max-w-7xl mx-auto px-6">
        <div className="flex items-center">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <Film className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">TFH Film Studio</span>
          </Link>
          
          <NavigationMenu className="hidden lg:flex ml-8">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Projects</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/dashboard"
                        >
                          <LayoutDashboard className="h-6 w-6" />
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Production Pipeline
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Manage your film projects through all 9 stages
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <button 
                          onClick={() => handleFilter("active")} 
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground w-full text-left"
                        >
                          <div className="text-sm font-medium leading-none">Active Projects</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            View all currently active film projects
                          </p>
                        </button>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <button 
                          onClick={() => handleFilter("completed")} 
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground w-full text-left"
                        >
                          <div className="text-sm font-medium leading-none">Completed</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Browse completed and archived projects
                          </p>
                        </button>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <button 
                          onClick={() => setIsTemplatesModalOpen(true)} 
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground w-full text-left"
                        >
                          <div className="text-sm font-medium leading-none">Templates</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Project templates for quick setup
                          </p>
                        </button>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger>Team</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li>
                      <NavigationMenuLink asChild>
                        <button 
                          onClick={() => setIsTeamMembersModalOpen(true)} 
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground w-full text-left"
                        >
                          <div className="text-sm font-medium leading-none">Team Members</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            View and manage team members
                          </p>
                        </button>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <button 
                          onClick={() => setIsTeamScheduleModalOpen(true)} 
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground w-full text-left"
                        >
                          <div className="text-sm font-medium leading-none">Schedule</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Team availability and scheduling
                          </p>
                        </button>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <button 
                    onClick={() => setIsAnalyticsModalOpen(true)} 
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                  >
                    Analytics
                  </button>
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <button 
                    onClick={() => setIsCalendarModalOpen(true)} 
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                  >
                    Calendar
                  </button>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="pl-8 md:w-[300px] lg:w-[400px]"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
          
          <nav className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                3
              </Badge>
            </Button>
            
            <Button 
              size="sm" 
              className="hidden sm:flex items-center gap-2 px-3 py-2"
              onClick={() => setIsNewProjectModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>New Project</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="@johndoe" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">John Doe</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      john.doe@tfhfilm.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/login")}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
      
      <AddProjectModal 
        open={isNewProjectModalOpen}
        onOpenChange={setIsNewProjectModalOpen}
        onCreateProject={(project) => {
          console.log('New project created:', project)
          // Handle project creation here - could emit an event or call a callback
          setIsNewProjectModalOpen(false)
        }}
      />
      
      {/* Templates Modal */}
      <Dialog open={isTemplatesModalOpen} onOpenChange={setIsTemplatesModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Project Templates</DialogTitle>
            <DialogDescription>
              Choose from pre-built project templates to quickly set up your film projects
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
              setIsTemplatesModalOpen(false)
              setIsNewProjectModalOpen(true)
            }}>
              <CardHeader>
                <CardTitle className="text-lg">Commercial Video</CardTitle>
                <CardDescription>Standard commercial video project</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Pre-production planning</li>
                  <li>• Script and storyboard</li>
                  <li>• Location scouting</li>
                  <li>• Post-production workflow</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
              setIsTemplatesModalOpen(false)
              setIsNewProjectModalOpen(true)
            }}>
              <CardHeader>
                <CardTitle className="text-lg">Documentary</CardTitle>
                <CardDescription>Documentary film project template</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Research and interviews</li>
                  <li>• Archival footage collection</li>
                  <li>• Narrative structure</li>
                  <li>• Color grading workflow</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
              setIsTemplatesModalOpen(false)
              setIsNewProjectModalOpen(true)
            }}>
              <CardHeader>
                <CardTitle className="text-lg">Music Video</CardTitle>
                <CardDescription>Music video production template</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Concept development</li>
                  <li>• Performance capture</li>
                  <li>• Creative editing</li>
                  <li>• Audio sync workflow</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
              setIsTemplatesModalOpen(false)
              setIsNewProjectModalOpen(true)
            }}>
              <CardHeader>
                <CardTitle className="text-lg">Corporate Video</CardTitle>
                <CardDescription>Corporate and training video template</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Message clarity focus</li>
                  <li>• Professional presentation</li>
                  <li>• Brand guidelines</li>
                  <li>• Multi-format delivery</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
              setIsTemplatesModalOpen(false)
              setIsNewProjectModalOpen(true)
            }}>
              <CardHeader>
                <CardTitle className="text-lg">Short Film</CardTitle>
                <CardDescription>Independent short film template</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Creative storytelling</li>
                  <li>• Budget management</li>
                  <li>• Festival preparation</li>
                  <li>• Distribution strategy</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
              setIsTemplatesModalOpen(false)
              setIsNewProjectModalOpen(true)
            }}>
              <CardHeader>
                <CardTitle className="text-lg">Animation Project</CardTitle>
                <CardDescription>2D/3D animation project template</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Asset creation pipeline</li>
                  <li>• Animation workflow</li>
                  <li>• Rendering optimization</li>
                  <li>• Final compositing</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Team Members Modal */}
      <Dialog open={isTeamMembersModalOpen} onOpenChange={setIsTeamMembersModalOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Team Members</DialogTitle>
            <DialogDescription>
              Manage your film production team members and their roles
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="active" className="py-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">Active Members</TabsTrigger>
              <TabsTrigger value="roles">Roles & Departments</TabsTrigger>
              <TabsTrigger value="add">Add Member</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Current Project</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">John Doe</TableCell>
                    <TableCell>Project Manager</TableCell>
                    <TableCell>Production</TableCell>
                    <TableCell>john@tfhfilm.com</TableCell>
                    <TableCell><Badge variant="secondary">Available</Badge></TableCell>
                    <TableCell>Mountain Echoes</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Jane Smith</TableCell>
                    <TableCell>Director</TableCell>
                    <TableCell>Creative</TableCell>
                    <TableCell>jane@tfhfilm.com</TableCell>
                    <TableCell><Badge variant="destructive">Busy</Badge></TableCell>
                    <TableCell>City Lights</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Mike Johnson</TableCell>
                    <TableCell>Cinematographer</TableCell>
                    <TableCell>Camera</TableCell>
                    <TableCell>mike@tfhfilm.com</TableCell>
                    <TableCell><Badge variant="secondary">Available</Badge></TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Sarah Williams</TableCell>
                    <TableCell>Editor</TableCell>
                    <TableCell>Post-Production</TableCell>
                    <TableCell>sarah@tfhfilm.com</TableCell>
                    <TableCell><Badge variant="outline">Part-time</Badge></TableCell>
                    <TableCell>Brand Story</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Alex Chen</TableCell>
                    <TableCell>Sound Engineer</TableCell>
                    <TableCell>Audio</TableCell>
                    <TableCell>alex@tfhfilm.com</TableCell>
                    <TableCell><Badge variant="secondary">Available</Badge></TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="roles" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Production</CardTitle>
                    <CardDescription>Core production team</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Project Manager (1)</li>
                      <li>• Producer (2)</li>
                      <li>• Assistant Director (3)</li>
                      <li>• Script Supervisor (1)</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Creative</CardTitle>
                    <CardDescription>Creative department</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Director (2)</li>
                      <li>• Screenwriter (3)</li>
                      <li>• Creative Director (1)</li>
                      <li>• Art Director (2)</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Camera</CardTitle>
                    <CardDescription>Camera & lighting crew</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Cinematographer (2)</li>
                      <li>• Camera Operator (4)</li>
                      <li>• Gaffer (2)</li>
                      <li>• Grip (6)</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Post-Production</CardTitle>
                    <CardDescription>Editing & finishing</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Editor (3)</li>
                      <li>• Colorist (2)</li>
                      <li>• Motion Graphics (2)</li>
                      <li>• VFX Artist (4)</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Audio</CardTitle>
                    <CardDescription>Sound department</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Sound Engineer (2)</li>
                      <li>• Boom Operator (3)</li>
                      <li>• Sound Designer (2)</li>
                      <li>• Composer (1)</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Support</CardTitle>
                    <CardDescription>Support roles</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Client Relations (2)</li>
                      <li>• Coordinator (3)</li>
                      <li>• Intern (5)</li>
                      <li>• Freelancer Pool (12)</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="add" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input placeholder="Enter full name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input type="email" placeholder="Enter email address" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <Input placeholder="e.g., Cinematographer" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department</label>
                  <Input placeholder="e.g., Camera" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input placeholder="Enter phone number" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hourly Rate</label>
                  <Input type="number" placeholder="e.g., 45" />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsTeamMembersModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  alert('Team member would be added to the system')
                  setIsTeamMembersModalOpen(false)
                }}>
                  Add Team Member
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      {/* Team Schedule Modal */}
      <Dialog open={isTeamScheduleModalOpen} onOpenChange={setIsTeamScheduleModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Team Schedule</DialogTitle>
            <DialogDescription>
              View team availability and project scheduling
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="calendar" className="py-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
              <TabsTrigger value="projects">Project Timeline</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calendar" className="space-y-4">
              <div className="bg-muted/20 p-6 rounded-lg text-center">
                <h3 className="text-lg font-semibold mb-2">Team Calendar</h3>
                <p className="text-muted-foreground mb-4">Interactive team scheduling calendar would be displayed here</p>
                <div className="grid grid-cols-7 gap-1 text-xs">
                  <div className="p-2 font-medium">Mon</div>
                  <div className="p-2 font-medium">Tue</div>
                  <div className="p-2 font-medium">Wed</div>
                  <div className="p-2 font-medium">Thu</div>
                  <div className="p-2 font-medium">Fri</div>
                  <div className="p-2 font-medium">Sat</div>
                  <div className="p-2 font-medium">Sun</div>
                  
                  {Array.from({ length: 35 }, (_, i) => (
                    <div key={i} className="p-2 border border-border/50 rounded min-h-[60px] text-xs">
                      {i + 1 <= 31 ? i + 1 : ''}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="availability" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team Member</TableHead>
                    <TableHead>Mon</TableHead>
                    <TableHead>Tue</TableHead>
                    <TableHead>Wed</TableHead>
                    <TableHead>Thu</TableHead>
                    <TableHead>Fri</TableHead>
                    <TableHead>Weekend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">John Doe</TableCell>
                    <TableCell><Badge variant="secondary">Available</Badge></TableCell>
                    <TableCell><Badge variant="secondary">Available</Badge></TableCell>
                    <TableCell><Badge variant="destructive">Busy</Badge></TableCell>
                    <TableCell><Badge variant="secondary">Available</Badge></TableCell>
                    <TableCell><Badge variant="secondary">Available</Badge></TableCell>
                    <TableCell><Badge variant="outline">Part-time</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Jane Smith</TableCell>
                    <TableCell><Badge variant="destructive">Busy</Badge></TableCell>
                    <TableCell><Badge variant="destructive">Busy</Badge></TableCell>
                    <TableCell><Badge variant="destructive">Busy</Badge></TableCell>
                    <TableCell><Badge variant="secondary">Available</Badge></TableCell>
                    <TableCell><Badge variant="secondary">Available</Badge></TableCell>
                    <TableCell><Badge variant="outline">Off</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Mike Johnson</TableCell>
                    <TableCell><Badge variant="secondary">Available</Badge></TableCell>
                    <TableCell><Badge variant="outline">Part-time</Badge></TableCell>
                    <TableCell><Badge variant="secondary">Available</Badge></TableCell>
                    <TableCell><Badge variant="secondary">Available</Badge></TableCell>
                    <TableCell><Badge variant="destructive">Busy</Badge></TableCell>
                    <TableCell><Badge variant="secondary">Available</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Sarah Williams</TableCell>
                    <TableCell><Badge variant="outline">Part-time</Badge></TableCell>
                    <TableCell><Badge variant="outline">Part-time</Badge></TableCell>
                    <TableCell><Badge variant="outline">Off</Badge></TableCell>
                    <TableCell><Badge variant="outline">Part-time</Badge></TableCell>
                    <TableCell><Badge variant="outline">Part-time</Badge></TableCell>
                    <TableCell><Badge variant="outline">Off</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="projects" className="space-y-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Active Project Timelines</CardTitle>
                    <CardDescription>Current project schedules and team assignments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-l-4 border-l-blue-500 pl-4">
                        <h4 className="font-semibold">Mountain Echoes</h4>
                        <p className="text-sm text-muted-foreground">Jan 15 - Mar 30 • Team: John, Mike, Alex</p>
                        <div className="mt-2 h-2 bg-blue-100 rounded">
                          <div className="h-2 bg-blue-500 rounded w-3/4"></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">75% Complete</p>
                      </div>
                      
                      <div className="border-l-4 border-l-green-500 pl-4">
                        <h4 className="font-semibold">City Lights</h4>
                        <p className="text-sm text-muted-foreground">Feb 1 - Jun 15 • Team: Jane, Sarah</p>
                        <div className="mt-2 h-2 bg-green-100 rounded">
                          <div className="h-2 bg-green-500 rounded w-1/3"></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">30% Complete</p>
                      </div>
                      
                      <div className="border-l-4 border-l-orange-500 pl-4">
                        <h4 className="font-semibold">Brand Story</h4>
                        <p className="text-sm text-muted-foreground">Jan 5 - Feb 28 • Team: Sarah, Alex</p>
                        <div className="mt-2 h-2 bg-orange-100 rounded">
                          <div className="h-2 bg-orange-500 rounded w-5/6"></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">85% Complete</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      {/* Analytics Modal */}
      <Dialog open={isAnalyticsModalOpen} onOpenChange={setIsAnalyticsModalOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Analytics Dashboard</DialogTitle>
            <DialogDescription>
              Comprehensive analytics and insights for your film production projects
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="overview" className="py-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                    <Film className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">+2 from last month</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-xs text-muted-foreground">67% of total projects</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24</div>
                    <p className="text-xs text-muted-foreground">5 available today</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$1.2M</div>
                    <p className="text-xs text-muted-foreground">+15% from last quarter</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Project Status Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Status Distribution</CardTitle>
                    <CardDescription>Current status of all projects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Active</span>
                        <span className="text-sm font-medium">8 projects</span>
                      </div>
                      <Progress value={67} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Completed</span>
                        <span className="text-sm font-medium">3 projects</span>
                      </div>
                      <Progress value={25} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">On Hold</span>
                        <span className="text-sm font-medium">1 project</span>
                      </div>
                      <Progress value={8} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Performance</CardTitle>
                    <CardDescription>Projects completed each month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">January</span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-16 bg-blue-200 rounded">
                            <div className="h-2 bg-blue-500 rounded w-3/4"></div>
                          </div>
                          <span className="text-sm font-medium">3</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">February</span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-16 bg-green-200 rounded">
                            <div className="h-2 bg-green-500 rounded w-full"></div>
                          </div>
                          <span className="text-sm font-medium">4</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">March</span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-16 bg-orange-200 rounded">
                            <div className="h-2 bg-orange-500 rounded w-1/2"></div>
                          </div>
                          <span className="text-sm font-medium">2</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="projects" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Types</CardTitle>
                    <CardDescription>Distribution by project category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Commercial</span>
                        <span className="text-sm font-medium">5 projects (42%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Documentary</span>
                        <span className="text-sm font-medium">3 projects (25%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Music Video</span>
                        <span className="text-sm font-medium">2 projects (17%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Corporate</span>
                        <span className="text-sm font-medium">2 projects (16%)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Average Project Duration</CardTitle>
                    <CardDescription>Time to completion by project type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Commercial</span>
                        <span className="text-sm font-medium">45 days</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Documentary</span>
                        <span className="text-sm font-medium">120 days</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Music Video</span>
                        <span className="text-sm font-medium">25 days</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Corporate</span>
                        <span className="text-sm font-medium">30 days</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Project Pipeline</CardTitle>
                  <CardDescription>Projects across all 9 stages</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 lg:grid-cols-9 gap-2">
                    <div className="text-center">
                      <div className="text-lg font-bold">2</div>
                      <div className="text-xs text-muted-foreground">Initiation</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">1</div>
                      <div className="text-xs text-muted-foreground">Pre-Prod</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">1</div>
                      <div className="text-xs text-muted-foreground">Planning</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">2</div>
                      <div className="text-xs text-muted-foreground">Production</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">1</div>
                      <div className="text-xs text-muted-foreground">Post-Prod</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">1</div>
                      <div className="text-xs text-muted-foreground">Review</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">1</div>
                      <div className="text-xs text-muted-foreground">Delivery</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">0</div>
                      <div className="text-xs text-muted-foreground">QA</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">3</div>
                      <div className="text-xs text-muted-foreground">Complete</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="team" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Team Utilization</CardTitle>
                    <CardDescription>Current workload distribution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Production Team</span>
                          <span>85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Creative Team</span>
                          <span>75%</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Post-Production</span>
                          <span>60%</span>
                        </div>
                        <Progress value={60} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Camera Team</span>
                          <span>90%</span>
                        </div>
                        <Progress value={90} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performers</CardTitle>
                    <CardDescription>Most active team members this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">John Doe</span>
                        <Badge variant="secondary">3 projects</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Jane Smith</span>
                        <Badge variant="secondary">3 projects</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Mike Johnson</span>
                        <Badge variant="outline">2 projects</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Sarah Williams</span>
                        <Badge variant="outline">2 projects</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="financial" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue</CardTitle>
                    <CardDescription>Total revenue this year</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$1,234,567</div>
                    <p className="text-sm text-muted-foreground">+15% from last year</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Expenses</CardTitle>
                    <CardDescription>Operating costs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$456,789</div>
                    <p className="text-sm text-muted-foreground">37% of revenue</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Profit Margin</CardTitle>
                    <CardDescription>Net profit percentage</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">63%</div>
                    <p className="text-sm text-muted-foreground">Above industry average</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Project Type</CardTitle>
                  <CardDescription>Income distribution across project categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Commercial Videos</span>
                      <span className="text-sm font-medium">$520,000 (42%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Documentary Films</span>
                      <span className="text-sm font-medium">$370,000 (30%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Music Videos</span>
                      <span className="text-sm font-medium">$210,000 (17%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Corporate Videos</span>
                      <span className="text-sm font-medium">$134,567 (11%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>On-Time Delivery</CardTitle>
                    <CardDescription>Projects delivered on schedule</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">92%</div>
                      <p className="text-sm text-muted-foreground">11 of 12 projects</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Client Satisfaction</CardTitle>
                    <CardDescription>Average client rating</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">4.8/5</div>
                      <p className="text-sm text-muted-foreground">Based on 24 reviews</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Key Performance Indicators</CardTitle>
                  <CardDescription>Performance metrics overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold">98%</div>
                      <div className="text-xs text-muted-foreground">Quality Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">85%</div>
                      <div className="text-xs text-muted-foreground">Budget Efficiency</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">76%</div>
                      <div className="text-xs text-muted-foreground">Resource Utilization</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">12</div>
                      <div className="text-xs text-muted-foreground">Avg Days to Complete</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      {/* Calendar Modal */}
      <Dialog open={isCalendarModalOpen} onOpenChange={setIsCalendarModalOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Production Calendar</DialogTitle>
            <DialogDescription>
              Master calendar for all film production schedules and deadlines
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="month" className="py-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="month">Month View</TabsTrigger>
              <TabsTrigger value="week">Week View</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
            </TabsList>
            
            <TabsContent value="month" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">March 2024</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">← Previous</Button>
                  <Button variant="outline" size="sm">Today</Button>
                  <Button variant="outline" size="sm">Next →</Button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-1 mb-2">
                <div className="p-2 text-center font-medium text-sm">Sun</div>
                <div className="p-2 text-center font-medium text-sm">Mon</div>
                <div className="p-2 text-center font-medium text-sm">Tue</div>
                <div className="p-2 text-center font-medium text-sm">Wed</div>
                <div className="p-2 text-center font-medium text-sm">Thu</div>
                <div className="p-2 text-center font-medium text-sm">Fri</div>
                <div className="p-2 text-center font-medium text-sm">Sat</div>
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }, (_, i) => (
                  <div key={i} className="min-h-[80px] p-1 border border-border/50 rounded">
                    <div className="text-xs font-medium mb-1">
                      {i + 1 <= 31 ? i + 1 : ''}
                    </div>
                    <div className="space-y-1">
                      {i === 4 && <div className="text-xs bg-blue-100 text-blue-800 p-1 rounded">Mountain Echoes</div>}
                      {i === 10 && <div className="text-xs bg-green-100 text-green-800 p-1 rounded">City Lights</div>}
                      {i === 15 && <div className="text-xs bg-orange-100 text-orange-800 p-1 rounded">Brand Story</div>}
                      {i === 20 && <div className="text-xs bg-purple-100 text-purple-800 p-1 rounded">Team Meeting</div>}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="week" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Week of March 18-24, 2024</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">← Previous Week</Button>
                  <Button variant="outline" size="sm">This Week</Button>
                  <Button variant="outline" size="sm">Next Week →</Button>
                </div>
              </div>
              
              <div className="grid grid-cols-8 gap-2">
                <div className="font-medium"></div>
                <div className="text-center font-medium text-sm">Mon 18</div>
                <div className="text-center font-medium text-sm">Tue 19</div>
                <div className="text-center font-medium text-sm">Wed 20</div>
                <div className="text-center font-medium text-sm">Thu 21</div>
                <div className="text-center font-medium text-sm">Fri 22</div>
                <div className="text-center font-medium text-sm">Sat 23</div>
                <div className="text-center font-medium text-sm">Sun 24</div>
                
                <div className="text-sm font-medium">9 AM</div>
                <div className="h-12 border rounded"></div>
                <div className="h-12 border rounded bg-blue-50">
                  <div className="text-xs p-1">Mountain Echoes - Editing</div>
                </div>
                <div className="h-12 border rounded"></div>
                <div className="h-12 border rounded"></div>
                <div className="h-12 border rounded"></div>
                <div className="h-12 border rounded"></div>
                <div className="h-12 border rounded"></div>
                
                <div className="text-sm font-medium">12 PM</div>
                <div className="h-12 border rounded bg-green-50">
                  <div className="text-xs p-1">City Lights - Shoot</div>
                </div>
                <div className="h-12 border rounded bg-green-50">
                  <div className="text-xs p-1">City Lights - Shoot</div>
                </div>
                <div className="h-12 border rounded bg-green-50">
                  <div className="text-xs p-1">City Lights - Shoot</div>
                </div>
                <div className="h-12 border rounded"></div>
                <div className="h-12 border rounded"></div>
                <div className="h-12 border rounded"></div>
                <div className="h-12 border rounded"></div>
                
                <div className="text-sm font-medium">3 PM</div>
                <div className="h-12 border rounded"></div>
                <div className="h-12 border rounded"></div>
                <div className="h-12 border rounded bg-purple-50">
                  <div className="text-xs p-1">Team Meeting</div>
                </div>
                <div className="h-12 border rounded"></div>
                <div className="h-12 border rounded bg-orange-50">
                  <div className="text-xs p-1">Brand Story - Review</div>
                </div>
                <div className="h-12 border rounded"></div>
                <div className="h-12 border rounded"></div>
              </div>
            </TabsContent>
            
            <TabsContent value="timeline" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Project Timeline</CardTitle>
                  <CardDescription>Visual timeline of all active projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="relative">
                      <div className="flex items-center mb-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                        <span className="font-medium">Mountain Echoes</span>
                        <span className="text-sm text-muted-foreground ml-2">Jan 15 - Mar 30</span>
                      </div>
                      <div className="ml-6 pl-3 border-l-2 border-blue-200">
                        <div className="h-3 bg-blue-500 rounded w-3/4 mb-1"></div>
                        <div className="text-xs text-muted-foreground">75% Complete - Post-Production</div>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="flex items-center mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <span className="font-medium">City Lights</span>
                        <span className="text-sm text-muted-foreground ml-2">Feb 1 - Jun 15</span>
                      </div>
                      <div className="ml-6 pl-3 border-l-2 border-green-200">
                        <div className="h-3 bg-green-500 rounded w-1/3 mb-1"></div>
                        <div className="text-xs text-muted-foreground">30% Complete - Pre-Production</div>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="flex items-center mb-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                        <span className="font-medium">Brand Story</span>
                        <span className="text-sm text-muted-foreground ml-2">Jan 5 - Feb 28</span>
                      </div>
                      <div className="ml-6 pl-3 border-l-2 border-orange-200">
                        <div className="h-3 bg-orange-500 rounded w-5/6 mb-1"></div>
                        <div className="text-xs text-muted-foreground">85% Complete - Client Review</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="deadlines" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">Urgent Deadlines</CardTitle>
                    <CardDescription>Due within 7 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50">
                        <div>
                          <div className="font-medium">Brand Story - Final Cut</div>
                          <div className="text-sm text-muted-foreground">Due: Feb 28</div>
                        </div>
                        <Badge variant="destructive">2 days</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border border-orange-200 rounded-lg bg-orange-50">
                        <div>
                          <div className="font-medium">City Lights - Script Review</div>
                          <div className="text-sm text-muted-foreground">Due: Mar 5</div>
                        </div>
                        <Badge variant="outline">5 days</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-600">Upcoming Deadlines</CardTitle>
                    <CardDescription>Due within 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Mountain Echoes - Delivery</div>
                          <div className="text-sm text-muted-foreground">Due: Mar 30</div>
                        </div>
                        <Badge variant="secondary">28 days</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">New Commercial - Kickoff</div>
                          <div className="text-sm text-muted-foreground">Due: Mar 15</div>
                        </div>
                        <Badge variant="secondary">13 days</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </header>
  );
}