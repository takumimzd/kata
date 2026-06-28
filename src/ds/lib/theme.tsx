// ============================================================
//  kata — 外観 (ライト / ダーク / システム) の管理
//  ダークは既定のダークパレット 'sumi' を使う。
//  ライト / システム(明) は既定テーマ (data-theme なし = kiri)。
//
//  利用側はアプリのルートで <AppearanceProvider> で包み、
//  <head> 内に APPEARANCE_INIT_SCRIPT を同期実行して FOUC を防ぐ。
// ============================================================
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export type Appearance = 'light' | 'dark' | 'system';

/** localStorage キー。アプリごとに分けたい場合は変更する。 */
export const APPEARANCE_KEY = 'kata.appearance';

/** ダーク時に適用するパレット (tokens.css の data-theme) */
const DARK_THEME = 'sumi';

/** ブラウザ chrome の色 (theme-color メタ) */
const THEME_COLOR = { light: '#e9e9ea', dark: '#181715' } as const;

function systemPrefersDark(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

/** 選択中の外観が実際にダーク表示になるか */
export function isDark(appearance: Appearance): boolean {
  return appearance === 'dark' || (appearance === 'system' && systemPrefersDark());
}

/** <html> の data-theme と theme-color メタへ反映 */
function apply(appearance: Appearance): void {
  if (typeof document === 'undefined') return;
  const dark = isDark(appearance);
  const root = document.documentElement;
  if (dark) root.dataset.theme = DARK_THEME;
  else delete root.dataset.theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', dark ? THEME_COLOR.dark : THEME_COLOR.light);
}

function readStored(): Appearance {
  if (typeof localStorage === 'undefined') return 'system';
  const v = localStorage.getItem(APPEARANCE_KEY);
  return v === 'light' || v === 'dark' || v === 'system' ? v : 'system';
}

/**
 * FOUC を避けるため <head> 内で同期実行するスクリプト。
 * 上の apply() / readStored() と挙動を一致させること。
 */
export const APPEARANCE_INIT_SCRIPT = `(function(){try{var k='${APPEARANCE_KEY}';var a=localStorage.getItem(k);if(a!=='light'&&a!=='dark'&&a!=='system')a='system';var d=a==='dark'||(a==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;if(d)r.dataset.theme='${DARK_THEME}';else delete r.dataset.theme;var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',d?'${THEME_COLOR.dark}':'${THEME_COLOR.light}');}catch(e){}})();`;

interface AppearanceContextValue {
  appearance: Appearance;
  setAppearance: (a: Appearance) => void;
}

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

export function AppearanceProvider({ children }: { children: ReactNode }) {
  // SSR / 初回は system 固定。マウント後に保存値へ同期する。
  const [appearance, setAppearanceState] = useState<Appearance>('system');

  useEffect(() => {
    const stored = readStored();
    setAppearanceState(stored);
    apply(stored);
  }, []);

  const setAppearance = useCallback((a: Appearance) => {
    setAppearanceState(a);
    try {
      localStorage.setItem(APPEARANCE_KEY, a);
    } catch {
      // localStorage 非対応環境では永続化しない
    }
    apply(a);
  }, []);

  // system 選択中は OS のダークモード設定変更に追従する
  useEffect(() => {
    if (appearance !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => apply('system');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [appearance]);

  return (
    <AppearanceContext.Provider value={{ appearance, setAppearance }}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance(): AppearanceContextValue {
  const ctx = useContext(AppearanceContext);
  if (!ctx) throw new Error('useAppearance must be used within AppearanceProvider');
  return ctx;
}
