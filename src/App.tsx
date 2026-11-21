import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowUpDown, Bell, Check, ChevronRight, Gift, Heart, Home, Layers3, Search, ShieldCheck, Sparkles, Swords, UserRound, Volume2, X, Zap } from 'lucide-react'
import WalletConnect from './WalletConnect'
import TelegramBridge from './TelegramBridge'

type Prize = { name: string; emoji: string; value: number; tone: string; chance: number }
type CaseItem = { id: string; name: string; cost: number; category: string; emoji: string; cover: string; prizes: Prize[]; free?: boolean; fresh?: boolean }
const prize = (name: string, emoji: string, value: number, tone: string, chance: number): Prize => ({name,emoji,value,tone,chance})
const cases: CaseItem[] = [
 {id:'daily',name:'Подарок дня',cost:0,category:'Бесплатные',emoji:'🎁',cover:'cover-daily',free:true,prizes:[prize('1 звезда','⭐',1,'gold',100)]},
 {id:'surprise',name:'Сюрприз',cost:0,category:'Бесплатные',emoji:'🦩',cover:'cover-surprise',free:true,prizes:[prize('1 звезда','⭐',1,'gold',100)]},
 {id:'vice',name:'Вайс-Сити',cost:70,category:'GTA VI',emoji:'🌴',cover:'cover-vice',fresh:true,prizes:[prize('Блеск','💍',140,'pink',35),prize('Шампанское','🍾',210,'gold',25),prize('Сёрф','🏄',350,'blue',20),prize('Роза','🌹',700,'rose',15),prize('Золотой подарок','🎁',1500,'gold',5)]},
 {id:'wanted',name:'Розыск',cost:175,category:'GTA VI',emoji:'💎',cover:'cover-wanted',fresh:true,prizes:[prize('Кольцо','💍',350,'red',35),prize('Бомба-сюрприз','💣',525,'blue',25),prize('Маска','🐵',875,'pink',20),prize('Щит','🛡️',1750,'purple',15),prize('Редкий трофей','🏆',3500,'gold',5)]},
 {id:'starter',name:'На сдачу',cost:5,category:'На сдачу',emoji:'🪙',cover:'cover-starter',prizes:[prize('1 звезда','⭐',1,'gold',55),prize('5 звёзд','⭐',5,'gold',30),prize('10 звёзд','🌟',10,'gold',12),prize('25 звёзд','✨',25,'purple',3)]},
 {id:'lucky',name:'Удача',cost:15,category:'На сдачу',emoji:'🍀',cover:'cover-lucky',prizes:[prize('5 звёзд','⭐',5,'gold',45),prize('15 звёзд','🌟',15,'gold',30),prize('30 звёзд','✨',30,'purple',20),prize('100 звёзд','💎',100,'blue',5)]},
 {id:'resistance',name:'Сопротивление',cost:35,category:'Сопротивление',emoji:'⚡',cover:'cover-resistance',prizes:[prize('15 звёзд','⭐',15,'gold',45),prize('35 звёзд','🌟',35,'gold',30),prize('70 звёзд','💎',70,'blue',20),prize('250 звёзд','👑',250,'gold',5)]},
 {id:'premium',name:'Премиум',cost:75,category:'Сопротивление',emoji:'👑',cover:'cover-premium',prizes:[prize('30 звёзд','⭐',30,'gold',45),prize('75 звёзд','💎',75,'blue',30),prize('150 звёзд','💜',150,'purple',20),prize('500 звёзд','👑',500,'gold',5)]},
]
const nav = [{name:'Игры',icon:Home},{name:'Кейсы',icon:Gift},{name:'Заработок',icon:Zap},{name:'Бонусы',icon:Sparkles}]
const categories = ['Все','GTA VI','На сдачу','Сопротивление']
const showcase = [
 prize('Gem Signet · Sentry Turret','💍',5718,'red',0),
 prize('Bling Binky · Bullet','⚙️',3630,'pink',0),
 prize('Myth Mask · Monkey Heist','🐵',2847,'pink',0),
 prize('Trapped Heart · Crime Scene','🕸️',1844,'purple',0),
 prize('Jolly Chimp · Bank Robber','🐒',1556,'purple',0),
 prize('Surge Board · Golden Siren','🏄',1047,'blue',0),
]
const dateKey = () => new Date().toISOString().slice(0,10)
const readBalance = () => { try { return Number(localStorage.getItem('giftora:demo-stars') ?? 25) } catch { return 25 } }
export default function App() {
 const [tab,setTab]=useState('Кейсы')
 const [category,setCategory]=useState('Все')
 const [selected,setSelected]=useState<CaseItem|null>(null)
 const [balance,setBalance]=useState(readBalance)
 const [freeDone,setFreeDone]=useState(()=>{try{return localStorage.getItem('giftora:free-date')===dateKey()}catch{return false}})
 const [rolling,setRolling]=useState(false)
 const [reward,setReward]=useState<Prize|null>(null)
 const [multiplier,setMultiplier]=useState(1)
 const [history,setHistory]=useState<string[]>([])
 const [favorites,setFavorites]=useState<string[]>([])
 const visible=useMemo(()=>cases.filter(c=>!c.free&&(category==='Все'||c.category===category)),[category])
 const begin=(c:CaseItem)=>{setSelected(c);setReward(null);setMultiplier(1)}
 const roll=()=>{
  if(!selected||rolling|| (selected.free&&freeDone)||balance<selected.cost*multiplier)return
  setRolling(true)
  window.setTimeout(()=>{
   const total=selected.prizes.reduce((s,p)=>s+p.chance,0);let n=Math.random()*total;let result=selected.prizes[selected.prizes.length-1]
   for(const p of selected.prizes){n-=p.chance;if(n<0){result=p;break}}
   const gain=selected.free?1:result.value
   const next=balance-selected.cost*multiplier+gain
   setBalance(next);localStorage.setItem('giftora:demo-stars',String(next))
   if(selected.free){setFreeDone(true);localStorage.setItem('giftora:free-date',dateKey())}
   setReward(result);setHistory(h=>[selected.name+' · '+result.emoji+' '+result.name,...h].slice(0,6));setRolling(false)
  },1550)
 }
 const back=()=>{if(rolling)return;setSelected(null);setReward(null)}
 const freeCases=cases.filter(c=>c.free)
 const favoriteToggle=(name:string)=>setFavorites(a=>a.includes(name)?a.filter(x=>x!==name):[...a,name])
 return <main className="app-shell rub-style">
  <header className="topbar">
   <a className="brand" href="#" onClick={e=>{e.preventDefault();setTab('Кейсы')}}><span className="brand-mark"><Gift size={20}/></span><span>GIFT<span className="brand-up">ORA</span></span></a>
   <div className="top-actions"><TelegramBridge/><div className="stars-balance"><span>⭐</span><strong>{balance.toLocaleString('ru-RU')}</strong><span className="balance-chevron">⌄</span></div><button className="topup-button" onClick={()=>setTab('Бонусы')}>Пополнить</button><WalletConnect/><button className="icon-button" aria-label="Уведомления"><Bell size={17}/></button></div>
  </header>
  {!selected ? <>
   <div className="category-bar"><button className="search-trigger" onClick={()=>document.getElementById('case-search')?.focus()}><Search size={18}/></button>{categories.map(c=><button key={c} className={category===c?'category-pill active':'category-pill'} onClick={()=>setCategory(c)}>{c}</button>)}<button className="sort-button" onClick={()=>setCategory(category==='Все'?'На сдачу':'Все')}><ArrowUpDown size={17}/></button></div>
   <section className="case-listing" hidden={tab!=='Кейсы'}>
    <div className="case-group-heading"><h2>Бесплатные</h2><span>Каждый день</span></div>
    <div className="free-case-grid">{freeCases.map(c=><article className="free-case-card" key={c.id} onClick={()=>begin(c)}><div className={'free-cover '+c.cover}><span className="cover-deco deco-a">🧸</span><span className="cover-deco deco-b">💎</span><span className="cover-deco deco-c">🌹</span><span className="cover-main">{c.emoji}</span><span className="cover-deco deco-d">🚀</span></div><div className="free-card-bottom"><strong>{c.name}</strong><button disabled={freeDone} onClick={e=>{e.stopPropagation();begin(c)}}>{freeDone?'Получено':'Бесплатно'}</button></div></article>)}</div>
    {category==='Все'&&<div className="case-group-heading"><h2>GTA VI</h2><button onClick={()=>setCategory('GTA VI')}>Все 5 <ChevronRight size={17}/></button></div>}
    <div className="main-case-grid">{(category==='Все'?cases.filter(c=>c.category==='GTA VI').slice(0,2):visible).map(c=><article className="catalog-case-card" key={c.id} onClick={()=>begin(c)}><div className={'catalog-case-cover '+c.cover}><span className="case-sticker sticker-one">💎</span><span className="case-sticker sticker-two">{c.emoji}</span><span className="catalog-case-emoji">{c.emoji}</span>{c.fresh&&<b>Новый</b>}</div><div className="catalog-case-caption"><strong>{c.name}</strong><span>⭐ {c.cost}</span></div></article>)}</div>
    {category!=='Все'&&<><div className="case-group-heading"><h2>{category}</h2><span>{visible.length} кейсов</span></div><div className="main-case-grid">{visible.map(c=><article className="catalog-case-card" key={c.id} onClick={()=>begin(c)}><div className={'catalog-case-cover '+c.cover}><span className="case-sticker sticker-one">💎</span><span className="case-sticker sticker-two">{c.emoji}</span><span className="catalog-case-emoji">{c.emoji}</span>{c.fresh&&<b>Новый</b>}</div><div className="catalog-case-caption"><strong>{c.name}</strong><span>⭐ {c.cost}</span></div></article>)}</div></>}
    <div className="case-group-heading"><h2>На сдачу</h2><button onClick={()=>setCategory('На сдачу')}>Все <ChevronRight size={17}/></button></div>
    <div className="main-case-grid">{cases.filter(c=>c.category==='На сдачу').map(c=><article className="catalog-case-card" key={c.id} onClick={()=>begin(c)}><div className={'catalog-case-cover '+c.cover}><span className="catalog-case-emoji">{c.emoji}</span></div><div className="catalog-case-caption"><strong>{c.name}</strong><span>⭐ {c.cost}</span></div></article>)}</div>
   </section>
   {tab==='Заработок'&&<section className="placeholder-panel"><Zap size={35}/><h2>Заработок</h2><p>Раздел заданий и наград скоро появится.</p></section>}
   {tab==='Бонусы'&&<section className="placeholder-panel"><Sparkles size={35}/><h2>Бонусы GIFTORA</h2><p>Пополнение и бонусные акции будут подключены после настройки реальных платежей.</p></section>}
   {tab==='Игры'&&<section className="placeholder-panel"><Swords size={35}/><h2>Игры</h2><p>Мини-игры появятся в следующих обновлениях.</p></section>}
  </>:<section className="opening-page">
   <button className="back-to-cases" onClick={back}><ArrowLeft size={19}/> Назад к кейсам</button>
   <div className="opening-panel">
    <div className="opening-title"><div className={'opening-case-icon '+selected.cover}>{selected.emoji}</div><h1>{selected.name}</h1></div>
    <div className="slot-stage"><div className="slot-arrow arrow-up">▼</div><div className={rolling?'slot-track is-rolling':'slot-track'}>{[...selected.prizes.slice(1),...selected.prizes,...selected.prizes].map((p,i)=><div className={'slot-item '+p.tone} key={p.name+i}><span>{p.emoji}</span></div>)}</div><div className="slot-arrow arrow-down">▲</div></div>
    {reward&&<div className="win-banner"><span>{reward.emoji}</span><div><small>ТВОЙ РЕЗУЛЬТАТ</small><strong>{selected.free?'1 ⭐':reward.name}</strong></div><b>+{selected.free?1:reward.value} ⭐</b></div>}
    <div className="open-controls"><button className="open-main-button" disabled={rolling||(selected.free&&freeDone)||balance<selected.cost*multiplier} onClick={roll}>{rolling?'Открываем...':reward?'Открыть ещё раз':'Открыть за '+(selected.cost*multiplier)+' ⭐'}</button><button className="battle-button" onClick={()=>setTab('Игры')}><Swords size={22}/> В батл</button></div>
    <div className="multiplier-row">{[1,2,3,4,5].map(n=><button key={n} className={multiplier===n?'multiplier active':'multiplier'} onClick={()=>setMultiplier(n)}>x{n}</button>)}<button className="round-tool"><Zap size={19}/></button><button className="round-tool"><ShieldCheck size={19}/></button><button className="round-tool"><Volume2 size={19}/></button></div>
   </div>
   <div className="prize-heading"><h2>{selected.free ? "Витрина подарков" : "Что может выпасть"}</h2><span>{selected.free ? "Коллекция" : selected.prizes.length+" предметов"}</span></div>
   <div className="prize-grid">{(selected.free?showcase:selected.prizes).map((p,i)=><article className={'prize-card '+p.tone} key={p.name+i}><button className={favorites.includes(p.name)?'prize-heart saved':'prize-heart'} onClick={()=>favoriteToggle(p.name)}><Heart size={15} fill={favorites.includes(p.name)?'currentColor':'none'}/></button><span className="prize-emoji">{p.emoji}</span><strong>{p.name}</strong><b>{p.value.toLocaleString('ru-RU')} ⭐</b>{!selected.free&&<small>Шанс {p.chance}%</small>}</article>)}</div>
   <div className="test-disclaimer">Демонстрационный режим: баланс и открытия хранятся на этом устройстве. Реальные платежи и выдача NFT ещё не подключены.</div>
   {history.length>0&&<div className="recent-wins"><h3>Последние открытия</h3>{history.map((h,i)=><p key={i}>{h}</p>)}</div>}
  </section>}
  <nav className="bottom-nav">{nav.map(({name,icon:Icon})=><button key={name} className={tab===name?'nav-item selected':'nav-item'} onClick={()=>{setSelected(null);setTab(name)}}><Icon size={19}/><span>{name}</span></button>)}</nav>
 </>}
 </main>
}
