// Design palette values. Secondary text is darkened where necessary for legibility.
export const skins = {
  mozhu: {
    name: '墨竹', subtitle: '暖纸书房', base: '#F9F5EC',
    sidebar: '#EFE9DB', raised: '#FDFAF3', border: '#E2D9C6', selection: '#E3DAC5',
    ink: '#211F1A', muted: '#6E624F', accent: '#B3402F', code: '#1F1D18',
    radius: 14,
  },
  qinglv: {
    name: '青绿', subtitle: '千里江山', base: '#F4F6ED', end: '#E7EDDC',
    sidebar: '#F8FAF1', raised: '#FDFFF7', border: '#D9DECA', selection: '#D8E5D8',
    ink: '#1C2721', muted: '#4C5B4E', accent: '#3E7A5E', code: '#17241F',
    radius: 11,
  },
  tianqing: {
    name: '天青', subtitle: '雨过天青', base: '#F2F5F4', end: '#DEE9E7',
    sidebar: '#FCFDFC', raised: '#FFFFFF', border: '#DCE6E4', selection: '#DFE9E8',
    ink: '#22333A', muted: '#536A70', accent: '#589297', code: '#172628',
    radius: 16,
  },
  dunhuang: {
    name: '敦煌', subtitle: '沙壁石青', base: '#F8F1E1', end: '#EEE1C5',
    sidebar: '#FCF8EC', raised: '#FFFCF3', border: '#E3D5B6', selection: '#ECE0C5',
    ink: '#2C2317', muted: '#6A5C46', accent: '#2F688E', code: '#272019',
    radius: 7,
  },
  dianlan: {
    name: '靛蓝', subtitle: '白棉拓靛', base: '#F6F9FB', end: '#D9E4ED',
    sidebar: '#FAFCFD', raised: '#FFFFFF', border: '#D6E0E8', selection: '#DCE6F0',
    ink: '#1B2634', muted: '#4C5C70', accent: '#2E5A88', code: '#16202E',
    radius: 15,
  },
  official: { name: '官方外观' },
};

const storageKey = 'dsh-chinese-skin.selection';
const isKnown = id => Object.hasOwn(skins, id);

export function createSkinSelection(storage) {
  let current = 'mozhu';
  try {
    const saved = storage?.getItem(storageKey);
    if (isKnown(saved)) current = saved;
  } catch {
    // Selection still works in memory when storage is blocked.
  }
  const listeners = new Set();
  return {
    getSnapshot: () => current,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    set(id) {
      if (!isKnown(id) || id === current) return;
      current = id;
      try { storage?.setItem(storageKey, id); } catch { /* Keep the in-memory choice. */ }
      for (const listener of listeners) listener();
    },
  };
}
