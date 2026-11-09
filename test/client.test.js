import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createSkinSelection, skins } from '../src/skins.js';

test('defaults to 墨竹, restores all five choices and supports host appearance', () => {
  const values = new Map();
  const storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) };
  const selection = createSkinSelection(storage);
  assert.equal(selection.getSnapshot(), 'mozhu');
  assert.equal(Object.keys(skins).length, 6);
  for (const id of Object.keys(skins)) {
    selection.set(id);
    assert.equal(createSkinSelection(storage).getSnapshot(), id);
  }
  selection.set('invalid');
  assert.equal(selection.getSnapshot(), 'official');
});

test('selection remains usable when persistence is unavailable', () => {
  const unavailable = () => { throw new Error('Storage denied'); };
  const selection = createSkinSelection({ getItem: unavailable, setItem: unavailable });
  let updates = 0;
  const unsubscribe = selection.subscribe(() => updates++);
  selection.set('tianqing');
  assert.equal(selection.getSnapshot(), 'tianqing');
  unsubscribe();
  selection.set('mozhu');
  assert.equal(updates, 1);
});
