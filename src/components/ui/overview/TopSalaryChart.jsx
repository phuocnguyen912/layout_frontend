import React from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCurrency } from '../../../utils/format';

export default function TopSalaryChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="#e7d8ca" strokeDasharray="4 4" />
          <XAxis 
            dataKey="name" 
            stroke="#8a7768" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            stroke="#8a7768" 
            tick={{ fontSize: 12 }}
            tickFormatter={(val) => `${val / 1000000}M`}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
            formatter={(value) => [formatCurrency(value), 'Tổng lương']} 
          />
          <Line 
            type="monotone" 
            dataKey="salary" 
            stroke="#7a3420" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#b55233' }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
