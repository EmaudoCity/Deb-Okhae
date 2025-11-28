# CS50 Mail - Email Application

#### Video Demo: [CS50 Mail Demo](https://youtu.be/your-video-link)

#### Description:

**CS50 Mail** is a Progressive Web Application (PWA) email client built as a final project for Harvard's CS50 course. This application demonstrates modern web development practices using TypeScript, Lit Web Components, and the Shoelace UI component library.

## Features

- **📥 Inbox** - View and manage incoming emails with unread count badges
- **✏️ Compose** - Write and send new emails with a clean form interface
- **📤 Sent** - View all emails you've sent
- **📁 Archive** - Archive emails for later reference
- **💬 Reply** - Reply to received emails directly from the email view
- **✅ Read/Unread** - Mark emails as read or unread
- **🌙 Dark Mode** - Automatic dark mode support based on system preferences
- **📱 Responsive** - Works on desktop and mobile devices
- **⚡ PWA** - Installable as a Progressive Web App

## Screenshots

### Inbox
![Inbox](https://github.com/user-attachments/assets/2bfffb42-c1e7-40d1-a390-27a8e4611a9d)

### Email Detail View
![Email Detail](https://github.com/user-attachments/assets/bae14eb7-b1f7-406b-a9f3-bd2f66ce751f)

### Compose Email
![Compose](https://github.com/user-attachments/assets/66deac21-1170-4102-af24-d63e76397867)

### Sent Emails
![Sent](https://github.com/user-attachments/assets/77aac750-046e-4ccc-9caa-a67371186387)

## Technology Stack

- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript for better developer experience
- **[Lit](https://lit.dev)** - Simple, fast Web Components library
- **[Shoelace](https://shoelace.style/)** - A forward-thinking library of web components
- **[Vite](https://vitejs.dev/)** - Next generation frontend tooling
- **[PWA](https://web.dev/progressive-web-apps/)** - Progressive Web App capabilities

## Project Structure

```
src/
├── app-index.ts          # Main application entry point
├── router.ts             # Application routing configuration
├── components/
│   └── header.ts         # Navigation header component
├── pages/
│   ├── app-inbox/        # Inbox page - displays received emails
│   ├── app-compose/      # Compose page - write new emails
│   ├── app-sent/         # Sent page - displays sent emails
│   ├── app-archived/     # Archived page - displays archived emails
│   ├── app-email/        # Email detail page - view single email
│   └── app-about/        # About page - project information
├── services/
│   └── email-service.ts  # Email data management service
└── styles/
    ├── global.css        # Global CSS styles
    └── shared-styles.ts  # Shared Lit component styles
```

## Design Decisions

### Why Lit Web Components?

I chose Lit for this project because:
1. **Native Web Standards** - Uses standard Web Components, no framework lock-in
2. **Performance** - Minimal overhead with efficient reactive updates
3. **Simplicity** - Clean, declarative templates with TypeScript support

### Why Shoelace UI?

Shoelace provides:
1. **Accessibility** - Built-in ARIA support and keyboard navigation
2. **Customization** - CSS custom properties for easy theming
3. **Web Components** - Works with any framework or vanilla JS

### Email Service Architecture

The email service uses a singleton pattern with a subscription model, allowing:
- Real-time UI updates when emails change
- Separation of concerns between data and presentation
- Easy extensibility for future features (e.g., API integration)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start development server (alias)

## Future Improvements

- Backend API integration for persistent email storage
- User authentication
- Multiple mailboxes support
- Email search functionality
- Attachments support
- Email threading/conversations

## About CS50

This project was created as a final project for [CS50](https://cs50.harvard.edu/), Harvard University's introduction to computer science. The course teaches students how to think algorithmically and solve problems efficiently.

**This was CS50!**

---

## Original PWA Starter Documentation

This project was built using the [PWABuilder pwa-starter](https://docs.pwabuilder.com/#/starter/quick-start) template.

### PWA Features

- Service Worker with Workbox for offline support
- Web App Manifest for installability
- Lighthouse score optimized
- Ready for app store deployment via PWABuilder
