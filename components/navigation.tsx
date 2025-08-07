"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Film, Bell, Search, Plus, Settings, LogOut, User, LayoutDashboard, Calendar, Users, BarChart3 } from "lucide-react"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AddProjectModal } from "@/components/add-project-modal"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function Navigation() {
  const router = useRouter()
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false)
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false)
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
                          onClick={() => alert('Team Members feature coming soon!')} 
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
                          onClick={() => alert('Team Schedule feature coming soon!')} 
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
                    onClick={() => alert('Analytics feature coming soon!')} 
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                  >
                    Analytics
                  </button>
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <button 
                    onClick={() => handleNavigation("/dashboard")} 
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
    </header>
  );
}