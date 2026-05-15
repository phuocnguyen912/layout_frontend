import { API_PROFILES } from '../../../lib/api';
import Alert from '../Alert';
import Button from '../Button';
import Field from '../Field';
import InfoBox from '../InfoBox';
import Input from '../Input';
import Select from '../Select';

export default function LoginForm({
  profileKey,
  username,
  password,
  pending,
  error,
  onProfileChange,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}) {
  return (
    <form
      className="mt-8 space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <Field label="Môi trường">
        <Select value={profileKey} onChange={(event) => onProfileChange(event.target.value)}>
          {Object.values(API_PROFILES).map((profile) => (
            <option key={profile.key} value={profile.key}>
              {profile.label}
            </option>
          ))}
        </Select>
      </Field>

      <InfoBox title={API_PROFILES[profileKey].label}>
        {API_PROFILES[profileKey].description}
      </InfoBox>

      <Field label="Tên đăng nhập">
        <Input value={username} onChange={(event) => onUsernameChange(event.target.value)} />
      </Field>
      <Field label="Mật khẩu">
        <Input type="password" value={password} onChange={(event) => onPasswordChange(event.target.value)} />
      </Field>

      {error && <Alert type="error" message={error} />}

      <Button type="submit" variant="accent" loading={pending} className="w-full">
        Đăng nhập
      </Button>
    </form>
  );
}
