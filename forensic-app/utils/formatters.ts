/**
 * Formatting Utilities
 * Functions for formatting dates, text, and other data
 */

/**
 * Format date to readable string
 * @param date - Date object or string
 * @returns Formatted date string (e.g., "Nov 2, 2025")
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  return dateObj.toLocaleDateString('en-US', options);
};

/**
 * Format time to readable string
 * @param date - Date object or string
 * @returns Formatted time string (e.g., "6:20 PM")
 */
export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };
  
  return dateObj.toLocaleTimeString('en-US', options);
};

/**
 * Format date and time together
 * @param date - Date object or string
 * @returns Formatted datetime string (e.g., "Nov 2, 2025 at 6:20 PM")
 */
export const formatDateTime = (date: Date | string): string => {
  return `${formatDate(date)} at ${formatTime(date)}`;
};

/**
 * Format relative time (e.g., "2 hours ago")
 * @param date - Date object or string
 * @returns Relative time string
 */
export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) {
    return 'Just now';
  } else if (diffMin < 60) {
    return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffHour < 24) {
    return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffDay < 7) {
    return `${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago`;
  } else {
    return formatDate(dateObj);
  }
};

/**
 * Normalize or generate case ID
 * @param caseId - Existing case ID to normalize (optional)
 * @returns Case ID in format "CASE-YYYY-XXXX"
 */
export const formatCaseId = (caseId?: string): string => {
  if (caseId && caseId.trim().length > 0) {
    return caseId.trim();
  }

  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `CASE-${year}-${random}`;
};

/**
 * Truncate text to specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Format file size
 * @param bytes - Size in bytes
 * @returns Formatted file size (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Capitalize first letter of string
 * @param text - Text to capitalize
 * @returns Capitalized text
 */
export const capitalizeFirst = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Format name (capitalize each word)
 * @param name - Name to format
 * @returns Formatted name
 */
export const formatName = (name: string): string => {
  return name
    .split(' ')
    .map(word => capitalizeFirst(word))
    .join(' ');
};

/**
 * Get initials from name
 * @param firstName - First name
 * @param lastName - Last name
 * @returns Initials (e.g., "JD")
 */
export const getInitials = (firstName: string, lastName: string): string => {
  const first = firstName.charAt(0).toUpperCase();
  const last = lastName.charAt(0).toUpperCase();
  return `${first}${last}`;
};

/**
 * Format phone number (US format)
 * @param phone - Phone number string
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  
  return phone;
};

/**
 * Generate summary from text
 * @param text - Full text
 * @param sentences - Number of sentences for summary
 * @returns Summary text
 */
export const generateSummary = (text: string, sentences: number = 2): string => {
  const sentenceArray = text.match(/[^.!?]+[.!?]+/g) || [];
  const summary = sentenceArray.slice(0, sentences).join(' ');
  return summary.trim();
};
