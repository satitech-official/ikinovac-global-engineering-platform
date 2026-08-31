import PublicPage from '@/components/PublicPage';
import { ContactPage } from '@/components/ContentPages';
export const metadata = { title: 'Request a Quote', description: 'Send an IKINOVAC Global industrial product or project requirement.' };
export default function Page() { return <PublicPage><ContactPage /></PublicPage>; }
