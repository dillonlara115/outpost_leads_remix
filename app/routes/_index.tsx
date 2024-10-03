import { useAuth } from '~/context/AuthContext';
import BusinessList from "~/components/BusinessList";
import Signup from '~/components/signup';

export default function Index() {
  const { user } = useAuth();

  if (user) {
    return <BusinessList />;
  }

  return <Signup />;
}