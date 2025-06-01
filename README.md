📅 React Event Planner
A beautifully designed and fully functional event planner built with React, featuring modern form handling, calendar integration, event image uploads, and responsive visual design.

✨ Features
🧾 Event Management
Add Events with name, date, time, location, and description

Modern Date Picker with disabled past dates

Event Image Upload with preview, drag & drop, and validation (max 5MB)

Form Validation using react-hook-form and zod

Delete Events with smooth slide-out animation and confirmation

Responsive Layout optimized for desktop and mobile

🖼️ Visual Enhancements
Event Cards with Images: Events display visually with image overlays and status badges

Decorative Elements: Background illustrations, gradient animations, and floating UI orbs

Custom Icons: Enhanced icons including a calendar with camera integration

Typography: Clean, modern sans-serif font with visual hierarchy and emphasis

🎨 Design System
Color Palette

Primary: Deep Indigo #4338ca

Secondary: Lavender #a78bfa

Accent: Emerald #10b981

Background: #fafafa

Text: Charcoal #1f2937

Layout: Card-based design with shadows, subtle animations, and floating labels

Animations: Fade-ins, hovers, shakes for form errors, and bounce indicators

🔔 Feedback & Notifications
Success/Failure Toasts using sonner

Drag & Drop UX with live image preview and removal

Inline Form Feedback for real-time validation issues

🛠 Tech Stack
React 18

TypeScript

Tailwind CSS

react-hook-form for form control

zod for schema validation

react-day-picker for calendar input

sonner for toast notifications

date-fns for date manipulation

📷 Screenshots
You can add actual screenshots here when available.

Event Form	Event List	Image Upload

🚀 Getting Started
1. Clone the Repository
Copy
Edit
git clone https://github.com/your-username/react-event-planner.git
cd react-event-planner
2. Install Dependencies
Copy
Edit
npm install
# or
yarn
3. Run the Development Server
Copy
Edit
npm run dev
The app will be available at http://localhost:3000.

🧪 Testing
Type checking is enabled via TypeScript. To validate types and catch errors:

Copy
Edit
tsc --noEmit
📁 File Structure Overview
pgsql
Copy
Edit
src/
│
├── components/
│   ├── EventForm.tsx
│   ├── EventList.tsx
│   └── ImageUpload.tsx
│
├── styles/
│   └── globals.css
│
├── utils/
│   └── validation.ts
│
├── App.tsx
├── index.tsx
└── types.ts
📸 Image Upload Guidelines
Max file size: 5MB

Supported formats: JPEG, PNG, WEBP

Drag and drop or click to upload

Inline preview with remove option

🎯 Future Improvements
Persist events in local storage or backend

Add tags or categories for events

Calendar view for scheduled events

Enhanced accessibility (ARIA roles, keyboard nav)

Dark mode support

📬 Feedback
Have suggestions, bugs, or feature requests? Please open an issue.

📄 License
MIT License
