import type {
  Appointment,
  Contact,
  DashboardMetrics,
  ExternalPlatform,
  Order,
  Tenant,
  User,
  WeeklyRevenue,
} from '@/types'

export const mockUser: User = {
  id: 'usr_mock_001',
  email: 'admin@demo.vitmus.com',
  full_name: 'Admin Demo',
  phone_e164: '+573001234567',
}

export const mockTenant: Tenant = {
  id: 'tnt_mock_001',
  name: 'Demo Store',
  slug: 'demo-store',
  plan: 'growth',
  vertical: 'hybrid',
  is_active: true,
}

export const mockContacts: Contact[] = [
  {
    id: 'cnt_001',
    first_name: 'María',
    last_name: 'García',
    email: 'maria@email.com',
    phone_e164: '+573001112233',
    external_platform: 'shopify',
    source_mode: 'mirror',
    created_at: '2026-05-10T10:00:00Z',
  },
  {
    id: 'cnt_002',
    first_name: 'Carlos',
    last_name: 'López',
    email: 'carlos@email.com',
    phone_e164: '+573004445566',
    source_mode: 'native',
    created_at: '2026-05-15T14:30:00Z',
  },
]

export const mockOrders: Order[] = [
  {
    id: 'ord_001',
    external_order_number: 'SH-1042',
    external_platform: 'shopify',
    source_mode: 'mirror',
    status: 'delivered',
    financial_status: 'paid',
    currency: 'COP',
    total: '189000',
    contact: mockContacts[0],
    ordered_at: '2026-06-01T09:00:00Z',
    created_at: '2026-06-01T09:00:00Z',
  },
  {
    id: 'ord_002',
    external_order_number: 'SH-1043',
    external_platform: 'shopify',
    source_mode: 'mirror',
    status: 'processing',
    financial_status: 'paid',
    currency: 'COP',
    total: '245000',
    contact: mockContacts[1],
    ordered_at: '2026-06-03T11:30:00Z',
    created_at: '2026-06-03T11:30:00Z',
  },
  {
    id: 'ord_003',
    external_order_number: 'WC-892',
    external_platform: 'woocommerce',
    source_mode: 'mirror',
    status: 'pending',
    financial_status: 'pending',
    currency: 'COP',
    total: '98000',
    contact: mockContacts[0],
    ordered_at: '2026-06-05T16:00:00Z',
    created_at: '2026-06-05T16:00:00Z',
  },
  {
    id: 'ord_004',
    external_order_number: 'NAT-015',
    source_mode: 'native',
    status: 'confirmed',
    financial_status: 'paid',
    currency: 'COP',
    total: '320000',
    contact: mockContacts[1],
    ordered_at: '2026-06-07T08:45:00Z',
    created_at: '2026-06-07T08:45:00Z',
  },
  {
    id: 'ord_005',
    external_order_number: 'SH-1044',
    external_platform: 'shopify',
    source_mode: 'mirror',
    status: 'cancelled',
    financial_status: 'refunded',
    currency: 'COP',
    total: '56000',
    contact: mockContacts[0],
    ordered_at: '2026-06-08T13:20:00Z',
    created_at: '2026-06-08T13:20:00Z',
  },
]

export const mockAppointments: Appointment[] = [
  {
    id: 'apt_001',
    status: 'confirmed',
    starts_at: '2026-06-09T10:00:00Z',
    ends_at: '2026-06-09T10:45:00Z',
    total: '45000',
    currency: 'COP',
    contact: mockContacts[0],
    services: ['Corte de cabello'],
    employee_name: 'Laura Martínez',
  },
  {
    id: 'apt_002',
    status: 'scheduled',
    starts_at: '2026-06-09T14:00:00Z',
    ends_at: '2026-06-09T15:00:00Z',
    total: '80000',
    currency: 'COP',
    contact: mockContacts[1],
    services: ['Barba', 'Corte'],
    employee_name: 'Juan Pérez',
  },
  {
    id: 'apt_003',
    status: 'completed',
    starts_at: '2026-06-08T09:00:00Z',
    ends_at: '2026-06-08T09:30:00Z',
    total: '35000',
    currency: 'COP',
    contact: mockContacts[0],
    services: ['Manicure'],
    employee_name: 'Ana Ruiz',
  },
]

export const mockPlatforms: ExternalPlatform[] = [
  {
    id: 'plt_001',
    platform_type: 'shopify',
    display_name: 'Tienda Shopify',
    shop_url: 'https://demo-store.myshopify.com',
    is_active: true,
    last_sync_at: '2026-06-09T08:00:00Z',
  },
  {
    id: 'plt_002',
    platform_type: 'woocommerce',
    display_name: 'WooCommerce Principal',
    shop_url: 'https://tienda.demo.com',
    is_active: true,
    last_sync_at: '2026-06-08T22:30:00Z',
  },
]

export const mockWeeklyRevenue: WeeklyRevenue[] = [
  { week: 'Sem 1', revenue: 1200000 },
  { week: 'Sem 2', revenue: 1450000 },
  { week: 'Sem 3', revenue: 980000 },
  { week: 'Sem 4', revenue: 1670000 },
  { week: 'Sem 5', revenue: 2100000 },
  { week: 'Sem 6', revenue: 1890000 },
  { week: 'Sem 7', revenue: 2340000 },
  { week: 'Sem 8', revenue: 1980000 },
]

export const mockDashboardMetrics: DashboardMetrics = {
  total_contacts: 128,
  orders_this_month: 47,
  revenue_this_month: '4850000',
  appointments_today: 6,
  recent_orders: mockOrders.slice(0, 5),
}

export function warnFallback(endpoint: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[Vitmus] Usando datos mock para: ${endpoint}`)
  }
}
