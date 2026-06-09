import { Redirect } from 'expo-router';
import { isSignedIn } from '../src/storage/session.web';

export default function Index() {
  if (!isSignedIn()) {
    return <Redirect href="/login" />;
  }
  return <Redirect href="/explore" />;
}
