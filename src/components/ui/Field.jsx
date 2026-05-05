export default function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[#4e433c]">{label}</span>
      {children}
    </label>
  );
}
