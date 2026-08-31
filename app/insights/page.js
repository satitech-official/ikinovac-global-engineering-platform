import PublicPage from '@/components/PublicPage';
import InsightsPage from '@/components/InsightsPage';

export const metadata = { title: 'Engineering Knowledge Hub', description: 'CMS-ready engineering and procurement knowledge resources from IKINOVAC Global.' };
export default function Page() { return <PublicPage><InsightsPage /></PublicPage>; }
