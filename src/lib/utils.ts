import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date to a readable string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Truncates text to a specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Generates a random ID for elements
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Debounces a function call
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function(...args: Parameters<T>): void {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Creates an ink drop animation at the specified coordinates
 */
export function createInkDrop(x: number, y: number, color = "rgba(255, 61, 0, 0.3)"): void {
  const drop = document.createElement("div");
  drop.classList.add("ink-drop");
  drop.style.left = `${x}px`;
  drop.style.top = `${y}px`;
  drop.style.backgroundColor = color;
  drop.style.width = "0";
  drop.style.height = "0";
  
  document.body.appendChild(drop);
  
  // Trigger animation
  requestAnimationFrame(() => {
    drop.style.width = "200px";
    drop.style.height = "200px";
    drop.style.marginLeft = "-100px";
    drop.style.marginTop = "-100px";
  });
  
  // Remove element after animation completes
  setTimeout(() => {
    document.body.removeChild(drop);
  }, 1000);
}

/**
 * Adds a ripple effect to a button
 */
export function addRippleEffect(event: React.MouseEvent<HTMLElement>): void {
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  createInkDrop(x, y);
}

/**
 * Filters artists by style
 */
export function filterArtistsByStyle(artists: any[], styleId: number): any[] {
  return artists.filter(artist => artist.styles.includes(styleId));
}

/**
 * Gets a random item from an array
 */
export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Checks if the current environment is the browser
 */
export const isBrowser = typeof window !== 'undefined';
