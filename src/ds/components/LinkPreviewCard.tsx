// ============================================================
//  kata — リンクの OGP カード
//  取得済みの OGP (画像・タイトル・説明) を表示するだけの部品。
//  取得手段はアプリ側の責務なので、ここは値を受け取るだけに留める。
// ============================================================
import { useState } from 'react';
import { cn } from '../lib/cn';
import { Icon } from './Icon';
import styles from './LinkPreviewCard.module.css';

export interface LinkPreview {
  /** リンク先 URL (カードのクリックで開く) */
  url: string;
  title?: string;
  description?: string;
  /** og:image の URL。無ければ画像なしのカードになる */
  imageUrl?: string;
}

interface LinkPreviewCardProps {
  preview: LinkPreview;
  className?: string;
}

/** 表示用のホスト名 (取り出せなければ URL をそのまま) */
function hostOf(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/**
 * OGP カード。リンクは常に別タブで開く。
 * タイトルが取れていないときはホスト名を見出しにする。
 */
export function LinkPreviewCard({ preview, className }: LinkPreviewCardProps) {
  // 画像 URL はあるが読み込めない (403 / 期限切れ) こともあるので、
  // 失敗したら画像なしのレイアウトに落とす
  const [imageFailed, setImageFailed] = useState(false);
  const host = hostOf(preview.url);
  const showImage = preview.imageUrl !== undefined && !imageFailed;

  return (
    <a
      className={cn(styles.card, className)}
      href={preview.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {showImage && (
        <div className={styles.thumb}>
          <img
            className={styles.image}
            src={preview.imageUrl}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
          />
        </div>
      )}
      <div className={styles.body}>
        <span className={styles.title}>{preview.title ?? host}</span>
        {preview.description ? <span className={styles.desc}>{preview.description}</span> : null}
        <span className={styles.host}>
          <Icon name="link" size={13} />
          {host}
        </span>
      </div>
    </a>
  );
}
