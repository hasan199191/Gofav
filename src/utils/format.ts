import { format, formatDistanceToNow } from 'date-fns';

// Format a number with commas and optional decimal places
export function formatNumber(num: number | undefined | null, decimals = 0): string {
  if (typeof num !== 'number' || isNaN(num)) {
    return '0';
  }
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// Truncate wallet address 0x123...789
export function truncateAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`;
}

// Format date to human readable format
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return 'N/A';
    }
    return format(dateObj, 'MMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'N/A';
  }
}

// Format date to relative time (e.g. "2 days ago")
export function formatRelativeTime(date: string | Date): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return 'N/A';
    }
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'N/A';
  }
}

// Format a tweet for display
export function formatTweet(tweet: string): string {
  if (!tweet) return '';
  
  // Convert URLs to links
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const withLinks = tweet.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:underline">$1</a>');
  
  // Convert hashtags to links
  const hashtagRegex = /(#\w+)/g;
  const withHashtags = withLinks.replace(hashtagRegex, '<span class="text-primary-600">$1</span>');
  
  // Convert mentions to links
  const mentionRegex = /(@\w+)/g;
  return withHashtags.replace(mentionRegex, '<span class="text-primary-600">$1</span>');
}

// Format large numbers to K, M, B format (e.g. 1500 -> 1.5K)
export function formatCompactNumber(num: number | undefined | null): string {
  if (typeof num !== 'number' || isNaN(num)) {
    return '0';
  }
  const formatter = Intl.NumberFormat('en', { notation: 'compact' });
  return formatter.format(num);
}