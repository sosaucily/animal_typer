/**
 * Animal data for each letter A-Z.
 * Each entry has the letter, animal name, a color from our palette,
 * and an SVG component for the papercut-style animal.
 */

const AnimalSVGs = {
  A: ({ color }) => (
    // Aardvark - long snout, big ears
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="110" cy="95" rx="55" ry="40" fill={color} />
      <ellipse cx="110" cy="95" rx="55" ry="40" fill="rgba(0,0,0,0.05)" />
      {/* Head */}
      <ellipse cx="55" cy="75" rx="30" ry="25" fill={color} />
      {/* Snout */}
      <ellipse cx="25" cy="80" rx="18" ry="10" fill={color} />
      <circle cx="14" cy="78" r="3" fill="#333" />
      {/* Eye */}
      <circle cx="50" cy="68" r="5" fill="white" />
      <circle cx="51" cy="67" r="3" fill="#333" />
      {/* Ears */}
      <ellipse cx="42" cy="48" rx="8" ry="16" fill={color} transform="rotate(-15 42 48)" />
      <ellipse cx="42" cy="48" rx="5" ry="12" fill="rgba(255,255,255,0.3)" transform="rotate(-15 42 48)" />
      <ellipse cx="62" cy="45" rx="8" ry="16" fill={color} transform="rotate(10 62 45)" />
      <ellipse cx="62" cy="45" rx="5" ry="12" fill="rgba(255,255,255,0.3)" transform="rotate(10 62 45)" />
      {/* Legs */}
      <rect x="80" y="120" width="12" height="30" rx="6" fill={color} />
      <rect x="110" y="120" width="12" height="30" rx="6" fill={color} />
      <rect x="135" y="118" width="12" height="28" rx="6" fill={color} />
      {/* Tail */}
      <path d="M165 90 Q185 70 175 50" stroke={color} strokeWidth="8" strokeLinecap="round" fill="none" />
    </svg>
  ),

  B: ({ color }) => (
    // Bear - round and friendly
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="100" cy="115" rx="60" ry="50" fill={color} />
      {/* Head */}
      <circle cx="100" cy="60" r="40" fill={color} />
      {/* Ears */}
      <circle cx="68" cy="28" r="16" fill={color} />
      <circle cx="68" cy="28" r="10" fill="rgba(255,255,255,0.3)" />
      <circle cx="132" cy="28" r="16" fill={color} />
      <circle cx="132" cy="28" r="10" fill="rgba(255,255,255,0.3)" />
      {/* Face */}
      <ellipse cx="100" cy="70" rx="20" ry="15" fill="rgba(255,255,255,0.4)" />
      <ellipse cx="100" cy="66" rx="8" ry="5" fill="#333" />
      {/* Eyes */}
      <circle cx="82" cy="55" r="6" fill="white" />
      <circle cx="83" cy="54" r="3.5" fill="#333" />
      <circle cx="118" cy="55" r="6" fill="white" />
      <circle cx="117" cy="54" r="3.5" fill="#333" />
      {/* Smile */}
      <path d="M90 75 Q100 83 110 75" stroke="#333" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Arms */}
      <ellipse cx="48" cy="110" rx="15" ry="25" fill={color} transform="rotate(15 48 110)" />
      <ellipse cx="152" cy="110" rx="15" ry="25" fill={color} transform="rotate(-15 152 110)" />
      {/* Feet */}
      <ellipse cx="75" cy="160" rx="18" ry="12" fill={color} />
      <ellipse cx="125" cy="160" rx="18" ry="12" fill={color} />
      {/* Belly */}
      <ellipse cx="100" cy="120" rx="30" ry="25" fill="rgba(255,255,255,0.2)" />
    </svg>
  ),

  C: ({ color }) => (
    // Cat
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="120" rx="45" ry="35" fill={color} />
      <circle cx="100" cy="70" r="32" fill={color} />
      {/* Ears */}
      <polygon points="72,45 60,10 88,35" fill={color} />
      <polygon points="75,42 66,18 86,35" fill="rgba(255,255,255,0.3)" />
      <polygon points="128,45 140,10 112,35" fill={color} />
      <polygon points="125,42 134,18 114,35" fill="rgba(255,255,255,0.3)" />
      {/* Eyes */}
      <ellipse cx="85" cy="65" rx="7" ry="8" fill="#AAEE44" />
      <ellipse cx="85" cy="65" rx="3" ry="7" fill="#333" />
      <ellipse cx="115" cy="65" rx="7" ry="8" fill="#AAEE44" />
      <ellipse cx="115" cy="65" rx="3" ry="7" fill="#333" />
      {/* Nose & mouth */}
      <polygon points="97,78 103,78 100,82" fill="#FF9999" />
      <path d="M100 82 Q95 88 88 85" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M100 82 Q105 88 112 85" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Whiskers */}
      <line x1="60" y1="75" x2="82" y2="78" stroke="#333" strokeWidth="1.5" />
      <line x1="60" y1="82" x2="82" y2="82" stroke="#333" strokeWidth="1.5" />
      <line x1="118" y1="78" x2="140" y2="75" stroke="#333" strokeWidth="1.5" />
      <line x1="118" y1="82" x2="140" y2="82" stroke="#333" strokeWidth="1.5" />
      {/* Tail */}
      <path d="M145 115 Q170 90 165 60 Q162 45 170 40" stroke={color} strokeWidth="10" strokeLinecap="round" fill="none" />
      {/* Legs */}
      <rect x="72" y="142" width="14" height="24" rx="7" fill={color} />
      <rect x="114" y="142" width="14" height="24" rx="7" fill={color} />
    </svg>
  ),

  D: ({ color }) => (
    // Dog
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="105" cy="110" rx="50" ry="40" fill={color} />
      <circle cx="85" cy="65" r="30" fill={color} />
      {/* Floppy ears */}
      <ellipse cx="58" cy="70" rx="15" ry="28" fill={color} transform="rotate(10 58 70)" />
      <ellipse cx="58" cy="70" rx="11" ry="22" fill="rgba(0,0,0,0.08)" transform="rotate(10 58 70)" />
      <ellipse cx="112" cy="68" rx="15" ry="28" fill={color} transform="rotate(-10 112 68)" />
      <ellipse cx="112" cy="68" rx="11" ry="22" fill="rgba(0,0,0,0.08)" transform="rotate(-10 112 68)" />
      {/* Snout */}
      <ellipse cx="85" cy="75" rx="16" ry="12" fill="rgba(255,255,255,0.4)" />
      <ellipse cx="85" cy="72" rx="7" ry="5" fill="#333" />
      {/* Eyes */}
      <circle cx="72" cy="58" r="5" fill="white" />
      <circle cx="73" cy="57" r="3" fill="#333" />
      <circle cx="98" cy="58" r="5" fill="white" />
      <circle cx="97" cy="57" r="3" fill="#333" />
      {/* Mouth */}
      <path d="M78 80 Q85 86 92 80" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Tongue */}
      <ellipse cx="85" cy="86" rx="5" ry="7" fill="#FF6B6B" />
      {/* Legs */}
      <rect x="72" y="138" width="14" height="28" rx="7" fill={color} />
      <rect x="105" y="136" width="14" height="28" rx="7" fill={color} />
      <rect x="125" y="134" width="14" height="26" rx="7" fill={color} />
      {/* Tail */}
      <path d="M155 100 Q175 80 168 55" stroke={color} strokeWidth="10" strokeLinecap="round" fill="none" />
    </svg>
  ),

  E: ({ color }) => (
    // Elephant
    <svg viewBox="0 0 220 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="120" cy="105" rx="65" ry="50" fill={color} />
      <circle cx="80" cy="60" r="38" fill={color} />
      {/* Ears */}
      <ellipse cx="45" cy="55" rx="28" ry="35" fill={color} />
      <ellipse cx="48" cy="55" rx="20" ry="27" fill="rgba(255,255,255,0.25)" />
      {/* Trunk */}
      <path d="M65 82 Q55 110 45 130 Q40 140 50 142" stroke={color} strokeWidth="16" strokeLinecap="round" fill="none" />
      {/* Eye */}
      <circle cx="75" cy="50" r="5" fill="white" />
      <circle cx="76" cy="49" r="3" fill="#333" />
      {/* Tusk */}
      <path d="M72 85 Q68 95 72 105" stroke="#FFFDE7" strokeWidth="5" strokeLinecap="round" fill="none" />
      {/* Legs */}
      <rect x="85" y="140" width="18" height="32" rx="9" fill={color} />
      <rect x="115" y="142" width="18" height="30" rx="9" fill={color} />
      <rect x="145" y="140" width="18" height="30" rx="9" fill={color} />
      {/* Tail */}
      <path d="M185 95 Q195 85 192 70" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
    </svg>
  ),

  F: ({ color }) => (
    // Fox
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="115" rx="45" ry="35" fill={color} />
      <circle cx="100" cy="65" r="30" fill={color} />
      {/* Pointy ears */}
      <polygon points="75,42 58,8 90,35" fill={color} />
      <polygon points="78,40 65,15 88,35" fill="rgba(255,255,255,0.3)" />
      <polygon points="125,42 142,8 110,35" fill={color} />
      <polygon points="122,40 135,15 112,35" fill="rgba(255,255,255,0.3)" />
      {/* White face markings */}
      <ellipse cx="100" cy="78" rx="18" ry="15" fill="white" />
      {/* Eyes */}
      <ellipse cx="88" cy="62" rx="4" ry="5" fill="#333" />
      <ellipse cx="112" cy="62" rx="4" ry="5" fill="#333" />
      {/* Nose */}
      <circle cx="100" cy="74" r="4" fill="#333" />
      {/* Bushy tail */}
      <path d="M145 110 Q175 85 180 60 Q182 45 175 42" stroke={color} strokeWidth="18" strokeLinecap="round" fill="none" />
      <circle cx="175" cy="44" r="6" fill="white" />
      {/* Legs */}
      <rect x="75" y="140" width="12" height="26" rx="6" fill="#333" />
      <rect x="113" y="140" width="12" height="26" rx="6" fill="#333" />
      {/* Belly */}
      <ellipse cx="100" cy="125" rx="25" ry="18" fill="rgba(255,255,255,0.25)" />
    </svg>
  ),

  G: ({ color }) => (
    // Giraffe
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="120" cy="145" rx="45" ry="30" fill={color} />
      {/* Neck */}
      <rect x="72" y="40" width="25" height="110" rx="12" fill={color} />
      {/* Head */}
      <ellipse cx="78" cy="35" rx="22" ry="16" fill={color} />
      {/* Ossicones */}
      <line x1="68" y1="22" x2="65" y2="10" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <circle cx="65" cy="8" r="4" fill={color} />
      <line x1="88" y1="22" x2="91" y2="10" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <circle cx="91" cy="8" r="4" fill={color} />
      {/* Eye */}
      <circle cx="70" cy="32" r="4" fill="white" />
      <circle cx="71" cy="31" r="2.5" fill="#333" />
      {/* Spots */}
      <circle cx="80" cy="60" r="6" fill="rgba(139,105,20,0.4)" />
      <circle cx="90" cy="80" r="5" fill="rgba(139,105,20,0.4)" />
      <circle cx="78" cy="100" r="6" fill="rgba(139,105,20,0.4)" />
      <circle cx="85" cy="120" r="5" fill="rgba(139,105,20,0.4)" />
      <circle cx="120" cy="135" r="7" fill="rgba(139,105,20,0.4)" />
      <circle cx="140" cy="140" r="6" fill="rgba(139,105,20,0.4)" />
      {/* Legs */}
      <rect x="90" y="165" width="10" height="30" rx="5" fill={color} />
      <rect x="110" y="165" width="10" height="30" rx="5" fill={color} />
      <rect x="135" y="163" width="10" height="28" rx="5" fill={color} />
      <rect x="150" y="163" width="10" height="28" rx="5" fill={color} />
    </svg>
  ),

  H: ({ color }) => (
    // Hippo
    <svg viewBox="0 0 220 170" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="110" cy="100" rx="70" ry="50" fill={color} />
      {/* Head */}
      <circle cx="65" cy="65" r="35" fill={color} />
      {/* Snout */}
      <ellipse cx="42" cy="75" rx="22" ry="16" fill={color} />
      <ellipse cx="42" cy="75" rx="22" ry="16" fill="rgba(255,255,255,0.2)" />
      {/* Nostrils */}
      <circle cx="36" cy="73" r="3" fill="#333" />
      <circle cx="48" cy="73" r="3" fill="#333" />
      {/* Eyes */}
      <circle cx="55" cy="52" r="6" fill="white" />
      <circle cx="56" cy="51" r="3.5" fill="#333" />
      {/* Small ears */}
      <ellipse cx="48" cy="35" rx="8" ry="10" fill={color} />
      <ellipse cx="80" cy="35" rx="8" ry="10" fill={color} />
      {/* Legs */}
      <rect x="65" y="135" width="20" height="28" rx="10" fill={color} />
      <rect x="100" y="135" width="20" height="28" rx="10" fill={color} />
      <rect x="135" y="133" width="20" height="26" rx="10" fill={color} />
    </svg>
  ),

  I: ({ color }) => (
    // Iguana
    <svg viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="130" cy="85" rx="50" ry="28" fill={color} />
      {/* Head */}
      <ellipse cx="65" cy="70" rx="25" ry="20" fill={color} />
      {/* Eye */}
      <circle cx="55" cy="65" r="6" fill="#F1C40F" />
      <circle cx="55" cy="65" r="3" fill="#333" />
      {/* Spines */}
      <polygon points="70,58 75,40 80,58" fill={color} />
      <polygon points="85,55 90,35 95,55" fill={color} />
      <polygon points="100,57 105,38 110,57" fill={color} />
      <polygon points="115,58 120,40 125,58" fill={color} />
      <polygon points="130,60 135,42 140,60" fill={color} />
      {/* Dewlap */}
      <path d="M55 80 Q50 100 65 95" fill="rgba(255,100,100,0.4)" />
      {/* Tail */}
      <path d="M180 85 Q200 80 210 65 Q215 55 210 50" stroke={color} strokeWidth="10" strokeLinecap="round" fill="none" />
      {/* Legs */}
      <path d="M100 105 L90 130 L80 128" stroke={color} strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M150 105 L145 130 L135 128" stroke={color} strokeWidth="7" strokeLinecap="round" fill="none" />
    </svg>
  ),

  J: ({ color }) => (
    // Jellyfish
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bell */}
      <path d="M40 100 Q40 30 100 30 Q160 30 160 100 Z" fill={color} opacity="0.8" />
      <path d="M55 100 Q55 45 100 45 Q145 45 145 100 Z" fill="rgba(255,255,255,0.2)" />
      {/* Eye spots */}
      <circle cx="80" cy="70" r="5" fill="rgba(255,255,255,0.5)" />
      <circle cx="81" cy="69" r="2.5" fill="#333" />
      <circle cx="120" cy="70" r="5" fill="rgba(255,255,255,0.5)" />
      <circle cx="119" cy="69" r="2.5" fill="#333" />
      {/* Tentacles */}
      <path d="M55 100 Q50 130 60 150 Q65 160 55 180" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M75 100 Q80 140 70 160 Q65 175 75 190" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M100 100 Q95 135 105 155 Q110 170 100 185" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M125 100 Q120 140 130 160 Q135 175 125 190" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M145 100 Q150 130 140 150 Q135 160 145 180" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.7" />
    </svg>
  ),

  K: ({ color }) => (
    // Koala
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="80" r="40" fill={color} />
      {/* Fluffy ears */}
      <circle cx="62" cy="52" r="22" fill={color} />
      <circle cx="62" cy="52" r="14" fill="rgba(255,255,255,0.3)" />
      <circle cx="138" cy="52" r="22" fill={color} />
      <circle cx="138" cy="52" r="14" fill="rgba(255,255,255,0.3)" />
      {/* Body */}
      <ellipse cx="100" cy="140" rx="40" ry="30" fill={color} />
      {/* Face */}
      <ellipse cx="100" cy="90" rx="22" ry="15" fill="rgba(255,255,255,0.3)" />
      {/* Big nose */}
      <ellipse cx="100" cy="82" rx="12" ry="9" fill="#333" />
      {/* Eyes */}
      <circle cx="84" cy="72" r="5" fill="white" />
      <circle cx="85" cy="71" r="3" fill="#333" />
      <circle cx="116" cy="72" r="5" fill="white" />
      <circle cx="115" cy="71" r="3" fill="#333" />
      {/* Arms */}
      <ellipse cx="62" cy="130" rx="12" ry="22" fill={color} transform="rotate(15 62 130)" />
      <ellipse cx="138" cy="130" rx="12" ry="22" fill={color} transform="rotate(-15 138 130)" />
    </svg>
  ),

  L: ({ color }) => (
    // Lion
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Mane */}
      <circle cx="90" cy="65" r="48" fill="rgba(243,156,18,0.6)" />
      {/* Head */}
      <circle cx="90" cy="68" r="32" fill={color} />
      {/* Body */}
      <ellipse cx="120" cy="120" rx="45" ry="32" fill={color} />
      {/* Eyes */}
      <circle cx="78" cy="60" r="5" fill="white" />
      <circle cx="79" cy="59" r="3" fill="#333" />
      <circle cx="102" cy="60" r="5" fill="white" />
      <circle cx="101" cy="59" r="3" fill="#333" />
      {/* Nose */}
      <polygon points="87,72 93,72 90,76" fill="#333" />
      {/* Mouth */}
      <path d="M84 78 Q90 84 96 78" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Legs */}
      <rect x="90" y="142" width="14" height="28" rx="7" fill={color} />
      <rect x="120" y="140" width="14" height="28" rx="7" fill={color} />
      <rect x="145" y="140" width="14" height="26" rx="7" fill={color} />
      {/* Tail with tuft */}
      <path d="M165 115 Q185 100 182 80" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" />
      <circle cx="182" cy="78" r="8" fill="rgba(243,156,18,0.6)" />
    </svg>
  ),

  M: ({ color }) => (
    // Monkey
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="65" r="35" fill={color} />
      {/* Ears */}
      <circle cx="62" cy="60" r="15" fill={color} />
      <circle cx="62" cy="60" r="10" fill="rgba(255,200,150,0.5)" />
      <circle cx="138" cy="60" r="15" fill={color} />
      <circle cx="138" cy="60" r="10" fill="rgba(255,200,150,0.5)" />
      {/* Face */}
      <ellipse cx="100" cy="75" rx="22" ry="18" fill="rgba(255,200,150,0.5)" />
      {/* Eyes */}
      <circle cx="88" cy="60" r="5" fill="white" />
      <circle cx="89" cy="59" r="3" fill="#333" />
      <circle cx="112" cy="60" r="5" fill="white" />
      <circle cx="111" cy="59" r="3" fill="#333" />
      {/* Nose & mouth */}
      <circle cx="96" cy="72" r="2.5" fill="#333" />
      <circle cx="104" cy="72" r="2.5" fill="#333" />
      <path d="M92 78 Q100 85 108 78" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Body */}
      <ellipse cx="100" cy="130" rx="35" ry="30" fill={color} />
      {/* Arms */}
      <path d="M65 115 Q45 130 40 150" stroke={color} strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M135 115 Q155 130 160 150" stroke={color} strokeWidth="12" strokeLinecap="round" fill="none" />
      {/* Curly tail */}
      <path d="M135 140 Q160 135 165 115 Q168 100 155 95 Q145 92 148 105" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" />
      {/* Belly */}
      <ellipse cx="100" cy="133" rx="20" ry="18" fill="rgba(255,200,150,0.3)" />
    </svg>
  ),

  N: ({ color }) => (
    // Narwhal
    <svg viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="120" cy="80" rx="65" ry="35" fill={color} />
      {/* Head */}
      <ellipse cx="55" cy="72" rx="30" ry="28" fill={color} />
      {/* Horn */}
      <line x1="45" y1="50" x2="15" y2="15" stroke="#F1C40F" strokeWidth="6" strokeLinecap="round" />
      <line x1="45" y1="50" x2="15" y2="15" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" />
      {/* Eye */}
      <circle cx="50" cy="68" r="5" fill="white" />
      <circle cx="51" cy="67" r="3" fill="#333" />
      {/* Smile */}
      <path d="M40 80 Q48 86 55 80" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Belly */}
      <ellipse cx="110" cy="90" rx="50" ry="18" fill="rgba(255,255,255,0.2)" />
      {/* Flippers */}
      <ellipse cx="90" cy="105" rx="15" ry="8" fill={color} transform="rotate(-20 90 105)" />
      {/* Tail */}
      <path d="M185 80 Q200 60 210 50" stroke={color} strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M185 80 Q200 100 210 110" stroke={color} strokeWidth="12" strokeLinecap="round" fill="none" />
      {/* Spots */}
      <circle cx="100" cy="75" r="4" fill="rgba(255,255,255,0.2)" />
      <circle cx="130" cy="70" r="3" fill="rgba(255,255,255,0.2)" />
      <circle cx="150" cy="80" r="4" fill="rgba(255,255,255,0.2)" />
    </svg>
  ),

  O: ({ color }) => (
    // Owl
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="100" cy="130" rx="45" ry="50" fill={color} />
      {/* Head */}
      <circle cx="100" cy="70" r="38" fill={color} />
      {/* Ear tufts */}
      <polygon points="68,38 55,10 80,32" fill={color} />
      <polygon points="132,38 145,10 120,32" fill={color} />
      {/* Eye circles */}
      <circle cx="80" cy="65" r="16" fill="white" />
      <circle cx="120" cy="65" r="16" fill="white" />
      <circle cx="82" cy="65" r="10" fill="#F39C12" />
      <circle cx="118" cy="65" r="10" fill="#F39C12" />
      <circle cx="82" cy="65" r="5" fill="#333" />
      <circle cx="118" cy="65" r="5" fill="#333" />
      {/* Beak */}
      <polygon points="95,80 100,92 105,80" fill="#F39C12" />
      {/* Wings */}
      <ellipse cx="55" cy="130" rx="20" ry="35" fill={color} />
      <ellipse cx="55" cy="130" rx="16" ry="28" fill="rgba(0,0,0,0.06)" />
      <ellipse cx="145" cy="130" rx="20" ry="35" fill={color} />
      <ellipse cx="145" cy="130" rx="16" ry="28" fill="rgba(0,0,0,0.06)" />
      {/* Belly pattern */}
      <ellipse cx="100" cy="140" rx="25" ry="30" fill="rgba(255,255,255,0.2)" />
      {/* Feet */}
      <path d="M80 175 L75 190 M80 175 L80 192 M80 175 L85 190" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <path d="M120 175 L115 190 M120 175 L120 192 M120 175 L125 190" stroke={color} strokeWidth="4" strokeLinecap="round" />
    </svg>
  ),

  P: ({ color }) => (
    // Penguin
    <svg viewBox="0 0 180 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="90" cy="120" rx="45" ry="60" fill="#333" />
      {/* White belly */}
      <ellipse cx="90" cy="130" rx="30" ry="45" fill="white" />
      {/* Head */}
      <circle cx="90" cy="55" r="30" fill="#333" />
      {/* Eyes */}
      <circle cx="78" cy="48" r="6" fill="white" />
      <circle cx="79" cy="47" r="3.5" fill="#333" />
      <circle cx="102" cy="48" r="6" fill="white" />
      <circle cx="101" cy="47" r="3.5" fill="#333" />
      {/* Beak */}
      <polygon points="85,60 90,72 95,60" fill={color} />
      {/* Flippers */}
      <ellipse cx="45" cy="115" rx="12" ry="30" fill="#333" transform="rotate(15 45 115)" />
      <ellipse cx="135" cy="115" rx="12" ry="30" fill="#333" transform="rotate(-15 135 115)" />
      {/* Feet */}
      <ellipse cx="75" cy="178" rx="15" ry="8" fill={color} />
      <ellipse cx="105" cy="178" rx="15" ry="8" fill={color} />
      {/* Cheek spots */}
      <circle cx="72" cy="58" r="5" fill="rgba(255,150,150,0.4)" />
      <circle cx="108" cy="58" r="5" fill="rgba(255,150,150,0.4)" />
    </svg>
  ),

  Q: ({ color }) => (
    // Quail
    <svg viewBox="0 0 200 170" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="110" cy="100" rx="50" ry="35" fill={color} />
      {/* Head */}
      <circle cx="60" cy="65" r="25" fill={color} />
      {/* Head plume */}
      <line x1="65" y1="42" x2="70" y2="15" stroke="#333" strokeWidth="3" strokeLinecap="round" />
      <circle cx="70" cy="12" r="6" fill="#333" />
      {/* Eye */}
      <circle cx="52" cy="60" r="5" fill="white" />
      <circle cx="53" cy="59" r="3" fill="#333" />
      {/* Beak */}
      <polygon points="38,68 28,72 38,76" fill="#F39C12" />
      {/* Wing pattern */}
      <ellipse cx="125" cy="95" rx="30" ry="22" fill="rgba(0,0,0,0.08)" />
      {/* Markings */}
      <path d="M55 78 Q60 82 65 78" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" />
      {/* Tail */}
      <path d="M160 95 Q175 85 180 75" stroke={color} strokeWidth="8" strokeLinecap="round" fill="none" />
      {/* Legs */}
      <line x1="95" y1="130" x2="90" y2="155" stroke="#F39C12" strokeWidth="4" strokeLinecap="round" />
      <line x1="120" y1="130" x2="118" y2="155" stroke="#F39C12" strokeWidth="4" strokeLinecap="round" />
      {/* Feet */}
      <path d="M82 155 L90 155 L98 155" stroke="#F39C12" strokeWidth="3" strokeLinecap="round" />
      <path d="M110 155 L118 155 L126 155" stroke="#F39C12" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),

  R: ({ color }) => (
    // Rabbit
    <svg viewBox="0 0 180 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="90" cy="140" rx="40" ry="40" fill={color} />
      {/* Head */}
      <circle cx="90" cy="85" r="30" fill={color} />
      {/* Long ears */}
      <ellipse cx="70" cy="35" rx="10" ry="35" fill={color} transform="rotate(-5 70 35)" />
      <ellipse cx="70" cy="35" rx="6" ry="28" fill="rgba(255,150,150,0.3)" transform="rotate(-5 70 35)" />
      <ellipse cx="110" cy="35" rx="10" ry="35" fill={color} transform="rotate(5 110 35)" />
      <ellipse cx="110" cy="35" rx="6" ry="28" fill="rgba(255,150,150,0.3)" transform="rotate(5 110 35)" />
      {/* Eyes */}
      <circle cx="78" cy="80" r="5" fill="white" />
      <circle cx="79" cy="79" r="3" fill="#333" />
      <circle cx="102" cy="80" r="5" fill="white" />
      <circle cx="101" cy="79" r="3" fill="#333" />
      {/* Nose */}
      <ellipse cx="90" cy="92" rx="4" ry="3" fill="#FF9999" />
      {/* Mouth */}
      <path d="M86 95 Q90 100 94 95" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Whiskers */}
      <line x1="62" y1="88" x2="78" y2="90" stroke="#333" strokeWidth="1" />
      <line x1="62" y1="94" x2="78" y2="94" stroke="#333" strokeWidth="1" />
      <line x1="102" y1="90" x2="118" y2="88" stroke="#333" strokeWidth="1" />
      <line x1="102" y1="94" x2="118" y2="94" stroke="#333" strokeWidth="1" />
      {/* Puff tail */}
      <circle cx="130" cy="145" r="12" fill="white" />
      {/* Feet */}
      <ellipse cx="70" cy="178" rx="16" ry="8" fill={color} />
      <ellipse cx="110" cy="178" rx="16" ry="8" fill={color} />
    </svg>
  ),

  S: ({ color }) => (
    // Snake
    <svg viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Coiled body */}
      <path d="M30 80 Q30 40 70 40 Q110 40 110 75 Q110 110 70 110 Q40 110 40 85 Q40 65 65 65 Q90 65 90 80"
        stroke={color} strokeWidth="22" strokeLinecap="round" fill="none" />
      {/* Head */}
      <ellipse cx="100" cy="80" rx="20" ry="16" fill={color} />
      {/* Eyes */}
      <circle cx="108" cy="74" r="4" fill="white" />
      <circle cx="109" cy="73" r="2.5" fill="#333" />
      {/* Tongue */}
      <path d="M118 82 L130 78 M118 82 L130 86" stroke="#E74C3C" strokeWidth="2" strokeLinecap="round" />
      {/* Pattern */}
      <circle cx="50" cy="40" r="4" fill="rgba(255,255,255,0.2)" />
      <circle cx="95" cy="45" r="3" fill="rgba(255,255,255,0.2)" />
      <circle cx="105" cy="105" r="4" fill="rgba(255,255,255,0.2)" />
      <circle cx="55" cy="105" r="3" fill="rgba(255,255,255,0.2)" />
    </svg>
  ),

  T: ({ color }) => (
    // Turtle
    <svg viewBox="0 0 220 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shell */}
      <ellipse cx="120" cy="80" rx="55" ry="40" fill={color} />
      <ellipse cx="120" cy="80" rx="55" ry="40" fill="rgba(0,0,0,0.06)" />
      {/* Shell pattern */}
      <path d="M120 42 L95 65 L120 80 L145 65 Z" fill="rgba(255,255,255,0.15)" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
      <path d="M120 80 L95 65 L75 80 L95 100 Z" fill="rgba(255,255,255,0.1)" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
      <path d="M120 80 L145 65 L165 80 L145 100 Z" fill="rgba(255,255,255,0.1)" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
      {/* Head */}
      <ellipse cx="58" cy="75" rx="18" ry="14" fill="#27AE60" />
      {/* Eye */}
      <circle cx="50" cy="70" r="4" fill="white" />
      <circle cx="51" cy="69" r="2.5" fill="#333" />
      {/* Smile */}
      <path d="M48 80 Q53 84 58 80" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Legs */}
      <ellipse cx="85" cy="115" rx="12" ry="10" fill="#27AE60" />
      <ellipse cx="155" cy="115" rx="12" ry="10" fill="#27AE60" />
      <ellipse cx="90" cy="55" rx="10" ry="8" fill="#27AE60" />
      <ellipse cx="150" cy="55" rx="10" ry="8" fill="#27AE60" />
      {/* Tail */}
      <path d="M175 85 Q185 88 188 82" stroke="#27AE60" strokeWidth="6" strokeLinecap="round" fill="none" />
    </svg>
  ),

  U: ({ color }) => (
    // Unicorn
    <svg viewBox="0 0 200 190" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="110" cy="120" rx="50" ry="35" fill={color} />
      {/* Neck */}
      <rect x="65" y="60" width="22" height="65" rx="11" fill={color} />
      {/* Head */}
      <ellipse cx="70" cy="50" rx="25" ry="20" fill={color} />
      {/* Horn */}
      <polygon points="70,8 64,32 76,32" fill="#F1C40F" />
      <polygon points="70,8 67,25 73,25" fill="rgba(255,255,255,0.4)" />
      {/* Eye */}
      <circle cx="60" cy="48" r="4" fill="white" />
      <circle cx="61" cy="47" r="2.5" fill="#8E44AD" />
      {/* Mane */}
      <path d="M82 35 Q95 30 90 45 Q88 55 98 50 Q105 48 100 60 Q96 70 108 65" stroke="#A29BFE" strokeWidth="6" strokeLinecap="round" fill="none" />
      {/* Legs */}
      <rect x="80" y="145" width="12" height="30" rx="6" fill={color} />
      <rect x="100" y="145" width="12" height="30" rx="6" fill={color} />
      <rect x="130" y="143" width="12" height="28" rx="6" fill={color} />
      <rect x="145" y="143" width="12" height="28" rx="6" fill={color} />
      {/* Tail */}
      <path d="M160 115 Q180 105 175 85 Q172 75 180 70 Q185 68 178 62" stroke="#A29BFE" strokeWidth="8" strokeLinecap="round" fill="none" />
    </svg>
  ),

  V: ({ color }) => (
    // Vulture
    <svg viewBox="0 0 200 190" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="100" cy="120" rx="40" ry="35" fill={color} />
      {/* Neck */}
      <rect x="85" y="55" width="18" height="50" rx="9" fill="rgba(255,150,150,0.5)" />
      {/* Head */}
      <circle cx="94" cy="45" r="18" fill="rgba(255,150,150,0.5)" />
      {/* Beak */}
      <path d="M80 50 L65 55 L78 56" fill="#F39C12" />
      {/* Eye */}
      <circle cx="88" cy="42" r="4" fill="white" />
      <circle cx="89" cy="41" r="2.5" fill="#333" />
      {/* Ruff/collar */}
      <ellipse cx="94" cy="72" rx="22" ry="10" fill={color} />
      {/* Wings */}
      <path d="M60 110 Q30 100 20 80" stroke={color} strokeWidth="16" strokeLinecap="round" fill="none" />
      <path d="M140 110 Q170 100 180 80" stroke={color} strokeWidth="16" strokeLinecap="round" fill="none" />
      {/* Legs */}
      <line x1="85" y1="150" x2="80" y2="178" stroke="#F39C12" strokeWidth="4" strokeLinecap="round" />
      <line x1="115" y1="150" x2="120" y2="178" stroke="#F39C12" strokeWidth="4" strokeLinecap="round" />
      {/* Talons */}
      <path d="M72 178 L80 178 L88 178" stroke="#F39C12" strokeWidth="3" strokeLinecap="round" />
      <path d="M112 178 L120 178 L128 178" stroke="#F39C12" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),

  W: ({ color }) => (
    // Whale
    <svg viewBox="0 0 240 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="120" cy="80" rx="80" ry="45" fill={color} />
      {/* Belly */}
      <ellipse cx="110" cy="95" rx="60" ry="25" fill="rgba(255,255,255,0.2)" />
      {/* Eye */}
      <circle cx="55" cy="70" r="6" fill="white" />
      <circle cx="56" cy="69" r="3.5" fill="#333" />
      {/* Mouth */}
      <path d="M42 88 Q70 95 100 88" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Tail */}
      <path d="M200 75 Q220 55 235 45" stroke={color} strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M200 85 Q220 105 235 115" stroke={color} strokeWidth="14" strokeLinecap="round" fill="none" />
      {/* Flipper */}
      <ellipse cx="90" cy="108" rx="20" ry="8" fill={color} transform="rotate(-15 90 108)" />
      {/* Water spout */}
      <path d="M70 38 Q65 20 55 10" stroke="#74B9FF" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M70 38 Q75 18 85 10" stroke="#74B9FF" strokeWidth="4" strokeLinecap="round" fill="none" />
      <circle cx="55" cy="8" r="3" fill="#74B9FF" />
      <circle cx="85" cy="8" r="3" fill="#74B9FF" />
      <circle cx="70" cy="12" r="2" fill="#74B9FF" />
    </svg>
  ),

  X: ({ color }) => (
    // X-ray Fish
    <svg viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body outline */}
      <ellipse cx="110" cy="75" rx="55" ry="35" fill={color} opacity="0.3" />
      <ellipse cx="110" cy="75" rx="55" ry="35" stroke={color} strokeWidth="3" fill="none" />
      {/* Skeleton */}
      <line x1="65" y1="75" x2="155" y2="75" stroke="white" strokeWidth="3" />
      {/* Ribs */}
      <line x1="80" y1="60" x2="85" y2="75" stroke="white" strokeWidth="2" />
      <line x1="80" y1="90" x2="85" y2="75" stroke="white" strokeWidth="2" />
      <line x1="95" y1="58" x2="100" y2="75" stroke="white" strokeWidth="2" />
      <line x1="95" y1="92" x2="100" y2="75" stroke="white" strokeWidth="2" />
      <line x1="110" y1="55" x2="115" y2="75" stroke="white" strokeWidth="2" />
      <line x1="110" y1="95" x2="115" y2="75" stroke="white" strokeWidth="2" />
      <line x1="125" y1="58" x2="130" y2="75" stroke="white" strokeWidth="2" />
      <line x1="125" y1="92" x2="130" y2="75" stroke="white" strokeWidth="2" />
      {/* Head */}
      <circle cx="60" cy="75" r="15" fill={color} opacity="0.3" stroke={color} strokeWidth="3" />
      {/* Eye */}
      <circle cx="55" cy="70" r="5" fill="white" />
      <circle cx="56" cy="69" r="3" fill="#333" />
      {/* Tail fin */}
      <polygon points="165,75 185,55 185,95" fill={color} opacity="0.4" stroke={color} strokeWidth="2" />
      {/* Top fin */}
      <polygon points="100,40 120,25 130,40" fill={color} opacity="0.4" stroke={color} strokeWidth="2" />
    </svg>
  ),

  Y: ({ color }) => (
    // Yak
    <svg viewBox="0 0 220 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body - big and shaggy */}
      <ellipse cx="120" cy="105" rx="60" ry="45" fill={color} />
      {/* Shaggy underfur */}
      <path d="M65 120 Q60 145 55 150 Q70 140 80 145 Q85 150 90 145 Q100 148 110 145 Q120 150 130 145 Q140 148 150 145 Q155 150 165 148 Q175 145 180 135"
        fill="rgba(0,0,0,0.15)" />
      {/* Head */}
      <circle cx="60" cy="65" r="28" fill={color} />
      {/* Horns */}
      <path d="M48 42 Q35 30 30 40" stroke="#FFFDE7" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M72 42 Q85 30 90 40" stroke="#FFFDE7" strokeWidth="6" strokeLinecap="round" fill="none" />
      {/* Eye */}
      <circle cx="55" cy="60" r="4" fill="white" />
      <circle cx="56" cy="59" r="2.5" fill="#333" />
      {/* Nose */}
      <ellipse cx="50" cy="75" rx="8" ry="5" fill="rgba(0,0,0,0.2)" />
      {/* Legs */}
      <rect x="85" y="140" width="16" height="30" rx="8" fill={color} />
      <rect x="115" y="138" width="16" height="30" rx="8" fill={color} />
      <rect x="150" y="136" width="16" height="28" rx="8" fill={color} />
      {/* Tail */}
      <path d="M180 100 Q195 90 192 75" stroke={color} strokeWidth="10" strokeLinecap="round" fill="none" />
    </svg>
  ),

  Z: ({ color }) => (
    // Zebra
    <svg viewBox="0 0 220 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="120" cy="105" rx="55" ry="38" fill="white" />
      {/* Stripes on body */}
      <path d="M75 85 Q90 80 80 105 Q75 120 85 125" stroke="#333" strokeWidth="5" fill="none" />
      <path d="M95 80 Q105 78 100 105 Q98 120 105 130" stroke="#333" strokeWidth="5" fill="none" />
      <path d="M115 78 Q125 76 122 105 Q120 120 128 132" stroke="#333" strokeWidth="5" fill="none" />
      <path d="M138 80 Q145 78 142 105 Q140 118 148 128" stroke="#333" strokeWidth="5" fill="none" />
      <path d="M155 85 Q162 82 160 105 Q158 115 165 122" stroke="#333" strokeWidth="5" fill="none" />
      {/* Neck */}
      <rect x="60" y="45" width="22" height="60" rx="11" fill="white" />
      <line x1="62" y1="55" x2="80" y2="52" stroke="#333" strokeWidth="4" />
      <line x1="62" y1="68" x2="80" y2="65" stroke="#333" strokeWidth="4" />
      <line x1="62" y1="80" x2="80" y2="78" stroke="#333" strokeWidth="4" />
      {/* Head */}
      <ellipse cx="60" cy="38" rx="22" ry="16" fill="white" />
      <ellipse cx="60" cy="38" rx="22" ry="16" stroke="#333" strokeWidth="1.5" fill="none" />
      {/* Ears */}
      <ellipse cx="48" cy="22" rx="5" ry="10" fill="white" stroke="#333" strokeWidth="1.5" />
      <ellipse cx="72" cy="22" rx="5" ry="10" fill="white" stroke="#333" strokeWidth="1.5" />
      {/* Eye */}
      <circle cx="50" cy="35" r="4" fill="white" stroke="#333" strokeWidth="1" />
      <circle cx="51" cy="34" r="2.5" fill="#333" />
      {/* Nose */}
      <circle cx="42" cy="42" r="2" fill="#333" />
      {/* Mane */}
      <path d="M55 22 Q60 15 65 22 Q70 15 75 22" fill="#333" />
      {/* Legs */}
      <rect x="85" y="135" width="12" height="32" rx="6" fill="white" stroke="#333" strokeWidth="1.5" />
      <rect x="105" y="133" width="12" height="32" rx="6" fill="white" stroke="#333" strokeWidth="1.5" />
      <rect x="135" y="133" width="12" height="30" rx="6" fill="white" stroke="#333" strokeWidth="1.5" />
      <rect x="155" y="133" width="12" height="30" rx="6" fill="white" stroke="#333" strokeWidth="1.5" />
      {/* Hooves */}
      <rect x="85" y="162" width="12" height="6" rx="3" fill="#333" />
      <rect x="105" y="160" width="12" height="6" rx="3" fill="#333" />
      <rect x="135" y="158" width="12" height="6" rx="3" fill="#333" />
      <rect x="155" y="158" width="12" height="6" rx="3" fill="#333" />
      {/* Tail */}
      <path d="M175 100 Q190 90 188 75" stroke="#333" strokeWidth="4" strokeLinecap="round" fill="none" />
    </svg>
  ),
};

export const ALPHABET_DATA = [
  { letter: 'A', animal: 'Aardvark', color: '#E74C3C', bg: '#FFF0F0' },
  { letter: 'B', animal: 'Bear', color: '#8B6914', bg: '#FFF8E7' },
  { letter: 'C', animal: 'Cat', color: '#F39C12', bg: '#FFF5E0' },
  { letter: 'D', animal: 'Dog', color: '#D4A574', bg: '#FFF3E8' },
  { letter: 'E', animal: 'Elephant', color: '#95A5A6', bg: '#F0F4F5' },
  { letter: 'F', animal: 'Fox', color: '#E67E22', bg: '#FFF2E0' },
  { letter: 'G', animal: 'Giraffe', color: '#F1C40F', bg: '#FFFDE7' },
  { letter: 'H', animal: 'Hippo', color: '#8E44AD', bg: '#F5EAFA' },
  { letter: 'I', animal: 'Iguana', color: '#27AE60', bg: '#E8F8EF' },
  { letter: 'J', animal: 'Jellyfish', color: '#E91E90', bg: '#FDE7F3' },
  { letter: 'K', animal: 'Koala', color: '#7F8C8D', bg: '#F2F3F3' },
  { letter: 'L', animal: 'Lion', color: '#D4A017', bg: '#FFF8E0' },
  { letter: 'M', animal: 'Monkey', color: '#8B6914', bg: '#FDF5E6' },
  { letter: 'N', animal: 'Narwhal', color: '#2980B9', bg: '#E8F4FD' },
  { letter: 'O', animal: 'Owl', color: '#6D4C41', bg: '#F5EDE8' },
  { letter: 'P', animal: 'Penguin', color: '#F39C12', bg: '#FFF5E0' },
  { letter: 'Q', animal: 'Quail', color: '#1ABC9C', bg: '#E8FBF5' },
  { letter: 'R', animal: 'Rabbit', color: '#FF6B6B', bg: '#FFE8E8' },
  { letter: 'S', animal: 'Snake', color: '#27AE60', bg: '#E8F8EF' },
  { letter: 'T', animal: 'Turtle', color: '#2ECC71', bg: '#EAFAF1' },
  { letter: 'U', animal: 'Unicorn', color: '#A29BFE', bg: '#F0EFFF' },
  { letter: 'V', animal: 'Vulture', color: '#5D4037', bg: '#F0EAE6' },
  { letter: 'W', animal: 'Whale', color: '#2980B9', bg: '#E8F4FD' },
  { letter: 'X', animal: 'X-ray Fish', color: '#74B9FF', bg: '#E8F4FF' },
  { letter: 'Y', animal: 'Yak', color: '#795548', bg: '#F0EAE3' },
  { letter: 'Z', animal: 'Zebra', color: '#333333', bg: '#F5F5F5' },
];

export function getAnimalSVG(letter) {
  return AnimalSVGs[letter] || null;
}
