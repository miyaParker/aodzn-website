import type { Metadata } from 'next';
import WorksView from '../../components/views/WorksView';

export const metadata: Metadata = {
  title: 'Work — AODZN',
};

export default function Page() {
  return <WorksView />;
}
