import Link from 'next/link';
import { insights, resources } from '@/lib/content';

export default function KnowledgePreview() {
  return <section className="knowledge-preview" data-reveal><div className="knowledge-resources reveal-up"><p className="eyebrow">09 / TECHNICAL RESOURCES</p><h2>THE CONTEXT<br /><em>BEHIND THE REQUEST.</em></h2>{resources.slice(0, 3).map(resource => <Link href={`/contact?resource=${encodeURIComponent(resource.title)}`} key={resource.number}><b>{resource.number}</b><span>{resource.title}</span><i>→</i></Link>)}<Link className="text-arrow" href="/resources">Visit resource desk <span>→</span></Link></div><div className="knowledge-insights reveal-clip"><p className="eyebrow light">10 / ENGINEERING KNOWLEDGE HUB</p><h2>BUILT FOR<br /><em>BETTER QUESTIONS.</em></h2>{insights.slice(0, 3).map(article => <article key={article.slug}><b>{article.category}</b><h3>{article.title}</h3><p>{article.description}</p></article>)}<Link className="button button-gold" href="/insights">Explore the hub <span>→</span></Link></div></section>;
}
