"use client"

import { useState } from 'react'
import { format } from 'date-fns'
import { CalendarIcon, Clock, MapPin, Trash2, Calendar as CalendarLarge, ImageIcon, FileText } from 'lucide-react'
import { Event } from './event-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface EventListProps {
  events: Event[]
  onDeleteEvent: (id: string) => void
}

export function EventList({ events, onDeleteEvent }: EventListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  console.log('EventList rendered with events:', events)

  const handleDelete = (event: Event) => {
    console.log('Deleting event:', event)
    setDeletingId(event.id)
    
    // Simulate deletion animation
    setTimeout(() => {
      onDeleteEvent(event.id)
      setDeletingId(null)
      toast.success('Event deleted', {
        description: `"${event.name}" has been removed from your events.`,
      })
    }, 300)
  }

  const getEventStatus = (event: Event) => {
    const eventDateTime = new Date(event.date)
    const now = new Date()
    const timeDiff = eventDateTime.getTime() - now.getTime()
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))

    if (daysDiff < 0) return { status: 'past', label: 'Past', color: 'bg-gray-100 text-gray-600' }
    if (daysDiff === 0) return { status: 'today', label: 'Today', color: 'bg-accent text-accent-foreground' }
    if (daysDiff === 1) return { status: 'tomorrow', label: 'Tomorrow', color: 'bg-secondary text-secondary-foreground' }
    if (daysDiff <= 7) return { status: 'week', label: `In ${daysDiff} days`, color: 'bg-primary text-primary-foreground' }
    return { status: 'future', label: `In ${daysDiff} days`, color: 'bg-muted text-muted-foreground' }
  }

  if (events.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <CalendarLarge className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
          <p className="text-muted-foreground max-w-sm">
            Create your first event using the form above to get started with planning!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <CalendarLarge className="w-5 h-5 text-primary" />
          Your Events ({events.length})
        </h2>
      </div>
      
      <div className="space-y-3">
        {events.map((event) => {
          const eventStatus = getEventStatus(event)
          const isDeleting = deletingId === event.id
          
          return (
            <Card 
              key={event.id} 
              className={`border-l-4 border-l-primary transition-all duration-300 hover:shadow-md overflow-hidden ${
                isDeleting ? 'animate-slide-out' : 'animate-fade-in'
              }`}
            >
              <CardContent className="p-0">
                {event.image && (
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <Badge className={`absolute top-4 right-4 ${eventStatus.color} border-0 shadow-lg`}>
                      {eventStatus.label}
                    </Badge>
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-lg text-gray-900 leading-tight">
                          {event.name}
                        </h3>
                        {!event.image && (
                          <Badge className={`ml-3 ${eventStatus.color} border-0`}>
                            {eventStatus.label}
                          </Badge>
                        )}
                      </div>
                      
                      {event.description && (
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <FileText className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <p className="line-clamp-2">{event.description}</p>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>{format(event.date, 'MMM d, yyyy')}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>{event.time}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-4 text-gray-500 hover:text-destructive hover:border-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Event</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{event.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(event)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}