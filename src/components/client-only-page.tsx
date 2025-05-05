'use client';

import { useEffect, useState, ReactNode } from 'react';

interface ClientOnlyPageProps {
  children: ReactNode;
}

/**
 * Component that ensures its children are only rendered on the client side
 * This completely prevents hydration errors by not rendering anything during SSR
 */
export default function ClientOnlyPage({ children }: ClientOnlyPageProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set mounted to true on client-side only
    setMounted(true);
    
    // Force a re-render after mounting to ensure client-side rendering takes precedence
    const timer = setTimeout(() => {
      setMounted(false);
      setTimeout(() => setMounted(true), 0);
    }, 10);
    
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same general structure to avoid layout shifts
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-[500px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
