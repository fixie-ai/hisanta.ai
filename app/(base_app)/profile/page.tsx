import { Profile } from '../../components/Profile';
import { AuthProvider } from '../../components/AuthProvider';

export const runtime = 'edge';

export default async function Page() {
  return (
    <AuthProvider>
      <Profile />
    </AuthProvider>
  );
}
