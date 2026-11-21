import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowUpDown, Bell, ChevronRight, Gift, Heart, Home, Search, ShieldCheck, Sparkles, Swords, Volume2, X, Zap, Flame, Trophy, Plus } from 'lucide-react'
import WalletConnect from './WalletConnect'
import TelegramBridge from './TelegramBridge'
import GiftArtwork from './GiftArtwork'

type Prize = { name: string; emoji: string; value: number; tone: string; chance: number; kind?: 'regular'|'collectible' }
type CaseItem = { id: string; name: string; cost: number; category: string; emoji: string; cover: string; prizes: Prize[]; free?: boolean; fresh?: boolean }
const prize = (name: string, emoji: string, value: number, tone: string, chance: number): Prize => ({name,emoji,value,tone,chance})
const collectibleNames = ["Durov’s Figurine","Intelligence Cup","Algorithm Cup","Lucky Locket","Durov’s Glasses","Resistance Dog","Heart Locket","Heroic Helmet","Mighty Arms","Mirage Lamp","Nail Bracelet","Precious Peach","Perfume Bottle","Mini Oscar","Gem Signet","Bling Binky","Plush Pepe","Ion Gem","Genie Lamp","Ionic Dryer","Astral Shard","Bonded Ring","Artisan Brick","Durov’s Cap","Magic Potion","Myth Mask","Love Candle","Surge Board","Khabib’s Papakha","Rare Bird","Fine Pen","Sharp Tongue","Valentine Box","Neko Helmet","Joyful Bundle","Electric Skull","Sleigh Bell","Snow Mitten","Westside Sign","Record Player","Eternal Rose","Cupid Charm","Pretty Posy","Sky Stiletto","Loot Bag","Holiday Drink","Snow Globe","Mad Pumpkin","Flying Broom","Low Rider","Love Potion","Lush Bouquet","Bunny Muffin","UFC Strike","Skull Flower","Hanging Star","Signet Ring","Kissed Frog","Mousse Cake","Crystal Ball","Diamond Ring","Bow Tie","Vintage Cigar","Jingle Bell","Berry Box","Top Hat","Hypno Lollipop","Star Notepad","Timeless Book","Trapped Heart","Money Pot","Restless Jar","Winter Wreath","Snake Box","Swiss Watch","Voodoo Doll","Tama Gadget","Happy Brownie","Pet Snake","Faith Amulet","Spiced Wine","Eternal Candle","Fresh Socks","Santa Hat","Big Year","Moon Pendant","Jester Hat","Spring Basket","Cookie Heart","Jelly Bunny","Scared Cat","Sakura Flower","Hex Pot","Input Key","Jolly Chimp","Whip Cupcake","Victory Medal","Mood Pack","Jacks-in-the-Box","Xmas Stocking","Pool Float","Stellar Rocket","Candy Cane","Light Sword","Evil Eye","Ginger Cookie","Snoop Cigar","Clover Pin","Lunar Snake","Swag Bag","Party Sparkler","B-Day Candle","Liberty Figure","Instant Ramen","Easter Egg","Spy Agaric","Toy Bear","Witch Hat","Homemade Cake","Desk Calendar","Ice Cream","Chill Flame","Vice Cream","Snoop Dogg","Lol Pop"]
const rareCollectibles = collectibleNames.slice(0, 25)
const midCollectibles = collectibleNames.slice(25, 65)
const commonCollectibles = collectibleNames.slice(65)
const regularGifts = [
 ['Love Heart',15,'pink'],['Teddy Bear',15,'gold'],['Gift Box',25,'blue'],['Red Rose',25,'pink'],
 ['Birthday Cake',50,'gold'],['Bouquet of Flowers',50,'pink'],['Rocket',50,'blue'],
 ['Champagne Bottle',50,'purple'],['Trophy',100,'gold'],['Diamond Ring',100,'gold'],['Gem',100,'blue']
] as const
const regularPool = (chance:number):Prize[] => regularGifts.map(([name,value,tone])=>({...prize(name,'',value,tone,chance/regularGifts.length),kind:'regular' as const}))
const collectiblePool = (names:string[], min:number, max:number, chance:number, tone:string):Prize[] =>
 names.map((name,i)=>({...prize(name,'',Math.round(min+(max-min)*(1-i/Math.max(1,names.length-1))),tone,chance/names.length),kind:'collectible' as const}))
const dailyPrize = prize('1 звезда','⭐',1,'gold',100)
const cases: CaseItem[] = [
 {id:'daily',name:'Подарок дня',cost:0,category:'Бесплатные',emoji:'🎁',cover:'cover-daily',free:true,prizes:[dailyPrize]},
 {id:'surprise',name:'Сюрприз',cost:0,category:'Бесплатные',emoji:'🦩',cover:'cover-surprise',free:true,prizes:[dailyPrize]},
 {id:'starter',name:'На сдачу',cost:5,category:'На сдачу',emoji:'🪙',cover:'cover-starter',prizes:[...regularPool(78),...collectiblePool(commonCollectibles,6,35,22,'gold')]},
 {id:'lucky',name:'Удача',cost:15,category:'На сдачу',emoji:'🍀',cover:'cover-lucky',prizes:[...regularPool(55),...collectiblePool(commonCollectibles,8,45,35,'gold'),...collectiblePool(midCollectibles,35,110,10,'blue')]},
 {id:'resistance',name:'Сопротивление',cost:55,category:'Сопротивление',emoji:'⚡',cover:'cover-resistance',prizes:[...collectiblePool(commonCollectibles,15,55,25,'gold'),...collectiblePool(midCollectibles,45,180,75,'blue')]},
 {id:'vice',name:'Вайс-Сити',cost:90,category:'GTA VI',emoji:'🌴',cover:'cover-vice',fresh:true,prizes:[...collectiblePool(commonCollectibles,15,65,15,'gold'),...collectiblePool(midCollectibles,55,260,85,'blue')]},
 {id:'wanted',name:'Розыск',cost:250,category:'GTA VI',emoji:'💎',cover:'cover-wanted',fresh:true,prizes:[...collectiblePool(midCollectibles,80,400,35,'blue'),...collectiblePool(rareCollectibles,400,3200,65,'red')]},
 {id:'premium',name:'Премиум',cost:600,category:'Сопротивление',emoji:'👑',cover:'cover-premium',prizes:[...collectiblePool(midCollectibles,150,650,20,'blue'),...collectiblePool(rareCollectibles,800,7000,80,'purple')]},
 {id:'legendary',name:'Легендарный',cost:1500,category:'Сопротивление',emoji:'💠',cover:'cover-premium',fresh:true,prizes:collectiblePool(rareCollectibles,1200,9000,100,'red')},
 {id:'collector',name:'Коллекционер',cost:3000,category:'Сопротивление',emoji:'🏆',cover:'cover-wanted',fresh:true,prizes:collectiblePool([...rareCollectibles,...midCollectibles],250,10000,100,'gold')},
]
const nav = [{name:'Игры',icon:Home},{name:'Кейсы',icon:Gift},{name:'Заработок',icon:Zap},{name:'Бонусы',icon:Sparkles}]
const categories = ['Все','GTA VI','На сдачу','Сопротивление']
const showcase = [
 prize('Plush Pepe','',5718,'red',0), prize('Durov’s Cap','',3630,'pink',0),
 prize('Jelly Bunny','',2847,'pink',0), prize('Heart Locket','',1844,'purple',0),
 prize('Jolly Chimp','',1556,'purple',0), prize('Surge Board','',1047,'blue',0),
]
const dateKey = () => new Date().toISOString().slice(0,10)
const readBalance = () => { try { const current = Number(localStorage.getItem('giftora:demo-stars') ?? 25); if (localStorage.getItem('giftora:owner-bonus-2026') !== 'claimed') { const credited = current + 1000000; localStorage.setItem('giftora:demo-stars', String(credited)); localStorage.setItem('giftora:owner-bonus-2026', 'claimed'); return credited } return current } catch { return 1000025 } }

export default function App() {
 const [tab,setTab]=useState('Кейсы')
 const [category,setCategory]=useState('Все')
 const [search,setSearch]=useState('')
 const [selected,setSelected]=useState<CaseItem|null>(null)
 const [balance,setBalance]=useState(readBalance)
 const [freeDone,setFreeDone]=useState(()=>{try{return localStorage.getItem('giftora:free-date')===dateKey()}catch{return false}})
 const [rolling,setRolling]=useState(false)
 const [reward,setReward]=useState<Prize|null>(null)
 const [multiplier,setMultiplier]=useState(1)
 const [history,setHistory]=useState<string[]>([])
 const [favorites,setFavorites]=useState<string[]>([])
 const visible=useMemo(()=>cases.filter(c=>!c.free&&(category==='Все'||c.category===category)&&c.name.toLowerCase().includes(search.toLowerCase())),[category,search])
 const begin=(c:CaseItem)=>{setSelected(c);setReward(null);setMultiplier(1)}
 const roll=()=>{
  if(!selected||rolling||(selected.free&&freeDone)||balance<selected.cost*multiplier)return
  setRolling(true)
  window.setTimeout(()=>{
   const total=selected.prizes.reduce((s,p)=>s+p.chance,0);let n=Math.random()*total;let result=selected.prizes[selected.prizes.length-1]
   for(const p of selected.prizes){n-=p.chance;if(n<0){result=p;break}}
   const gain=selected.free?1:result.value
   const next=balance-selected.cost*multiplier+gain
   setBalance(next);localStorage.setItem('giftora:demo-stars',String(next))
   if(selected.free){setFreeDone(true);localStorage.setItem('giftora:free-date',dateKey())}
   setReward(result);setHistory(h=>[selected.name+' · '+result.name,...h].slice(0,6));setRolling(false)
  },1550)
 }
 const back=()=>{if(rolling)return;setSelected(null);setReward(null)}
 const favoriteToggle=(name:string)=>setFavorites(a=>a.includes(name)?a.filter(x=>x!==name):[...a,name])
 const featured=cases.find(c=>c.id==='vice')!
 return <main className="app-shell rub-style">
  <header className="topbar">
   <a className="brand" href="#" onClick={e=>{e.preventDefault();setTab('Кейсы');setSelected(null)}}><span className="brand-mark"><Gift size={20}/></span><span>GIFT<span className="brand-up">ORA</span></span></a>
   <div className="top-actions"><TelegramBridge/><div className="stars-balance"><span>⭐</span><strong>{balance.toLocaleString('ru-RU')}</strong><span className="balance-chevron">⌄</span></div><button className="topup-button" onClick={()=>setTab('Бонусы')}><Plus size={14}/> Пополнить</button><WalletConnect/><button className="icon-button" aria-label="Уведомления"><Bell size={17}/></button></div>
  </header>
  {!selected ? <>
   <div className="category-bar">
    <button className="search-trigger" onClick={()=>document.getElementById('case-search')?.focus()} aria-label="Поиск"><Search size={18}/></button>
    {categories.map(c=><button key={c} className={category===c?'category-pill active':'category-pill'} onClick={()=>{setCategory(c);setTab('Кейсы')}}>{c}</button>)}
    <button className="sort-button" onClick={()=>setCategory(category==='Все'?'На сдачу':'Все')} aria-label="Сортировка"><ArrowUpDown size={17}/></button>
   </div>
   {tab==='Кейсы'&&<section className="case-listing">
    <section className="feature-banner">
     <div className="feature-copy"><div className="feature-kicker"><Flame size={13}/> КЕЙС НЕДЕЛИ</div><h1>Поймай свой<br/><span>редкий подарок</span></h1><p>Открывай кейсы, собирай коллекцию и испытывай удачу.</p><button onClick={()=>begin(featured)}>Открыть «Вайс-Сити» <ChevronRight size={17}/></button><div className="feature-price">Стоимость <strong>⭐ {featured.cost}</strong></div></div>
     <div className="feature-art"><div className="feature-orbit orbit-one"/><div className="feature-orbit orbit-two"/><GiftArtwork variant="vice" className="feature-gift-art"/><span className="feature-float float-star">✦</span><span className="feature-float float-gem">◆</span></div>
     <div className="feature-counter"><span>01</span><i/> 03</div>
    </section>
    <div className="section-head"><div><span className="section-overline">ЗАБИРАЙ КАЖДЫЙ ДЕНЬ</span><h2>Бесплатные кейсы</h2></div><span className="section-note"><span className="live-dot"/> Обновляются ежедневно</span></div>
    <div className="free-case-grid">{cases.filter(c=>c.free).map((c,i)=><article className={'free-case-card '+(i===1?'free-alt':'')} key={c.id} onClick={()=>begin(c)}><div className={'free-cover '+c.cover}><span className="free-ribbon">{i===0?'ЕЖЕДНЕВНО':'БОНУС'}</span><span className="cover-deco deco-a">✦</span><span className="cover-deco deco-b">✧</span><GiftArtwork variant={c.id} className="cover-main-art"/><span className="cover-deco deco-c">✦</span></div><div className="free-card-bottom"><div className="free-card-label"><strong>{c.name}</strong><small>Гарантированно 1 ⭐</small></div><button disabled={freeDone} onClick={e=>{e.stopPropagation();begin(c)}}>{freeDone?'Получено':'Открыть'}</button></div></article>)}</div>
    <div className="section-head case-section-head"><div><span className="section-overline">ВЫБИРАЙ СВОЙ РИСК</span><h2>Каталог кейсов</h2></div><span className="section-note">{visible.length} кейсов</span></div>
    <div className="catalog-toolbar"><label className="catalog-search"><Search size={17}/><input id="case-search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Найти кейс..."/>{search&&<button onClick={()=>setSearch('')} aria-label="Очистить"><X size={15}/></button>}</label><div className="catalog-categories">{categories.map(c=><button key={c} className={category===c?'active':''} onClick={()=>setCategory(c)}>{c}</button>)}</div></div>
    <div className="main-case-grid">{visible.map(c=><article className="catalog-case-card" key={c.id} onClick={()=>begin(c)}><div className={'catalog-case-cover '+c.cover}><span className="case-card-glint"/><span className="case-sticker sticker-one">{c.category==='GTA VI'?'✦':'✧'}</span><GiftArtwork variant={c.id} className="catalog-case-emoji-art"/>{c.fresh&&<b>НОВИНКА</b>}<span className="case-card-index">GIFTORA / {String(cases.indexOf(c)+1).padStart(2,'0')}</span></div><div className="catalog-case-caption"><div><strong>{c.name}</strong><small>{c.category}</small></div><span className="case-cost">⭐ {c.cost}</span></div><div className="case-card-bottom"><span>{c.prizes.length} наград</span><span>Смотреть <ChevronRight size={14}/></span></div></article>)}</div>
    {visible.length===0&&<div className="empty-cases"><Search size={24}/><strong>Ничего не найдено</strong><span>Попробуй изменить запрос или категорию.</span></div>}
    <div className="collection-strip"><div className="collection-icon"><Trophy size={22}/></div><div><strong>Твоя коллекция начинается здесь</strong><span>Собирай подарки и следи за удачными открытиями.</span></div><ChevronRight size={18}/></div>
   </section>}
   {tab==='Заработок'&&<section className="placeholder-panel"><Zap size={35}/><h2>Заработок</h2><p>Раздел заданий и наград скоро появится.</p></section>}
   {tab==='Бонусы'&&<section className="placeholder-panel"><Sparkles size={35}/><h2>Бонусы GIFTORA</h2><p>Пополнение и бонусные акции будут подключены после настройки реальных платежей.</p></section>}
   {tab==='Игры'&&<section className="placeholder-panel"><Swords size={35}/><h2>Игры</h2><p>Мини-игры появятся в следующих обновлениях.</p></section>}
  </>:<section className="opening-page">
   <button className="back-to-cases" onClick={back}><ArrowLeft size={19}/> Назад к кейсам</button>
   <div className="opening-panel">
    <div className="opening-title"><div className={'opening-case-icon '+selected.cover}><GiftArtwork variant={selected.prizes[0]?.name || selected.id}/></div><div><span className="section-overline">ОТКРЫТИЕ КЕЙСА</span><h1>{selected.name}</h1></div><span className="opening-cost">⭐ {selected.cost}</span></div>
    <div className="slot-stage"><div className="slot-arrow arrow-up">▼</div><div className={rolling?'slot-track is-rolling':'slot-track'}>{[...selected.prizes.slice(1),...selected.prizes,...selected.prizes].map((p,i)=><div className={'slot-item '+p.tone} key={p.name+i}><GiftArtwork variant={p.name}/></div>)}</div><div className="slot-arrow arrow-down">▲</div></div>
    {reward&&<div className="win-banner"><GiftArtwork variant={reward.name} className="win-gift-art"/><div><small>ТВОЙ РЕЗУЛЬТАТ</small><strong>{selected.free?'1 звезда':reward.name}</strong></div><b>+{selected.free?1:reward.value} ⭐</b></div>}
    <div className="open-controls"><button className="open-main-button" disabled={rolling||(selected.free&&freeDone)||balance<selected.cost*multiplier} onClick={roll}>{rolling?'Открываем...':selected.free&&freeDone?'Уже получено':reward?'Открыть ещё раз':'Открыть за '+(selected.cost*multiplier)+' ⭐'}</button><button className="battle-button" onClick={()=>setTab('Игры')}><Swords size={22}/> В батл</button></div>
    <div className="multiplier-row">{[1,2,3,4,5].map(n=><button key={n} className={multiplier===n?'multiplier active':'multiplier'} onClick={()=>setMultiplier(n)}>x{n}</button>)}<button className="round-tool"><Zap size={19}/></button><button className="round-tool"><ShieldCheck size={19}/></button><button className="round-tool"><Volume2 size={19}/></button></div>
   </div>
   <div className="prize-heading"><div><span className="section-overline">СОДЕРЖИМОЕ</span><h2>{selected.free?'Витрина подарков':'Что может выпасть'}</h2></div><span>{selected.free?'Декоративная витрина':selected.prizes.length+' предметов'}</span></div>
   <div className="prize-grid">{(selected.free?showcase:selected.prizes).map((p,i)=><article className={'prize-card '+p.tone} key={p.name+i}><button className={favorites.includes(p.name)?'prize-heart saved':'prize-heart'} onClick={()=>favoriteToggle(p.name)}><Heart size={15} fill={favorites.includes(p.name)?'currentColor':'none'}/></button><GiftArtwork variant={p.name} className="prize-artwork"/><strong>{p.name}</strong><b>{p.value.toLocaleString('ru-RU')} ⭐</b>{!selected.free&&<small>{p.kind==='regular'?'Обычный подарок':'Коллекционный подарок'} · Шанс {p.chance.toFixed(2)}%</small>}</article>)}</div>
   <div className="test-disclaimer">В кейсах собраны обычные подарки Telegram и 123 коллекции collectible gifts. Сейчас это демонстрационные открытия: баланс хранится на этом устройстве, реальные платежи и выдача подарков пока не подключены.</div>
   {history.length>0&&<div className="recent-wins"><h3>Последние открытия</h3>{history.map((h,i)=><p key={i}>{h}</p>)}</div>}
  </section>}
  <nav className="bottom-nav">{nav.map(({name,icon:Icon})=><button key={name} className={tab===name?'nav-item selected':'nav-item'} onClick={()=>{setSelected(null);setTab(name)}}><Icon size={19}/><span>{name}</span></button>)}</nav>
 </main>
}
