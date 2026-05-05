export default function Select(props) {
  return (
    <select
      {...props}
      className={`w-full rounded-2xl border border-[#decebd] bg-[#fbf6ef] px-4 py-3 text-sm text-[var(--hr-ink)] outline-none transition focus:border-[#b55233] focus:bg-white ${props.className || ''}`}
    />
  );
}
