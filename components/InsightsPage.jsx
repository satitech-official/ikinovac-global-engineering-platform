import Link from 'next/link';
import { insights } from '@/lib/content';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function InsightsPage() {
  return <><section className="insights-hero" style={{ backgroundImage: `linear-gradient(100deg,rgba(9,28,23,.96),rgba(18,51,41,.82),rgba(38,59,51,.38)),url(${basePath}/assets/industry/instrumentation.jpg)` }}><p className="eyebrow light">ENGINEERING KNOWLEDGE HUB / CMS-READY</p><h1>BETTER<br /><em>QUESTIONS.</em><br />CLEARER BRIEFS.</h1><p>A structured home for verified IKINOVAC engineering and procurement resources. Educational articles remain CMS-ready until content is approved.</p></section><section className="insights-grid">{insights.map((article, index) => <article key={article.slug}><b>{String(index + 1).padStart(2, '0')} / {article.category}</b><h2>{article.title}</h2><p>{article.description}</p><Link href={`/contact?insight=${encodeURIComponent(article.title)}`}>Discuss with the project desk <span>→</span></Link></article>)}</section><section className="insights-cta"><p className="eyebrow">NEED A VERIFIED ANSWER?</p><h2>Bring the requirement.<br /><em>We&apos;ll start with the detail.</em></h2><Link href="/contact" className="button button-dark">Start a technical RFQ <span>→</span></Link></section></>;
}
