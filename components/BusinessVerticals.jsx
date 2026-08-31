import Link from 'next/link';
import { businessVerticals } from '@/lib/content';
import { catalogueCategories } from '@/lib/catalogue';

export default function BusinessVerticals() {
  return <section className="business-verticals" data-reveal><div className="verticals-heading reveal-up"><p className="eyebrow light">02 / CURATED BUSINESS VERTICALS</p><h2>START WITH THE<br /><em>SYSTEM,</em> NOT THE SKU.</h2><p>Explore the connected product groups that usually sit around the same industrial requirement.</p></div><div className="verticals-grid reveal-clip">{businessVerticals.map(vertical => { const categories = vertical.categorySlugs.map(slug => catalogueCategories.find(item => item.slug === slug)).filter(Boolean); return <article key={vertical.name}><p>{vertical.number} / {vertical.name}</p><h3>{vertical.title}</h3><span>{vertical.description}</span><div>{categories.map(category => <Link href={`/products/${category.slug}`} key={category.slug}>{category.name}</Link>)}</div><Link className="vertical-link" href={`/products/${categories[0]?.slug || 'products'}`}>Explore vertical <i>→</i></Link></article>; })}</div></section>;
}
