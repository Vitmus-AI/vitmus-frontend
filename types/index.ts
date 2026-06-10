export interface Tenant {
  id: string
  name: string
  slug: string
  plan: 'free' | 'starter' | 'growth' | 'pro'
  vertical: 'ecommerce' | 'services' | 'hybrid'
  is_active: boolean
}

export interface User {
  id: string
  email: string
  full_name: string
  phone_e164?: string
}

export interface AuthState {
  user: User | null
  tenant: Tenant | null
  accessToken: string | null
  refreshToken: string | null
}

export interface Contact {
  id: string
  first_name: string
  last_name: string
  email?: string
  phone_e164?: string
  external_platform?: string
  source_mode: 'mirror' | 'native'
  created_at: string
}

export interface Order {
  id: string
  external_order_number?: string
  external_platform?: string
  source_mode: 'mirror' | 'native'
  status: string
  financial_status: string
  currency: string
  total: string
  contact?: Contact
  ordered_at?: string
  created_at: string
}

export interface Appointment {
  id: string
  status: string
  starts_at: string
  ends_at: string
  total: string
  currency: string
  notes?: string
  contact?: Contact
  services?: string[]
  employee_name?: string
}

export interface ExternalPlatform {
  id: string
  platform_type: string
  display_name: string
  shop_url?: string
  is_active: boolean
  last_sync_at?: string
}

export interface PaginatedResponse<T> {
  count: number
  next?: string
  previous?: string
  results: T[]
}

export interface DashboardMetrics {
  total_contacts: number
  orders_this_month: number
  revenue_this_month: string
  appointments_today: number
  recent_orders: Order[]
}

export interface WeeklyRevenue {
  week: string
  revenue: number
}

export interface TokenResponse {
  access: string
  refresh: string
}

export interface MeResponse {
  user: User
  tenant: Tenant
}

export interface NavItem {
  label: string
  href: string
  icon: string
}
