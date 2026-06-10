'use client'

import { useEffect, useState } from 'react'
import { ContactsTable } from '@/components/contacts/ContactsTable'
import { fetchContacts } from '@/lib/data'
import type { Contact } from '@/types'

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    async function load() {
      setIsLoading(true)
      try {
        const data = await fetchContacts()
        setContacts(data.results)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [refreshKey])

  return (
    <ContactsTable
      contacts={contacts}
      isLoading={isLoading}
      onRefresh={() => setRefreshKey((k) => k + 1)}
    />
  )
}
