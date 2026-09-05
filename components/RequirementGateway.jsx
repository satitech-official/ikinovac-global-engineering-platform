'use client';

import Link from 'next/link';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const assetUrl = path => `${basePath}${path}`;

const paths = [
  {
    number: '01',
    title: 'Industrial Products',
    copy: 'Explore industrial product families for critical applications.',
    action: 'Explore products',
    href: '/products',
    image: '/assets/industry/valves.jpg',
    alt: 'Industrial valves for critical applications'
  },
  {
    number: '02',
    title: 'Global Sourcing',
    copy: "Source products and equipment through IKINOVAC's global supply network.",
    action: 'Explore sourcing',
    href: '/solutions#solution-02',
    image: '/assets/industry/procurement.jpg',
    alt: 'Industrial procurement and sourcing operation'
  },
  {
    number: '03',
    title: 'Project Requirement',
    copy: 'Have a specific requirement? Send the essentials and connect directly with our project desk.',
    action: 'Send requirement',
    href: '/contact',
    image: '/assets/industry/refining.jpg',
    alt: 'Industrial engineering project facility'
  }
];

export default function RequirementGateway() {
  return <section className="requirement-gateway" data-reveal>
    <span className="requirement-gateway-ghost" aria-hidden="true">01</span>
    <div className="requirement-gateway-heading reveal-up">
      <p className="eyebrow">01 / Start with your requirement</p>
      <h2>One requirement.<br />One global partner.</h2>
      <p>From industrial product supply to global sourcing and project support, IKINOVAC helps move your requirement from enquiry to delivery.</p>
    </div>
    <div className="requirement-gateway-cards reveal-clip">
      {paths.map(path => <Link className="requirement-gateway-card" href={path.href} key={path.number}>
        <div className="requirement-gateway-image" style={{ backgroundImage: `url(${assetUrl(path.image)})` }} role="img" aria-label={path.alt} />
        <div className="requirement-gateway-copy">
          <b>{path.number}</b>
          <h3>{path.title}</h3>
          <p>{path.copy}</p>
          <span>{path.action} <i>→</i></span>
        </div>
      </Link>)}
    </div>
  </section>;
}
