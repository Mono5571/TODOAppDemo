import { test, describe, it } from 'node:test';
import * as assert from 'node:assert';

function add(a: number, b: number): number {
  return a + b;
}

describe('たし算のテスト', () => {
  it('二数の和がもとめられているか', () => {
    assert.strictEqual(add(1, 2), 3);
  });

  it('負のたし算ができるか', () => {
    assert.strictEqual(add(-2, -2), -4);
  });
});
