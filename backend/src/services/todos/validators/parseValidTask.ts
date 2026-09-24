import { TASK_MAX_LENGTH } from '@todo/shared';
import type { Result, ValidTask } from '@todo/shared';

/**
 * 入力された文字列を、タスクとして DB に保存しても問題ないか厳密に検証する関数
 *
 * 1. Unicode 正規化
 * 2. 入力された文字列から前後の空白・改行文字を取り除く
 * 3. 文字列中の改行を半角スペースに変換
 * 4. 空文字、空白のみなら弾く
 * 5. TODO のタスクとして意味のない制御文字を含む文字列は弾く
 * 5. この時点での文字列の長さが、1 以上かつ制限字数以内か検証
 * @param str クライアントから渡ってきた文字列
 * @returns 適正な文字列なら ValidTask、不正な文字列なら null
 */
export function parseValidTask(str: string): Result<ValidTask, null> {
  const cleanStr = str
    .normalize('NFC') // Unicode を NFC 正規化
    .trim()
    .replace(/\r\n?|\n/g, ' '); // CRLF, LF ともに置換

  // 空文字・空白のみ
  if (cleanStr.length === 0) return { ok: false, err: null };

  // TODO の文字列として意味のない制御文字を許可しない
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u.test(cleanStr)) return { ok: false, err: null };

  // サロゲートペアを考慮した文字数を数える (Unicode code point 単位の文字数)
  const strLength = [...cleanStr].length;

  if (strLength === 0) return { ok: false, err: null };
  if (strLength > TASK_MAX_LENGTH) return { ok: false, err: null };

  return { ok: true, data: cleanStr as ValidTask };
}
