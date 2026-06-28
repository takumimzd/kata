// ============================================================
//  kata — 公開エントリ
//  利用側: import { Button, Icon, ... } from 'kata'
//          import 'kata/styles.css'
// ============================================================

// --- lib ---
export { cn } from './lib/cn';
export { WEEKDAYS, parseYmd, toYmd, today } from './lib/date';
export {
  AppearanceProvider,
  useAppearance,
  isDark,
  APPEARANCE_KEY,
  APPEARANCE_INIT_SCRIPT,
  type Appearance,
} from './lib/theme';

// --- components: グループ (forms / charts / editor) ---
export * from './components/forms';
export * from './components/charts';
export * from './components/editor';

// --- components: 単体 (components/ 直下) ---
export { Icon, type IconName } from './components/Icon';
export { Badge, type BadgeVariant } from './components/Badge';
export { Chip, ChipGroup } from './components/Chip';
export { ProgressBar, type ProgressTone } from './components/ProgressBar';
export { Card } from './components/Card';
export { SectionTitle } from './components/SectionTitle';
export { PageTitle } from './components/PageTitle';
export { Modal } from './components/Modal';
export { ConfirmProvider, useConfirm, type ConfirmOptions } from './components/ConfirmDialog';
export { ToastProvider, useToast } from './components/Toast';
export {
  SideNav,
  type SideNavItem,
  type SideNavLink,
  type SideNavGroup,
  type SideNavRenderCtx,
} from './components/SideNav';
