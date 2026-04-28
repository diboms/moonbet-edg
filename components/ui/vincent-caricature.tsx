"use client";

export function VincentCaricature({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 130 158" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Vincent CEO">
      <defs>
        <radialGradient id="v-skin" cx="44%" cy="28%" r="65%">
          <stop offset="0%" stopColor="#e8a06a"/>
          <stop offset="55%" stopColor="#c8784a"/>
          <stop offset="100%" stopColor="#b06030"/>
        </radialGradient>
        <radialGradient id="v-cheek" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c86040" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#c86040" stopOpacity="0"/>
        </radialGradient>
        <filter id="v-drop">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#00000020"/>
        </filter>
        <filter id="v-moon">
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="v-spark">
          <feGaussianBlur stdDeviation="1" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <clipPath id="v-gl"><circle cx="41" cy="64" r="16"/></clipPath>
        <clipPath id="v-gr"><circle cx="77" cy="64" r="16"/></clipPath>
      </defs>

      {/* ══ CORPS — blazer bleu marine ══ */}
      <path d="M12 158 Q10 130 24 114 Q40 104 64 102 Q88 104 104 114 Q118 130 116 158 Z" fill="#1a2f58"/>
      {/* Revers gauche */}
      <path d="M64 102 L50 118 L59 130 L64 118 Z" fill="#142448"/>
      {/* Revers droit */}
      <path d="M64 102 L78 118 L69 130 L64 118 Z" fill="#0e1c3c"/>
      {/* Chemise bleu clair — col déboutonné */}
      <path d="M55 102 L51 114 L64 130 L77 114 L73 102 Q69 97 64 97 Q59 97 55 102 Z" fill="#c8ddf0"/>
      {/* Col ouvert */}
      <path d="M55 102 L60 110 L64 107 L68 110 L73 102 Q69 97 64 97 Q59 97 55 102 Z" fill="#b8cee4"/>
      {/* Pas de cravate — ouverture naturelle */}
      <path d="M60 110 L64 124 L68 110 L64 107 Z" fill="#b0c8e0"/>

      {/* ── Cou ── */}
      <path d="M56 89 Q55 104 64 105 Q73 104 72 89 Q70 83 64 82 Q58 83 56 89 Z" fill="url(#v-skin)"/>

      {/* ══ TÊTE — ovale, légèrement plus haute que large ══ */}
      <ellipse cx="64" cy="55" rx="40" ry="46" fill="url(#v-skin)" filter="url(#v-drop)"/>

      {/* ── Oreilles ── */}
      <ellipse cx="24" cy="60" rx="5" ry="8.5" fill="#c07848"/>
      <path d="M26.5 53 Q23 60 26.5 67" fill="none" stroke="#a86030" strokeWidth="1.8"/>
      <ellipse cx="104" cy="60" rx="5" ry="8.5" fill="#c07848"/>
      <path d="M101.5 53 Q105 60 101.5 67" fill="none" stroke="#a86030" strokeWidth="1.8"/>

      {/* ══ CHEVEUX — sombres, courts, gris sur les côtés ══ */}
      {/* Masse principale noire */}
      <path d="M24 50 Q23 24 36 13 Q48 4 64 3 Q80 4 92 13 Q105 24 104 50 Q98 28 64 26 Q30 28 24 50 Z" fill="#1c1208"/>
      {/* Côtés légèrement gris */}
      <path d="M24 50 Q20 38 23 26 Q28 15 36 11 Q28 24 26 40 Z" fill="#3a3028"/>
      <path d="M104 50 Q108 38 105 26 Q100 15 92 11 Q100 24 102 40 Z" fill="#3a3028"/>
      {/* Ligne frontale naturelle */}
      <path d="M28 48 Q42 35 64 33 Q86 35 100 48 Q86 39 64 37 Q42 39 28 48 Z" fill="#100c04"/>
      {/* Cheveux gris tempes */}
      <path d="M24 46 Q26 38 30 32" stroke="#888070" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7"/>
      <path d="M26 50 Q28 42 32 36" stroke="#706858" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5"/>
      <path d="M104 46 Q102 38 98 32" stroke="#888070" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7"/>
      <path d="M102 50 Q100 42 96 36" stroke="#706858" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5"/>
      {/* Reflet */}
      <path d="M44 16 Q64 11 84 16 Q64 13 44 16 Z" fill="#4a3418" opacity="0.4"/>

      {/* ── Sourcils — sombres et épais ── */}
      <path d="M26 47 Q39 41 53 46" stroke="#18100a" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
      <path d="M75 46 Q89 41 102 47" stroke="#18100a" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
      {/* Léger froncement intérieur expressif */}
      <path d="M49 46 Q52 44 55 46" stroke="#0e0806" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M73 46 Q76 44 79 46" stroke="#0e0806" strokeWidth="2" fill="none" strokeLinecap="round"/>

      {/* ══ LUNETTES — RONDES ET FINES, noires ══ */}
      {/* Légère ombre */}
      <circle cx="41" cy="65" r="17" fill="#00000018"/>
      <circle cx="77" cy="65" r="17" fill="#00000018"/>
      {/* Teinte verre subtile */}
      <circle cx="41" cy="64" r="16" fill="#d0e0f0" opacity="0.15"/>
      <circle cx="77" cy="64" r="16" fill="#d0e0f0" opacity="0.15"/>
      {/* MONTURE FINE ET RONDE — strokeWidth fin ! */}
      <circle cx="41" cy="64" r="16" fill="none" stroke="#0c0a08" strokeWidth="2.2"/>
      <circle cx="77" cy="64" r="16" fill="none" stroke="#0c0a08" strokeWidth="2.2"/>
      {/* Pont fin */}
      <path d="M57 63 Q59 61 61 63" fill="none" stroke="#0c0a08" strokeWidth="2"/>
      {/* Branches fines */}
      <line x1="25" y1="62" x2="18" y2="65" stroke="#0c0a08" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="93" y1="62" x2="100" y2="65" stroke="#0c0a08" strokeWidth="1.8" strokeLinecap="round"/>
      {/* Reflet naturel sur les verres */}
      <path d="M29 55 Q36 51 43 54" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4"/>
      <path d="M65 55 Q72 51 79 54" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4"/>

      {/* ── Yeux sombres et expressifs ── */}
      <circle cx="41" cy="65" r="8" fill="#f0e8dc" clipPath="url(#v-gl)"/>
      <circle cx="77" cy="65" r="8" fill="#f0e8dc" clipPath="url(#v-gr)"/>
      <circle cx="41" cy="66" r="5.5" fill="#2e1c0c" clipPath="url(#v-gl)"/>
      <circle cx="77" cy="66" r="5.5" fill="#2e1c0c" clipPath="url(#v-gr)"/>
      <circle cx="41" cy="66" r="3" fill="#140c04" clipPath="url(#v-gl)"/>
      <circle cx="77" cy="66" r="3" fill="#140c04" clipPath="url(#v-gr)"/>
      <circle cx="43" cy="63.5" r="1.8" fill="white" opacity="0.9" clipPath="url(#v-gl)"/>
      <circle cx="79" cy="63.5" r="1.8" fill="white" opacity="0.9" clipPath="url(#v-gr)"/>

      {/* ── Nez ── */}
      <path d="M60 69 Q56 78 53 83 Q58 87 64 87 Q70 87 75 83 Q72 78 68 69" fill="none"/>
      <ellipse cx="55" cy="83" rx="5" ry="3.5" fill="#a86038" opacity="0.45"/>
      <ellipse cx="73" cy="83" rx="5" ry="3.5" fill="#a86038" opacity="0.45"/>
      <path d="M55 83 Q64 87 73 83" fill="none" stroke="#b06840" strokeWidth="1.5" strokeLinecap="round"/>

      {/* ── Joues ── */}
      <ellipse cx="26" cy="74" rx="10" ry="7" fill="url(#v-cheek)"/>
      <ellipse cx="102" cy="74" rx="10" ry="7" fill="url(#v-cheek)"/>

      {/* ══ BARBE — noire avec reflets gris, bien entretenue ══ */}
      {/* Base de la barbe — noire dominante */}
      <path d="M22 72 Q22 92 28 102 Q40 114 64 115 Q88 114 100 102 Q106 92 106 72 Q95 80 64 82 Q33 80 22 72 Z" fill="#28201a"/>
      {/* Couche noire principale */}
      <path d="M25 76 Q25 94 32 104 Q44 113 64 114 Q84 113 96 104 Q103 94 103 76 Q92 84 64 86 Q36 84 25 76 Z" fill="#1e1810"/>
      {/* Reflets gris sel & poivre — naturels, pas dominants */}
      <path d="M30 80 Q32 96 38 105" stroke="#706860" strokeWidth="1.2" fill="none" opacity="0.65"/>
      <path d="M34 78 Q36 94 42 103" stroke="#807870" strokeWidth="1" fill="none" opacity="0.5"/>
      <path d="M98 80 Q96 96 90 105" stroke="#706860" strokeWidth="1.2" fill="none" opacity="0.65"/>
      <path d="M94 78 Q92 94 86 103" stroke="#807870" strokeWidth="1" fill="none" opacity="0.5"/>
      <path d="M64 84 Q64 100 64 108" stroke="#686058" strokeWidth="1.2" fill="none" opacity="0.5"/>
      <path d="M52 82 Q52 98 54 106" stroke="#787068" strokeWidth="1" fill="none" opacity="0.45"/>
      <path d="M76 82 Q76 98 74 106" stroke="#787068" strokeWidth="1" fill="none" opacity="0.45"/>
      {/* Zone menton — un peu plus grise */}
      <path d="M44 100 Q50 112 64 113 Q78 112 84 100 Q76 108 64 109 Q52 108 44 100 Z" fill="#383028"/>
      {/* Moustache — noire, bien dessinée */}
      <path d="M46 86 Q55 92 64 90 Q73 92 82 86 Q73 96 64 94 Q55 96 46 86 Z" fill="#1a1410"/>
      {/* Espace entre moustache et lèvres */}
      <ellipse cx="64" cy="94" rx="10" ry="4" fill="#22180e"/>
      {/* Léger sourire avenant */}
      <path d="M54 93 Q64 98 74 93" stroke="#a07050" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d="M56 95 Q64 99 72 95" stroke="#904030" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5"/>

      {/* ══ BRAS LEVÉ ══ */}
      <path d="M98 114 Q115 95 118 70" stroke="#142448" strokeWidth="13" fill="none" strokeLinecap="round"/>
      <path d="M98 114 Q115 95 118 70" stroke="#1a2f58" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.4"/>
      {/* Manchette chemise bleue claire */}
      <ellipse cx="118" cy="68" rx="9" ry="6" fill="#c0d8f0"/>
      {/* Main */}
      <ellipse cx="119" cy="61" rx="9" ry="8" fill="#c87848"/>
      {/* Doigts */}
      <path d="M111 57 Q108 47 111 44" stroke="#c87848" strokeWidth="5.5" fill="none" strokeLinecap="round"/>
      <path d="M116 54 Q114 44 117 41" stroke="#c87848" strokeWidth="5" fill="none" strokeLinecap="round"/>
      <path d="M121 53 Q121 43 124 41" stroke="#c87848" strokeWidth="5" fill="none" strokeLinecap="round"/>
      <path d="M125 55 Q128 46 130 49" stroke="#c87848" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
      <path d="M110 64 Q103 60 105 53" stroke="#c87848" strokeWidth="5" fill="none" strokeLinecap="round"/>

      {/* ══ LUNES ANIMÉES ══ */}
      <text x="115" y="37" fontSize="24" textAnchor="middle" style={{userSelect:"none"}} filter="url(#v-moon)">
        🌙
        <animateTransform attributeName="transform" type="translate"
          values="0,0; -2,-8; 1,-4; 0,0" keyTimes="0;0.4;0.7;1" dur="2.3s" repeatCount="indefinite"/>
      </text>
      <text x="94" y="26" fontSize="14" textAnchor="middle" style={{userSelect:"none"}} filter="url(#v-spark)">
        🌙
        <animateTransform attributeName="transform" type="translate"
          values="0,0; -4,-7; -2,-3; 0,0" keyTimes="0;0.45;0.75;1" dur="3s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0.5;1" dur="3s" repeatCount="indefinite"/>
      </text>
      <text x="128" y="23" fontSize="9" textAnchor="middle" style={{userSelect:"none"}}>
        🌙
        <animateTransform attributeName="transform" type="translate"
          values="0,0; 3,-5; 0,-1; 0,0" keyTimes="0;0.5;0.8;1" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.8;0.25;0.8" dur="2s" repeatCount="indefinite"/>
      </text>
      <text x="104" y="13" fontSize="7.5" textAnchor="middle" style={{userSelect:"none"}}>
        🌙
        <animateTransform attributeName="transform" type="rotate"
          values="0 116 36; 360 116 36" dur="5.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.35;1;0.35" dur="2.7s" repeatCount="indefinite"/>
      </text>

      {/* ── Étincelles ── */}
      <g filter="url(#v-spark)">
        <polygon points="0,-6 1.4,-1.4 6,0 1.4,1.4 0,6 -1.4,1.4 -6,0 -1.4,-1.4"
          fill="#fbbf24" transform="translate(85,17)">
          <animateTransform attributeName="transform" type="scale" additive="sum" values="1;1.8;1" dur="1.7s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.6;1;0.6" dur="1.7s" repeatCount="indefinite"/>
        </polygon>
      </g>
      <g filter="url(#v-spark)">
        <polygon points="0,-4 1,-1 4,0 1,1 0,4 -1,1 -4,0 -1,-1"
          fill="#fde68a" transform="translate(129,14)">
          <animateTransform attributeName="transform" type="scale" additive="sum" values="1;2;0.7;1" dur="2.4s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2.4s" repeatCount="indefinite"/>
        </polygon>
      </g>
      <polygon points="0,-3 0.7,-0.7 3,0 0.7,0.7 0,3 -0.7,0.7 -3,0 -0.7,-0.7"
        fill="#fcd34d" transform="translate(108,7)">
        <animateTransform attributeName="transform" type="scale" additive="sum" values="1;2.4;1" dur="3.2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.2;0.85;0.2" dur="3.2s" repeatCount="indefinite"/>
      </polygon>

      {/* Traits de dynamisme */}
      <path d="M108 80 Q115 73 117 77" stroke="#fbbf24" strokeWidth="1.8" fill="none" strokeLinecap="round">
        <animate attributeName="opacity" values="0.5;0.05;0.5" dur="1.4s" repeatCount="indefinite"/>
      </path>
      <path d="M106 88 Q113 85 114 89" stroke="#fbbf24" strokeWidth="1" fill="none" strokeLinecap="round">
        <animate attributeName="opacity" values="0.3;0.05;0.3" dur="1.9s" repeatCount="indefinite"/>
      </path>
    </svg>
  );
}
