// Shared utility functions for CS50 Mail application

/**
 * Format a timestamp for display in email lists
 * Shows time for today, "Yesterday" for yesterday, weekday for this week, or date
 */
export function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (days === 1) {
    return 'Yesterday';
  } else if (days < 7) {
    return date.toLocaleDateString([], { weekday: 'short' });
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
}

/**
 * Get a preview of the email body (first non-empty line, truncated)
 */
export function getEmailPreview(body: string, maxLength = 100): string {
  return body.split('\n').filter((line) => line.trim())[0]?.substring(0, maxLength) || '';
}

/**
 * Format a full timestamp for email detail view
 */
export function formatFullTimestamp(date: Date): string {
  return date.toLocaleDateString([], {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
