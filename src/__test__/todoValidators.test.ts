import { describe, it, type TestContext } from 'node:test';
import { isFutureOrToday } from '../utils/dateStringValidator.js';
import { validateDeadline } from '../domain/Todo/validators/validateDeadline.js';
import { validatePriority } from '../domain/Todo/validators/validatePriority.js';
import { validateTask } from '../domain/Todo/validators/validateTask.js';
import { TASK_MAX_LENGTH } from '../domain/Todo/types.js';

// 補助関数
/**
 * [yyyy-MM-dd] 形式のローカル日付 (e.g. JST)
 */
function formatDate(date: Date): string {
  const y = String(date.getFullYear());
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');

  return `${y}-${m}-${d}`;
}

/**
 * date から \\{days} 日前の日付を表す文字列を返す
 *
 * - days の小数点以下は切り捨てる。
 * @param date 基準となる日に対応する Date オブジェクト
 * @param days 遡りたい日数
 * @returns [yyyy-mm-dd] 形式の \\{days} 日前の日付文字列
 */
export function getDateStringBefore(date: Date, days: -1 | 0 | 1 | 2): string {
  const copy = new Date(date);
  copy.setDate(copy.getDate() - days);

  return formatDate(copy);
}

/**
 * date から \\{days} 日前の日付を表す数値のタプルを返す
 *
 * - days の小数点以下は切り捨てる。
 * @param date 基準となる日に対応する Date オブジェクト
 * @param days 遡りたい日数
 * @returns [yyyy, mm, dd] の \\{days} 日前の数値タプル
 */
export function getDateTupleBefore(date: Date, days: -1 | 0 | 1 | 2): [number, number, number] {
  const copy = new Date(date);
  copy.setDate(copy.getDate() - days);

  return [copy.getFullYear(), copy.getMonth() + 1, copy.getDate()];
}

describe('isFutureOrToday() のテスト', () => {
  it('前日の日付なら失敗', (t: TestContext) => {
    const yesterdayTuple = getDateTupleBefore(new Date(), 1);

    t.assert.strictEqual(isFutureOrToday(...yesterdayTuple), false);
  });

  it('当日の日付なら成功', (t: TestContext) => {
    const todayTuple = getDateTupleBefore(new Date(), 0);

    t.assert.strictEqual(isFutureOrToday(...todayTuple), true);
  });
});

describe('validateDeadline() のテスト', () => {
  it('空文字列なら失敗', (t: TestContext) => {
    t.assert.deepStrictEqual(validateDeadline(''), {
      ok: false,
      err: new Error('期日を入力してください')
    });
  });

  it('書式が [yyyy-mm-dd] でなければ失敗', (t: TestContext) => {
    t.assert.deepStrictEqual(validateDeadline('2030/11/30'), {
      ok: false,
      err: new Error('日付が無効な形式です')
    });
  });

  it('存在しない日付なら失敗', (t: TestContext) => {
    t.assert.deepStrictEqual(validateDeadline('2030-04-31'), {
      ok: false,
      err: new Error('入力された日付が存在しません')
    });
  });

  it('前日の日付なら失敗', (t: TestContext) => {
    const yesterdayStr = getDateStringBefore(new Date(), 1);
    t.assert.deepStrictEqual(validateDeadline(yesterdayStr), {
      ok: false,
      err: new Error('今日以降の日付を入力してください')
    });
  });

  it('今日の日付なら成功', (t: TestContext) => {
    const todayStr = getDateStringBefore(new Date(), 0);
    t.assert.deepStrictEqual(validateDeadline(todayStr), {
      ok: true,
      data: todayStr
    });
  });
});

describe('validatePriority() のテスト', () => {
  it('priority として定義された文字列なら成功', (t: TestContext) => {
    t.assert.deepStrictEqual(validatePriority('low'), {
      ok: true,
      data: 'low'
    });

    t.assert.deepStrictEqual(validatePriority('middle'), {
      ok: true,
      data: 'middle'
    });

    t.assert.deepStrictEqual(validatePriority('high'), {
      ok: true,
      data: 'high'
    });
  });

  it('定義外の文字列なら失敗', (t: TestContext) => {
    t.assert.deepStrictEqual(validatePriority('extra'), {
      ok: false,
      err: new Error('「低」「並」「高」のうちいずれかを選んでください')
    });

    t.assert.deepStrictEqual(validatePriority(''), {
      ok: false,
      err: new Error('「低」「並」「高」のうちいずれかを選んでください')
    });

    t.assert.deepStrictEqual(validatePriority('\nhigh\n'), {
      ok: false,
      err: new Error('「低」「並」「高」のうちいずれかを選んでください')
    });

    t.assert.deepStrictEqual(validatePriority(' middle'), {
      ok: false,
      err: new Error('「低」「並」「高」のうちいずれかを選んでください')
    });

    t.assert.deepStrictEqual(validatePriority('middle '), {
      ok: false,
      err: new Error('「低」「並」「高」のうちいずれかを選んでください')
    });
  });
});

describe('validateTask() のテスト', () => {
  it('空の文字列（空文字列、改行・空白文字のみ）なら失敗', (t: TestContext) => {
    t.assert.deepStrictEqual(validateTask(''), {
      ok: false,
      err: new Error('タイトルを入力してください')
    });

    t.assert.deepStrictEqual(validateTask('\n\n\n'), {
      ok: false,
      err: new Error('タイトルを入力してください')
    });

    t.assert.deepStrictEqual(validateTask('      '), {
      ok: false,
      err: new Error('タイトルを入力してください')
    });

    t.assert.deepStrictEqual(validateTask('\n  \n'), {
      ok: false,
      err: new Error('タイトルを入力してください')
    });
  });

  it('空文字や改行文字がフォーマットされる', (t: TestContext) => {
    t.assert.deepStrictEqual(validateTask('  ポチの\n散歩  '), {
      ok: true,
      data: 'ポチの 散歩'
    });
  });

  it('TASK_MAX_LENGTH が境界値', (t: TestContext) => {
    const okStr = Array.from({ length: TASK_MAX_LENGTH }, (_) => 'a').join('');
    t.assert.deepStrictEqual(validateTask(okStr), {
      ok: true,
      data: okStr
    });

    const errStr = Array.from({ length: TASK_MAX_LENGTH + 1 }, (_) => 'a').join('');
    t.assert.deepStrictEqual(validateTask(errStr), {
      ok: false,
      err: new Error(`${TASK_MAX_LENGTH} 文字以内で入力してください`)
    });
  });

  it('各種の言語・文字を許容', (t: TestContext) => {
    const loremIpsumSpanish = 'El dolor en sí es grande';
    t.assert.deepStrictEqual(validateTask(loremIpsumSpanish), {
      ok: true,
      data: loremIpsumSpanish
    });

    const ihatovoWindChinese = '伊哈托夫的清风';
    t.assert.deepStrictEqual(validateTask(ihatovoWindChinese), {
      ok: true,
      data: ihatovoWindChinese
    });

    const mixedStr = 'あaA风íქარი,(#$';
    t.assert.deepStrictEqual(validateTask(mixedStr), {
      ok: true,
      data: mixedStr
    });
  });

  it('サロゲートペアの考慮', (t: TestContext) => {
    const hokkeMaxStr = Array.from({ length: TASK_MAX_LENGTH }, () => '𩸽').join('');
    t.assert.deepStrictEqual(validateTask(hokkeMaxStr), {
      ok: true,
      data: hokkeMaxStr
    });

    const thumsUpMaxStr = Array.from({ length: TASK_MAX_LENGTH }, () => '👍').join('');
    t.assert.deepStrictEqual(validateTask(thumsUpMaxStr), {
      ok: true,
      data: thumsUpMaxStr
    });
  });
});
