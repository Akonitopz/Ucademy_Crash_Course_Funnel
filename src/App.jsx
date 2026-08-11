import React, { useState, useEffect } from "react";

/* ------------------------------------------------------------------ */
/*  Ucademy — GCSE Crash Course, August 2026                            */
/*  One page funnel. Sell above, qualify below.                         */
/*  Copy and schedule confirmed by Usman, 12 August.                    */
/* ------------------------------------------------------------------ */

const C = {
  ink: "#181716", paper: "#ffffff", mint: "#8ce5d2", yellow: "#ffde8d",
  coral: "#fc8a7b", red: "#e84b37", rule: "#e6e2dc", muted: "#6b6560",
};

/* One entry per testimonial video. id is the Google Drive file ID.
   Each file must be shared as "anyone with the link" or the embed
   shows a sign-in wall to everyone but you. */
const TESTIMONIALS = [
  { id: "19wCVV9hd0tqzFrfi7XaywMfineNZoArd", caption: "" },
  { id: "1JqT1sN1EUbTZtRTCO0sgPJDmObImBPnJ", caption: "" },
  { id: "1JGCDMfxmIIO9ugqfxEI8aKoFwLcL6i2m", caption: "" },
];

/* Strict routing. Only a student going into Year 11 this September gets the
   crash course link. Everyone else goes to the main consultation. */
const BOOKING_URL = "https://learn.ucademy.co.uk/book/---free-consultation-with-ucademy--crash-course";
const CONSULT_URL = "https://learn.ucademy.co.uk/book/free-consultation-with-ucademy--main";

/* Same creative as the ad. Replace with a hosted mp4 before paid traffic. */
const VSL_URL = "https://drive.google.com/file/d/1SvNEcS3sydlr5EfCrgV86crq0hdasnPN/preview";

const TRUSTPILOT_URL = "https://www.trustpilot.com/review/ucademy.co.uk";

/* Capacity, per Usman. Update this number as spaces go, or the claim stops
   being true and becomes a scarcity problem rather than a scarcity signal. */
const SPACES_LEFT = 50;

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
.uc-trust { color: ${C.muted}; text-decoration: underline; text-underline-offset: 3px; }
.uc-trust:hover { color: ${C.ink}; }
.uc-qnum { font-family: 'Space Mono', monospace; font-size: 12px; font-weight: 700; color: ${C.red}; border: 1.5px solid ${C.red}; border-radius: 3px; padding: 1px 7px; display: inline-block; margin-bottom: 12px; }
.uc-hl { background: linear-gradient(180deg, transparent 52%, ${C.yellow} 52%, ${C.yellow} 94%, transparent 94%); padding: 0 2px; }
.uc-sec { padding: 46px 0; border-top: 1px solid ${C.rule}; }
.uc-eyebrow { font-family: 'Space Mono', monospace; font-size: 11.5px; letter-spacing: 0.14em; text-transform: uppercase; color: ${C.muted}; margin-bottom: 14px; }
.uc-only { display: inline-block; margin-top: 4px; font-family: 'Space Mono', monospace; font-size: 12px; letter-spacing: 0.04em; color: ${C.ink}; background: ${C.mint}; padding: 4px 9px; border-radius: 4px; }

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

.uc-times { list-style: none; padding: 0; margin: 16px 0 0; border: 1.5px solid ${C.rule}; border-radius: 8px; }
.uc-times li { display: flex; justify-content: space-between; gap: 14px; padding: 11px 16px; border-bottom: 1px solid ${C.rule}; font-size: 15.5px; }
.uc-times li:last-child { border-bottom: none; }
.uc-times b { font-weight: 700; }
.uc-times span { font-family: 'Space Mono', monospace; font-size: 13px; color: ${C.muted}; white-space: nowrap; }

.uc-video { position: relative; aspect-ratio: 16/9; border: 1.5px solid ${C.ink}; border-radius: 8px; overflow: hidden; background: ${C.ink}; }
.uc-video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: none; }
.uc-vids { display: grid; gap: 18px; margin-top: 20px; }
.uc-vid { position: relative; aspect-ratio: 16/9; border: 1.5px solid ${C.ink}; border-radius: 8px; overflow: hidden; background: ${C.ink}; }
.uc-vid iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: none; }
.uc-vid-cap { margin-top: 8px; font-size: 14px; color: ${C.muted}; }
@media (min-width: 700px) { .uc-vids { grid-template-columns: repeat(3, 1fr); } }

.uc-list { list-style: none; padding: 0; margin: 0; }
.uc-list li { padding: 12px 0 12px 30px; border-bottom: 1px solid ${C.rule}; position: relative; font-size: 16.5px; }
.uc-list li:last-child { border-bottom: none; }
.uc-list li::before { content: "\\2713"; position: absolute; left: 2px; top: 12px; color: ${C.red}; font-weight: 700; }

.uc-tbc { display: inline-block; background: ${C.yellow}; color: ${C.ink}; font-family: 'Space Mono', monospace; font-size: 10.5px; letter-spacing: 0.06em; padding: 2px 6px; border-radius: 3px; margin-left: 6px; }

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
/* Confirmed by Usman: Mon to Thu 11am-3pm in the weeks of the 17th and 24th,
   plus the Friday of each week 10am-12pm. More sessions added if needed.
   NOTE: Usman wrote "22nd Friday" and "29nd Friday", but in 2026 those dates
   fall on Saturdays. Day names are used here, so Fridays are the 21st and 28th.
   Confirm with him before this goes to paid traffic. */
const SESSION_DAYS = [17, 18, 19, 20, 21, 24, 25, 26, 27, 28];

const SCHEDULE = [
  { label: "Mon 17 to Thu 20 August", time: "11am – 3pm" },
  { label: "Fri 21 August", time: "10am – 12pm" },
  { label: "Mon 24 to Thu 27 August", time: "11am – 3pm" },
  { label: "Fri 28 August", time: "10am – 12pm" },
];

/* Aug 2026 starts on a Saturday, so a Monday-first grid needs 5 blanks. */
const LEAD_BLANKS = 5;

function todayInAugust2026() {
  const n = new Date();
  return n.getFullYear() === 2026 && n.getMonth() === 7 ? n.getDate() : 0;
}

function Calendar() {
  const today = todayInAugust2026();
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  return (
    <div>
      <div className="uc-cal">
        <div className="uc-cal-top">
          <span>August 2026</span>
          <span>{SPACES_LEFT} spaces remaining</span>
        </div>
        <div className="uc-cal-grid">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <div className="uc-dow" key={i}>{d}</div>)}
          {Array.from({ length: LEAD_BLANKS }).map((_, i) => <div className="uc-day plain" key={"b" + i} />)}
          {days.map((d) => {
            const s = SESSION_DAYS.includes(d);
            const cls = ["uc-day", s && d < today ? "gone" : "", s && d >= today ? "live" : "", !s ? "plain" : "", d === today ? "today" : ""].filter(Boolean).join(" ");
            return <div className={cls} key={d}>{d}</div>;
          })}
        </div>
      </div>
      <div className="uc-legend">
        <span><i className="uc-swatch" style={{ background: C.mint }} /> Session days</span>
        <span><i className="uc-swatch" style={{ background: "#f3f1ee" }} /> Already run</span>
      </div>
      <ul className="uc-times">
        {SCHEDULE.map((s) => (
          <li key={s.label}><b>{s.label}</b><span>{s.time}</span></li>
        ))}
        <li><b>More sessions added if needed</b></li>
      </ul>
    </div>
  );
}

/* ------------------------------ quiz ------------------------------ */
const digits = (s) => s.replace(/\D/g, "");

/* Year the child is going INTO this September. Only "Year 11" qualifies. */
const YEARS = ["Year 11", "Year 12", "Year 10", "Year 9", "Already finished, resitting"];

/* How each option reads mid-sentence, so the copy doesn't say
   "for already finished, resitting, a free consultation…" */
const YEAR_PHRASE = {
  "Year 12": "a student going into Year 12",
  "Year 10": "a student going into Year 10",
  "Year 9": "a student going into Year 9",
  "Already finished, resitting": "a student resitting",
};

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

  /* Strict: going into Year 11 and nothing else. */
  const fit = a.year === "Year 11";
  const bookingLink = fit ? BOOKING_URL : CONSULT_URL;

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
        <Screen at={2} tag="Question 3 of 3" title="What grades are they working at now?" onBack={back}>
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
              ? "Students going into Year 11 with gaps in " + a.subjects.slice(0, 2).join(" and ").toLowerCase() + " are who Usman designed this course around."
              : "The August crash course is only for students going into Year 11, so we'll point you somewhere more useful in a moment."}
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
        <Screen at={5} tag="Almost done" title={"Thanks, " + a.name + ". What's your email address?"} onBack={back}>
          <input className="uc-input" type="email" placeholder="Email address" maxLength={80} value={a.email}
            onChange={(e) => set("email", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && a.email.includes("@") && next()} />
          <p className="uc-hint">We'll only use this to confirm the call and send the details.</p>
          <button className="uc-btn" disabled={!a.email.includes("@")} onClick={next}>Continue</button>
        </Screen>
      )}
      {step === 6 && (
        <Screen at={6} tag="Last step" title="What's the best mobile number to reach you on?" onBack={back}>
          <input className="uc-input" type="tel" inputMode="numeric" maxLength={16}
            placeholder="Mobile number" value={a.phone}
            onChange={(e) => set("phone", e.target.value.replace(/[^\d+ ]/g, ""))}
            onKeyDown={(e) => e.key === "Enter" && digits(a.phone).length >= 10 && next()} />
          <p className="uc-hint">We'll only use this to confirm the call and send the details.</p>
          <button className="uc-btn" disabled={digits(a.phone).length < 10} onClick={next}>
            {fit ? "Check my child's place" : "See what fits"}
          </button>
        </Screen>
      )}
      {step === 7 && (
        <div style={{ textAlign: "center", padding: "26px 0" }}>
          <h3>{fit ? "Checking spaces left on the August course…" : "Finding the right option…"}</h3>
          <div className="uc-bar"><i style={{ width: pct + "%" }} /></div>
          <p className="uc-marks">{pct}%</p>
        </div>
      )}

      {/* Going into Year 11 — the crash course */}
      {step === 8 && fit && (
        <>
          <h2 style={{ marginBottom: 12 }}>{a.name}, there's a place for your child on the August course.</h2>
          <p>Tap below to pick a time. We'll talk through what your child needs, confirm their place and send the session details. The course runs from 17 August, so every day you wait is a session they miss.</p>
          <a className="uc-btn" href={bookingLink} target="_blank" rel="noopener noreferrer" onClick={next}>
            Pick a time for the call
          </a>
          <button className="uc-back" onClick={reset}>↺ Start again</button>
        </>
      )}

      {/* Everyone else — main consultation */}
      {step === 8 && !fit && (
        <>
          <h2 style={{ marginBottom: 12 }}>{a.name}, the crash course isn't the right fit.</h2>
          <p>
            It's built specifically for students going into Year 11 this September. For{" "}
            {YEAR_PHRASE[a.year] || "your child"}, a free consultation will be more use. We'll look at
            where they are now, what to work on, and which Ucademy course actually suits them.
          </p>
          <a className="uc-btn" href={bookingLink} target="_blank" rel="noopener noreferrer" onClick={next}>
            Book a free consultation instead
          </a>
          <button className="uc-back" onClick={reset}>↺ Start again</button>
        </>
      )}

      {step === 9 && (
        <>
          <span className="uc-qnum">Nearly there</span>
          <h2 style={{ marginBottom: 12 }}>Finish booking in the tab that just opened, {a.name}.</h2>
          <p>Nothing is held until you've picked a time. If the tab didn't open, use the link below.</p>
          <div className="uc-recap">
            <dl>
              <div><dt>Child's year</dt><dd>{a.year}</dd></div>
              <div><dt>Subjects</dt><dd>{a.subjects.join(", ")}</dd></div>
              <div><dt>Current grades</dt><dd>{a.grades}</dd></div>
              <div><dt>Booking</dt><dd>{fit ? "August crash course" : "Free consultation"}</dd></div>
            </dl>
          </div>
          <h3 style={{ marginBottom: 10 }}>Before the call</h3>
          <ul className="uc-list" style={{ marginBottom: 18 }}>
            <li>Have their latest report or mock results to hand</li>
            <li>Know which subjects worry you most, so we can go straight to them</li>
            <li>Add the calendar invite so it doesn't get lost</li>
          </ul>
          <a className="uc-btn" href={bookingLink} target="_blank" rel="noopener noreferrer">
            Reopen the booking page
          </a>
          <button className="uc-back" onClick={reset}>↺ Start again</button>
        </>
      )}
    </div>
  );
}

/* ------------------------------- FAQ ------------------------------ */
/* Answers below are Usman's own words, lightly tidied. */
const FAQS = [
  {
    q: "It's already mid-August. Has my child missed too much?",
    a: "No. As long as they're willing to put in the work, I'll personally make sure they've covered all of the content, A to Z, in a few weeks.",
  },
  {
    q: "What if the sessions clash with our holiday?",
    a: "This course is intensive, and it's for families who want the content finished before Year 11 starts properly. If that's your goal, some things are going to need to be cut. That said, you can still log on from anywhere with internet. Give it a few hours in the day, make sure you've done the work being covered, and then crack on and enjoy the pina colada on the beach.",
  },
  {
    q: "Which exam board does it cover?",
    a: "All of them. We cover every exam board, both GCSE and IGCSE.",
  },
  {
    q: "My child isn't going into Year 11. Can they still join?",
    a: "No. The crash course is only for students going into Year 11 this September. Everyone else is pointed to a free consultation to find the right course.",
  },
  {
    q: "What happens after the course ends?",
    a: "Your child leaves with a written plan for September onwards. For now, focus on one step at a time.",
  },
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
          {open === i && <div>{f.a}</div>}
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
        <div className="uc-eyebrow">Starts 17 August · Taught by Usman</div>
        <h1>Year 10 going into<br />Year 11 this September?</h1>
        <p style={{ fontSize: 18, marginTop: 18 }}>
          After three years of parents asking, the GCSE crash course is back.
          <span className="uc-hl"> Intensive live sessions from 17 August</span> to cover the content
          your child carried out of Year 10, then a plan for how they hit top grades from September.
        </p>
        <span className="uc-only">For students going into Year 11 only</span>
        <Calendar />
        <button id="hero-cta" className="uc-btn" style={{ marginTop: 22 }} onClick={goQuiz}>
          Save my child's place
        </button>
        <p className="uc-marks" style={{ textAlign: "center", marginTop: 14 }}>
          <a className="uc-trust" href={TRUSTPILOT_URL} target="_blank" rel="noopener noreferrer">
            ★★★★★ 4.9 on Trustpilot
          </a>
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
        <h2>The whole GCSE, covered before Year 11 starts.</h2>
        <ul className="uc-list" style={{ marginTop: 20 }}>
          <li>Live sessions across the second half of August, taught by Usman personally</li>
          <li>We cover the full maths GCSE, which takes months in a normal programme, in just a few weeks</li>
          <li>A written plan for September, so your child starts Year 11 knowing what to work on</li>
          <li>Live and interactive, taught by one of the most in demand tutors in the country</li>
          <li>Every exam board covered, GCSE and IGCSE</li>
          <li>Open only to students going into Year 11 this September</li>
        </ul>
      </div>

      {/* TEACHER */}
      <div className="uc-wrap uc-sec">
        <div className="uc-eyebrow">Who's teaching it</div>
        <h2>Why Usman</h2>
        <p style={{ marginTop: 16 }}>
          I'm Usman. I studied engineering at the University of Oxford and the University of Birmingham,
          and I run Ucademy.<span className="uc-hl"> I'm teaching this course myself</span>, not handing
          it to a tutor. Parents have asked me to run it again every year since we stopped, and this
          August I finally am.
        </p>
      </div>

      {/* PROOF */}
      <div className="uc-wrap uc-sec">
        <div className="uc-eyebrow">Proof</div>
        <h2>Parents who have been here before</h2>
        <div className="uc-vids">
          {TESTIMONIALS.map((t) => (
            <div key={t.id}>
              <div className="uc-vid">
                <iframe
                  src={"https://drive.google.com/file/d/" + t.id + "/preview"}
                  title={t.caption}
                  allow="autoplay"
                  allowFullScreen
                />
              </div>
              <p className="uc-vid-cap">{t.caption}</p>
            </div>
          ))}
        </div>
        <p className="uc-marks" style={{ marginTop: 18, textAlign: "center" }}>
          <a className="uc-trust" href={TRUSTPILOT_URL} target="_blank" rel="noopener noreferrer">
            Read every review on Trustpilot
          </a>
        </p>
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
          <b>Still open.</b> Price isn't stated anywhere on the page yet. The Friday dates need
          confirming with Usman, since he wrote the 22nd and 29th but those are Saturdays this year.
          The ad says fifteen days and the confirmed schedule shows ten, so one of the two needs to
          change. Quiz answers still aren't stored or sent anywhere, and the Meta pixel, booking event
          and Appointment Setter webhook are all still to do.
        </div>
      </div>

      <div className="uc-wrap uc-foot">Ucademy — GCSE Crash Course, August 2026.</div>

      {/* sticky mobile CTA */}
      <div className={"uc-sticky" + (sticky ? " show" : "")}>
        <button onClick={goQuiz}>Save my child's place</button>
      </div>
    </div>
  );
}