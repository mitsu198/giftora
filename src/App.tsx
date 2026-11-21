import { useState } from 'react'
import { ArrowUpRight, Bell, ChevronRight, Compass, Gift, Gem, Heart, House, Search, Sparkles, UserRound } from 'lucide-react'
import WalletConnect from './WalletConnect'
import TelegramBridge from './TelegramBridge'

type GiftItem = { name: string; series: string; price: string; emoji: string; tone: string; tag?: string }
const gifts: GiftItem[] = [
  { name: 'Plush Pepe', series: 'Rare collectible', price: '245 TON*', emoji: '🐸', tone: 'mint', tag: 'HOT' },
  { name: 'Durov’s Cap', series: 'Limited gift', price: '180 TON*', emoji: '🧢', tone: 'blue' },
  { name: 'Precious Peach', series: 'Collectible gift', price: '320 TON*', emoji: '🍑', tone: 'peach', tag: 'RARE' },
  { name: 'Vintage Cigar', series: 'Classic collection', price: '95 TON*', emoji: '🚬', tone: 'gold' },
  { name: 'Eternal Rose', series: 'Collectible gift', price: '410 TON*', emoji: '🌹', tone: 'rose' },
  { name: 'Toy Bear', series: 'Classic collection', price: '125 TON*', emoji: '🧸', tone: 'lavender' },
]
const tabs = [{ label: 'Главная', icon: House }, { label: 'Каталог', icon: Compass }, { label: 'Избранное', icon: Heart }, { label: 'Профиль', icon: UserRound }]

export default function App() {
  const [active, setActive] = useState('Главная')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('Все')
  const [favorites, setFavorites] = useState<string[]>(() => {\n    try { return JSON.parse(localStorage.getItem('giftora:favorites') || '[]') as string[] } catch { return [] }\n  })
  const shown = gifts.filter(g =>
    g.name.toLowerCase().includes(query.toLowerCase()) &&
    (filter === 'Все' || g.series.toLowerCase().includes(filter.toLowerCase())) &&
    (active !== 'Избранное' || favorites.includes(g.name))
  )
  const toggleFavorite = (name: string) => setFavorites(current =>
    current.includes(name) ? current.filter(item => item !== name) : [...current, name]
  )
  return <main className="app-shell">
    <div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <header className="topbar">
      <a className="brand" href="#"><span className="brand-mark"><Gift size={19}/></span><span>giftora<span className="brand-dot">.</span></span></a>
      <div className="top-actions"><TelegramBridge /><button className="icon-button" aria-label="Уведомления"><Bell size={18}/><i /></button><WalletConnect /></div>
    </header>

    <section className="hero glass-panel" hidden={active !== "Главная"}>
      <div className="hero-copy"><div className="eyebrow"><Sparkles size={13}/> DIGITAL GIFTS UNIVERSE</div>
        <h1>Подарки,<br/><span>которые имеют</span><br/><em>значение.</em></h1>
        <p>Открывай коллекционные подарки Telegram, собирай редкие экземпляры и находи свою уникальную коллекцию.</p>
        <button className="primary-button" onClick={() => setActive('Каталог')}>Исследовать каталог <ArrowUpRight size={17}/></button>
      </div>
      <div className="hero-art"><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="hero-glow"/><div className="hero-gift">🎁</div><div className="float-chip chip-top"><Sparkles size={13}/> limited edition</div><div className="float-chip chip-bottom">✦  коллекционируй редкое</div></div>
      <div className="hero-index">01 <span/> 03</div>
    </section>

    <section className="stats-row" hidden={active !== "Главная"}>
      <div className="stat-card glass-panel"><span className="stat-icon purple"><Gift size={17}/></span><div><strong>1,240+</strong><small>Подарков в каталоге</small></div></div>
      <div className="stat-card glass-panel"><span className="stat-icon pink"><Gem size={17}/></span><div><strong>8.6K</strong><small>Коллекционеров</small></div></div>
      <div className="stat-card glass-panel"><span className="stat-icon gold"><Sparkles size={17}/></span><div><strong>126</strong><small>Редких находок</small></div></div>
    </section>

    <section className="catalog-section" hidden={active === "Профиль"}>
      <div className="section-heading"><div><div className="eyebrow">DEMO CATALOG · NOT LIVE LISTINGS</div><h2>{active === "Каталог" ? "Каталог подарков" : active === "Избранное" ? "Избранное" : "Популярные подарки"}</h2></div><button className="text-link" onClick={() => setActive('Каталог')}>Весь каталог <ChevronRight size={16}/></button></div>
      <div className="catalog-tools"><div className="search-box"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Найти подарок..."/></div><div className="filters">{['Все','Rare','Classic'].map(f => <button key={f} className={filter === f ? 'filter active' : 'filter'} onClick={() => setFilter(f)}>{f}</button>)}</div></div>
      <div className="gift-grid">{shown.map((g) => <article className="gift-card glass-panel" key={g.name}><div className={'gift-visual '+g.tone}><div className="visual-shine"/><span className="gift-emoji">{g.emoji}</span>{g.tag && <span className="gift-tag">{g.tag}</span>}<button className={favorites.includes(g.name) ? "heart-button is-favorite" : "heart-button"} aria-label={favorites.includes(g.name) ? "Убрать из избранного" : "В избранное"} aria-pressed={favorites.includes(g.name)} onClick={() => toggleFavorite(g.name)}><Heart size={15} fill={favorites.includes(g.name) ? "currentColor" : "none"}/></button></div><div className="gift-info"><div><h3>{g.name}</h3><p>{g.series}</p></div><strong>{g.price}</strong></div></article>)}</div>
      {shown.length === 0 && <div className="empty-state">{active === "Избранное" && favorites.length === 0 ? "Пока нет избранных подарков. Добавь подарок нажатием на сердечко." : "Ничего не найдено. Попробуй другой запрос."}</div>}
    </section>
    <section className="profile-section glass-panel" hidden={active !== "Профиль"}><div className="profile-avatar">✦</div><div className="eyebrow">COLLECTOR PROFILE</div><h2>Твой профиль GIFTORA</h2><p>Подключи TON-кошелёк, чтобы подготовить свою коллекцию. Подключение кошелька само по себе не подтверждает владение подарками.</p><div className="profile-stats"><div><strong>{favorites.length}</strong><span>Избранное</span></div><div><strong>0</strong><span>Коллекционных подарков</span></div></div></section>
    <section className="bottom-promo glass-panel" hidden={active === "Профиль"}><div className="promo-icon">💎</div><div><strong>Твоя коллекция начинается здесь</strong><p>Подключи TON-кошелёк, чтобы подготовить профиль коллекционера.</p></div><ChevronRight size={19}/></section>
    <nav className="bottom-nav">{tabs.map(({label, icon: Icon}) => <button key={label} className={active === label ? 'nav-item selected' : 'nav-item'} onClick={() => setActive(label)}><Icon size={19}/><span>{label}</span></button>)}</nav>
    <footer>GIFTORA <span>•</span> DIGITAL GIFTS ECOSYSTEM <span className="testnet-label">TESTNET PREVIEW</span></footer>
  </main>
}