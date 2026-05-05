import { LoaderCircle } from 'lucide-react';

export default function Button({ children, variant = 'primary', loading = false, ...props }) {
  const styles = {
    primary: 'bg-[#2f2824] text-white hover:bg-[#201a17]',
    secondary: 'bg-[#fff9f2] text-[#3f342d] border border-[#ddcdbc] hover:bg-[#f6ede2]',
    accent: 'bg-[#b55233] text-white hover:bg-[#964228]',
  };

  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${props.className || ''}`}
    >
      {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
}
