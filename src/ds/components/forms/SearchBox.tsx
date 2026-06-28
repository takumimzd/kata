// ============================================================
//  kata — SearchBox (丸型の検索入力)
// ============================================================
import { Icon } from '../Icon';
import styles from './SearchBox.module.css';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBox({ value, onChange, placeholder = '検索' }: SearchBoxProps) {
  return (
    <div className={styles.box}>
      <Icon name="search" size={16} />
      <input
        type="text"
        className={styles.input}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {value !== '' && (
        <button
          type="button"
          className={styles.clear}
          onClick={() => onChange('')}
          aria-label="検索をクリア"
        >
          <Icon name="close" size={14} />
        </button>
      )}
    </div>
  );
}
