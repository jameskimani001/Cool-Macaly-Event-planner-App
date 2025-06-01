"use client"

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CalendarIcon, Clock, MapPin, Plus, Camera, X, ImageIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { toast } from 'sonner'

export interface Event {
  id: string
  name: string
  date: Date
  time: string
  location: string
  image?: string
  description?: string
}

const eventSchema = z.object({
  name: z.string().min(1, 'Event name is required').max(100, 'Name must be less than 100 characters'),
  date: z.date({ required_error: 'Please select a date' }),
  time: z.string().min(1, 'Time is required').regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time (HH:MM)'),
  location: z.string().min(1, 'Location is required').max(200, 'Location must be less than 200 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  image: z.string().optional(),
})

type EventFormData = z.infer<typeof eventSchema>

interface EventFormProps {
  onAddEvent: (event: Event) => void
}

export function EventForm({ onAddEvent }: EventFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  console.log('EventForm rendered')

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: '',
      date: undefined,
      time: '',
      location: '',
      description: '',
      image: '',
    },
  })

  const handleImageUpload = (file: File) => {
    console.log('Image uploaded:', file.name)
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image too large', {
        description: 'Please choose an image smaller than 5MB.',
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setImagePreview(result)
      form.setValue('image', result)
      console.log('Image preview set')
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find(file => file.type.startsWith('image/'))
    
    if (imageFile) {
      handleImageUpload(imageFile)
    } else {
      toast.error('Invalid file type', {
        description: 'Please upload an image file.',
      })
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const removeImage = () => {
    setImagePreview(null)
    form.setValue('image', '')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    console.log('Image removed')
  }

  const onSubmit = (data: EventFormData) => {
    console.log('Form submitted with data:', data)
    
    const newEvent: Event = {
      id: Date.now().toString(),
      ...data,
    }
    
    console.log('Creating new event:', newEvent)
    onAddEvent(newEvent)
    
    form.reset()
    setImagePreview(null)
    setIsOpen(false)
    
    toast.success('Event created successfully! 🎉', {
      description: `"${data.name}" has been added to your events.`,
    })
  }

  const handleFormError = () => {
    console.log('Form validation failed:', form.formState.errors)
    toast.error('Please check your form for errors', {
      description: 'All fields are required and must be valid.',
    })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="space-y-2 pb-6">
        <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Plus className="w-4 h-4 text-white" />
          </div>
          Create New Event
        </CardTitle>
        <p className="text-muted-foreground">Plan your next amazing event with all the details</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, handleFormError)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-primary/10 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    Event Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter event name..."
                      className={cn(
                        "h-12 border-2 border-gray-200 focus:border-primary transition-colors",
                        form.formState.errors.name && "border-destructive animate-shake"
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-sm" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-primary" />
                      Date
                    </FormLabel>
                    <Popover open={isOpen} onOpenChange={setIsOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "h-12 w-full justify-start text-left font-normal border-2 border-gray-200 hover:border-primary transition-colors",
                              !field.value && "text-muted-foreground",
                              form.formState.errors.date && "border-destructive animate-shake"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 shadow-xl border-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date)
                            setIsOpen(false)
                            console.log('Date selected:', date)
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="rounded-xl"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      Time
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="14:30"
                        type="time"
                        className={cn(
                          "h-12 border-2 border-gray-200 focus:border-primary transition-colors",
                          form.formState.errors.time && "border-destructive animate-shake"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Location
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter event location..."
                      className={cn(
                        "h-12 border-2 border-gray-200 focus:border-primary transition-colors",
                        form.formState.errors.location && "border-destructive animate-shake"
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-primary/10 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    Description (Optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add event description, agenda, or special notes..."
                      className={cn(
                        "min-h-[100px] border-2 border-gray-200 focus:border-primary transition-colors resize-none",
                        form.formState.errors.description && "border-destructive animate-shake"
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-primary" />
                    Event Image (Optional)
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {imagePreview ? (
                        <div className="relative group">
                          <div className="relative rounded-xl overflow-hidden border-2 border-gray-200">
                            <img
                              src={imagePreview}
                              alt="Event preview"
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={removeImage}
                                className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={cn(
                            "border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer hover:border-primary/50 hover:bg-primary/5",
                            isDragOver ? "border-primary bg-primary/10" : "border-gray-300",
                            form.formState.errors.image && "border-destructive"
                          )}
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <div className="space-y-3">
                            <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                              <ImageIcon className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                Drop an image here, or click to browse
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                PNG, JPG, GIF up to 5MB
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleImageUpload(file)
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-sm" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-opacity text-white font-medium shadow-lg"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Event...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Event
                </div>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}