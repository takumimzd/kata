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

// --- components ---
export { Button, type ButtonVariant } from './components/Button';
export { IconButton } from './components/IconButton';
export { Icon, type IconName } from './components/Icon';
export { PageTitle } from './components/PageTitle';
export { Field, Input } from './components/Field';
export { Stepper } from './components/Stepper';
export { DatePicker } from './components/DatePicker';
export { SearchBox } from './components/SearchBox';
export { SectionTitle } from './components/SectionTitle';
export { Modal } from './components/Modal';
export { ConfirmProvider, useConfirm, type ConfirmOptions } from './components/ConfirmDialog';
export { ToastProvider, useToast } from './components/Toast';
export { PinPad } from './components/PinPad';
export {
  SideNav,
  type SideNavItem,
  type SideNavLink,
  type SideNavGroup,
  type SideNavRenderCtx,
} from './components/SideNav';
export { Switch } from './components/Switch';
export { Textarea } from './components/Textarea';
export { Select, type SelectOption } from './components/Select';
export { SearchSelect, type SearchSelectOption } from './components/SearchSelect';
export { Calendar } from './components/Calendar';
export { BarChart, LineChart, Sparkline, type ChartPoint } from './components/charts';
export {
  RichTextEditor,
  MAX_INDENT,
  createEditorBlock,
  type EditorBlock,
  type EditorBlockType,
} from './components/RichTextEditor';
