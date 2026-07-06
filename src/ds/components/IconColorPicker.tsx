// ============================================================
//  kata — IconColorPicker (アイコンと色のピッカー)
//  トリガー = いま選んでいる見た目のタイル。押すとモーダルが開き、
//  上のプレビューを見ながらアイコンと色を同時に選べる。
//  候補 (groups / colors) は利用側が渡す。
// ============================================================
import { useState } from 'react';
import { Button } from './Button';
import { Icon, type IconName } from './Icon';
import { Modal } from './Modal';
import { Text } from './Text';
import styles from './IconColorPicker.module.css';

export interface IconPickerGroup {
  label: string;
  icons: IconName[];
}

interface IconColorPickerProps {
  /** 選択中のアイコン名 (未知の名前は fallbackIcon で描画) */
  icon: string;
  /** 選択中の色 (CSS color) */
  color: string;
  /** プレビューに出す名前 */
  name?: string;
  /** 名前が未入力のときのプレビュー表示。既定は「名前」 */
  placeholder?: string;
  /** プレビュー下の説明文 (任意) */
  hint?: string;
  /** アイコン候補 (グループごと) */
  groups: IconPickerGroup[];
  /** 色の候補 */
  colors: string[];
  /** 未知のアイコン名のフォールバック。既定は 'pin' */
  fallbackIcon?: IconName;
  onChange: (value: { icon: string; color: string }) => void;
}

export function IconColorPicker({
  icon,
  color,
  name,
  placeholder = '名前',
  hint,
  groups,
  colors,
  fallbackIcon = 'pin',
  onChange,
}: IconColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [draftIcon, setDraftIcon] = useState(icon);
  const [draftColor, setDraftColor] = useState(color);

  const valid = new Set<string>(groups.flatMap((g) => g.icons));
  const iconOf = (n: string): IconName => (valid.has(n) ? (n as IconName) : fallbackIcon);

  const openPicker = () => {
    setDraftIcon(icon);
    setDraftColor(color);
    setOpen(true);
  };

  const commit = () => {
    onChange({ icon: draftIcon, color: draftColor });
    setOpen(false);
  };

  return (
    <>
      <button type="button" className={styles.trigger} onClick={openPicker} aria-label="アイコンと色を選ぶ">
        <span className={styles.tile} style={{ color }}>
          <Icon name={iconOf(icon)} size={22} />
        </span>
        <span className={styles.triggerText}>
          アイコンと色を選ぶ
          <Icon name="chevron" size={14} />
        </span>
      </button>

      {open && (
        <Modal title="アイコンと色" onClose={() => setOpen(false)}>
          <div className={styles.picker}>
            {/* プレビュー */}
            <div className={styles.preview}>
              <span className={styles.previewTile} style={{ color: draftColor }}>
                <Icon name={iconOf(draftIcon)} size={30} />
              </span>
              <div>
                <Text as="div" variant="bodyStrong">
                  {name?.trim() || placeholder}
                </Text>
                {hint && (
                  <Text as="div" variant="sub">
                    {hint}
                  </Text>
                )}
              </div>
            </div>

            {/* 色 */}
            <div className={styles.block}>
              <Text variant="label">色</Text>
              <div className={styles.swatches}>
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`${styles.swatch} ${draftColor === c ? styles.swatchOn : ''}`}
                    style={{ background: c }}
                    aria-label={`色 ${c}`}
                    onClick={() => setDraftColor(c)}
                  />
                ))}
              </div>
            </div>

            {/* アイコン (グループごと) */}
            <div className={`${styles.block} ${styles.icons}`}>
              {groups.map((group) => (
                <div key={group.label} className={styles.group}>
                  <span className={styles.groupLabel}>{group.label}</span>
                  <div className={styles.iconGrid}>
                    {group.icons.map((n) => (
                      <button
                        key={n}
                        type="button"
                        className={`${styles.iconBtn} ${draftIcon === n ? styles.iconOn : ''}`}
                        style={draftIcon === n ? { color: draftColor, borderColor: draftColor } : undefined}
                        aria-label={n}
                        onClick={() => setDraftIcon(n)}
                      >
                        <Icon name={n} size={18} />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.nav}>
              <Button variant="text" onClick={() => setOpen(false)}>
                キャンセル
              </Button>
              <Button variant="primary" onClick={commit}>
                この見た目にする
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
