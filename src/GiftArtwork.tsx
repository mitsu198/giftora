import { useState } from 'react'
type Props = { variant?: string; className?: string }

const giftSlugs: Record<string,string> = {
 'plush pepe':'plush_pepe','durov’s cap':'durovs_cap',"durov's cap":'durovs_cap','durovs cap':'durovs_cap',
 'jelly bunny':'jelly_bunny','heart locket':'heart_locket','jolly chimp':'jolly_chimp',
 'surge board':'surge_board','eternal rose':'eternal_rose','diamond ring':'diamond_ring',
 'precious peach':'precious_peach','snoop dogg':'snoop_dogg','santa hat':'santa_hat',
 'toy bear':'toy_bear','resistance dog':'resistance_dog','loot bag':'loot_bag',
 'vice cream':'vice_cream','daily':'jelly_bunny','surprise':'precious_peach',
 'vice':'vice_cream','wanted':'durovs_cap','starter':'diamond_ring','lucky':'plush_pepe',
 'resistance':'resistance_dog','premium':'heart_locket'
}

export default function GiftArtwork({ variant = 'Plush Pepe', className = '' }: Props) {
 const key=variant.toLowerCase().trim()
 const slug=giftSlugs[key] || 'plush_pepe'
 const [failed,setFailed]=useState(false)
 const src=`https://cdn.jsdelivr.net/gh/ssamy2/TG_Photos@main/webp/by_name/${slug}.webp`
 return <span className={`gift-artwork-wrap ${className}`} role="img" aria-label={variant}>
  {!failed ? <img className="gift-artwork" src={src} alt={variant} loading="lazy" decoding="async" onError={()=>setFailed(true)}/> : <span className="gift-art-fallback">🎁</span>}
 </span>
}
