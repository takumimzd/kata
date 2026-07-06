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
  appearanceInitScript,
  type Appearance,
} from './lib/theme';

// --- forms (components/forms/) ---
export {
  Field,
  Input,
  Textarea,
  Select,
  type SelectOption,
  SearchSelect,
  type SearchSelectOption,
  Stepper,
  DatePicker,
  Switch,
} from './components/forms';

// --- charts (常に ChartCard の枠つき) ---
export {
  BarChart,
  LineChart,
  Sparkline,
  BarList,
  type BarListItem,
  type ChartPoint,
  type ChartTab,
  Heatmap,
  type HeatmapDatum,
  StackedBarChart,
  type StackedPoint,
  type StackedSeries,
  type LineOverlay,
} from './components/charts';

// --- editor ---
export {
  RichTextEditor,
  MAX_INDENT,
  createEditorBlock,
  type EditorBlock,
  type EditorBlockType,
} from './components/editor';

// --- 単体 (components/ 直下) ---
export { Icon, ICON_NAMES, type IconName } from './components/Icon';
export { Button, buttonClassName, type ButtonVariant } from './components/Button';
export {
  IconButton,
  type IconButtonShape,
  type IconButtonSize,
  type IconButtonVariant,
} from './components/IconButton';
export { Fab } from './components/Fab';
export { Breadcrumb, type BreadcrumbItem } from './components/Breadcrumb';
export { ActionSheet, ActionSheetItem } from './components/ActionSheet';
export { SearchBox } from './components/SearchBox';
export { Calendar } from './components/Calendar';
export { DotCalendar, type CalendarSeries } from './components/DotCalendar';
export { GoalBar } from './components/GoalBar';
export { IconColorPicker, type IconPickerGroup } from './components/IconColorPicker';
export { PinPad } from './components/PinPad';
export { Badge, type BadgeVariant } from './components/Badge';
export { Chip, ChipGroup } from './components/Chip';
export { ProgressBar, type ProgressTone } from './components/ProgressBar';
export { Card, type CardPadding } from './components/Card';
export { Text, type TextVariant } from './components/Text';
export { SectionTitle } from './components/SectionTitle';
export { PageTitle } from './components/PageTitle';
export { Modal } from './components/Modal';
export { Menu, MenuItem } from './components/Menu';
export { ConfirmProvider, useConfirm, type ConfirmOptions } from './components/ConfirmDialog';
export { ToastProvider, useToast } from './components/Toast';
export {
  SideNav,
  type SideNavItem,
  type SideNavLink,
  type SideNavGroup,
  type SideNavRenderCtx,
} from './components/SideNav';
export { TabBar, type TabBarItem, type TabBarRenderCtx, type TabBarVariant } from './components/TabBar';
export { Drawer, type DrawerSide } from './components/Drawer';
export { HamburgerMenu } from './components/HamburgerMenu';
