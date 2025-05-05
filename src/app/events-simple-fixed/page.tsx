'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EventsSimpleFixedPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the main events page
    router.replace('/events');
  }, [router]);
  
  // Return nothing on the server
  return null;
}
