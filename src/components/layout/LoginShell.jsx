export default function LoginShell({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f7efe6_0%,#ecdcc8_100%)] px-4 py-10">
      <div className="w-full max-w-md rounded-[32px] border border-white/70 bg-[rgba(255,248,241,0.92)] p-8 shadow-[0_30px_80px_rgba(71,52,40,0.14)]">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#8c7b6c]">DDB HRM</p>
          <h1 className="mt-4 text-3xl font-semibold text-[var(--hr-ink)]">Đăng nhập hệ thống</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--hr-muted)]">
            Vui lòng chọn môi trường làm việc và đăng nhập bằng tài khoản của bạn.
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
