import { useEffect, useState } from 'react';
import { API_PROFILES } from '../lib/api';
import Field from '../components/ui/Field';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';

export default function LoginScreen({ onLogin, pending, error }) {
  const [profileKey, setProfileKey] = useState('publisher');
  const [username, setUsername] = useState(API_PROFILES.publisher.defaultUsername);
  const [password, setPassword] = useState(API_PROFILES.publisher.defaultPassword);

  useEffect(() => {
    const profile = API_PROFILES[profileKey];
    setUsername(profile.defaultUsername);
    setPassword(profile.defaultPassword);
  }, [profileKey]);

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

        <form
          className="mt-8 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            onLogin({ profileKey, username, password });
          }}
        >
          <Field label="Môi trường">
            <Select value={profileKey} onChange={(event) => setProfileKey(event.target.value)}>
              {Object.values(API_PROFILES).map((profile) => (
                <option key={profile.key} value={profile.key}>
                  {profile.label}
                </option>
              ))}
            </Select>
          </Field>

          <div className="rounded-2xl border border-[#eadbcc] bg-[#fbf5ee] px-4 py-3">
            <p className="text-sm font-semibold text-[#4f433b]">{API_PROFILES[profileKey].label}</p>
            <p className="mt-1 text-sm text-[var(--hr-muted)]">{API_PROFILES[profileKey].description}</p>
            <p className="mt-1 text-xs text-[#8c7b6c]">{API_PROFILES[profileKey].baseUrl}</p>
          </div>

          <Field label="Tên đăng nhập">
            <Input value={username} onChange={(event) => setUsername(event.target.value)} />
          </Field>
          <Field label="Mật khẩu">
            <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </Field>

          {error ? <p className="rounded-2xl bg-[#f3d9d2] px-4 py-3 text-sm text-[#8a3828]">{error}</p> : null}

          <Button type="submit" variant="accent" loading={pending} className="w-full">
            Đăng nhập
          </Button>
        </form>
      </div>
    </div>
  );
}
