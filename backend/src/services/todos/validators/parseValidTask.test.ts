import { describe, it, type TestContext } from 'node:test';
import { TASK_MAX_LENGTH } from '@todo/shared';
import { parseValidTask } from './parseValidTask.ts';

describe('parseValidTask() のテスト', () => {
  it('通常の日本語・英数字を許容する', (t: TestContext) => {
    t.assert.deepStrictEqual(parseValidTask('hello'), { ok: true, data: 'hello' });
    t.assert.deepStrictEqual(parseValidTask('こんにちは'), { ok: true, data: 'こんにちは' });
    t.assert.deepStrictEqual(parseValidTask('コンニチハ'), { ok: true, data: 'コンニチハ' });
    t.assert.deepStrictEqual(parseValidTask('ｺﾝﾆﾁﾊ'), { ok: true, data: 'ｺﾝﾆﾁﾊ' });
    t.assert.deepStrictEqual(parseValidTask('123'), { ok: true, data: '123' });
    t.assert.deepStrictEqual(parseValidTask('１２３'), { ok: true, data: '１２３' });
    t.assert.deepStrictEqual(parseValidTask('helloこんにちはコンニチハｺﾝﾆﾁﾊ123１２３'), {
      ok: true,
      data: 'helloこんにちはコンニチハｺﾝﾆﾁﾊ123１２３'
    });
  });

  describe('前後の空白と改行を除去する', () => {
    it('半角スペース', (t: TestContext) => {
      t.assert.deepStrictEqual(parseValidTask(' a'), { ok: true, data: 'a' });
      t.assert.deepStrictEqual(parseValidTask('a '), { ok: true, data: 'a' });
      t.assert.deepStrictEqual(parseValidTask(' a '), { ok: true, data: 'a' });
    });

    it('全角スペース', (t: TestContext) => {
      t.assert.deepStrictEqual(parseValidTask('　a'), { ok: true, data: 'a' });
      t.assert.deepStrictEqual(parseValidTask('a　'), { ok: true, data: 'a' });
      t.assert.deepStrictEqual(parseValidTask('　a　'), { ok: true, data: 'a' });
    });

    it('TAB', (t: TestContext) => {
      t.assert.deepStrictEqual(parseValidTask('\ta'), { ok: true, data: 'a' });
      t.assert.deepStrictEqual(parseValidTask('a\t'), { ok: true, data: 'a' });
      t.assert.deepStrictEqual(parseValidTask('\ta\t'), { ok: true, data: 'a' });
    });

    it('LF', (t: TestContext) => {
      t.assert.deepStrictEqual(parseValidTask('\na'), { ok: true, data: 'a' });
      t.assert.deepStrictEqual(parseValidTask('a\n'), { ok: true, data: 'a' });
      t.assert.deepStrictEqual(parseValidTask('\na\n'), { ok: true, data: 'a' });
    });

    it('CR', (t: TestContext) => {
      t.assert.deepStrictEqual(parseValidTask('\ra'), { ok: true, data: 'a' });
      t.assert.deepStrictEqual(parseValidTask('a\r'), { ok: true, data: 'a' });
      t.assert.deepStrictEqual(parseValidTask('\ra\r'), { ok: true, data: 'a' });
    });

    it('CRLF', (t: TestContext) => {
      t.assert.deepStrictEqual(parseValidTask('\r\na'), { ok: true, data: 'a' });
      t.assert.deepStrictEqual(parseValidTask('a\r\n'), { ok: true, data: 'a' });
      t.assert.deepStrictEqual(parseValidTask('\r\na\r\n'), { ok: true, data: 'a' });
    });
  });

  it('内部の TAB と改行を半角スペースに変換する', (t: TestContext) => {
    // TAB
    t.assert.deepStrictEqual(parseValidTask('a\tb'), { ok: true, data: 'a b' });
    t.assert.deepStrictEqual(parseValidTask('a\t\tb'), { ok: true, data: 'a  b' });
    t.assert.deepStrictEqual(parseValidTask('a\t\t\tb'), { ok: true, data: 'a   b' });

    // LF
    t.assert.deepStrictEqual(parseValidTask('a\nb'), { ok: true, data: 'a b' });
    t.assert.deepStrictEqual(parseValidTask('a\n\nb'), { ok: true, data: 'a  b' });
    t.assert.deepStrictEqual(parseValidTask('a\n\n\nb'), { ok: true, data: 'a   b' });

    // CRLF
    t.assert.deepStrictEqual(parseValidTask('a\r\nb'), { ok: true, data: 'a b' });
    t.assert.deepStrictEqual(parseValidTask('a\r\n\r\nb'), { ok: true, data: 'a  b' });
    t.assert.deepStrictEqual(parseValidTask('a\r\n\r\n\r\nb'), { ok: true, data: 'a   b' });
  });

  it('空文字・空白のみを拒否する', (t: TestContext) => {
    t.assert.strictEqual(parseValidTask('').ok, false);
    t.assert.strictEqual(parseValidTask(' ').ok, false);
    t.assert.strictEqual(parseValidTask('　').ok, false);
    t.assert.strictEqual(parseValidTask('\t').ok, false);
    t.assert.strictEqual(parseValidTask('\n').ok, false);
    t.assert.strictEqual(parseValidTask('\r').ok, false);
    t.assert.strictEqual(parseValidTask('\r\n').ok, false);
    t.assert.strictEqual(parseValidTask(' 　\t\n\r\n').ok, false);
  });

  it('NUL、ESC、DEL などの制御文字を拒否する', (t: TestContext) => {
    // NUL
    t.assert.strictEqual(parseValidTask('abc\u0000def').ok, false);
    // ESC
    t.assert.strictEqual(parseValidTask('abc\u001Bdef').ok, false);
    // DEL
    t.assert.strictEqual(parseValidTask('abc\u007Fdef').ok, false);
  });

  describe('文字数のチェック', () => {
    it('1文字のケースを受理する', (t: TestContext) => {
      t.assert.deepStrictEqual(parseValidTask('a'), { ok: true, data: 'a' });
      t.assert.deepStrictEqual(parseValidTask('あ'), { ok: true, data: 'あ' });
    });

    it('長さが上限ちょうどのケースを受理する', (t: TestContext) => {
      t.assert.deepStrictEqual(parseValidTask('a'.repeat(TASK_MAX_LENGTH)), {
        ok: true,
        data: 'a'.repeat(TASK_MAX_LENGTH)
      });
    });

    it('長さが上限 + 1 のケースを拒否する', (t: TestContext) => {
      t.assert.strictEqual(parseValidTask('a'.repeat(TASK_MAX_LENGTH + 1)).ok, false);
    });
  });

  describe('サロゲートペアの文字数カウントのテスト', () => {
    it('通常の絵文字を 1 つとしてカウントし、変化させない', (t: TestContext) => {
      t.assert.deepStrictEqual(parseValidTask('😀'), { ok: true, data: '😀' });
    });
    it('ゼロ幅接合子を含む文字列も 1 つとしてカウント、変化させない', (t: TestContext) => {
      t.assert.deepStrictEqual(parseValidTask('👨‍👩‍👧‍👦'), { ok: true, data: '👨‍👩‍👧‍👦' });
    });
  });

  describe('NFC 正規化についてのテスト', () => {
    it('ひらがな | カタカナ + 結合 濁点 | 半濁点 -> 通常の入力で出てくる形に', (t: TestContext) => {
      [
        ['か\u3099', 'が'],
        ['カ\u3099', 'ガ'],
        ['は\u309A', 'ぱ'],
        ['ハ\u309A', 'パ']
      ].forEach(([input, expected]) => {
        if (input === undefined) throw new Error('no input');

        const result = parseValidTask(input);
        if (!result.ok) throw new Error('failed to parse: ${expected}');

        t.assert.strictEqual(result.data, expected);
      });
    });

    it('ｶﾀｶﾅ + 結合 濁点 | 半濁点 -> U+FF9E には変換されない', (t: TestContext) => {
      [
        ['ｶ\u3099', 'ｶ\u3099'],
        ['ﾊ\u309A', 'ﾊ\u309A']
      ].forEach(([input, expected]) => {
        if (input === undefined) throw new Error('no input');

        const result = parseValidTask(input);
        if (!result.ok) throw new Error('failed to parse: ${expected}');

        t.assert.strictEqual(result.data, expected);
      });
    });

    it('ラテン文字 + アクセント', (t: TestContext) => {
      const result = parseValidTask('e\u0301');
      if (!result.ok) throw new Error('failed to parse: "e\\u0301"');

      t.assert.strictEqual(result.data, '\u00E9');
    });
  });

  describe('プロパティベーステスト', () => {
    it('正規化の冪等性：正規化を2回適用しても結果が変わらない', (t: TestContext) => {
      const firstResult = parseValidTask('a');
      if (!firstResult.ok) throw new Error('parse failed on idempotency test first parse');

      const secondResult = parseValidTask(firstResult.data);
      if (!secondResult.ok) throw new Error('parse failed on idempotency test second parse');

      t.assert.strictEqual(firstResult.data, secondResult.data);
    });
  });
});
