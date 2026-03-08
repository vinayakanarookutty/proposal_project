import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────
   POETIC VERSES — beautiful Malayalam poetry
   Each verse unlocks as the reader "blooms" it
───────────────────────────────────────────── */
const VERSES = [
  {
    id: 1,
    icon: "🌙",
    malayalam: "നീ ഒരു കവിതയാണ്,\nഞാൻ ഇനിയും വായിച്ചു തീർന്നിട്ടില്ലാത്ത...",
    transliteration: "Nee oru kavithayāṇ,\njñān iniyum vāyichu thīrnniṭṭillātha...",
    meaning: "You are a poem I haven't finished reading yet",
    color: "#f9a8d4",
  },
  {
    id: 2,
    icon: "🌸",
    malayalam: "മഴ പോലെ നീ വന്നു,\nഉള്ളിലെ വേനൽ മറന്നു പോയി...",
    transliteration: "Mazha pole nee vannu,\nullile vēnal marannupōyi...",
    meaning: "Like rain you came, and I forgot the summer inside",
    color: "#fda4af",
  },
  {
    id: 3,
    icon: "✨",
    malayalam: "നിന്റെ ചിരി — ഒരു നിലാവ്,\nതാരങ്ങൾ നാണിച്ചു പോകുന്ന...",
    transliteration: "Ninte chiri — oru nilāv,\nthārangaḷ nāṇichu pōkunna...",
    meaning: "Your smile — a moonlight that makes the stars blush",
    color: "#f0abfc",
  },
  {
    id: 4,
    icon: "🌺",
    malayalam: "ഈ ഹൃദയം ഒരു കടൽ ആണ്,\nനീ മാത്രം അതിന്റെ തീരം...",
    transliteration: "Ee hṛdayam oru kaṭal āṇ,\nnee māthram atinte thīram...",
    meaning: "This heart is an ocean, and you alone are its shore",
    color: "#fb7185",
  },
  {
    id: 5,
    icon: "🦋",
    malayalam: "നിന്നോടൊപ്പം ഇരിക്കുമ്പോൾ,\nവാക്കുകൾ പൂക്കളാകുന്നു...",
    transliteration: "Ninnōṭoppam irikkumpōḷ,\nvākkukaḷ pūkkaḷākunnu...",
    meaning: "When I am with you, words bloom into flowers",
    color: "#e879f9",
  },
];

/* ── FLOATING PETAL PARTICLE ── */
type Petal = { id: number; x: string; y: string; size: number; dur: number; delay: number; char: string };

function usePetals() {
  const [petals, setPetals] = useState<Petal[]>([]);
  const counter = useRef(0);

  const burst = useCallback((count = 12) => {
    const chars = ["🌸", "🌺", "✿", "❀", "💮", "🌷", "💕", "✨", "🌼"];
    const newP: Petal[] = Array.from({ length: count }, () => {
      counter.current += 1;
      return {
        id: counter.current,
        x: Math.random() * 95 + "%",
        y: Math.random() * 30 + 60 + "%",
        size: 1 + Math.random() * 1.2,
        dur: 3 + Math.random() * 2,
        delay: Math.random() * 0.8,
        char: chars[Math.floor(Math.random() * chars.length)],
      };
    });
    setPetals(p => [...p, ...newP]);
    setTimeout(() => setPetals(p => p.filter(x => !newP.find(n => n.id === x.id))), 6000);
  }, []);

  return { petals, burst };
}

/* ── MAIN ── */
export default function MalayalamLoveProposal() {
  const [phase, setPhase] = useState<"intro" | "blooming" | "question" | "yes">("intro");
  const [unlockedIdx, setUnlockedIdx] = useState(-1);
  const [noCount, setNoCount] = useState(0);
  const [noStyle, setNoStyle] = useState<React.CSSProperties>({});
  const [yesGrow, setYesGrow] = useState(1);
  const [activeVerse, setActiveVerse] = useState<number | null>(null);
  const { petals, burst } = usePetals();
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-unlock verses one by one
  useEffect(() => {
    if (phase !== "blooming") return;
    if (unlockedIdx >= VERSES.length - 1) return;
    const t = setTimeout(() => setUnlockedIdx(i => i + 1), unlockedIdx === -1 ? 400 : 1100);
    return () => clearTimeout(t);
  }, [phase, unlockedIdx]);

  const handleNoClick = () => {
    const n = noCount + 1;
    setNoCount(n);
    setYesGrow(g => Math.min(g + 0.22, 2.8));
    const w = containerRef.current?.offsetWidth ?? 400;
    const h = containerRef.current?.offsetHeight ?? 600;
    setNoStyle({
      position: "absolute",
      left: Math.random() * (w - 130) + "px",
      top: Math.random() * (h - 50) + "px",
    });
    burst(6);
  };

  const handleYes = () => {
    setPhase("yes");
    burst(20);
    const iv = setInterval(() => burst(10), 800);
    setTimeout(() => clearInterval(iv), 7000);
  };

  const noLabels = [
    "ഇല്ല... 🙈", "ഉം... ഇല്ല?", "ഓ.. ഒന്ന് കൂടി?", "ഒളിക്കുകയാണ്! 🏃",
    "Button ഓടി! 😂", "ഇനി ഇവിടെ ഇല്ല~", "ഞാൻ invisible 🫥",
  ];
  const noLabel = noLabels[Math.min(noCount, noLabels.length - 1)];

  const noCountMsgs = [
    "", "ഒന്ന് കൂടി ആലോചിക്ക്... 🌸", "Button-ന് ലജ്ജ ഉണ്ട് 😳",
    "ഓടി തളർന്നു! 😩", "YES ഇപ്പൊ ഒരു മരം 🌳", "ഈ button marathon ഓടുന്നു 🏅",
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tiro+Malayalam:ital@0;1&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=DM+Serif+Display:ital@0;1&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --rose:    #f43f7f;
          --blush:   #fda4af;
          --petal:   #fce7f3;
          --soft:    #fff1f7;
          --mauve:   #d946a8;
          --lilac:   #f0abfc;
          --cream:   #fff8fb;
          --text:    #4a1942;
          --muted:   #c084a0;
        }

        html, body { height: 100%; overflow-x: hidden; }

        body {
          font-family: 'Cormorant Garamond', serif;
          background: var(--soft);
          min-height: 100vh;
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Ctext y='18' font-size='16'%3E🌸%3C/text%3E%3C/svg%3E") 12 12, auto;
        }

        /* ── PETALS ── */
        @keyframes petalDrift {
          0%   { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
          80%  { opacity: 0.6; }
          100% { transform: translateY(-110vh) rotate(540deg) scale(0.2); opacity: 0; }
        }
        .petal-fixed {
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          user-select: none;
        }

        /* ── BG MESH ── */
        .page-bg {
          min-height: 100vh;
          background:
            radial-gradient(ellipse 80% 60% at 20% 10%, #ffe4ef 0%, transparent 60%),
            radial-gradient(ellipse 60% 70% at 80% 80%, #fce7f3 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 50% 50%, #fff0fa 0%, transparent 70%),
            linear-gradient(160deg, #fff1f7 0%, #fce7f3 50%, #fdf4ff 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: 0 16px 80px;
          position: relative;
          overflow: hidden;
        }

        /* ── DECORATIVE CIRCLES ── */
        .deco-circle {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }

        /* ── HEADER ── */
        .site-header {
          width: 100%;
          max-width: 580px;
          text-align: center;
          padding: 52px 0 24px;
          position: relative;
          z-index: 2;
        }
        .site-header .eyebrow {
          font-family: 'DM Serif Display', serif;
          font-style: italic;
          font-size: 0.88rem;
          color: var(--muted);
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 14px;
          display: block;
          animation: fadeSlide 0.8s ease both;
        }
        .site-header h1 {
          font-family: 'Tiro Malayalam', serif;
          font-size: clamp(2rem, 6vw, 3rem);
          color: var(--text);
          line-height: 1.35;
          font-weight: 400;
          margin-bottom: 10px;
          animation: fadeSlide 0.9s 0.15s ease both;
        }
        .site-header .sub {
          font-style: italic;
          font-size: 1rem;
          color: var(--muted);
          animation: fadeSlide 0.9s 0.3s ease both;
        }

        /* ── DIVIDER ── */
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 28px 0;
          width: 100%;
          max-width: 420px;
        }
        .divider-line { flex: 1; height: 1px; background: linear-gradient(to right, transparent, var(--blush), transparent); }
        .divider-icon { color: var(--rose); font-size: 1.1rem; }

        /* ── INTRO CARD ── */
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heartbeat {
          0%,100% { transform: scale(1); }
          14%     { transform: scale(1.15); }
          28%     { transform: scale(1); }
          42%     { transform: scale(1.1); }
        }
        @keyframes floatGently {
          0%,100% { transform: translateY(0px) rotate(-1deg); }
          50%      { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes shimmer {
          from { background-position: -200% center; }
          to   { background-position: 200% center; }
        }
        @keyframes ringPulse {
          0%   { box-shadow: 0 0 0 0 rgba(244,63,127,0.35); }
          70%  { box-shadow: 0 0 0 22px rgba(244,63,127,0); }
          100% { box-shadow: 0 0 0 0 rgba(244,63,127,0); }
        }
        @keyframes verseReveal {
          from { opacity: 0; transform: translateY(30px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes bloomIn {
          0%   { opacity: 0; transform: scale(0.5) rotate(-8deg); }
          60%  { transform: scale(1.08) rotate(2deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes twinkle {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(0.7); }
        }
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .glass-card {
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1.5px solid rgba(253,164,175,0.4);
          border-radius: 32px;
          padding: 44px 36px;
          max-width: 560px;
          width: 100%;
          box-shadow:
            0 4px 40px rgba(244,63,127,0.08),
            0 1px 0 rgba(255,255,255,0.9) inset,
            0 -1px 0 rgba(253,164,175,0.2) inset;
          position: relative;
          z-index: 2;
          text-align: center;
          animation: fadeSlide 0.8s ease both;
        }

        .big-heart {
          font-size: 5rem;
          display: block;
          margin-bottom: 16px;
          animation: heartbeat 2.4s ease-in-out infinite, floatGently 4s ease-in-out infinite;
          line-height: 1;
          filter: drop-shadow(0 6px 20px rgba(244,63,127,0.35));
        }

        .intro-ml {
          font-family: 'Tiro Malayalam', serif;
          font-size: clamp(1.4rem, 3.5vw, 1.9rem);
          color: var(--text);
          line-height: 1.7;
          margin-bottom: 10px;
        }
        .intro-en {
          font-style: italic;
          font-size: 0.95rem;
          color: var(--muted);
          margin-bottom: 32px;
          line-height: 1.6;
        }

        /* ── BTN ── */
        .btn-bloom {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #f43f7f 0%, #d946a8 50%, #f43f7f 100%);
          background-size: 200% auto;
          color: white;
          border: none;
          border-radius: 50px;
          padding: 15px 40px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          font-weight: 600;
          letter-spacing: 1px;
          cursor: pointer;
          animation: shimmer 3s linear infinite, ringPulse 2s ease-in-out infinite;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 8px 28px rgba(244,63,127,0.35);
        }
        .btn-bloom:hover { transform: scale(1.05) translateY(-3px); box-shadow: 0 14px 36px rgba(244,63,127,0.45); }
        .btn-bloom:active { transform: scale(0.97); }

        /* ── VERSE GARDEN ── */
        .verse-garden {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
          max-width: 560px;
          position: relative;
          z-index: 2;
        }

        .verse-card {
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(14px);
          border-radius: 24px;
          padding: 28px 30px;
          border: 1.5px solid rgba(253,164,175,0.35);
          box-shadow: 0 4px 24px rgba(244,63,127,0.07);
          animation: verseReveal 0.7s cubic-bezier(0.22,1,0.36,1) both;
          cursor: pointer;
          transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
          position: relative;
          overflow: hidden;
          text-align: left;
        }
        .verse-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0) 60%, rgba(253,164,175,0.15) 100%);
          border-radius: inherit;
          pointer-events: none;
        }
        .verse-card:hover {
          transform: translateY(-4px) scale(1.01);
          box-shadow: 0 10px 40px rgba(244,63,127,0.14);
          border-color: rgba(244,63,127,0.4);
        }
        .verse-card.expanded {
          border-color: rgba(244,63,127,0.5);
          box-shadow: 0 8px 40px rgba(244,63,127,0.15);
        }

        .verse-icon {
          font-size: 2rem;
          margin-bottom: 10px;
          display: block;
          animation: floatGently 3.5s ease-in-out infinite;
        }
        .verse-ml {
          font-family: 'Tiro Malayalam', serif;
          font-size: clamp(1.1rem, 2.8vw, 1.35rem);
          color: var(--text);
          line-height: 1.9;
          white-space: pre-line;
          margin-bottom: 8px;
        }
        .verse-translit {
          font-style: italic;
          font-size: 0.82rem;
          color: var(--muted);
          line-height: 1.7;
          white-space: pre-line;
        }
        .verse-meaning {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px dashed rgba(244,63,127,0.25);
          font-size: 0.9rem;
          color: var(--rose);
          font-style: italic;
          font-weight: 600;
          animation: fadeSlide 0.4s ease both;
        }
        .verse-number {
          position: absolute;
          top: 20px; right: 22px;
          font-size: 2rem;
          font-weight: 600;
          color: rgba(244,63,127,0.12);
          font-family: 'DM Serif Display', serif;
          font-style: italic;
        }

        /* ── QUESTION SECTION ── */
        .question-wrap {
          width: 100%;
          max-width: 560px;
          z-index: 2;
          animation: fadeSlide 0.8s ease both;
        }
        .question-card {
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(20px);
          border-radius: 32px;
          padding: 44px 36px;
          border: 1.5px solid rgba(253,164,175,0.45);
          box-shadow: 0 8px 48px rgba(244,63,127,0.1);
          text-align: center;
          position: relative;
          overflow: visible;
        }
        .question-ml {
          font-family: 'Tiro Malayalam', serif;
          font-size: clamp(1.3rem, 3.5vw, 1.8rem);
          color: var(--text);
          line-height: 1.75;
          margin-bottom: 8px;
        }
        .question-en {
          font-style: italic;
          color: var(--muted);
          font-size: 0.92rem;
          margin-bottom: 36px;
        }

        .btn-yes {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #f43f7f, #d946a8, #f43f7f);
          background-size: 200% auto;
          color: white;
          border: none;
          border-radius: 50px;
          font-family: 'Tiro Malayalam', serif;
          font-size: 1.1rem;
          cursor: pointer;
          box-shadow: 0 8px 32px rgba(244,63,127,0.4);
          transition: box-shadow 0.2s;
          animation: shimmer 3s linear infinite, ringPulse 2s ease-in-out infinite;
          padding: 16px 52px;
          white-space: nowrap;
        }
        .btn-yes:hover { box-shadow: 0 14px 44px rgba(244,63,127,0.5); }

        .btn-no {
          background: rgba(255,255,255,0.7);
          color: var(--muted);
          border: 1.5px solid rgba(253,164,175,0.4);
          border-radius: 50px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.95rem;
          cursor: pointer;
          padding: 13px 30px;
          white-space: nowrap;
          transition: background 0.2s;
        }
        .btn-no:hover { background: rgba(255,241,247,0.9); }

        .btn-no-fly {
          position: absolute;
          background: rgba(255,255,255,0.85);
          color: #c084a0;
          border: 1.5px solid rgba(253,164,175,0.4);
          border-radius: 50px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.88rem;
          cursor: pointer;
          padding: 10px 22px;
          white-space: nowrap;
          backdrop-filter: blur(8px);
          transition: opacity 0.2s;
          z-index: 20;
        }

        .no-taunt {
          font-style: italic;
          font-size: 0.85rem;
          color: var(--blush);
          margin-top: 18px;
          animation: fadeSlide 0.3s ease both;
          min-height: 22px;
        }

        /* ── YES RESULT ── */
        .yes-wrap {
          width: 100%;
          max-width: 560px;
          z-index: 2;
          animation: bloomIn 0.8s cubic-bezier(0.34,1.56,0.64,1) both;
          text-align: center;
        }
        .yes-card {
          background: linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,225,240,0.85));
          backdrop-filter: blur(20px);
          border-radius: 32px;
          padding: 52px 36px;
          border: 2px solid rgba(253,164,175,0.5);
          box-shadow: 0 12px 60px rgba(244,63,127,0.18);
        }
        .yes-glow {
          font-size: 5.5rem;
          display: block;
          margin: 0 auto 20px;
          filter: drop-shadow(0 0 20px rgba(244,63,127,0.5));
          animation: heartbeat 1.6s ease-in-out infinite, floatGently 3s ease-in-out infinite;
        }
        .yes-title {
          font-family: 'Tiro Malayalam', serif;
          font-size: clamp(1.6rem, 4vw, 2.4rem);
          background: linear-gradient(135deg, #f43f7f, #d946a8, #a855f7);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 3s ease infinite;
          line-height: 1.4;
          margin-bottom: 10px;
        }
        .yes-poem {
          font-family: 'Tiro Malayalam', serif;
          font-size: clamp(1rem, 2.5vw, 1.2rem);
          color: var(--text);
          line-height: 2;
          margin: 24px 0;
          padding: 24px;
          background: rgba(255,241,247,0.7);
          border-radius: 20px;
          border-left: 3px solid var(--rose);
        }
        .yes-en {
          font-style: italic;
          font-size: 0.9rem;
          color: var(--muted);
          margin-top: 8px;
        }
        .twinkle-row {
          font-size: 1.8rem;
          letter-spacing: 8px;
          margin-top: 20px;
          display: block;
        }
        .twinkle-row span {
          display: inline-block;
          animation: twinkle 1.4s ease-in-out infinite;
        }
        .twinkle-row span:nth-child(2) { animation-delay: 0.2s; }
        .twinkle-row span:nth-child(3) { animation-delay: 0.4s; }
        .twinkle-row span:nth-child(4) { animation-delay: 0.6s; }
        .twinkle-row span:nth-child(5) { animation-delay: 0.8s; }

        /* ── SCROLL HINT ── */
        .scroll-hint {
          text-align: center;
          color: var(--muted);
          font-style: italic;
          font-size: 0.82rem;
          margin-top: 6px;
          opacity: 0.7;
          z-index: 2;
          position: relative;
        }

        /* ── FOOTER ── */
        .footer-sig {
          margin-top: 48px;
          text-align: center;
          font-style: italic;
          font-size: 0.85rem;
          color: rgba(192,132,160,0.6);
          z-index: 2;
          position: relative;
        }
      `}</style>

      {/* Floating petals */}
      {petals.map(p => (
        <span
          key={p.id}
          className="petal-fixed"
          style={{
            left: p.x,
            bottom: p.y,
            fontSize: `${p.size}rem`,
            animation: `petalDrift ${p.dur}s ${p.delay}s ease-out forwards`,
          }}
        >
          {p.char}
        </span>
      ))}

      {/* Decorative bg circles */}
      <div className="deco-circle" style={{ width: 420, height: 420, top: -100, right: -120, background: "radial-gradient(circle, rgba(253,164,175,0.18) 0%, transparent 70%)" }} />
      <div className="deco-circle" style={{ width: 360, height: 360, bottom: 40, left: -100, background: "radial-gradient(circle, rgba(240,171,252,0.15) 0%, transparent 70%)" }} />

      <div className="page-bg">

        {/* Header */}
        <header className="site-header">
          <span className="eyebrow">✦ ഒരു കവി, നിനക്കായി ✦</span>
          <h1>പ്രേമത്തിന്റെ<br />പൂന്തോട്ടം</h1>
          <p className="sub">A garden of love, blooming in Malayalam</p>
        </header>

        <div className="divider">
          <div className="divider-line" />
          <span className="divider-icon">🌸</span>
          <div className="divider-line" />
        </div>

        {/* ── PHASE: INTRO ── */}
        {phase === "intro" && (
          <div className="glass-card">
            <span className="big-heart">💗</span>
            <p className="intro-ml">
              "ഒരു കത്ത് എഴുതാൻ തുടങ്ങി,<br />
              വാക്കുകൾ പൂക്കളായി..."
            </p>
            <p className="intro-en">
              I started writing a letter,<br />
              and the words turned into flowers...
            </p>
            <button
              className="btn-bloom"
              onClick={() => { setPhase("blooming"); burst(10); }}
            >
              🌸 പൂക്കൾ തുറക്കൂ
            </button>
          </div>
        )}

        {/* ── PHASE: BLOOMING ── */}
        {phase === "blooming" && (
          <>
            <div className="verse-garden">
              {VERSES.map((v, i) => (
                unlockedIdx >= i && (
                  <div
                    key={v.id}
                    className={`verse-card ${activeVerse === v.id ? "expanded" : ""}`}
                    style={{ animationDelay: `${i * 0.08}s`, borderColor: activeVerse === v.id ? v.color : undefined }}
                    onClick={() => { setActiveVerse(activeVerse === v.id ? null : v.id); burst(5); }}
                  >
                    <span className="verse-number">{String(i + 1).padStart(2, "0")}</span>
                    <span className="verse-icon">{v.icon}</span>
                    <p className="verse-ml">{v.malayalam}</p>
                    <p className="verse-translit">{v.transliteration}</p>
                    {activeVerse === v.id && (
                      <p className="verse-meaning">✨ {v.meaning}</p>
                    )}
                  </div>
                )
              ))}
            </div>

            {unlockedIdx >= VERSES.length - 1 && (
              <>
                <div className="divider" style={{ marginTop: 32 }}>
                  <div className="divider-line" />
                  <span className="divider-icon">💕</span>
                  <div className="divider-line" />
                </div>
                <button
                  className="btn-bloom"
                  style={{ marginBottom: 8 }}
                  onClick={() => { setPhase("question"); burst(12); }}
                >
                  💌 ഒരു ചോദ്യം കൂടി...
                </button>
                <p className="scroll-hint">tap each verse to reveal its meaning 🌸</p>
              </>
            )}
          </>
        )}

        {/* ── PHASE: QUESTION ── */}
        {phase === "question" && (
          <div className="question-wrap">
            <div className="question-card" ref={containerRef}>
              <span style={{ fontSize: "3.5rem", display: "block", marginBottom: 16, animation: "floatGently 3s ease-in-out infinite" }}>🥀</span>

              <p className="question-ml">
                "നിന്റെ ജീവിതത്തിലെ<br />
                ഒരു ഇലയാകാൻ...<br />
                ഒരു ചെറിയ നിലാവാകാൻ...<br />
                സമ്മതമോ?" 🌙
              </p>
              <p className="question-en">
                May I be a leaf in your life,<br />
                a small moonlight beside you...?
              </p>

              <div style={{ position: "relative", minHeight: noCount > 0 ? 220 : "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                <button
                  className="btn-yes"
                  style={{ transform: `scale(${yesGrow})`, margin: `${Math.min(noCount * 4, 28)}px auto` }}
                  onClick={handleYes}
                >
                  🌸 അതേ... സമ്മതം!
                </button>

                {noCount === 0 ? (
                  <button className="btn-no" onClick={handleNoClick}>
                    ഇല്ല... 🙈
                  </button>
                ) : (
                  <button
                    className="btn-no-fly"
                    style={noStyle}
                    onClick={handleNoClick}
                  >
                    {noLabel}
                  </button>
                )}
              </div>

              {noCount > 0 && (
                <p className="no-taunt">
                  {noCountMsgs[Math.min(noCount, noCountMsgs.length - 1)]}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── PHASE: YES ── */}
        {phase === "yes" && (
          <div className="yes-wrap">
            <div className="yes-card">
              <span className="yes-glow">🌺</span>

              <h2 className="yes-title">
                "ഒരു പൂ വിരിഞ്ഞു...
                <br />ഹൃദയത്തിൽ!"
              </h2>
              <p style={{ fontStyle: "italic", color: "var(--muted)", fontSize: "0.9rem" }}>
                A flower bloomed... in my heart!
              </p>

              <div className="yes-poem">
                "നിന്റെ ഒരു വാക്ക് —<br />
                ആയിരം കവിതകളായി;<br />
                നിന്റെ ഒരു ചിരി —<br />
                ജീവിതം സുന്ദരമായി.<br />
                ഇനി നീ — എന്റെ<br />
                ഏറ്റവും പ്രിയപ്പെട്ട കവിത." 💗
                <p className="yes-en">
                  Your one word became a thousand poems;<br />
                  your one smile made life beautiful.<br />
                  From now — you are my most beloved poem.
                </p>
              </div>

              <span className="twinkle-row">
                <span>🌸</span><span>💕</span><span>✨</span><span>💗</span><span>🌺</span>
              </span>
            </div>
          </div>
        )}

        <p className="footer-sig">
          🌸 written with love, in the language of Kerala 🌸
        </p>

      </div>
    </>
  );
}