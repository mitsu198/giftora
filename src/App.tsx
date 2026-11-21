import { useState } from 'react'
import { ArrowUpRight, Bell, ChevronRight, Compass, Gift, Gem, Heart, House, Search, Sparkles, Wallet, UserRound } from 'lucide-react'

type GiftItem = { name: string; series: string; price: string; emoji: string; tone: string; tag?: string }
const gifts: GiftItem[] = [
  { name: 'Plush Pepe', series: 'Rare collectible', price: '฿ 245', emoji: '🐸', tone: 'mint', tag: 'HOT' },
  { name: 'Durov’s Cap', series: 'Limited gift', price: '฿ 180', emoji: '🧢', tone: 'blue' },
  { name: 'Precious Peach', series: 'Collectible gift', price: '฿ 320', emoji: '🍑', tone: 'peach', tag: 'RARE' },
  { name: 'Vintage Cigar', series: 'Classic collection', price: '฿ 95', emoji: '🚬', tone: 'gold' },
  { name: 'Eternal Rose', series: 'Collectible gift', price: '฿ 410', emoji: '🌹', tone: 'rose' },
  { name: 'Toy Bear', series: 'Classic collection', price: '฿ 125', emoji: '🧸', tone: 'lavender' },
]
const tabs = [{ label: 'Главная', icon: House }, { label: 'Каталог', icon: Compass }, { label: 'Избранное', icon: Heart }, { label: 'Профиль', icon: UserRound }]

export default function App() {
  const [active, setActive] = useState('Главная')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('Все')
  const shown = gifts.filter(g => (g.name.toLowerCase().includes(query.toLowerCase())) && (filter === 'Все' || g.series.toLowerCase().includes(filter.toLowerCase())))
  return <main className="app-shell">
    <div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <header className="topbar">
      <a className="brand" href="#"><span className="brand-mark"><Gift size={19}/></span><span>giftora<span className="brand-dot">.</span></span></a>
      <div className="top-actions"><button className="icon-button" aria-label="Уведомления"><Bell size={18}/><i /></button><button className="wallet-button"><Wallet size={16}/> Подключить</button></div>
    </header>

    <section className="hero glass-panel">
      <div className="hero-copy"><div className="eyebrow"><Sparkles size={13}/> DIGITAL GIFTS UNIVERSE</div>
        <h1>Подарки,<br/><span>которые имеют</span><br/><em>значение.</em></h1>
        <p>Открывай коллекционные подарки Telegram, собирай редкие экземпляры и находи свою уникальную коллекцию.</p>
        <button className="primary-button" onClick={() => setActive('Каталог')}>Исследовать каталог <ArrowUpRight size={17}/></button>
      </div>
      <div className="hero-art"><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="hero-glow"/><div className="hero-gift">🎁</div><div className="float-chip chip-top"><Sparkles size={13}/> limited edition</div><div className="float-chip chip-bottom">✦  коллекционируй редкое</div></div>
      <div className="hero-index">01 <span/> 03</div>
    </section>

    <section className="stats-row">
      <div className="stat-card glass-panel"><span className="stat-icon purple"><Gift size={17}/></span><div><strong>1,240+</strong><small>Подарков в каталоге</small></div></div>
      <div className="stat-card glass-panel"><span className="stat-icon pink"><Gem size={17}/></span><div><strong>8.6K</strong><small>Коллекционеров</small></div></div>
      <div className="stat-card glass-panel"><span className="stat-icon gold"><Sparkles size={17}/></span><div><strong>126</strong><small>Редких находок</small></div></div>
    </section>

    <section className="catalog-section">
      <div className="section-heading"><div><div className="eyebrow">CURATED FOR YOU</div><h2>Популярные подарки</h2></div><button className="text-link" onClick={() => setActive('Каталог')}>Весь каталог <ChevronRight size={16}/></button></div>
      <div className="catalog-tools"><div className="search-box"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Найти подарок..."/></div><div className="filters">{['Все','Rare','Classic'].map(f => <button key={f} className={filter === f ? 'filter active' : 'filter'} onClick={() => setFilter(f)}>{f}</button>)}</div></div>
      <div className="gift-grid">{shown.map((g) => <article className="gift-card glass-panel" key={g.name}><div className={'gift-visual '+g.tone}><div className="visual-shine"/><span className="gift-emoji">{g.emoji}</span>{g.tag && <span className="gift-tag">{g.tag}</span>}<button className="heart-button" aria-label="В избранное"><Heart size={15}/></button></div><div className="gift-info"><div><h3>{g.name}</h3><p>{g.series}</p></div><strong>{g.price}</strong></div></article>)}</div>
      {shown.length === 0 && <div className="empty-state">Ничего не найдено. Попробуй другой запрос.</div>}
    </section>
    <section className="bottom-promo glass-panel"><div className="promo-icon">💎</div><div><strong>Твоя коллекция начинается здесь</strong><p>Подключи TON-кошелёк, чтобы подготовить профиль коллекционера.</p></div><ChevronRight size={19}/></section>
    <nav className="bottom-nav">{tabs.map(({label, icon: Icon}) => <button key={label} className={active === label ? 'nav-item selected' : 'nav-item'} onClick={() => setActive(label)}><Icon size={19}/><span>{label}</span></button>)}</nav>
    <footer>GIFTORA <span>•</span> DIGITAL GIFTS ECOSYSTEM <span className="testnet-label">TESTNET PREVIEW</span></footer>
  </main>
}