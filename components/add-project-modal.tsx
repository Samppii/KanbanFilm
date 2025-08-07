"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DatePicker } from "@/components/ui/date-picker"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Plus, X } from "lucide-react"
import { Project, TaskPriority } from "@/types/kanban"

interface ProjectFormData {
  title: string
  client: string
  contact: string
  projectManager: string
  brief: string
  type: string
  genre: string
  duration: string
  description: string
  technicalRequirements: string
  budget: string
  currency: string
  startDate: Date | undefined
  endDate: Date | undefined
  deliverables: string[]
  productionRequirements: string
  paymentNotes: string
  additionalNotes: string
  tags: string[]
  priority: string
  stage: string
}

const projectTypes = [
  "Commercial",
  "Documentary", 
  "Music Video",
  "Short Film",
  "Corporate Video",
  "Feature Film",
  "Web Series",
  "Animation"
]

const stages = [
  { id: "1", title: "1. Project Initiation" },
  { id: "2", title: "2. Pre-Production" },
  { id: "3", title: "3. Production Planning" },
  { id: "4", title: "4. Production" },
  { id: "5", title: "5. Post-Production" },
  { id: "6", title: "6. Client Review" },
  { id: "7", title: "7. Final Delivery" },
  { id: "8", title: "8. Quality Assurance" },
  { id: "9", title: "9. Project Complete" }
]

const genres = [
  "Action",
  "Comedy", 
  "Drama",
  "Horror",
  "Sci-Fi",
  "Romance",
  "Thriller",
  "Documentary",
  "Educational",
  "Promotional"
]

const deliverableOptions = [
  "Final Video File",
  "Raw Footage",
  "Behind-the-Scenes",
  "Social Media Cuts",
  "Color Graded Version",
  "Sound Mixed Version",
  "DCP",
  "Web Version",
  "Trailer",
  "Promotional Materials"
]

interface AddProjectModalProps {
  onCreateProject?: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void
  initialStage?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function AddProjectModal({ onCreateProject, initialStage, open: controlledOpen, onOpenChange }: AddProjectModalProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  
  // Use controlled or internal open state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    client: "",
    contact: "",
    projectManager: "",
    brief: "",
    type: "",
    genre: "",
    duration: "",
    description: "",
    technicalRequirements: "",
    budget: "",
    currency: "USD",
    startDate: undefined,
    endDate: undefined,
    deliverables: [],
    productionRequirements: "",
    paymentNotes: "",
    additionalNotes: "",
    tags: [],
    priority: "medium",
    stage: initialStage || "1"
  })
  const [newTag, setNewTag] = useState("")

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // Validate form data
    if (!formData.title || !formData.client || !formData.type) {
      alert("Please fill in all required fields")
      return
    }

    // Create the project object
    const projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = {
      ...formData,
      priority: formData.priority as TaskPriority,
      stage: formData.stage, // Use the selected stage
      progress: 0, // Initial progress
      status: "active" as const // Default status
    }

    // Call the parent's create function
    if (onCreateProject) {
      onCreateProject(projectData)
    }
    
    // Reset form and close modal
    setFormData({
      title: "",
      client: "",
      contact: "",
      projectManager: "",
      brief: "",
      type: "",
      genre: "",
      duration: "",
      description: "",
      technicalRequirements: "",
      budget: "",
      currency: "USD",
      startDate: undefined,
      endDate: undefined,
      deliverables: [],
      productionRequirements: "",
      paymentNotes: "",
      additionalNotes: "",
      tags: [],
      priority: "medium",
      stage: initialStage || "1"
    })
    setCurrentStep(1)
    setOpen(false)
  }

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({ ...formData, tags: [...formData.tags, newTag] })
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Film Project</DialogTitle>
          <DialogDescription>
            Create a new film project and add it to your production pipeline
          </DialogDescription>
          <Progress value={progress} className="mt-4" />
        </DialogHeader>

        <div className="py-4">
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter project title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client">Client Name</Label>
                  <Input
                    id="client"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    placeholder="Enter client name"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact">Client Contact Email</Label>
                  <Input
                    id="contact"
                    type="email"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="client@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manager">Project Manager</Label>
                  <Select
                    value={formData.projectManager}
                    onValueChange={(value) => setFormData({ ...formData, projectManager: value })}
                  >
                    <SelectTrigger id="manager">
                      <SelectValue placeholder="Select project manager" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john-doe">John Doe</SelectItem>
                      <SelectItem value="jane-smith">Jane Smith</SelectItem>
                      <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brief">Project Brief</Label>
                <Textarea
                  id="brief"
                  value={formData.brief}
                  onChange={(e) => setFormData({ ...formData, brief: e.target.value })}
                  placeholder="Enter project brief and requirements..."
                  rows={4}
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Project Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Project Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectTypes.map((type) => (
                        <SelectItem key={type} value={type.toLowerCase()}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="genre">Genre</Label>
                  <Select
                    value={formData.genre}
                    onValueChange={(value) => setFormData({ ...formData, genre: value })}
                  >
                    <SelectTrigger id="genre">
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.map((genre) => (
                        <SelectItem key={genre} value={genre.toLowerCase()}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Project Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 30 seconds, 90 minutes"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stage">Starting Stage</Label>
                <Select
                  value={formData.stage}
                  onValueChange={(value) => setFormData({ ...formData, stage: value })}
                >
                  <SelectTrigger id="stage">
                    <SelectValue placeholder="Select starting stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id}>
                        {stage.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {initialStage && (
                  <p className="text-xs text-muted-foreground">
                    Pre-selected for: {stages.find(s => s.id === initialStage)?.title}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the project in detail..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="technical">Technical Requirements</Label>
                <Textarea
                  id="technical"
                  value={formData.technicalRequirements}
                  onChange={(e) => setFormData({ ...formData, technicalRequirements: e.target.value })}
                  placeholder="Specify technical requirements..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Production Terms</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Project Budget</Label>
                  <div className="flex gap-2">
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => setFormData({ ...formData, currency: value })}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="budget"
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      placeholder="Enter budget amount"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Production Timeline</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <DatePicker
                      date={formData.startDate}
                      onDateChange={(date) => setFormData({ ...formData, startDate: date })}
                      placeholder="Start date"
                    />
                    <DatePicker
                      date={formData.endDate}
                      onDateChange={(date) => setFormData({ ...formData, endDate: date })}
                      placeholder="End date"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Deliverables</Label>
                <div className="grid grid-cols-2 gap-2">
                  {deliverableOptions.map((deliverable) => (
                    <div key={deliverable} className="flex items-center space-x-2">
                      <Checkbox
                        id={deliverable}
                        checked={formData.deliverables.includes(deliverable)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              deliverables: [...formData.deliverables, deliverable]
                            })
                          } else {
                            setFormData({
                              ...formData,
                              deliverables: formData.deliverables.filter(d => d !== deliverable)
                            })
                          }
                        }}
                      />
                      <Label htmlFor={deliverable} className="text-sm">
                        {deliverable}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Production Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.productionRequirements}
                  onChange={(e) => setFormData({ ...formData, productionRequirements: e.target.value })}
                  placeholder="Specify production requirements..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment">Payment Terms</Label>
                <Textarea
                  id="payment"
                  value={formData.paymentNotes}
                  onChange={(e) => setFormData({ ...formData, paymentNotes: e.target.value })}
                  placeholder="Specify payment terms and schedule..."
                  rows={2}
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Review & Submit</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <p><strong>Title:</strong> {formData.title}</p>
                    <p><strong>Client:</strong> {formData.client}</p>
                    <p><strong>Manager:</strong> {formData.projectManager}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Project Details</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <p><strong>Type:</strong> {formData.type}</p>
                    <p><strong>Genre:</strong> {formData.genre}</p>
                    <p><strong>Duration:</strong> {formData.duration}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                  placeholder="Any additional notes..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <RadioGroup
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low">Low Priority</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium">Medium Priority</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high">High Priority</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                // Save as draft functionality
                console.log("Saving draft:", formData)
              }}
            >
              Save Draft
            </Button>
          </div>
          
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
              >
                Previous
              </Button>
            )}
            {currentStep < totalSteps ? (
              <Button onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                Create Project
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}