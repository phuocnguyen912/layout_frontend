import React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCurrency } from '../../../utils/format';

export default function AttendanceStatsChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-[var(--hr-ink-subtle)]">
        Không có dữ liệu thống kê.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: 'var(--hr-ink-subtle)', fontSize: 12 }}
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: 'var(--hr-ink-subtle)', fontSize: 12 }}
          tickFormatter={(val) => `${val / 1000000}M`}
        />
        <Tooltip 
          cursor={{ fill: 'rgba(0,0,0,0.02)' }}
          contentStyle={{ 
            borderRadius: '12px', 
            border: 'none', 
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
          }}
          formatter={(value) => [formatCurrency(value), 'Tổng lương']}
        />
        <Bar 
          dataKey="total" 
          fill="var(--hr-accent)" 
          radius={[4, 4, 0, 0]} 
          barSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
