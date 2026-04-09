# Interactive Wall Calendar

A polished, responsive, and highly interactive wall calendar component built for a software engineering internship challenge. This project aims to demonstrate high-quality frontend engineering, reusable component architecture, and advanced UI/UX interactions by mapping out a clean physical "wall calendar" aesthetic to the digital space.

## ✨ Key Features
- **Wall Calendar Aesthetic:** Elegant layout featuring a robust hero image header (with diagonal clip styling) and decorative binder rings. Also features monthly dynamic color themes.
- **3D Page Flip Animation:** Transitions between months execute a buttery-smooth 3D flip animation anchored at the binder spine, feeling like a real desk calendar. 
- **Robust Range Selection:** Click and select date ranges seamlessly. Highlights endpoints as full circles and visually connects adjacent days cleanly in a light horizontal strip. Backwards range selection is robustly normalized.
- **Google Calendar-style Note Tracking:** You can add notes on specific ranges. Note indicators display as small, stackable colored bar markers directly on the calendar days with smart counters. Notes persist using client-side `localStorage`.
- **Responsive Layout:** Exquisitely adapts from a side-by-side desktop app view to a scrollable vertical stack for mobile environments.
- **Holidays Context:** Subtly integrates holiday tracking markers indicating distinct localized context.

## 🛠 Tech Stack & Architectural Choices
- **Framework:** **Next.js 14** (App Router) / **React** with **TypeScript** for robust typing, scalable routing, and high performance.
- **Styling:** **CSS Modules**. Consciously avoided massive utility class tools (like Tailwind) to demonstrate ability to write clean, modular, and deeply configurable vanilla CSS variables and animations from scratch.
- **Animations:** **Framer Motion** drives the complex perspective 3D flip transitions simply and declaratively.
- **State Management:** Abstracted logic into decoupled custom React hooks (`useCalendar` and `useNotes`) bridging clear separation between view layers and logical rules.
- **Icons:** **Lucide React**.

## 🚀 Getting Started Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/JKSANJAY27/Interactive-Calendar.git
   cd calendar
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **View the Application:**
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to view the calendar.
