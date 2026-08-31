const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const basket = [];

window.addEventListener('load', () => setTimeout(() => $('.page-loader').classList.add('done'), 450));
$('#year').textContent = new Date().getFullYear();

const header = $('.site-header');
let lastScrollPosition = window.scrollY;
window.addEventListener('scroll', () => {
  const currentScrollPosition = window.scrollY;
  header.classList.toggle('scrolled', currentScrollPosition > 48);
  const shouldHideHeader = currentScrollPosition > 180 && currentScrollPosition > lastScrollPosition + 8 && !$('.mobile-nav').classList.contains('open');
  header.classList.toggle('header-hidden', shouldHideHeader);
  lastScrollPosition = currentScrollPosition;
}, { passive: true });

const menu = $('.menu-button'); const mobileNav = $('.mobile-nav');
menu.addEventListener('click', () => { const open = mobileNav.classList.toggle('open'); menu.setAttribute('aria-expanded', open); });
$$('.mobile-nav a').forEach(link => link.addEventListener('click', () => { mobileNav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }));

const modal = $('.search-modal'); const searchInput = $('#search-input');
function openSearch() { modal.hidden = false; setTimeout(() => searchInput.focus(), 10); }
function closeSearch() { modal.hidden = true; searchInput.value = ''; renderSearch(''); }
$('.search-trigger').addEventListener('click', openSearch);
window.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); } if (e.key === 'Escape') closeSearch(); });
modal.addEventListener('click', e => { if (e.target === modal) closeSearch(); });
const searchData = [
  { title: 'Valves & Actuation', text: 'Products / flow control systems', target: '#products' },
  { title: 'Piping Products', text: 'Products / pipe and fitting systems', target: '#products' },
  { title: 'Instrumentation', text: 'Products / measurement systems', target: '#products' },
  { title: 'Engineering support', text: 'Capabilities / technical requirements', target: '#engineering' },
  { title: 'Global supply journey', text: 'Procurement / source to delivery', target: '#supply' },
  { title: 'Quality control', text: 'Capabilities / documentation coordination', target: '#quality' },
  { title: 'Request a quote', text: 'RFQ / submit technical requirement', target: '#rfq' }
];
function renderSearch(term) { const results = $('#search-results'); const list = term ? searchData.filter(item => `${item.title} ${item.text}`.toLowerCase().includes(term.toLowerCase())) : searchData.slice(0, 4); results.innerHTML = `<p>${term ? 'SEARCH RESULTS' : 'QUICK ACCESS'}</p>` + (list.length ? list.map(item => `<button data-target="${item.target}">${item.title}<small>${item.text}</small></button>`).join('') : '<p class="empty-search">No matching engineering records.</p>'); $$('#search-results button').forEach(btn => btn.addEventListener('click', () => { $(btn.dataset.target).scrollIntoView({ behavior: 'smooth' }); closeSearch(); })); }
searchInput.addEventListener('input', e => renderSearch(e.target.value)); renderSearch('');

$$('.filter').forEach(button => button.addEventListener('click', () => { $$('.filter').forEach(item => item.classList.remove('active')); button.classList.add('active'); const filter = button.dataset.filter; $$('.product-card').forEach(card => card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter)); }));

const dock = $('.rfq-dock'); const basketItems = $('#basket-items'); const basketCount = $('#basket-toggle b'); const formBasket = $('#form-basket');
function updateBasket() { basketCount.textContent = basket.length; if (!basket.length) { basketItems.innerHTML = '<p>Your RFQ is empty.<br><small>Explore products and add systems to begin.</small></p>'; formBasket.innerHTML = '<span>RFQ BASKET</span><p>No product systems selected yet.</p>'; return; } basketItems.innerHTML = basket.map((item, index) => `<div class="basket-item"><span>${item}</span><button data-remove="${index}" aria-label="Remove ${item}">×</button></div>`).join(''); formBasket.innerHTML = `<span>RFQ BASKET / ${basket.length} ITEM${basket.length > 1 ? 'S' : ''}</span><p>${basket.join(' · ')}</p>`; $$('[data-remove]').forEach(btn => btn.addEventListener('click', () => { basket.splice(Number(btn.dataset.remove), 1); updateBasket(); })); }
function toast(message) { const node = $('.toast'); node.textContent = message; node.classList.add('show'); setTimeout(() => node.classList.remove('show'), 2800); }
$$('.add-rfq').forEach(button => button.addEventListener('click', () => { const product = button.dataset.product; if (!basket.includes(product)) { basket.push(product); toast(`${product} added to your RFQ.`); } else toast('This product system is already in your RFQ.'); updateBasket(); }));
$('#basket-toggle').addEventListener('click', () => dock.classList.toggle('open')); $('.basket-close').addEventListener('click', () => dock.classList.remove('open')); $('.basket-cta').addEventListener('click', () => dock.classList.remove('open')); updateBasket();

$('#rfq-form').addEventListener('submit', event => { event.preventDefault(); const data = new FormData(event.currentTarget); const reference = `IKG-${String(Date.now()).slice(-7)}`; const entries = { company: data.get('company'), email: data.get('email'), requirement: data.get('requirement'), products: basket, reference, date: new Date().toISOString() }; localStorage.setItem('ikinovac-rfq-draft', JSON.stringify(entries)); event.currentTarget.reset(); basket.splice(0); updateBasket(); toast(`Requirement transmitted. Reference ${reference}`); });

const values = {
  integrity: { number: '01', kicker: 'CORE PRINCIPLE / 01', title: 'INTEGRITY,<br><span>ENGINEERED IN.</span>', description: 'We build technical and commercial relationships on transparent communication, accountable coordination and respect for every commitment.', stage: 'FOUNDATION / EVERY PROJECT' },
  engineering: { number: '02', kicker: 'CORE PRINCIPLE / 02', title: 'ENGINEERING<br><span>EXCELLENCE.</span>', description: 'We approach requirements with technical discipline, practical product understanding and a focus on the details that influence project outcomes.', stage: 'TECHNICAL / EVERY REQUIREMENT' },
  innovation: { number: '03', kicker: 'CORE PRINCIPLE / 03', title: 'THINK FORWARD.<br><span>STAY PRECISE.</span>', description: 'We keep exploring stronger ways to connect engineering insight, sourcing intelligence and responsive industrial support.', stage: 'PROGRESS / EVERY SOLUTION' },
  customer: { number: '04', kicker: 'CORE PRINCIPLE / 04', title: 'YOUR PROJECT.<br><span>IN CLEAR FOCUS.</span>', description: 'We structure support around the actual application, scope, timeline and information needed for a confident decision.', stage: 'PARTNERSHIP / EVERY CONVERSATION' },
  quality: { number: '05', kicker: 'CORE PRINCIPLE / 05', title: 'QUALITY THAT<br><span>TRAVELS WITH IT.</span>', description: 'Quality requirements, documentation and inspection coordination are considered from the first technical conversation.', stage: 'ASSURANCE / EVERY WORKFLOW' },
  sustainability: { number: '06', kicker: 'CORE PRINCIPLE / 06', title: 'RESPONSIBLE<br><span>BY DESIGN.</span>', description: 'We believe disciplined engineering, efficient sourcing and considered delivery choices create more responsible industrial outcomes.', stage: 'RESPONSIBILITY / EVERY DECISION' },
  collaboration: { number: '07', kicker: 'CORE PRINCIPLE / 07', title: 'ONE NETWORK.<br><span>SHARED PURPOSE.</span>', description: 'We bring engineering, commercial and supply perspectives together to make complex industrial requirements easier to progress.', stage: 'CONNECTION / GLOBAL CONTEXT' },
  improvement: { number: '08', kicker: 'CORE PRINCIPLE / 08', title: 'ALWAYS<br><span>MOVING FORWARD.</span>', description: 'We learn from every requirement and keep refining the way we support industrial customers and their projects.', stage: 'MOMENTUM / LONG-TERM PARTNERSHIP' }
};
const valuesConsole = $('.values-console');
if (valuesConsole) {
  const valueTabs = $$('.value-tab', valuesConsole);
  const selectValue = key => {
    const value = values[key]; if (!value) return;
    valuesConsole.dataset.active = key;
    valueTabs.forEach(tab => { const active = tab.dataset.value === key; tab.classList.toggle('active', active); tab.setAttribute('aria-selected', String(active)); });
    $('.value-detail-number', valuesConsole).textContent = value.number;
    $('#value-kicker', valuesConsole).textContent = value.kicker;
    $('#value-title', valuesConsole).innerHTML = value.title;
    $('#value-description', valuesConsole).textContent = value.description;
    $('#value-stage', valuesConsole).textContent = value.stage;
  };
  valueTabs.forEach(tab => { tab.addEventListener('click', () => selectValue(tab.dataset.value)); tab.addEventListener('keydown', event => { const index = valueTabs.indexOf(tab); if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); valueTabs[(index + 1) % valueTabs.length].focus(); } if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); valueTabs[(index - 1 + valueTabs.length) % valueTabs.length].focus(); } }); });
}

if (window.matchMedia('(pointer:fine)').matches) { const dot = $('.cursor-dot'); const ring = $('.cursor-ring'); window.addEventListener('mousemove', e => { dot.style.left = ring.style.left = `${e.clientX}px`; dot.style.top = ring.style.top = `${e.clientY}px`; }); $$('a,button,.industry-card,.product-card').forEach(el => { el.addEventListener('mouseenter', () => ring.classList.add('large')); el.addEventListener('mouseleave', () => ring.classList.remove('large')); }); $$('.magnetic').forEach(card => card.addEventListener('mousemove', e => { const rect = card.getBoundingClientRect(); const x = (e.clientX - rect.left) / rect.width - .5; const y = (e.clientY - rect.top) / rect.height - .5; card.style.transform = `translate(${x * 5}px, ${y * 5}px)`; })); $$('.magnetic').forEach(card => card.addEventListener('mouseleave', () => card.style.transform = '')); }
