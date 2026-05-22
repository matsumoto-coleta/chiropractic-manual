import React from 'react';
import ReactDOM from 'react-dom/client';
import { useTweaks, TweaksPanel, TweakSection, TweakColor, TweakButton } from './tweaks-panel.jsx';
import { ManualApp } from './manual-component.jsx';

const ACCENT_DEFAULT = "#d97048";

function makeTheme(accent) {
  return {
    bg: '#fafaf6',
    sidebarBg: '#f4f2ec',
    border: '#e4e2d8',
    accent,
    heading: '#1f2620',
    body: '#3a4038',
    muted: '#8a8d85',
    headingFont: '"Noto Sans JP", system-ui, sans-serif',
    bodyFont: '"Noto Sans JP", system-ui, sans-serif',
    numberFont: '"JetBrains Mono", ui-monospace, monospace',
  };
}

function App() {
  const [tweaks, setTweak] = useTweaks({ accent: ACCENT_DEFAULT });
  const theme = React.useMemo(() => makeTheme(tweaks.accent), [tweaks.accent]);

  const [vw, setVw] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      <div style={{ height: '100vh', width: '100vw' }}>
        <ManualApp theme={theme} viewportWidth={vw} />
      </div>

      <TweaksPanel title="Tweaks · カラーテーマ">
        <TweakSection title="アクセントカラー">
          <TweakColor label="アクセント" value={tweaks.accent} onChange={(v) => setTweak('accent', v)} />
        </TweakSection>
        <TweakSection title="プリセット">
          <TweakButton onClick={() => setTweak({ accent: '#d97048' })}>暖色（オレンジ）</TweakButton>
          <TweakButton onClick={() => setTweak({ accent: '#3a8a6a' })}>緑系</TweakButton>
          <TweakButton onClick={() => setTweak({ accent: '#5a7ac4' })}>青系</TweakButton>
          <TweakButton onClick={() => setTweak({ accent: '#a04a8a' })}>紫系</TweakButton>
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
