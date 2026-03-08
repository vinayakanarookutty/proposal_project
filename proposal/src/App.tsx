import { useState, useEffect, useRef } from "react";

const hearts = ["❤️", "💕", "💖", "💗", "💓", "💝", "🥰", "😍"];
const excuses = [
  "You laugh at my jokes even when they're terrible.",
  "You pretend not to notice when I eat the last snack.",
  "You still like me even after seeing my morning face.",
  "You tolerate my weird music choices without (much) complaint.",
  "You're the only one who gets my chaotic brain.",
  "You make boring errands feel like adventures.",
  "You haven't blocked me yet. That's true love.",
];

const noButtonMessages = [
  "Are you sure? 🥺",
  "That seems wrong...",
  "Think again!",
  "My heart is breaking 💔",
  "The button lied. Click YES.",
  "Error 404: Good decision not found",
  "Last chance... 👀",
  "This button is broken, try YES",
];

function FloatingHeart({ id, x, emoji, onDone }) {
  useEffect(() => {
    const t = setTimeout(() => onDone(id), 2800);
    return () => clearTimeout(t);
  }, [id, onDone]);
  return (
    <span
      style={{
        position: "fixed",
        left: x,
        bottom: "10%",
        fontSize: "2rem",
        animation: "floatUp 2.8s ease-out forwards",
        pointerEvents: "none",
        zIndex: 999,
        userSelect: "none",
      }}
    >
      {emoji}
    </span>
  );
}

export default function App() {
  const [stage, setStage] = useState(0); // 0=intro, 1=reasons, 2=question, 3=yes
  const [reasonIdx, setReasonIdx] = useState(0);
  const [noCount, setNoCount] = useState(0);
  const [yesScale, setYesScale] = useState(1);
  const [noPos, setNoPos] = useState({ x: null, y: null });
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [shake, setShake] = useState(false);
  const heartIdRef = useRef(0);
  const containerRef = useRef(null);

  const spawnHearts = () => {
    const newHearts = Array.from({ length: 6 }, () => {
      heartIdRef.current += 1;
      return {
        id: heartIdRef.current,
        x: Math.random() * 90 + "%",
        emoji: hearts[Math.floor(Math.random() * hearts.length)],
      };
    });
    setFloatingHearts((prev) => [...prev, ...newHearts]);
  };

  const removeHeart = (id) => {
    setFloatingHearts((prev) => prev.filter((h) => h.id !== id));
  };

  const handleNo = () => {
    const next = noCount + 1;
    setNoCount(next);
    setYesScale((s) => Math.min(s + 0.3, 3.5));
    setShake(true);
    setTimeout(() => setShake(false), 500);
    // Move NO button to random position
    const maxX = (containerRef.current?.offsetWidth || 400) - 120;
    const maxY = (containerRef.current?.offsetHeight || 400) - 60;
    setNoPos({
      x: Math.random() * maxX,
      y: Math.random() * maxY,
    });
  };

  const handleYes = () => {
    setStage(3);
    spawnHearts();
    const interval = setInterval(spawnHearts, 800);
    setTimeout(() => clearInterval(interval), 5000);
  };

  const currentNoMsg = noButtonMessages[Math.min(noCount, noButtonMessages.length - 1)];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=Nunito:wght@400;600;700;900&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #fff0f5;
          min-height: 100vh;
          font-family: 'Nunito', sans-serif;
        }

        @keyframes floatUp {
          0%   { transform: translateY(0) scale(1) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-80vh) scale(0.4) rotate(30deg); opacity: 0; }
        }

        @keyframes bop {
          0%, 100% { transform: scale(1) rotate(-2deg); }
          50%       { transform: scale(1.08) rotate(2deg); }
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25%       { transform: rotate(-6deg); }
          75%       { transform: rotate(6deg); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-6px); }
          80%       { transform: translateX(6px); }
        }

        @keyframes popIn {
          0%   { transform: scale(0) rotate(-10deg); opacity: 0; }
          70%  { transform: scale(1.1) rotate(3deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-12px); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        @keyframes starPop {
          0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
          60%  { transform: scale(1.3) rotate(10deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); }
        }

        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }

        @keyframes rainbowText {
          0%   { color: #ff6b9d; }
          16%  { color: #ff9f43; }
          33%  { color: #ffd93d; }
          50%  { color: #6bcb77; }
          66%  { color: #4d96ff; }
          83%  { color: #c77dff; }
          100% { color: #ff6b9d; }
        }

        .page-wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: radial-gradient(ellipse at 30% 20%, #ffe0ec 0%, #fff0f5 40%, #fde8ff 100%);
        }

        .card {
          background: white;
          border-radius: 32px;
          padding: 48px 40px;
          max-width: 520px;
          width: 100%;
          box-shadow:
            0 0 0 3px #ffb3cf,
            0 20px 60px rgba(255, 100, 150, 0.2),
            0 4px 20px rgba(0,0,0,0.06);
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .card::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 160px; height: 160px;
          background: radial-gradient(circle, #ffe0ec 0%, transparent 70%);
          border-radius: 50%;
        }

        .mascot {
          font-size: 5rem;
          animation: bop 1.6s ease-in-out infinite;
          display: block;
          margin-bottom: 12px;
          line-height: 1;
        }

        .title {
          font-family: 'Pacifico', cursive;
          font-size: 2rem;
          color: #e84393;
          margin-bottom: 12px;
          animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        .subtitle {
          font-size: 1rem;
          color: #a0627a;
          line-height: 1.6;
          margin-bottom: 28px;
          animation: slideUp 0.5s 0.3s ease both;
        }

        .btn-primary {
          background: linear-gradient(135deg, #ff6b9d, #e84393);
          color: white;
          border: none;
          border-radius: 50px;
          padding: 14px 36px;
          font-family: 'Nunito', sans-serif;
          font-size: 1.05rem;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(232, 67, 147, 0.35);
          transition: transform 0.15s, box-shadow 0.15s;
          animation: popIn 0.5s 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .btn-primary:hover {
          transform: scale(1.06) translateY(-2px);
          box-shadow: 0 10px 28px rgba(232, 67, 147, 0.4);
        }
        .btn-primary:active { transform: scale(0.97); }

        /* REASON CARD */
        .reason-badge {
          background: #fff0f7;
          border: 2px dashed #ffb3cf;
          border-radius: 20px;
          padding: 20px 24px;
          margin: 20px 0;
          font-size: 1.05rem;
          color: #c2185b;
          font-weight: 700;
          animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          min-height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .progress-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 20px;
        }
        .dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: #ffd6e7;
          transition: background 0.3s, transform 0.3s;
        }
        .dot.active { background: #e84393; transform: scale(1.3); }
        .dot.done   { background: #ffb3cf; }

        /* QUESTION STAGE */
        .question-zone {
          position: relative;
          min-height: 160px;
        }

        .yes-btn {
          background: linear-gradient(135deg, #ff6b9d, #e84393);
          color: white;
          border: none;
          border-radius: 50px;
          padding: 16px 48px;
          font-family: 'Nunito', sans-serif;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(232, 67, 147, 0.4);
          transition: transform 0.15s, box-shadow 0.15s;
          margin: 8px;
          font-size: 1.1rem;
        }
        .yes-btn:hover {
          transform: scale(1.07) translateY(-2px);
          box-shadow: 0 10px 30px rgba(232, 67, 147, 0.45);
        }

        .no-btn {
          background: #f0f0f0;
          color: #999;
          border: none;
          border-radius: 50px;
          padding: 13px 28px;
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
          font-size: 0.95rem;
          margin: 8px;
        }
        .no-btn:hover { background: #e8e8e8; }

        .no-btn-floating {
          position: absolute;
          background: #f0f0f0;
          color: #aaa;
          border: none;
          border-radius: 50px;
          padding: 12px 24px;
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          cursor: pointer;
          font-size: 0.88rem;
          transition: opacity 0.3s;
          white-space: nowrap;
        }
        .no-btn-floating:hover { background: #e0e0e0; }

        .shake { animation: shake 0.4s ease; }

        /* SUCCESS */
        .success-emoji {
          font-size: 6rem;
          animation: starPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          display: block;
          margin-bottom: 16px;
        }

        .confetti-row {
          font-size: 2rem;
          animation: bounce 0.8s ease-in-out infinite;
          letter-spacing: 6px;
        }

        .rainbow {
          font-family: 'Pacifico', cursive;
          font-size: 2.2rem;
          animation: rainbowText 2s linear infinite, popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        .tag {
          display: inline-block;
          background: #fff0f7;
          border: 1.5px solid #ffb3cf;
          border-radius: 100px;
          padding: 4px 14px;
          font-size: 0.78rem;
          color: #e84393;
          font-weight: 700;
          margin-bottom: 16px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .tiny-spin {
          display: inline-block;
          animation: spin 3s linear infinite;
        }
      `}</style>

      {floatingHearts.map((h) => (
        <FloatingHeart key={h.id} {...h} onDone={removeHeart} />
      ))}

      <div className="page-wrap">
        <div className="card" ref={containerRef}>

          {/* ─── STAGE 0: INTRO ─── */}
          {stage === 0 && (
            <>
              <span className="mascot">🐻</span>
              <div className="tag">⚠️ Very Important Notice</div>
              <h1 className="title">Excuse me, ma'am</h1>
              <p className="subtitle">
                I have conducted a thorough scientific investigation<br />
                and the results are <em>quite alarming</em>.<br /><br />
                It appears I may be <strong>completely, utterly,<br />and hopelessly in love with you.</strong><br /><br />
                Please review the evidence before proceeding.
              </p>
              <button className="btn-primary" onClick={() => setStage(1)}>
                Show me the evidence 🔍
              </button>
            </>
          )}

          {/* ─── STAGE 1: REASONS ─── */}
          {stage === 1 && (
            <>
              <span className="mascot">🕵️</span>
              <div className="tag">Exhibit {reasonIdx + 1} of {excuses.length}</div>
              <h1 className="title" style={{ fontSize: "1.6rem" }}>
                Why I Like You
              </h1>

              <div className="progress-dots">
                {excuses.map((_, i) => (
                  <div
                    key={i}
                    className={`dot ${i < reasonIdx ? "done" : ""} ${i === reasonIdx ? "active" : ""}`}
                  />
                ))}
              </div>

              <div className="reason-badge" key={reasonIdx}>
                ✨ {excuses[reasonIdx]}
              </div>

              {reasonIdx < excuses.length - 1 ? (
                <button
                  className="btn-primary"
                  onClick={() => setReasonIdx((i) => i + 1)}
                >
                  Next reason 👉
                </button>
              ) : (
                <button
                  className="btn-primary"
                  onClick={() => setStage(2)}
                  style={{ background: "linear-gradient(135deg, #ff6b9d, #c2185b)" }}
                >
                  OK I've seen enough 💌
                </button>
              )}
            </>
          )}

          {/* ─── STAGE 2: THE QUESTION ─── */}
          {stage === 2 && (
            <>
              <span className="mascot" style={{ animationDuration: "0.8s" }}>🥺</span>
              <h1 className="title">Sooo...</h1>
              <p className="subtitle">
                After extensive research, multiple sleepless nights,<br />
                and at least <em>three panic attacks</em>...<br /><br />
                <strong>Will you be my girlfriend?</strong> 💝<br /><br />
                <span style={{ fontSize: "0.85rem", color: "#c2185b", opacity: 0.8 }}>
                  (The YES button keeps growing. Just saying.)
                </span>
              </p>

              <div className="question-zone" style={{ minHeight: noPos.x !== null ? 200 : "auto" }}>
                <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 4 }}>
                  <button
                    className={`yes-btn ${shake ? "shake" : ""}`}
                    style={{ transform: `scale(${yesScale})`, margin: `${8 + noCount * 2}px 16px` }}
                    onClick={handleYes}
                  >
                    YES 💖
                  </button>

                  {noPos.x === null ? (
                    <button className="no-btn" onClick={handleNo}>
                      No
                    </button>
                  ) : (
                    <button
                      className="no-btn-floating"
                      style={{ left: noPos.x, top: noPos.y }}
                      onClick={handleNo}
                    >
                      {currentNoMsg}
                    </button>
                  )}
                </div>
              </div>

              {noCount > 0 && (
                <p style={{ marginTop: 20, fontSize: "0.85rem", color: "#e84393", animation: "slideUp 0.3s ease" }}>
                  {noCount === 1 && "The NO button seems to be malfunctioning 🤔"}
                  {noCount === 2 && "It keeps running away... very suspicious 👀"}
                  {noCount === 3 && "The YES button is flattered by the attention 💅"}
                  {noCount >= 4 && "At this point YES is basically a planet 🪐"}
                </p>
              )}
            </>
          )}

          {/* ─── STAGE 3: SUCCESS ─── */}
          {stage === 3 && (
            <>
              <span className="success-emoji">🎉</span>
              <div className="confetti-row">🎊💖✨🥳💕🌟</div>
              <br />
              <p className="rainbow">SHE SAID YES!!!</p>
              <br />
              <p className="subtitle" style={{ animation: "slideUp 0.5s 0.4s ease both" }}>
                Outstanding decision. 10/10. Would recommend.<br /><br />
                <strong>You've just made one very happy bear.</strong> 🐻💕<br /><br />
                <em>(I promise to always share snacks,<br />laugh at your jokes, and be your person.)</em>
              </p>
              <div style={{ fontSize: "2.5rem", animation: "bounce 0.7s ease-in-out infinite", marginTop: 12 }}>
                🥰
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}