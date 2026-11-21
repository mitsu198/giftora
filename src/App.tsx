import { useMemo, useState } from 'react'
import { ArrowRight, Bell, Check, ChevronRight, CircleHelp, Gift, Gem, Heart, House, Layers3, Search, Sparkles, UserRound, X } from 'lucide-react'
import WalletConnect from './WalletConnect'
import TelegramBridge from './TelegramBridge'

type GiftItem = { name: string; series: string; price: string; emoji: string; tone: string; tag?: string }
type CaseItem = { id: string; name: string; description: string; cost: number; accent: string; icon: string; prizes: { label: string; weight: number }[]; featured?: boolean }
const gifts: GiftItem[] = [
  { name: 'Plush Pepe', series: 'Rare collectible', price: '245 TON*', emoji: '🐸', tone: 'mint', tag: 'HOT' },
  { name: 'Durov’s Cap', series: 'Limited gift', price: '180 TON*', emoji: '🧢', tone: 'blue' },
  { name: 'Precious Peach', series: 'Collectible gift', price: '320 TON*', emoji: '🍑', tone: 'peach', tag: 'RARE' },
  { name: 'Vintage Cigar', series: 'Classic collection', price: '95 TON*', emoji: '🚬', tone: 'gold' },
  { name: 'Eternal Rose', series: 'Collectible gift', price: '410 TON*', emoji: '🌹', tone: 'rose' },
  { name: 'Toy Bear', series: 'Classic collection', price: '125 TON*', emoji: '🧸', tone: 'lavender' },
]
const cases: CaseItem[] = [
  { id: 'free', name: 'Первый подарок', description: 'Бесплатный старт каждый день', cost: 0, accent: 'case-free', icon: '🎁', featured: true, prizes: [{ label: '1 ⭐', weight: 100 }] },
  { id: 'mini', name: 'Мини-кейс', description: 'Небольшой шанс на x2', cost: 5, accent: 'case-mint', icon: '🪄', prizes: [{ label: '1 ⭐', weight: 60 }, { label: '3 ⭐', weight: 25 }, { label: '5 ⭐', weight: 10 }, { label: '10 ⭐', weight: 5 }] },
  { id: 'lilac', name: 'Лиловый', description: 'Больше звёзд — больше эмоций', cost: 10, accent: 'case-lilac', icon: '💜', prizes: [{ label: '3 ⭐', weight: 50 }, { label: '8 ⭐', weight: 30 }, { label: '15 ⭐', weight: 15 }, { label: '30 ⭐', weight: 5 }] },
  { id: 'shine', name: 'Сияние', description: 'Кейс для смелых коллекционеров', cost: 20, accent: 'case-pink', icon: '✨', prizes: [{ label: '10 ⭐', weight: 50 }, { label: '20 ⭐', weight: 30 }, { label: '40 ⭐', weight: 15 }, { label: '100 ⭐', weight: 5 }] },
  { id: 'royal', name: 'Королевский', description: 'Самые крупные множители', cost: 35, accent: 'case-gold', icon: '👑', prizes: [{ label: '15 ⭐', weight: 55 }, { label: '35 ⭐', weight: 25 }, { label: '70 ⭐', weight: 15 }, { label: '200 ⭐', weight: 5 }] },
]
const tabs = [{ label: 'Главная', icon: House }, { label: 'Кейсы', icon: Gift }, { label: 'Каталог', icon: Layers3 }, { label: 'Профиль', icon: UserRound }]
const todayKey = () => new Date().toISOString().slice(0, 10)
const loadBalance = () => { try { return Number(localStorage.getItem('giftora:demo-stars') ?? 25) } catch { return 25 } }

export default function App() {
  const [active, setActive] = useState('Главная')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('Все')
  const [favorites, setFavorites] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('giftora:favorites') || '[]') as string[] } catch { return [] } })
  const [balance, setBalance] = useState(loadBalance)
  const [openedCase, setOpenedCase] = useState<CaseItem | null>(null)
  const [opening, setOpening] = useState(false)
  const [lastReward, setLastReward] = useState<string | null>(null)
  const [freeOpened, setFreeOpened] = useState(() => { try { return localStorage.getItem('giftora:free-date') === todayKey() } catch { return false } })
  const [history, setHistory] = useState<string[]>([])
  const shown = useMemo(() => gifts.filter(g => g.name.toLowerCase().includes(query.toLowerCase()) && (filter === 'Все' || g.series.toLowerCase().includes(filter.toLowerCase()))), [query, filter])
  const toggleFavorite = (name: string) => setFavorites(current => { const updated = current.includes(name) ? current.filter(item => item !== name) : [...current, name]; localStorage.setItem('giftora:favorites', JSON.stringify(updated)); return updated })
  const openCase = (item: CaseItem) => { setOpenedCase(item); setLastReward(null) }
  const spinCase = () => {
    if (!openedCase || opening || (openedCase.id === 'free' && freeOpened) || balance < openedCase.cost) return
    setOpening(true)
    window.setTimeout(() => {
      const roll = Math.random() * 100
      let cursor = 0
      const reward = openedCase.prizes.find(p => { cursor += p.weight; return roll < cursor }) ?? openedCase.prizes[openedCase.prizes.length - 1]
      const amount = Number(reward.label.replace(/[^0-9]/g, ''))
      const nextBalance = balance - openedCase.cost + amount
      setBalance(nextBalance); localStorage.setItem('giftora:demo-stars', String(nextBalance))
      if (openedCase.id === 'free') { setFreeOpened(true); localStorage.setItem('giftora:free-date', todayKey()) }
      setLastReward(reward.label); setHistory(current => [openedCase.name + ' · ' + reward.label, ...current].slice(0, 5)); setOpening(false)
    }, 1350)
  }
  return <main className="app-shell">
    <div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <header className="topbar">
      <a className="brand" href="#"><span className="brand-mark"><Gift size={19}/></span><span>giftora<span className="brand-dot">.</span></span></a>
      <div className="top-actions"><TelegramBridge /><div className="stars-balance"><span>⭐</span><strong>{balance}</strong></div><button className="icon-button" aria-label="Уведомления"><Bell size={18}/><i /></button><WalletConnect /></div>
    </header>

    <section className="hero glass-panel" hidden={active !== 'Главная'}>
      <div className="hero-copy"><div className="eyebrow"><Sparkles size={13}/> DIGITAL GIFTS UNIVERSE</div>
        <h1>Открывай.<br/><span>Собирай эмоции.</span><br/><em>Лови редкое.</em></h1>
        <p>Мир цифровых подарков, ярких кейсов и уникальных коллекций в одном месте.</p>
        <button className="primary-button" onClick={() => setActive('Кейсы')}>Открыть кейсы <ArrowRight size={17}/></button>
      </div>
      <div className="hero-art"><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="hero-glow"/><div className="hero-gift">🎁</div><div className="float-chip chip-top"><Sparkles size={13}/> special drops</div><div className="float-chip chip-bottom">✦ коллекционируй редкое</div></div>
      <div className="hero-index">01 <span/> 03</div>
    </section>

    <section className="stats-row" hidden={active !== 'Главная'}>
      <div className="stat-card glass-panel"><span className="stat-icon purple"><Gift size={17}/></span><div><strong>5 кейсов</strong><small>Уже доступны</small></div></div>
      <div className="stat-card glass-panel"><span className="stat-icon pink"><Gem size={17}/></span><div><strong>6 подарков</strong><small>В витрине</small></div></div>
      <div className="stat-card glass-panel"><span className="stat-icon gold"><Sparkles size={17}/></span><div><strong>Каждый день</strong><small>Новый бесплатный кейс</small></div></div>
    </section>

    <section className="cases-section" hidden={active !== 'Кейсы'}>
      <div className="section-heading"><div><div className="eyebrow">GIFTORA DROP ZONE</div><h2>Выбери свой кейс</h2></div><div className="case-balance">⭐ {balance}</div></div>
      <p className="cases-intro">Открывай кейсы, собирай звёзды и пробуй удачу. Бесплатный кейс доступен раз в день.</p>
      <div className="case-grid">{cases.map(item => <article className={'case-card glass-panel ' + item.accent} key={item.id}>
        <div className="case-art"><div className="case-aura"/><span className="case-emoji">{item.icon}</span><div className="case-spark spark-a">✦</div><div className="case-spark spark-b">✧</div>{item.featured && <span className="case-ribbon">FREE DROP</span>}</div>
        <div className="case-details"><div className="case-title-row"><h3>{item.name}</h3>{item.cost === 0 ? <span className="free-pill">FREE</span> : <span className="case-cost">⭐ {item.cost}</span>}</div><p>{item.description}</p>
          <div className="case-preview">{gifts.slice(0, 4).map((g, i) => <span className={'preview-gift preview-' + i} key={g.name}>{g.emoji}</span>)}</div>
          <div className="case-prize-line"><span>{item.id === 'free' ? 'Гарантированная награда' : 'Награды и шансы'}</span><strong>{item.id === 'free' ? '1 ⭐' : item.prizes.map(p => p.label).join(' · ')}</strong></div>
          <button className="case-open-button" onClick={() => openCase(item)} disabled={item.id === 'free' && freeOpened}>{item.id === 'free' && freeOpened ? 'Уже открыто сегодня' : 'Открыть кейс'} <ArrowRight size={15}/></button>
        </div>
      </article>)}</div>
      <div className="demo-note"><CircleHelp size={15}/><span>Тестовый режим: баланс и открытия сохраняются только на этом устройстве. Реальные платежи и выдача NFT пока не подключены.</span></div>
      {history.length > 0 && <div className="case-history"><h3>Последние открытия</h3>{history.map((h, i) => <div key={i}><span>🎉 {h}</span><Check size={14}/></div>)}</div>}
    </section>

    <section className="catalog-section" hidden={active !== 'Каталог'}>
      <div className="section-heading"><div><div className="eyebrow">COLLECTIBLE SHOWCASE</div><h2>Витрина подарков</h2></div></div>
      <div className="catalog-tools"><div className="search-box"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Найти подарок..."/></div><div className="filters">{['Все','Rare','Classic'].map(f => <button key={f} className={filter === f ? 'filter active' : 'filter'} onClick={() => setFilter(f)}>{f}</button>)}</div></div>
      <div className="gift-grid">{shown.map(g => <article className="gift-card glass-panel" key={g.name}><div className={'gift-visual '+g.tone}><div className="visual-shine"/><span className="gift-emoji">{g.emoji}</span>{g.tag && <span className="gift-tag">{g.tag}</span>}<button className={favorites.includes(g.name) ? 'heart-button is-favorite' : 'heart-button'} aria-label="Избранное" onClick={() => toggleFavorite(g.name)}><Heart size={15} fill={favorites.includes(g.name) ? 'currentColor' : 'none'}/></button></div><div className="gift-info"><div><h3>{g.name}</h3><p>{g.series}</p></div><strong>{g.price}</strong></div></article>)}</div>
      <p className="demo-note">* Демонстрационные карточки и цены — не реальные предложения о продаже.</p>
    </section>

    <section className="profile-section glass-panel" hidden={active !== 'Профиль'}><div className="profile-avatar">✦</div><div className="eyebrow">COLLECTOR PROFILE</div><h2>Твой профиль GIFTORA</h2><p>Подключи TON-кошелёк, чтобы подготовить свою коллекцию. Подключение кошелька само по себе не подтверждает владение подарками.</p><div className="profile-stats"><div><strong>{balance} ⭐</strong><span>Демо-баланс</span></div><div><strong>{favorites.length}</strong><span>Избранное</span></div></div></section>

    <section className="bottom-promo glass-panel" hidden={active !== 'Главная'}><div className="promo-icon">💎</div><div><strong>Твоя коллекция начинается здесь</strong><p>Загляни в кейсы и найди свой первый дроп.</p></div><ChevronRight size={19}/></section>
    <nav className="bottom-nav">{tabs.map(({label, icon: Icon}) => <button key={label} className={active === label ? 'nav-item selected' : 'nav-item'} onClick={() => setActive(label)}><Icon size={19}/><span>{label}</span></button>)}</nav>
    <footer>GIFTORA <span>•</span> DIGITAL GIFTS ECOSYSTEM <span className="testnet-label">TESTNET PREVIEW</span></footer>

    {openedCase && <div className="case-modal-backdrop" onClick={() => !opening && setOpenedCase(null)}><section className="case-modal glass-panel" onClick={e => e.stopPropagation()}>
      <button className="modal-close" onClick={() => setOpenedCase(null)} disabled={opening}><X size={18}/></button>
      <div className={'modal-case-art ' + openedCase.accent}><div className="case-aura"/><span>{openedCase.icon}</span></div>
      <div className="eyebrow">GIFTORA CASE OPENING</div><h2>{openedCase.name}</h2>
      <p className="modal-subtitle">{lastReward ? 'Поздравляем! Твой результат:' : 'Готов испытать удачу?'}</p>
      <div className={opening ? 'roulette-result spinning' : 'roulette-result'}>{lastReward ? <><span>⭐</span><strong>{lastReward}</strong></> : opening ? <><span>✨</span><strong>Открываем...</strong></> : <><span>{openedCase.icon}</span><strong>?</strong></>}</div>
      {!lastReward && <div className="odds-panel"><div className="odds-title">Шансы выпадения</div>{openedCase.prizes.map(p => <div className="odds-row" key={p.label}><span>{p.label}</span><strong>{p.weight}%</strong><div className="odds-track"><i style={{width: p.weight + '%'}}/></div></div>)}</div>}
      {lastReward ? <button className="case-open-button modal-action" onClick={() => setOpenedCase(null)}>Забрать результат <Check size={16}/></button> : <button className="case-open-button modal-action" disabled={opening || (openedCase.id === 'free' && freeOpened) || balance < openedCase.cost} onClick={spinCase}>{opening ? 'Открываем...' : openedCase.cost === 0 ? 'Открыть бесплатно' : 'Открыть за ⭐ ' + openedCase.cost}</button>}
      {openedCase.cost > balance && !lastReward && <small className="not-enough">Не хватает звёзд для открытия.</small>}
      <small className="modal-demo-caption">Демонстрационное открытие · без списания реальных средств</small>
    </section></div>}
  </main>
}
