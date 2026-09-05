import Link from 'next/link';

export default function ProductComparePage() {
  return <section className="compare-page compare-empty"><p className="eyebrow">PRODUCT DIRECTORY</p><h1>Explore the<br /><em>right product family.</em></h1><p>IKINOVAC keeps the directory focused on discovery and direct technical enquiries. Open a product family to review its information and send a requirement to the project desk.</p><Link href="/products" className="button button-dark">Explore products <span>→</span></Link></section>;
}
