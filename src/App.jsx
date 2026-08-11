import React, { useState, useEffect } from "react";

/* ------------------------------------------------------------------ */
/*  Ucademy — GCSE Crash Course, August 2026                            */
/*  One page funnel. Sell above, qualify below.                         */
/*  PROTOTYPE — nothing submits, stores or tracks.                      */
/* ------------------------------------------------------------------ */

const C = {
  ink: "#181716", paper: "#ffffff", mint: "#8ce5d2", yellow: "#ffde8d",
  coral: "#fc8a7b", red: "#e84b37", rule: "#e6e2dc", muted: "#6b6560",
};

/* Live booking page on Ucademy's own LMS. Both branches point here for now —
   if Usman provides a separate crash course link, only this line changes. */
const BOOKING_URL = "https://learn.ucademy.co.uk/book/---free-consultation-with-ucademy--crash-course";

/* Same creative as the ad. Drive /preview is the embeddable form of the URL.
   Replace with a hosted mp4 before this takes paid traffic. */
const VSL_URL = "https://drive.google.com/file/d/1SvNEcS3sydlr5EfCrgV86crq0hdasnPN/preview";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Karla:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap');

.uc, .uc * { box-sizing: border-box; }
.uc {
  font-family: 'Karla', system-ui, sans-serif; color: ${C.ink}; background: ${C.paper};
  color-scheme: light; line-height: 1.55; -webkit-font-smoothing: antialiased;
  text-align: left; min-height: 100vh;
}
.uc-wrap { max-width: 660px; margin: 0 auto; padding: 0 22px; }

.uc h1, .uc h2, .uc h3 {
  font-family: 'Bricolage Grotesque', system-ui, sans-serif; color: ${C.ink};
  margin: 0; letter-spacing: -0.02em; line-height: 1.1;
}
.uc h1 { font-size: clamp(30px, 7vw, 46px); font-weight: 800; }
.uc h2 { font-size: clamp(21px, 4.4vw, 29px); font-weight: 700; }
.uc h3 { font-size: 19px; font-weight: 700; }
.uc p { margin: 0 0 14px; font-size: 16.5px; color: ${C.ink}; }

.uc-marks { font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: ${C.muted}; }
.uc-qnum { font-family: 'Space Mono', monospace; font-size: 12px; font-weight: 700; color: ${C.red}; border: 1.5px solid ${C.red}; border-radius: 3px; padding: 1px 7px; display: inline-block; margin-bottom: 12px; }
.uc-hl { background: linear-gradient(180deg, transparent 52%, ${C.yellow} 52%, ${C.yellow} 94%, transparent 94%); padding: 0 2px; }
.uc-sec { padding: 46px 0; border-top: 1px solid ${C.rule}; }
.uc-eyebrow { font-family: 'Space Mono', monospace; font-size: 11.5px; letter-spacing: 0.14em; text-transform: uppercase; color: ${C.muted}; margin-bottom: 14px; }

.uc-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; padding: 16px 22px; border: none; border-radius: 6px;
  background: ${C.red}; color: #fff; cursor: pointer; text-decoration: none;
  font-family: 'Bricolage Grotesque', sans-serif; font-size: 17px; font-weight: 700;
  transition: transform .12s ease, background .12s ease;
}
.uc-btn:hover { background: #d13f2c; transform: translateY(-1px); color: #fff; }
.uc-btn:visited { color: #fff; }
.uc-btn:disabled { background: ${C.rule}; color: ${C.muted}; cursor: not-allowed; transform: none; }
.uc-btn:focus-visible, .uc-opt:focus-visible, .uc-input:focus-visible, .uc-sticky button:focus-visible { outline: 3px solid ${C.mint}; outline-offset: 2px; }

/* sticky mobile CTA — appears once the hero button scrolls away */
.uc-sticky {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 30;
  padding: 10px 16px calc(10px + env(safe-area-inset-bottom));
  background: rgba(255,255,255,.94); backdrop-filter: blur(8px);
  border-top: 1px solid ${C.rule};
  transform: translateY(110%); transition: transform .2s ease;
}
.uc-sticky.show { transform: translateY(0); }
.uc-sticky button { width: 100%; padding: 14px; border: none; border-radius: 6px; background: ${C.red}; color: #fff; cursor: pointer; font-family: 'Bricolage Grotesque', sans-serif; font-size: 16px; font-weight: 700; }
@media (min-width: 700px) { .uc-sticky { display: none; } }

.uc-cal { border: 1.5px solid ${C.ink}; border-radius: 8px; overflow: hidden; margin: 22px 0 8px; }
.uc-cal-top { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 10px 14px; background: ${C.ink}; color: #fff; font-family: 'Space Mono', monospace; font-size: 11.5px; letter-spacing: 0.1em; text-transform: uppercase; }
.uc-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background: ${C.rule}; }
.uc-dow { background: #faf8f5; text-align: center; padding: 6px 0; font-family: 'Space Mono', monospace; font-size: 10px; color: ${C.muted}; }
.uc-day { background: #fff; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-family: 'Space Mono', monospace; font-size: 13px; color: ${C.ink}; }
.uc-day.plain { color: #c9c4bd; }
.uc-day.gone { background: #f3f1ee; color: #b8b2ab; text-decoration: line-through; }
.uc-day.live { background: ${C.mint}; font-weight: 700; }
.uc-day.today { box-shadow: inset 0 0 0 2.5px ${C.red}; font-weight: 700; }
.uc-legend { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 10px; }
.uc-legend span { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: ${C.muted}; }
.uc-swatch { width: 12px; height: 12px; border-radius: 2px; display: inline-block; }

.uc-video { position: relative; aspect-ratio: 16/9; border: 1.5px solid ${C.ink}; border-radius: 8px; overflow: hidden; background: ${C.ink}; }
.uc-video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: none; }

.uc-book { border: 1.5px solid ${C.rule}; border-radius: 8px; overflow: hidden; margin: 18px 0 16px; height: 620px; background: #faf8f5; }
.uc-book iframe { width: 100%; height: 100%; border: none; display: block; }

.uc-list { list-style: none; padding: 0; margin: 0; }
.uc-list li { padding: 12px 0 12px 30px; border-bottom: 1px solid ${C.rule}; position: relative; font-size: 16.5px; }
.uc-list li:last-child { border-bottom: none; }
.uc-list li::before { content: "\\2713"; position: absolute; left: 2px; top: 12px; color: ${C.red}; font-weight: 700; }

.uc-tbc { display: inline-block; background: ${C.yellow}; color: ${C.ink}; font-family: 'Space Mono', monospace; font-size: 10.5px; letter-spacing: 0.06em; padding: 2px 6px; border-radius: 3px; margin-left: 6px; }

.uc-quote { border-left: 3px solid ${C.coral}; padding: 4px 0 4px 16px; margin: 0 0 20px; }
.uc-quote cite { display: block; margin-top: 6px; font-size: 13.5px; color: ${C.muted}; font-style: normal; }

.uc-faq { border-bottom: 1px solid ${C.rule}; }
.uc-faq:first-of-type { border-top: 1px solid ${C.rule}; }
.uc-faq button { width: 100%; text-align: left; background: none; border: none; cursor: pointer; padding: 15px 0; font-family: 'Karla', sans-serif; font-size: 16.5px; font-weight: 700; color: ${C.ink}; display: flex; justify-content: space-between; gap: 14px; align-items: center; }
.uc-faq div { padding: 0 0 15px; font-size: 16px; color: ${C.muted}; }

.uc-quiz { border: 2px solid ${C.ink}; border-radius: 10px; padding: 28px 22px; background: #fff; box-shadow: 6px 6px 0 ${C.mint}; scroll-margin-top: 20px; }
.uc-progress { display: flex; gap: 4px; margin-bottom: 20px; }
.uc-tick { height: 5px; flex: 1; background: ${C.rule}; border-radius: 3px; }
.uc-tick.on { background: ${C.red}; }
.uc-input { width: 100%; padding: 14px; border: 1.5px solid ${C.rule}; border-radius: 6px; font-family: 'Karla', sans-serif; font-size: 16.5px; margin-bottom: 14px; background: #fff; color: ${C.ink}; }
.uc-input:focus { border-color: ${C.ink}; }
.uc-hint { font-size: 13.5px; color: ${C.muted}; margin: -6px 0 16px; }
.uc-opt { width: 100%; text-align: left; padding: 14px 16px; margin-bottom: 9px; border: 1.5px solid ${C.rule}; border-radius: 6px; background: #fff; cursor: pointer; font-family: 'Karla', sans-serif; font-size: 16.5px; color: ${C.ink}; display: flex; justify-content: space-between; align-items: center; gap: 10px; transition: border-color .12s ease, background .12s ease; }
.uc-opt:hover { border-color: ${C.ink}; }
.uc-opt.sel { border-color: ${C.red}; background: #fff6f4; font-weight: 700; }
.uc-back { background: none; border: none; color: ${C.muted}; cursor: pointer; font-family: 'Space Mono', monospace; font-size: 11.5px; letter-spacing: 0.08em; text-transform: uppercase; padding: 12px 0 0; display: block; }
.uc-bar { height: 6px; background: ${C.rule}; border-radius: 4px; overflow: hidden; margin: 20px 0 10px; }
.uc-bar i { display: block; height: 100%; background: ${C.red}; }

.uc-recap { border: 1.5px solid ${C.rule}; border-radius: 8px; padding: 4px 16px; margin: 18px 0; }
.uc-recap dl { margin: 0; }
.uc-recap div { display: flex; justify-content: space-between; gap: 14px; padding: 11px 0; border-bottom: 1px solid ${C.rule}; }
.uc-recap div:last-child { border-bottom: none; }
.uc-recap dt { font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: ${C.muted}; padding-top: 3px; }
.uc-recap dd { margin: 0; font-size: 16px; font-weight: 700; text-align: right; }

.uc-note { margin-top: 34px; padding: 16px 18px; border: 1.5px dashed ${C.coral}; border-radius: 8px; background: #fffaf9; font-size: 14.5px; color: ${C.muted}; }
.uc-note b { color: ${C.red}; }
.uc-foot { padding: 34px 0 90px; font-size: 13px; color: ${C.muted}; border-top: 1px solid ${C.rule}; }

@media (prefers-reduced-motion: reduce) { .uc *, .uc *::before { transition: none !important; } }
`;

/* ---------------------------- calendar ---------------------------- */
const TODAY = 10;
const SESSION_DAYS = [3, 4, 5, 6, 7, 10, 11, 12, 13, 14, 17, 18, 19, 20, 21];

function Calendar() {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  return (
    <div>
      <div className="uc-cal">
        <div className="uc-cal-top">
          <span>August 2026</span>
          <span>{SESSION_DAYS.filter((d) => d >= TODAY).length} sessions left</span>
        </div>
        <div className="uc-cal-grid">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <div className="uc-dow" key={i}>{d}</div>)}
          {Array.from({ length: 5 }).map((_, i) => <div className="uc-day plain" key={"b" + i} />)}
          {days.map((d) => {
            const s = SESSION_DAYS.includes(d);
            const cls = ["uc-day", s && d < TODAY ? "gone" : "", s && d >= TODAY ? "live" : "", !s ? "plain" : "", d === TODAY ? "today" : ""].filter(Boolean).join(" ");
            return <div className={cls} key={d}>{d}</div>;
          })}
        </div>
      </div>
      <div className="uc-legend">
        <span><i className="uc-swatch" style={{ background: C.mint }} /> Sessions still to come</span>
        <span><i className="uc-swatch" style={{ background: "#f3f1ee" }} /> Already run</span>
      </div>
      <p className="uc-marks" style={{ marginTop: 12 }}>Dates illustrative — confirm the real schedule before launch</p>
    </div>
  );
}

/* ------------------------------ quiz ------------------------------ */
const digits = (s) => s.replace(/\D/g, "");
const YEARS = ["Year 11", "Year 10", "Year 9", "Already finished, resitting"];
const SUBJECTS = ["Maths", "English Language", "English Literature", "Biology", "Chemistry", "Physics"];
const GRADES = ["Mostly 1 to 3", "Mostly 4 to 5", "Mostly 6 to 7", "Grade 8 to 9, aiming higher", "Not sure yet"];
const TOTAL = 7;
const EMPTY = { year: "", subjects: [], grades: "", name: "", email: "", phone: "" };

/* Defined at module scope on purpose. Declaring a component inside another
   component makes React treat it as a new type on every render, which unmounts
   any input inside it and loses focus after a single keystroke. */
const Ticks = ({ at }) => (
  <div className="uc-progress" aria-hidden="true">
    {Array.from({ length: TOTAL }).map((_, i) => (
      <div key={i} className={"uc-tick" + (i <= at ? " on" : "")} />
    ))}
  </div>
);

const Screen = ({ at, tag, title, hint, children, onBack }) => (
  <>
    <Ticks at={at} />
    <span className="uc-qnum">{tag}</span>
    <h3 style={{ marginBottom: hint ? 8 : 18 }}>{title}</h3>
    {hint && <p className="uc-hint" style={{ margin: "0 0 18px" }}>{hint}</p>}
    {children}
    {onBack && <button className="uc-back" onClick={onBack}>← Back</button>}
  </>
);

function Quiz() {
  const [step, setStep] = useState(0);
  const [a, setA] = useState(EMPTY);
  const [pct, setPct] = useState(0);

  const set = (k, v) => setA((p) => ({ ...p, [k]: v }));
  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);
  const reset = () => { setA(EMPTY); setStep(0); };
  const toggle = (s) => setA((p) => ({ ...p, subjects: p.subjects.includes(s) ? p.subjects.filter((x) => x !== s) : [...p.subjects, s] }));

  useEffect(() => {
    if (step !== 7) return;
    setPct(0);
    const t = setInterval(() => setPct((p) => {
      if (p >= 100) { clearInterval(t); setTimeout(() => setStep(8), 300); return 100; }
      return p + 4;
    }), 65);
    return () => clearInterval(t);
  }, [step]);

  const fit = a.year === "Year 11";

  return (
    <div className="uc-quiz" id="quiz">
      {step === 0 && (
        <Screen at={0} tag="Question 1 of 3" title="What year is your child going into this September?">
          {YEARS.map((y) => (
            <button key={y} className={"uc-opt" + (a.year === y ? " sel" : "")} onClick={() => { set("year", y); next(); }}>
              {y}{y === "Year 11" && <span className="uc-marks">Crash course</span>}
            </button>
          ))}
        </Screen>
      )}
      {step === 1 && (
        <Screen at={1} tag="Question 2 of 3" title="Which subjects need the most catching up?" hint="Pick as many as apply." onBack={back}>
          {SUBJECTS.map((s) => (
            <button key={s} className={"uc-opt" + (a.subjects.includes(s) ? " sel" : "")} onClick={() => toggle(s)}>
              {s}<span>{a.subjects.includes(s) ? "\u2713" : ""}</span>
            </button>
          ))}
          <button className="uc-btn" style={{ marginTop: 10 }} disabled={!a.subjects.length} onClick={next}>Continue</button>
        </Screen>
      )}
      {step === 2 && (
        <Screen at={2} tag="Question 3 of 3" title="What grades did they finish Year 10 on?" onBack={back}>
          {GRADES.map((g) => (
            <button key={g} className={"uc-opt" + (a.grades === g ? " sel" : "")} onClick={() => { set("grades", g); next(); }}>{g}</button>
          ))}
        </Screen>
      )}
      {step === 3 && (
        <>
          <Ticks at={3} />
          <span className="uc-qnum">Your answers</span>
          <h3 style={{ marginBottom: 14 }}>
            {fit ? "Good news. This is exactly what the course is built for." : "Thanks. Let's find the right fit."}
          </h3>
          <p style={{ color: C.muted, marginBottom: 4 }}>
            {fit
              ? "Students going into Year 11 with gaps in " + a.subjects.slice(0, 2).join(" and ").toLowerCase() + " are who Usman designed these fifteen sessions around."
              : "The crash course is built for students going into Year 11, so we'll point you somewhere more useful in a moment."}
          </p>
          <div className="uc-recap">
            <dl>
              <div><dt>Year</dt><dd>{a.year}</dd></div>
              <div><dt>Subjects</dt><dd>{a.subjects.join(", ")}</dd></div>
              <div><dt>Current grades</dt><dd>{a.grades}</dd></div>
            </dl>
          </div>
          <button className="uc-btn" onClick={next}>Continue</button>
          <button className="uc-back" onClick={back}>← Back</button>
        </>
      )}
      {step === 4 && (
        <Screen at={4} tag="Almost done" title="Nearly there. What should we call you?" onBack={back}>
          <input className="uc-input" placeholder="First name" maxLength={40} value={a.name}
            onChange={(e) => set("name", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && a.name.trim() && next()} />
          <button className="uc-btn" disabled={!a.name.trim()} onClick={next}>Continue</button>
        </Screen>
      )}
      {step === 5 && (
        <Screen at={5} tag="Almost done" title={"Thanks, " + a.name + ". Where should we send the August dates?"} onBack={back}>
          <input className="uc-input" type="email" placeholder="Email address" maxLength={80} value={a.email}
            onChange={(e) => set("email", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && a.email.includes("@") && next()} />
          <p className="uc-hint">We'll only use this to send the session dates and confirm the place.</p>
          <button className="uc-btn" disabled={!a.email.includes("@")} onClick={next}>Continue</button>
        </Screen>
      )}
      {step === 6 && (
        <Screen at={6} tag="Last step" title="What's the best mobile number to reach you on?" onBack={back}>
          <input className="uc-input" type="tel" inputMode="numeric" maxLength={16}
            placeholder="Mobile number" value={a.phone}
            onChange={(e) => set("phone", e.target.value.replace(/[^\d+ ]/g, ""))}
            onKeyDown={(e) => e.key === "Enter" && digits(a.phone).length >= 10 && next()} />
          <p className="uc-hint">We'll only use this to confirm your child's place and send the session dates.</p>
          <button className="uc-btn" disabled={digits(a.phone).length < 10} onClick={next}>
            {fit ? "Check my child's place" : "See what fits"}
          </button>
        </Screen>
      )}
      {step === 7 && (
        <div style={{ textAlign: "center", padding: "26px 0" }}>
          <h3>Checking places left on the August course…</h3>
          <div className="uc-bar"><i style={{ width: pct + "%" }} /></div>
          <p className="uc-marks">{pct}%</p>
        </div>
      )}
      {step === 8 && fit && (
        <>
          <h2 style={{ marginBottom: 12 }}>{a.name}, there's a place for your child on the August course.</h2>
          <p>Pick a time below and we'll talk through what your child needs, confirm their place and send the session dates. Sessions run across August, so every day you wait is a session they miss.</p>

          <a className="uc-btn" href={BOOKING_URL} target="_blank" rel="noopener noreferrer" onClick={next}>
            Open the booking page
          </a>
          <button className="uc-back" onClick={reset}>↺ Start again</button>
        </>
      )}
      {step === 8 && !fit && (
        <>
          <h2 style={{ marginBottom: 12 }}>{a.name}, the crash course isn't the right fit.</h2>
          <p>It's built specifically for students going into Year 11. For {a.year.toLowerCase()}, a free grade boosting consultation will be more use. We'll look at where they are now and what to work on.</p>
          <a className="uc-btn" href={BOOKING_URL} target="_blank" rel="noopener noreferrer" onClick={next}>
            Book a free consultation instead
          </a>
          <p className="uc-hint" style={{ marginTop: 14, marginBottom: 0 }}>This branch currently shares the crash course booking link. Swap it once the evergreen consultation funnel has its own.</p>
          <button className="uc-back" onClick={reset}>↺ Start again</button>
        </>
      )}
      {step === 9 && (
        <>
          <span className="uc-qnum">Confirmed</span>
          <h2 style={{ marginBottom: 12 }}>You're booked, {a.name}.</h2>
          <p>We've sent a confirmation to {a.email} and we'll text {a.phone} if anything changes.</p>
          <div className="uc-recap">
            <dl>
              <div><dt>Child's year</dt><dd>{a.year}</dd></div>
              <div><dt>Subjects</dt><dd>{a.subjects.join(", ")}</dd></div>
              <div><dt>Current grades</dt><dd>{a.grades}</dd></div>
              <div><dt>Course</dt><dd>August crash course</dd></div>
            </dl>
          </div>
          <h3 style={{ marginBottom: 10 }}>Before the call</h3>
          <ul className="uc-list" style={{ marginBottom: 18 }}>
            <li>Have their latest report or mock results to hand</li>
            <li>Watch the short video we've emailed you, it saves ten minutes on the call</li>
            <li>Add the calendar invite so it doesn't get lost</li>
          </ul>
          <p className="uc-hint" style={{ marginBottom: 0 }}>Prototype only — the booking itself happens on the Ucademy page that opened in a new tab.</p>
          <button className="uc-back" onClick={reset}>↺ Start again</button>
        </>
      )}
    </div>
  );
}

/* ------------------------------- FAQ ------------------------------ */
const FAQS = [
  { q: "It's already mid-August. Has my child missed too much?", a: "Needs an answer from Usman. Recordings, a catch-up session, or a stated cut-off date all work here. Nothing does not — this is the first thing a parent landing today will ask.", flag: true },
  { q: "What if the sessions clash with our holiday?", a: "Say plainly whether recordings are available.", flag: true },
  { q: "Is this group or one to one?", a: "Small group, live and interactive. Confirm the group size.", flag: true },
  { q: "Which exam board does it cover?", a: "To confirm.", flag: true },
  { q: "What happens after August?", a: "Your child leaves with a written plan for September onwards.", flag: false },
];

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <div>
      {FAQS.map((f, i) => (
        <div className="uc-faq" key={i}>
          <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
            <span>{f.q}</span><span style={{ color: C.red }}>{open === i ? "\u2212" : "+"}</span>
          </button>
          {open === i && <div>{f.flag && <span className="uc-tbc">To confirm</span>} {f.a}</div>}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------- app ------------------------------ */
export default function App() {
  const [sticky, setSticky] = useState(false);

  const goQuiz = () => {
    const el = document.getElementById("quiz");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("hero-cta");
      const quiz = document.getElementById("quiz");
      if (!hero || !quiz) return;
      const heroGone = hero.getBoundingClientRect().bottom < 0;
      const quizVisible = quiz.getBoundingClientRect().top < window.innerHeight - 120;
      setSticky(heroGone && !quizVisible);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="uc">
      <style>{CSS}</style>

      {/* HERO */}
      <div className="uc-wrap" style={{ paddingTop: 44 }}>
        <div className="uc-eyebrow">Starting now · Running all August · Taught by Usman</div>
        <h1>Year 10 going into<br />Year 11 this September?</h1>
        <p style={{ fontSize: 18, marginTop: 18 }}>
          After three years of parents asking, the GCSE crash course is back.
          <span className="uc-hl"> Fifteen sessions across August</span> to close the gaps your child
          carried out of Year 10, then a plan for how they hit top grades from September.
        </p>
        <Calendar />
        <button id="hero-cta" className="uc-btn" style={{ marginTop: 22 }} onClick={goQuiz}>
          Save my child's place
        </button>
        <p className="uc-marks" style={{ textAlign: "center", marginTop: 14 }}>
          ★★★★★ 4.9 from 800+ reviews on Trustpilot <span className="uc-tbc">Verify</span>
        </p>
      </div>

      {/* VIDEO */}
      <div className="uc-wrap uc-sec" style={{ borderTop: "none", paddingTop: 34 }}>
        <div className="uc-video">
          <iframe
            src={VSL_URL}
            title="Usman explains the August crash course"
            allow="autoplay"
            allowFullScreen
          />
        </div>
        <p className="uc-marks" style={{ marginTop: 10, textAlign: "center" }}>
          Usman explains the course in 60 seconds
        </p>
      </div>

      {/* OFFER */}
      <div className="uc-wrap uc-sec">
        <div className="uc-eyebrow">What it is</div>
        <h2>Fifteen sessions. One goal. Walk into Year 11 ahead instead of behind.</h2>
        <ul className="uc-list" style={{ marginTop: 20 }}>
          <li>Fifteen live sessions across August, taught by Usman personally</li>
          <li>Every session targets the Year 10 content most students carry forward as gaps</li>
          <li>A written plan for September, so your child starts Year 11 knowing what to work on</li>
          <li>Small group, live and interactive. Not a recorded course nobody opens</li>
          <li style={{ color: C.muted }}>Price, session times and group size <span className="uc-tbc">Needed from Usman</span></li>
        </ul>
      </div>

      {/* TEACHER */}
      <div className="uc-wrap uc-sec">
        <div className="uc-eyebrow">Who's teaching it</div>
        <h2>Why Usman</h2>
        <p style={{ marginTop: 16 }}>
          I'm Usman. I studied engineering at Oxford and Birmingham, and I run Ucademy.
          <span className="uc-hl"> I'm teaching this course myself</span>, not handing it to a tutor.
          Parents have asked me to run it again every year since we stopped, and this August I finally am.
        </p>
        <p className="uc-marks">Confirm the exact wording of the credentials before launch</p>
      </div>

      {/* PROOF */}
      <div className="uc-wrap uc-sec">
        <div className="uc-eyebrow">Proof</div>
        <h2>Parents who have been here before</h2>
        <div style={{ marginTop: 20 }}>
          {[1, 2, 3].map((i) => (
            <blockquote className="uc-quote" key={i}>
              <span className="uc-tbc">Real testimonial needed</span>
              <p style={{ margin: "8px 0 0", color: C.muted }}>
                Short quote naming the subject and the grade movement. Generic five-star praise won't do the same work here.
              </p>
              <cite>Parent, Year {10 + (i % 2)} — subject</cite>
            </blockquote>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="uc-wrap uc-sec">
        <div className="uc-eyebrow">Before you ask</div>
        <h2 style={{ marginBottom: 20 }}>The questions parents actually have</h2>
        <Faq />
      </div>

      {/* QUIZ */}
      <div className="uc-wrap uc-sec">
        <div className="uc-eyebrow">Two minutes</div>
        <h2 style={{ marginBottom: 20 }}>Check your child's place</h2>
        <Quiz />
        <div className="uc-note">
          <b>Prototype notes.</b> The quiz answers are not stored or sent anywhere yet, and the booking
          happens entirely on the Ucademy page. Before this can take real traffic it needs the price and
          schedule, an answer to the mid-August joiner question, the Meta pixel with a Lead event on the
          contact step and a separate booking event, and a webhook routing leads to the Appointment Setter
          chat. The "checking places" screen is only honest if the course genuinely has a cap.
        </div>
      </div>

      <div className="uc-wrap uc-foot">Ucademy — GCSE Crash Course, August 2026. Prototype for internal review.</div>

      {/* sticky mobile CTA */}
      <div className={"uc-sticky" + (sticky ? " show" : "")}>
        <button onClick={goQuiz}>Save my child's place</button>
      </div>
    </div>
  );
}