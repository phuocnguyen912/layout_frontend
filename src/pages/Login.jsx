import { useEffect, useState } from 'react';
import { API_PROFILES } from '../lib/api';
import LoginShell from '../components/layout/LoginShell';
import LoginForm from '../components/ui/login/LoginForm';

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
    <LoginShell>
      <LoginForm
        profileKey={profileKey}
        username={username}
        password={password}
        pending={pending}
        error={error}
        onProfileChange={setProfileKey}
        onUsernameChange={setUsername}
        onPasswordChange={setPassword}
        onSubmit={() => onLogin({ profileKey, username, password })}
      />
    </LoginShell>
  );
}
