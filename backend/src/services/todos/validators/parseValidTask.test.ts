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
});
