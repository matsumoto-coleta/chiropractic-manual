import { useState, useEffect, useRef, useMemo } from 'react';
import { MANUAL_DATA } from './data.js';

function highlight(text, q) {
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark style={{ background: 'rgba(255,220,80,0.6)', color: 'inherit', padding: 0 }}>
        {text.slice(i, i + q.length)}
      </mark>
      {text.slice(i + q.length)}
    </>
  );
}

function FigurePlaceholder({ caption, color }) {
  return (
    <figure style={{
      margin: 0, borderRadius: 12, overflow: 'hidden',
      border: `1px solid ${color.tagBg}`,
      background: '#fff',
    }}>
      <div style={{
        aspectRatio: '16/10', position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          padding: '8px 14px', borderRadius: 999,
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontSize: 11, fontWeight: 600, color: color.deep, letterSpacing: 0.5,
        }}>
        </div>
      </div>
      <figcaption style={{
        padding: '8px 12px', fontSize: 11, color: color.deep,
        background: color.tagBg, textAlign: 'center', letterSpacing: 0.3,
      }}>{caption}</figcaption>
    </figure>
  );
}

function StepCard({ step, color, isOpen, onToggle, theme, isMobile }) {
  return (
    <div className="step-card" style={{
      background: '#fff', borderRadius: 12, overflow: 'hidden',
      border: `1px solid ${isOpen ? color.tag : color.tagBg}`,
      boxShadow: isOpen ? `0 4px 16px rgba(0,0,0,0.06)` : '0 1px 0 rgba(0,0,0,0.03)',
      transition: 'border-color 0.18s, box-shadow 0.18s',
    }}>
      <button onClick={onToggle}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 16px', border: 'none', background: 'transparent',
          cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
        }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          minWidth: 38, height: 32, padding: '0 10px', borderRadius: 16,
          background: color.tag, color: '#fff',
          fontFamily: theme.numberFont, fontSize: 12, fontWeight: 700,
          fontVariantNumeric: 'tabular-nums',
        }}>{step.id}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: theme.heading, lineHeight: 1.3 }}>{step.title}</div>
          <div style={{ fontSize: 12, color: theme.muted, marginTop: 2, lineHeight: 1.4 }}>{step.subtitle}</div>
        </div>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={color.deep} strokeWidth="2" strokeLinecap="round"
          style={{ flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s' }}>
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>

      <div className="step-card-content" style={{
        maxHeight: isOpen ? 4000 : 0, opacity: isOpen ? 1 : 0,
        overflow: 'hidden', transition: 'max-height 0.4s ease, opacity 0.25s',
      }}>
        <div style={{ padding: '4px 16px 18px', borderTop: `1px solid ${color.tagBg}` }}>
          <div style={{
            display: 'flex', flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 0 : 20, marginTop: 14, alignItems: 'flex-start',
          }}>

            {/* 左カラム: tools + 画像 */}
            <div style={{ width: isMobile ? '100%' : '45%', flexShrink: 0 }}>
              {step.tools && step.tools.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                  {step.tools.map((t) => (
                    <span key={t} style={{
                      padding: '3px 10px', borderRadius: 999,
                      background: color.tagBg, color: color.deep,
                      fontSize: 11, fontWeight: 600,
                    }}>使う部位: {t}</span>
                  ))}
                </div>
              )}
              {step.image
                ? (
                  <figure style={{ margin: 0, borderRadius: 12, overflow: 'hidden', border: `1px solid ${color.tagBg}` }}>
                    <img src={step.image} alt={step.title} style={{ width: '100%', display: 'block' }} />
                  </figure>
                )
                : <FigurePlaceholder caption={`${step.id} ${step.title}`} color={color} />
              }
            </div>

            {/* 右カラム: テキスト */}
            <div style={{ flex: 1, minWidth: 0, marginTop: isMobile ? 16 : 0 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 4, background: '#3a8a6a' }} />
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: theme.muted, fontFamily: theme.numberFont }}>目的</span>
                </div>
                <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.7, color: theme.body }}>{step.purpose}</p>
              </div>

              {step.details && step.details.length > 0 && (
                <div style={{ marginTop: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 4, background: '#5a8ac4' }} />
                    <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: theme.muted, fontFamily: theme.numberFont }}>詳細手順</span>
                  </div>
                  {step.details.length === 1 ? (
                    <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.7, color: theme.body }}>{step.details[0]}</p>
                  ) : (
                    <ol style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
                      {step.details.map((d, i) => (
                        <li key={i} style={{ display: 'flex', gap: 10, fontSize: 13.5, lineHeight: 1.7, color: theme.body, marginBottom: 4 }}>
                          <span style={{ flexShrink: 0, fontFamily: theme.numberFont, fontSize: 11, fontWeight: 700, color: '#5a8ac4', minWidth: 18, paddingTop: 2 }}>{String(i + 1).padStart(2, '0')}</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              )}

              {step.points && step.points.length > 0 && (
                <div style={{ marginTop: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 4, background: '#e07a4a' }} />
                    <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: theme.muted, fontFamily: theme.numberFont }}>ポイント</span>
                  </div>
                  <div style={{
                    background: '#fff8f0', border: '1px solid #ffe0c0',
                    borderLeft: '4px solid #e07a4a', borderRadius: 8, padding: '10px 14px',
                  }}>
                    {step.points.length === 1 ? (
                      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: theme.body }}>{step.points[0]}</p>
                    ) : (
                      <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
                        {step.points.map((p, i) => (
                          <li key={i} style={{ display: 'flex', gap: 8, fontSize: 13, lineHeight: 1.7, color: theme.body, marginBottom: 3 }}>
                            <span style={{ color: '#e07a4a', fontWeight: 700, flexShrink: 0 }}>★</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

const PrintButton = ({ theme, style = {} }) => (
  <button onClick={() => window.print()} style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    padding: '7px 14px', border: `1px solid ${theme.border}`,
    borderRadius: 8, background: 'transparent', cursor: 'pointer',
    fontSize: 12, fontFamily: 'inherit', color: theme.muted,
    ...style,
  }}>
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 6 2 18 2 18 9"/>
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
      <rect x="6" y="14" width="12" height="8"/>
    </svg>
    印刷
  </button>
);

export function ManualApp({ theme, viewportWidth }) {
  const data = MANUAL_DATA;
  const [activeStep, setActiveStep] = useState('intro');
  const [openSteps, setOpenSteps] = useState(new Set());
  const [query, setQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainRef = useRef(null);

  useEffect(() => {
    const handleBeforePrint = () => {
      setOpenSteps(new Set(data.sections.flatMap(sec => sec.steps.map(s => s.id))));
      const stepEls = document.querySelectorAll('[id^="section-step-"]');
      stepEls.forEach((el, i) => {
        el.classList.toggle('print-break', (i + 1) % 2 === 0);
      });
    };
    const handleAfterPrint = () => {
      document.querySelectorAll('.print-break').forEach(el => el.classList.remove('print-break'));
    };
    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, [data]);

  const isMobile = viewportWidth < 768;

  const toggleStep = (id) => {
    setOpenSteps((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const onJump = (id) => {
    const el = document.getElementById(id === 'intro' ? 'section-intro' : `section-step-${id}`);
    if (el && mainRef.current) {
      mainRef.current.scrollTo({ top: el.offsetTop - 16, behavior: 'smooth' });
      setActiveStep(id);
      if (id !== 'intro') {
        setOpenSteps((prev) => new Set([...prev, id]));
      }
    }
    if (isMobile) setSidebarOpen(false);
  };

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const out = [];
    data.sections.forEach((sec) => sec.steps.forEach((s) => {
      const hay = `${s.id} ${s.title} ${s.subtitle} ${s.purpose} ${(s.details || []).join(' ')} ${(s.points || []).join(' ')} ${(s.tools || []).join(' ')}`.toLowerCase();
      if (hay.includes(q)) out.push({ sec, step: s });
    }));
    return out.slice(0, 12);
  }, [query, data]);

  const secColors = [
    { bg: '#fef0e8', tag: '#e07a4a', tagBg: '#fde0d0', deep: '#a04820' },
    { bg: '#edf5ee', tag: '#3a8a6a', tagBg: '#d0ead8', deep: '#1f5a3a' },
    { bg: '#e8f0f5', tag: '#3a7aa0', tagBg: '#d0e2ed', deep: '#1f4d6e' },
  ];
  const introColor = { bg: '#f0ede0', tag: '#7a8a3a', tagBg: '#e0e3c8', deep: '#4a5520' };

  const SidebarContent = () => (
    <>
      <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: theme.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26C17.81 13.47 19 11.38 19 9c0-3.87-3.13-7-7-7z"/></svg>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: theme.heading, lineHeight: 1.2 }}>{data.title}</div>
          <div style={{ fontSize: 10, color: theme.muted, marginTop: 1 }}>{data.subtitle}</div>
        </div>
      </div>

      <div style={{ padding: '0 16px 12px' }}>
        <div style={{ position: 'relative' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={theme.muted} strokeWidth="1.5"
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
            <circle cx="6" cy="6" r="4.5" /><path d="M9.5 9.5L13 13" strokeLinecap="round" />
          </svg>
          <input type="search" placeholder="検索..." value={query} onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%', padding: '8px 12px 8px 32px',
              border: `1px solid ${theme.border}`, borderRadius: 999,
              background: '#fff', color: theme.body,
              fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
            }} />
        </div>
      </div>

      <div style={{ padding: '0 16px 24px' }}>
        {query ? (
          <div style={{ background: '#fff', borderRadius: 8, border: `1px solid ${theme.border}`, overflow: 'hidden' }}>
            {results.length === 0 ? (
              <div style={{ padding: 14, fontSize: 12, color: theme.muted, textAlign: 'center' }}>該当なし</div>
            ) : results.map(({ sec, step }) => (
              <button key={step.id} onClick={() => { onJump(step.id); setQuery(''); }}
                style={{ display: 'block', width: '100%', textAlign: 'left',
                  padding: '10px 12px', border: 'none',
                  borderBottom: `1px solid ${theme.border}`,
                  background: 'transparent', cursor: 'pointer', fontFamily: 'inherit' }}>
                <div style={{ fontSize: 11, color: theme.muted, marginBottom: 2 }}>{sec.number}. {sec.title} · {step.id}</div>
                <div style={{ fontSize: 13, color: theme.heading, fontWeight: 600 }}>{highlight(step.title, query)}</div>
              </button>
            ))}
          </div>
        ) : (
          <>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: theme.muted, marginBottom: 8, padding: '0 4px', fontFamily: theme.numberFont }}>
              CONTENTS
            </div>
            <button onClick={() => onJump('intro')}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                padding: '8px 10px', border: 'none',
                background: activeStep === 'intro' ? introColor.tagBg : 'transparent',
                borderRadius: 8, fontFamily: 'inherit', cursor: 'pointer', textAlign: 'left',
                fontSize: 13, fontWeight: activeStep === 'intro' ? 600 : 500,
                color: activeStep === 'intro' ? introColor.deep : theme.body,
                marginBottom: 4,
              }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: introColor.tag, flexShrink: 0 }} />
              基本ルール
            </button>
            {data.sections.map((sec, i) => {
              const c = secColors[i] || secColors[0];
              return (
                <div key={sec.id} style={{ marginTop: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 4px', marginBottom: 4 }}>
                    <span style={{ fontFamily: theme.numberFont, fontSize: 18, fontWeight: 800, color: c.tag, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{sec.number}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: theme.heading }}>{sec.title}</span>
                  </div>
                  {sec.steps.map((s) => {
                    const isActive = activeStep === s.id;
                    return (
                      <button key={s.id} onClick={() => onJump(s.id)}
                        style={{
                          display: 'flex', alignItems: 'baseline', gap: 8, width: '100%',
                          padding: '5px 8px 5px 14px', border: 'none',
                          background: isActive ? c.tagBg : 'transparent',
                          borderLeft: isActive ? `2px solid ${c.tag}` : '2px solid transparent',
                          borderRadius: 4, fontFamily: 'inherit', cursor: 'pointer', textAlign: 'left',
                          fontSize: 12.5, fontWeight: isActive ? 600 : 400,
                          color: isActive ? c.deep : theme.body,
                        }}>
                        <span style={{ fontVariantNumeric: 'tabular-nums', fontFamily: theme.numberFont, fontSize: 11, color: isActive ? c.tag : theme.muted, minWidth: 22 }}>{s.id}</span>
                        <span>{s.title}</span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </>
        )}
      </div>

      <div style={{ padding: '0 16px 20px' }}>
        <PrintButton theme={theme} style={{ width: '100%' }} />
      </div>
    </>
  );

  return (
    <div id="app-layout" style={{
      position: 'relative', height: '100%', background: theme.bg, color: theme.body,
      fontFamily: theme.bodyFont, fontSize: 14, overflow: 'hidden',
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '260px 1fr',
    }}>
      {isMobile && (
        <header style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 52,
          background: '#fff', borderBottom: `1px solid ${theme.border}`,
          display: 'flex', alignItems: 'center', padding: '0 12px', gap: 10, zIndex: 30,
        }}>
          <button onClick={() => setSidebarOpen(true)}
            style={{ border: 'none', background: 'transparent', padding: 6, cursor: 'pointer', display: 'flex' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={theme.heading} strokeWidth="2" strokeLinecap="round">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
          <div style={{ width: 26, height: 26, borderRadius: 6, background: theme.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26C17.81 13.47 19 11.38 19 9c0-3.87-3.13-7-7-7z"/></svg>
          </div>
          <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: theme.heading }}>整体施術マニュアル</span>
          <PrintButton theme={theme} />
        </header>
      )}

      {!isMobile && (
        <nav style={{
          height: '100%', overflowY: 'auto',
          background: theme.sidebarBg, borderRight: `1px solid ${theme.border}`,
          boxSizing: 'border-box',
        }}>
          <SidebarContent />
        </nav>
      )}

      {isMobile && sidebarOpen && (
        <>
          <div onClick={() => setSidebarOpen(false)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 40 }} />
          <nav style={{
            position: 'absolute', top: 0, left: 0, bottom: 0, width: 280,
            background: theme.sidebarBg, zIndex: 50, overflowY: 'auto',
            boxShadow: '4px 0 16px rgba(0,0,0,0.1)',
          }}>
            <button onClick={() => setSidebarOpen(false)}
              style={{ position: 'absolute', top: 14, right: 14, border: 'none',
                background: 'transparent', padding: 6, cursor: 'pointer', zIndex: 1, display: 'flex' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.heading} strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <SidebarContent />
          </nav>
        </>
      )}

      <main ref={mainRef} style={{
        overflowY: 'auto', boxSizing: 'border-box',
        paddingTop: isMobile ? 52 : 0,
      }}>
        <section id="section-intro" style={{
          padding: isMobile ? '32px 20px' : '48px 56px',
          background: introColor.bg, scrollMarginTop: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 4 }}>
            <span style={{ fontFamily: theme.numberFont, fontSize: isMobile ? 44 : 64, fontWeight: 800, color: introColor.tag, lineHeight: 0.9, letterSpacing: -2 }}>00</span>
            <div style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 12, background: introColor.tag, color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, fontFamily: theme.numberFont }}>BASICS</div>
          </div>
          <h1 style={{ margin: '0 0 12px', fontSize: isMobile ? 24 : 30, fontWeight: 700, color: introColor.deep, letterSpacing: '-0.01em', lineHeight: 1.25 }}>施術の前提・基本ルール</h1>
          <p style={{ margin: '0 0 20px', fontSize: 13.5, color: theme.body, lineHeight: 1.7, maxWidth: 560 }}>
            施術に入る前に、すべての場面で守るべき基本ルールです。新人の方は必ず暗記してください。
          </p>
          <ol style={{
            margin: 0, padding: 0, listStyle: 'none',
            display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 10,
          }}>
            {data.premise.map((item, i) => (
              <li key={i} style={{
                padding: '14px 16px', background: '#fff', borderRadius: 10,
                display: 'flex', gap: 12, alignItems: 'flex-start',
                boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
              }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, borderRadius: 13, background: introColor.tag, color: '#fff', fontFamily: theme.numberFont, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                <span style={{ fontSize: 13, lineHeight: 1.6, color: theme.body }}>{item}</span>
              </li>
            ))}
          </ol>
        </section>

        {data.sections.map((sec, i) => {
          const c = secColors[i] || secColors[0];
          return (
            <section key={sec.id} style={{ padding: isMobile ? '32px 20px' : '48px 56px 64px', background: c.bg, scrollMarginTop: 16 }}>
              <div className="section-header" style={{ display: 'flex', alignItems: 'flex-start', gap: isMobile ? 14 : 20, marginBottom: 24 }}>
                <span style={{ fontFamily: theme.numberFont, fontSize: isMobile ? 64 : 96, fontWeight: 800, color: c.tag, lineHeight: 0.85, letterSpacing: -4 }}>{String(sec.number).padStart(2, '0')}</span>
                <div style={{ paddingTop: isMobile ? 4 : 12 }}>
                  <div style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 12, background: c.tag, color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, fontFamily: theme.numberFont, marginBottom: 8 }}>SECTION {sec.number}</div>
                  <h2 style={{ margin: 0, fontSize: isMobile ? 26 : 36, fontWeight: 700, color: c.deep, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{sec.title}</h2>
                  <div style={{ marginTop: 4, fontSize: 12, color: theme.muted, lineHeight: 1.5 }}>{sec.subtitle}</div>
                </div>
              </div>

              {sec.pre && (
                <div className="section-pre" style={{
                  display: 'flex', gap: 12, padding: '14px 18px',
                  background: '#fff', borderRadius: 10, marginBottom: 24,
                  borderLeft: `4px solid ${c.tag}`,
                }}>
                  <span style={{ fontSize: 18 }}>📌</span>
                  <div style={{ fontSize: 13, lineHeight: 1.65, color: theme.body }}>{sec.pre}</div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {sec.steps.map((step) => (
                  <div key={step.id} id={`section-step-${step.id}`}>
                    <StepCard step={step} color={c} theme={theme} isMobile={isMobile}
                      isOpen={openSteps.has(step.id)} onToggle={() => { toggleStep(step.id); setActiveStep(step.id); }} />
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        <footer style={{
          padding: '24px 20px', borderTop: `1px solid ${theme.border}`,
          fontSize: 11, color: theme.muted, textAlign: 'center', fontFamily: theme.numberFont, letterSpacing: 1,
        }}>
          {data.edition} · {data.title}
        </footer>
      </main>
    </div>
  );
}
