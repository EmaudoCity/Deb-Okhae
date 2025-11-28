// Email types and service for CS50 Final Project - Email Application

export interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  timestamp: Date;
  read: boolean;
  archived: boolean;
}

// Mock user for the application
export const currentUser = 'user@cs50mail.com';

// Generate unique ID using crypto API for guaranteed uniqueness
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

// Mock initial emails
const initialInboxEmails: Email[] = [
  {
    id: generateId(),
    from: 'david@harvard.edu',
    to: currentUser,
    subject: 'Welcome to CS50!',
    body: `Dear Student,

Welcome to CS50! This is CS50, Harvard University's introduction to the intellectual enterprises of computer science and the art of programming.

This course teaches students how to think algorithmically and solve problems efficiently. Topics include abstraction, algorithms, data structures, encapsulation, resource management, security, software engineering, and web development.

Good luck with your final project!

Best regards,
David J. Malan
Harvard University`,
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    read: false,
    archived: false,
  },
  {
    id: generateId(),
    from: 'brian@cs50.harvard.edu',
    to: currentUser,
    subject: 'CS50 Final Project Guidelines',
    body: `Hi there!

Here are the guidelines for your final project:

1. The project must be a software-based solution
2. You should implement something of interest to you
3. Document your work with a video and README
4. Submit via the CS50 submission system

Your email application looks like a great choice!

Cheers,
Brian`,
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    read: false,
    archived: false,
  },
  {
    id: generateId(),
    from: 'alice@example.com',
    to: currentUser,
    subject: 'Project Collaboration?',
    body: `Hey!

I saw your profile on CS50's community page. Would you be interested in collaborating on a web development project after the course?

I'm thinking about building a social media platform for programmers. Let me know if you're interested!

Best,
Alice`,
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
    read: true,
    archived: false,
  },
  {
    id: generateId(),
    from: 'newsletter@tech-weekly.com',
    to: currentUser,
    subject: 'This Week in Tech - New JavaScript Features',
    body: `Tech Weekly Newsletter

This week's highlights:

🚀 New JavaScript ES2024 Features Announced
📱 Apple Releases New Development Tools  
💻 Microsoft Updates VS Code Extensions
🌐 Web Components Gaining Popularity

Read more at tech-weekly.com

Unsubscribe: click here`,
    timestamp: new Date(Date.now() - 172800000), // 2 days ago
    read: true,
    archived: false,
  },
];

const initialSentEmails: Email[] = [
  {
    id: generateId(),
    from: currentUser,
    to: 'david@harvard.edu',
    subject: 'Re: Welcome to CS50!',
    body: `Dear Professor Malan,

Thank you so much for the warm welcome! I am excited to be part of CS50 and learn computer science.

For my final project, I decided to build an email client application using modern web technologies like Lit, TypeScript, and Shoelace UI components.

Best regards,
CS50 Student`,
    timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
    read: true,
    archived: false,
  },
];

// Email service class to manage emails
class EmailServiceClass {
  private inbox: Email[] = [...initialInboxEmails];
  private sent: Email[] = [...initialSentEmails];
  private listeners: Set<() => void> = new Set();

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  getInbox(): Email[] {
    return this.inbox.filter((email) => !email.archived).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getSent(): Email[] {
    return this.sent.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getArchived(): Email[] {
    return this.inbox.filter((email) => email.archived).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getEmailById(id: string): Email | undefined {
    return [...this.inbox, ...this.sent].find((email) => email.id === id);
  }

  sendEmail(to: string, subject: string, body: string): Email {
    const email: Email = {
      id: generateId(),
      from: currentUser,
      to,
      subject,
      body,
      timestamp: new Date(),
      read: true,
      archived: false,
    };
    this.sent.unshift(email);
    this.notify();
    return email;
  }

  markAsRead(id: string): void {
    const email = this.inbox.find((e) => e.id === id);
    if (email) {
      email.read = true;
      this.notify();
    }
  }

  markAsUnread(id: string): void {
    const email = this.inbox.find((e) => e.id === id);
    if (email) {
      email.read = false;
      this.notify();
    }
  }

  archiveEmail(id: string): void {
    const email = this.inbox.find((e) => e.id === id);
    if (email) {
      email.archived = true;
      this.notify();
    }
  }

  unarchiveEmail(id: string): void {
    const email = this.inbox.find((e) => e.id === id);
    if (email) {
      email.archived = false;
      this.notify();
    }
  }

  getUnreadCount(): number {
    return this.inbox.filter((email) => !email.read && !email.archived).length;
  }

  // Reply to an email - creates a new sent email and simulates receiving a reply
  replyToEmail(originalEmail: Email, replyBody: string): Email {
    const email: Email = {
      id: generateId(),
      from: currentUser,
      to: originalEmail.from,
      subject: originalEmail.subject.startsWith('Re:') ? originalEmail.subject : `Re: ${originalEmail.subject}`,
      body: replyBody,
      timestamp: new Date(),
      read: true,
      archived: false,
    };
    this.sent.unshift(email);
    this.notify();
    return email;
  }
}

// Export singleton instance
export const EmailService = new EmailServiceClass();
