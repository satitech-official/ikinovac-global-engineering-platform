import PublicPage from '@/components/PublicPage';
import { ResourcesPage } from '@/components/ContentPages';
export const metadata = { title: 'Resources', description: 'Request company information, line cards and industrial product documents.' };
export default function Page() { return <PublicPage><ResourcesPage /></PublicPage>; }
