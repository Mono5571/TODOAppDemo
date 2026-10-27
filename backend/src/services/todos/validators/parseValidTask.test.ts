import { describe, it, type TestContext } from 'node:test';
import { TASK_MAX_LENGTH } from '@todo/shared';
import { parseValidTask } from './parseValidTask.ts';

describe('parseValidTask() のテスト', { todo: true }, () => {
  it('通常の日本語・英数字を許容する', (t: TestContext) => {
    t.assert.deepStrictEqual(parseValidTask('hello'), { ok: true, data: 'hello' });
    t.assert.deepStrictEqual(parseValidTask('こんにちは'), { ok: true, data: 'こんにちは' });
    t.assert.deepStrictEqual(parseValidTask('123'), { ok: true, data: '123' });
    t.assert.deepStrictEqual(parseValidTask('１２３'), { ok: true, data: '１２３' });
    t.assert.deepStrictEqual(parseValidTask('helloこんにちは123１２３'), {
      ok: true,
      data: 'helloこんにちは123１２３'
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

    it('LF', (t: TestContext) => {
      t.assert.deepStrictEqual(parseValidTask('\na'), { ok: true, data: 'a' });
      t.assert.deepStrictEqual(parseValidTask('a\n'), { ok: true, data: 'a' });
      t.assert.deepStrictEqual(parseValidTask('\na\n'), { ok: true, data: 'a' });
    });

    it('CRLF', (t: TestContext) => {
      t.assert.deepStrictEqual(parseValidTask('\r\na'), { ok: true, data: 'a' });
      t.assert.deepStrictEqual(parseValidTask('a\r\n'), { ok: true, data: 'a' });
      t.assert.deepStrictEqual(parseValidTask('\r\na\r\n'), { ok: true, data: 'a' });
    });
  });

  it('内部の改行を半角スペースに変換する', (t: TestContext) => {
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
    t.assert.strictEqual(parseValidTask('\n').ok, false);
    t.assert.strictEqual(parseValidTask('\r\n').ok, false);
    t.assert.strictEqual(parseValidTask(' 　\n\r\n').ok, false);
  });

  it('NUL、ESC、DEL などの制御文字を拒否する', (t: TestContext) => {
    // NUL
    t.assert.strictEqual(parseValidTask('abc\u0000def').ok, false);
    // ESC
    t.assert.strictEqual(parseValidTask('abc\u001Bdef').ok, false);
    // DEL
    t.assert.strictEqual(parseValidTask('abc\u007Fdef').ok, false);
  });
});
