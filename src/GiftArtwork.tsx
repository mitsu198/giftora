import { useState } from 'react'
type Props = { variant?: string; className?: string }

const giftSlugs: Record<string,string> = {
 'plush pepe':'plush_pepe','durov’s cap':'durovs_cap',"durov's cap":'durovs_cap','durovs cap':'durovs_cap',
 'jelly bunny':'jelly_bunny','heart locket':'heart_locket','jolly chimp':'jolly_chimp',
 'surge board':'surge_board','eternal rose':'eternal_rose','diamond ring':'diamond_ring',
 'precious peach':'precious_peach','snoop dogg':'snoop_dogg','santa hat':'santa_hat',
 'toy bear':'toy_bear','resistance dog':'resistance_dog','loot bag':'loot_bag',
 'vice cream':'vice_cream','daily':'jelly_bunny','surprise':'precious_peach',
 'vice':'vice_cream','wanted':'durovs_cap','starter':'teddy_bear','lucky':'love_heart',
 'resistance':'resistance_dog','premium':'heart_locket',
 'love heart':'love_heart','teddy bear':'teddy_bear','gift box':'gift_box','red rose':'red_rose',
 'birthday cake':'birthday_cake','homemade cake':'homemade_cake','bouquet of flowers':'bouquet_of_flowers',
 'rocket':'rocket','champagne bottle':'champagne_bottle','trophy':'trophy','gem':'gem',
 'durov’s figurine':'durovs_figurine',"durov's figurine":"durovs_figurine",'myth mask':'myth_mask','intelligence cup':'intelligence_cup','algorithm cup':'algorithm_cup','lucky locket':'lucky_locket',
 'durov’s glasses':'durovs_glasses','resistance dogs':'resistance_dog',
 'heart lockets':'heart_locket','heroic helmets':'heroic_helmet','mighty arms':'mighty_arm',
 'mirage lamps':'mirage_lamp','nail bracelets':'nail_bracelet','precious peaches':'precious_peach',
 'perfume bottles':'perfume_bottle','mini oscars':'mini_oscar','gem signets':'gem_signet',
 'bling binkies':'bling_binky','plush pepes':'plush_pepe','ion gems':'ion_gem','genie lamps':'genie_lamp',
 'ionic dryers':'ionic_dryer','astral shards':'astral_shard','bonded rings':'bonded_ring',
 'artisan bricks':'artisan_brick','durov’s caps':'durovs_cap','magic potions':'magic_potion',
 'love candles':'love_candle','surge boards':'surge_board','khabib’s papakhas':'khabibs_papakha',
 'rare birds':'rare_bird','fine pens':'fine_pen','sharp tongues':'sharp_tongue',
 'valentine boxes':'valentine_box','neko helmets':'neko_helmet','joyful bundles':'joyful_bundle',
 'electric skulls':'electric_skull','sleigh bells':'sleigh_bell','snow mittens':'snow_mitten',
 'westside signs':'westside_sign','record players':'record_player','eternal roses':'eternal_rose',
 'cupid charms':'cupid_charm','pretty posies':'pretty_posy','sky stilettos':'sky_stiletto',
 'loot bags':'loot_bag','holiday drinks':'holiday_drink','snow globes':'snow_globe',
 'mad pumpkins':'mad_pumpkin','flying brooms':'flying_broom','low riders':'low_rider',
 'love potions':'love_potion','lush bouquets':'lush_bouquet','bunny muffins':'bunny_muffin',
 'ufc strikes':'ufc_strike','skull flowers':'skull_flower','hanging stars':'hanging_star',
 'signet rings':'signet_ring','kissed frogs':'kissed_frog','mousse cakes':'mousse_cake',
 'crystal balls':'crystal_ball','diamond rings':'diamond_ring','bow ties':'bow_tie',
 'vintage cigars':'vintage_cigar','jingle bells':'jingle_bell','berry boxes':'berry_box',
 'top hats':'top_hat','hypno lollipops':'hypno_lollipop','star notepads':'star_notepad',
 'timeless books':'timeless_book','trapped hearts':'trapped_heart','money pots':'money_pot',
 'restless jars':'restless_jar','winter wreaths':'winter_wreath','snake boxes':'snake_box',
 'swiss watches':'swiss_watch','voodoo dolls':'voodoo_doll','tama gadgets':'tama_gadget',
 'happy brownies':'happy_brownie','pet snakes':'pet_snake','faith amulets':'faith_amulet',
 'spiced wines':'spiced_wine','eternal candles':'eternal_candle','fresh socks':'fresh_sock',
 'santa hats':'santa_hat','big years':'big_year','moon pendants':'moon_pendant',
 'jester hats':'jester_hat','spring baskets':'spring_basket','cookie hearts':'cookie_heart',
 'jelly bunnies':'jelly_bunny','scared cats':'scared_cat','sakura flowers':'sakura_flower',
 'hex pots':'hex_pot','input keys':'input_key','jolly chimps':'jolly_chimp',
 'whip cupcakes':'whip_cupcake','victory medals':'victory_medal','mood packs':'mood_pack',
 'jacks-in-the-box':'jacks_in_the_box','xmas stockings':'xmas_stocking','pool floats':'pool_float',
 'stellar rockets':'stellar_rocket','candy canes':'candy_cane','light swords':'light_sword',
 'evil eyes':'evil_eye','ginger cookies':'ginger_cookie','snoop cigars':'snoop_cigar',
 'clover pins':'clover_pin','lunar snakes':'lunar_snake','swag bags':'swag_bag',
 'party sparklers':'party_sparkler','b-day candles':'b_day_candle','liberty figures':'liberty_figure',
 'instant ramens':'instant_ramen','easter eggs':'easter_egg','spy agarics':'spy_agaric',
 'toy bears':'toy_bear','witch hats':'witch_hat','homemade cakes':'homemade_cake',
 'desk calendars':'desk_calendar','ice creams':'ice_cream','chill flames':'chill_flame',
 'vice creams':'vice_cream','snoop doggs':'snoop_dogg','lol pops':'lol_pop'
}

export default function GiftArtwork({ variant = 'Plush Pepe', className = '' }: Props) {
 const key=variant.toLowerCase().trim()
 const slug=giftSlugs[key] || key.normalize('NFKD').replace(/[’']/g,'').replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'')
 const [failed,setFailed]=useState(false)
 const src=`https://cdn.jsdelivr.net/gh/ssamy2/TG_Photos@main/webp/by_name/${slug}.webp`
 return <span className={`gift-artwork-wrap ${className}`} role="img" aria-label={variant}>
  {!failed ? <img className="gift-artwork" src={src} alt={variant} loading="lazy" decoding="async" onError={()=>setFailed(true)}/> : <span className="gift-art-fallback">Изображение</span>}
 </span>
}
