"use client"

import { useState } from 'react'
import { EventForm, Event } from '@/components/event-form'
import { EventList } from '@/components/event-list'
import { Toaster } from '@/components/ui/sonner'

export default function Home() {
  const [events, setEvents] = useState<Event[]>([])

  console.log('Home component rendered, current events:', events)

  const handleAddEvent = (event: Event) => {
    console.log('Adding new event:', event)
    setEvents(prev => [...prev, event])
  }

  const handleDeleteEvent = (id: string) => {
    console.log('Deleting event with id:', id)
    setEvents(prev => prev.filter(event => event.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/40 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-yellow-200/10 to-orange-200/10 rounded-full blur-3xl animate-pulse" />
      </div>
      
      <div className="container mx-auto px-4 py-8 space-y-8 relative z-10">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-primary mb-4 shadow-lg">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-10 h-10 text-white"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
              <circle cx="8" cy="16" r="2"/>
              <path d="m10.3 13.7 5.7-5.7"/>
              <circle cx="16" cy="8" r="2"/>
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent drop-shadow-sm">
            Event Planner
          </h1>
          <p className="text-gray-600 text-lg max-w-md mx-auto">
            Create beautiful events with photos, descriptions, and seamless organization
          </p>
          <div className="flex justify-center space-x-2 mt-4">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 animate-bounce animation-delay-200" />
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-yellow-400 animate-bounce animation-delay-400" />
          </div>
        </div>
        
        <EventForm onAddEvent={handleAddEvent} />
        <EventList events={events} onDeleteEvent={handleDeleteEvent} />
      </div>
      
      <Toaster position="top-right" richColors />
    </div>
  )
}
