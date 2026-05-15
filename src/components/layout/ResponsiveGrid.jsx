const gridClasses = {
  two: 'grid gap-6 xl:grid-cols-2',
  three: 'grid gap-6 xl:grid-cols-3',
  overview: 'grid gap-6 xl:grid-cols-[1.6fr_1fr]',
  sync: 'grid gap-6 xl:grid-cols-[1.2fr_0.8fr]',
  payroll: 'grid gap-6 xl:grid-cols-[1fr_1.5fr]',
};

export default function ResponsiveGrid({ variant = 'two', className = '', children }) {
  return (
    <div className={`${gridClasses[variant] || gridClasses.two} ${className}`.trim()}>
      {children}
    </div>
  );
}
