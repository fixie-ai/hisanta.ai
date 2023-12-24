import { Profile } from '../../components/Profile';

export default async function Page({ params }: { params: { character: string } }) {
  return <Profile />;
}
