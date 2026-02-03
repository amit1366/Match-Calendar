# BM Matches - Team Match & Player Availability Management

A React application for managing a local team's matches and tracking player availability with a stunning glassmorphism UI featuring a cricket stadium background.

## Features

### 🧑‍🤝‍🧑 Player Management
- Add new players with validation
- Edit player names
- Delete players (removes from all matches)
- **Search functionality** to quickly find players
- Prevents duplicate and empty names
- New players automatically appear in all matches

### 📅 Match Management
- Add match dates using date picker
- Edit match dates
- Delete matches
- Matches displayed in ascending order by date
- Prevents duplicate match dates
- **Progress bars** showing player availability at a glance
- **Confirmed badges** when enough players are available

### ✅ Player Availability
- Track IN/OUT status for each player per match
- Default state: Not Marked
- Toggle availability with color-coded buttons:
  - 🟢 Green: IN
  - 🔴 Red: OUT
  - ⚪ Grey: Not Marked

### 📊 Match Summary
- Real-time statistics for each match:
  - Total players IN
  - Total players OUT
  - Total players Not Responded
- Visual progress bars
- Summary text: "X Going • Y Out • Z Pending"
- Warning alert if IN players < 11 (configurable)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:5173` (or the next available port).

### Customizing Background Image

To use your own cricket stadium image:

1. Place your image in the `public` folder as `stadium-bg.jpg`
2. Update the background URL in `src/App.css` line 34:
```css
background: 
  linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)),
  url('/stadium-bg.jpg');
```

Or use any image URL by replacing the URL in the CSS file.

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## Design Features

### 🎨 Glassmorphism UI
- Frosted glass effect with backdrop blur
- Semi-transparent cards
- Beautiful cricket stadium background
- Smooth animations and transitions

### 🔤 Typography
- **Bebas Neue** for main headings (bold, athletic)
- **Montserrat** for section headers and buttons (modern, sporty)
- **Poppins** for body text and player names (clean, readable)

### 📱 Responsive Design
- Mobile-first approach
- Works seamlessly on all screen sizes
- Touch-friendly interface

## State Management

The application uses React hooks (`useState` and `useEffect`) for state management:

- **Players State**: Managed in `PlayerManager` component, synced with localStorage
- **Matches State**: Managed in `MatchManager` component, synced with localStorage
- **Availability State**: Stored within each match object's `availability` property

### Data Persistence

All data is persisted to browser localStorage:
- Players: `bm-matches-players`
- Matches: `bm-matches-matches`

Data automatically syncs when:
- Players are added/edited/deleted
- Matches are added/edited/deleted
- Availability status changes

### Component Structure

```
App
├── PlayerManager
│   ├── AddPlayerForm
│   └── PlayerList
└── MatchManager
    ├── AddMatchForm
    ├── MatchList
    └── MatchCard
        ├── PlayerAvailabilityRow
        └── AvailabilityToggle
```

## Technical Details

- **Framework**: React 18 (Functional Components only)
- **Hooks Used**: `useState`, `useEffect`
- **Build Tool**: Vite
- **Styling**: CSS with Glassmorphism effects
- **Fonts**: Google Fonts (Bebas Neue, Montserrat, Poppins)
- **Responsive**: Mobile-first design

## Browser Support

Works in all modern browsers that support:
- ES6+ JavaScript
- localStorage API
- CSS Grid and Flexbox
- backdrop-filter (for glassmorphism effect)

## License

Built for local team management.
