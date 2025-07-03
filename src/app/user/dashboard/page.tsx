'use client'

import { useSession } from 'next-auth/react'

export default function DashboardPage() {
  const { data: session } = useSession()

  return (
    <div className="p-6">
      <h1 className="text-xl">Welcome  {session?.user?.email}</h1>
    </div>
  )
}
