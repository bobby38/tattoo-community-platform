import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

/**
 * Creates a client-only component with proper hydration handling
 * @param importFunc Dynamic import function for the component
 * @param loadingComponent Optional loading component to show while loading
 * @returns Client-only component that won't cause hydration errors
 */
export function createClientOnlyComponent<P>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  loadingComponent: JSX.Element | null = null
) {
  return dynamic(importFunc, {
    ssr: false,
    loading: loadingComponent 
      ? () => loadingComponent 
      : undefined
  });
}

/**
 * Safely access browser APIs by checking if window is defined
 * @returns Whether the code is running in a browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Safe wrapper for browser-only code
 * @param callback Function to execute only in browser environment
 */
export function runOnlyInBrowser(callback: () => void): void {
  if (isBrowser()) {
    callback();
  }
}
