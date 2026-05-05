export default function Input(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-2xl border border-[#decebd] bg-[#fbf6ef] px-4 py-3 text-sm text-[var(--hr-ink)] outline-none transition placeholder:text-[#9b8d80] focus:border-[#b55233] focus:bg-white ${props.className || ''}`}
    />
  );
}
