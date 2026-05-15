import React from 'react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function BranchDistributionChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <p className="text-sm text-[var(--hr-muted)]">
        Không có dữ liệu phân bổ nhân sự.
      </p>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="#e7d8ca" strokeDasharray="4 4" />
          <XAxis 
            dataKey="name" 
            stroke="#8a7768" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            stroke="#8a7768" 
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
          />
          <Bar dataKey="employees" radius={[10, 10, 0, 0]}>
            {data.map((item, index) => (
              <Cell 
                key={item.name} 
                fill={index % 2 === 0 ? '#b55233' : '#7f8a63'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
