'use client'

import { useEffect, useState } from 'react'

export default function ClientOnly({ 
  children, 
  fallback = <div>Loading...</div> 
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode 
}) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
