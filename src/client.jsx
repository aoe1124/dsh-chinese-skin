import React, { useSyncExternalStore } from 'react';
import { createSkinSelection, skins } from './skins.js';
import css from './style.css';

export const inject = ['slots'];

function SkinSectionIcon({ size = 16 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 20 2.5 9.5a13 13 0 0 1 19 0L12 20Z" />
    <path d="M12 20 7 6.5M12 20V5.4M12 20l5-13.5" />
  </svg>;
}

function paletteCSS(id, skin) {
  const [stamp, avatar] = skin.name;
  return `body[data-dsh-chinese-skin="${id}"] {
    --chinese-stamp: "${stamp}";
    --chinese-avatar: "${avatar}";
    --chinese-base: ${skin.base};
    --chinese-end: ${skin.end ?? skin.base};
    --chinese-sidebar: ${skin.sidebar};
    --chinese-raised: ${skin.raised};
    --chinese-border: ${skin.border};
    --chinese-selection: ${skin.selection};
    --chinese-ink: ${skin.ink};
    --chinese-muted: ${skin.muted};
    --chinese-accent: ${skin.accent};
    --chinese-code: ${skin.code};
    --chinese-radius: ${skin.radius}px;
  }`;
}

const sheet = Object.entries(skins)
  .filter(([id]) => id !== 'official')
  .map(([id, skin]) => paletteCSS(id, skin))
  .join('\n') + css;

export function apply(ctx) {
  let storage;
  try { storage = window.localStorage; } catch { /* Storage access can be denied. */ }
  const selection = createSkinSelection(storage);
  const body = document.body;

  ctx.effect(() => {
    const style = document.createElement('style');
    style.id = 'dsh-chinese-skin-style';
    style.textContent = sheet;
    document.head.append(style);
    function paint() {
      const id = selection.getSnapshot();
      if (id === 'official') delete body.dataset.dshChineseSkin;
      else body.dataset.dshChineseSkin = id;
    }
    paint();
    const unsubscribe = selection.subscribe(paint);
    return () => {
      unsubscribe();
      delete body.dataset.dshChineseSkin;
      style.remove();
    };
  });

  function SkinSettings() {
    const current = useSyncExternalStore(selection.subscribe, selection.getSnapshot);
    return <section style={{ padding: '16px 0' }}>
      <h2 style={{ margin: '0 0 8px', fontSize: 18 }}>中国风皮肤</h2>
      <p style={{ margin: '0 0 16px', color: 'var(--dsw-alias-label-secondary)' }}>
        选择皮肤即时生效。
      </p>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 170px), 1fr))' }}>
        {Object.entries(skins).map(([id, skin]) => <button
          key={id}
          type="button"
          aria-pressed={id === current}
          onClick={() => selection.set(id)}
          style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', minHeight: 68,
            border: '1px solid', borderColor: id === current ? (skin.accent ?? 'currentColor') : (skin.border ?? 'var(--dsw-alias-border-l3)'),
            borderRadius: 12,
            background: skin.base ?? 'var(--dsw-alias-bg-layer-1)',
            color: skin.ink ?? 'var(--dsw-alias-label-primary)',
            textAlign: 'left', cursor: 'pointer',
          }}
        >
          {id !== 'official' && <span aria-hidden="true" style={{
            display: 'grid', placeItems: 'center', width: 30, height: 30, flexShrink: 0,
            borderRadius: 6, background: skin.accent, color: '#fff',
          }}>{skin.name[0]}</span>}
          <span>
            <strong>{skin.name}</strong>
            {skin.subtitle && <small style={{ display: 'block', marginTop: 3, color: skin.muted }}>{skin.subtitle}</small>}
          </span>
          {id === current && <span aria-hidden="true" style={{ marginLeft: 'auto' }}>✓</span>}
        </button>)}
      </div>
    </section>;
  }

  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'chinese-skin',
    order: 90,
    label: () => '中国风皮肤',
  }, SkinSettings));

  ctx.slots.inject('settings.section.icon', () => ctx.slots.register({
    name: 'settings.section.icon',
    id: 'chinese-skin',
  }, SkinSectionIcon));
}
