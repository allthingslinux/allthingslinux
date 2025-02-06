import { getPageMetadata } from './metadata';
import HomePage from '@/components/pages/home';
import { viewport } from './metadata';

export { viewport };
export const metadata = getPageMetadata('home');

export default function Home() {
  return <HomePage />;
}
