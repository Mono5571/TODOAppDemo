import { type TestContext, describe, it } from 'node:test';

function add(a: number, b: number): number {
  return a + b;
}

describe('たし算のテスト', () => {
  it('二数の和がもとめられているか', (t: TestContext) => {
    t.assert.strictEqual(add(1, 2), 3);
  });

  it('負のたし算ができるか', (t: TestContext) => {
    t.assert.strictEqual(add(-2, -2), -4);
  });
});
