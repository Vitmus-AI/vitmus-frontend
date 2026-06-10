'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/format'
import type { WeeklyRevenue } from '@/types'

interface RevenueChartProps {
  data: WeeklyRevenue[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card className="rounded-xl border-vitmus-border shadow-none">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Ventas por semana</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Explicit px height prevents ResponsiveContainer width(-1)/height(-1) warning */}
        <div style={{ width: '100%', height: 288 }}>
          <ResponsiveContainer width="99%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis
                dataKey="week"
                tick={{ fill: '#6B7280', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#6B7280', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value: number) => `$${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip
                formatter={(value) => [
                  formatCurrency(typeof value === 'number' ? value : Number(value ?? 0)),
                  'Ventas',
                ]}
                contentStyle={{
                  borderRadius: '0.75rem',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.06)',
                }}
                cursor={{ fill: '#22C55E14' }}
              />
              <Bar dataKey="revenue" fill="#22C55E" radius={[6, 6, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
