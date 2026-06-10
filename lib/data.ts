import apiClient from '@/lib/api'
import {
  mockAppointments,
  mockContacts,
  mockOrders,
  mockPlatforms,
  warnFallback,
} from '@/lib/fallbacks'
import type {
  Appointment,
  Contact,
  ExternalPlatform,
  Order,
  PaginatedResponse,
} from '@/types'
import { isAxiosError } from 'axios'

function normalizePaginated<T>(data: PaginatedResponse<T> | T[]): PaginatedResponse<T> {
  const results = (data as PaginatedResponse<T>).results ?? (data as T[]) ?? []
  const count = (data as PaginatedResponse<T>).count ?? results.length
  return { count, results }
}

// ─── Contacts ────────────────────────────────────────────────────────────────

export async function fetchContacts(): Promise<PaginatedResponse<Contact>> {
  try {
    const { data } = await apiClient.get<PaginatedResponse<Contact> | Contact[]>('/contacts/')
    return normalizePaginated(data)
  } catch {
    warnFallback('GET /contacts/')
    return { count: mockContacts.length, results: mockContacts }
  }
}

export interface ContactPayload {
  first_name: string
  last_name: string
  email?: string
  phone_e164?: string
  source_mode: 'native'
}

export async function createContact(payload: ContactPayload): Promise<Contact> {
  const { data } = await apiClient.post<Contact>('/contacts/', payload)
  return data
}

export async function updateContact(id: string, payload: Partial<ContactPayload>): Promise<Contact> {
  const { data } = await apiClient.patch<Contact>(`/contacts/${id}/`, payload)
  return data
}

export async function deleteContact(id: string): Promise<void> {
  await apiClient.delete(`/contacts/${id}/`)
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export async function fetchOrders(params?: Record<string, string>): Promise<PaginatedResponse<Order>> {
  try {
    const { data } = await apiClient.get<PaginatedResponse<Order> | Order[]>('/orders/', { params })
    return normalizePaginated(data)
  } catch {
    warnFallback('GET /orders/')
    return { count: mockOrders.length, results: mockOrders }
  }
}

// ─── Appointments ─────────────────────────────────────────────────────────────

export async function fetchAppointments(): Promise<PaginatedResponse<Appointment>> {
  try {
    const { data } = await apiClient.get<PaginatedResponse<Appointment> | Appointment[]>('/appointments/')
    return normalizePaginated(data)
  } catch {
    warnFallback('GET /appointments/')
    return { count: mockAppointments.length, results: mockAppointments }
  }
}

export interface AppointmentPayload {
  contact?: string
  starts_at: string
  ends_at: string
  notes?: string
  total?: string
  source_mode: 'native'
}

export async function createAppointment(payload: AppointmentPayload): Promise<Appointment> {
  const { data } = await apiClient.post<Appointment>('/appointments/', payload)
  return data
}

export async function updateAppointment(id: string, payload: Partial<AppointmentPayload> & { status?: string }): Promise<Appointment> {
  const { data } = await apiClient.patch<Appointment>(`/appointments/${id}/`, payload)
  return data
}

export async function deleteAppointment(id: string): Promise<void> {
  await apiClient.delete(`/appointments/${id}/`)
}

// ─── External Platforms ───────────────────────────────────────────────────────

export async function fetchPlatforms(): Promise<PaginatedResponse<ExternalPlatform>> {
  try {
    const { data } = await apiClient.get<PaginatedResponse<ExternalPlatform> | ExternalPlatform[]>('/external-platforms/')
    return normalizePaginated(data)
  } catch {
    warnFallback('GET /external-platforms/')
    return { count: mockPlatforms.length, results: mockPlatforms }
  }
}

export interface PlatformPayload {
  platform_type: string
  display_name: string
  shop_url?: string
}

export async function createPlatform(payload: PlatformPayload): Promise<ExternalPlatform> {
  const { data } = await apiClient.post<ExternalPlatform>('/external-platforms/', payload)
  return data
}

export async function updatePlatform(id: string, payload: Partial<PlatformPayload>): Promise<ExternalPlatform> {
  const { data } = await apiClient.patch<ExternalPlatform>(`/external-platforms/${id}/`, payload)
  return data
}

export async function deletePlatform(id: string): Promise<void> {
  await apiClient.delete(`/external-platforms/${id}/`)
}

export function isNotFoundError(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 404
}
