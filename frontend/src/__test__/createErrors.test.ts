import { describe, it, type TestContext } from 'node:test';
import { createErrors, type ValidationResults } from '../domain/Todo/validators/validateInputValues.js';
import { inputKeyList, type InputTodo } from '@todo/shared';
import { TASK_MAX_LENGTH } from '@todo/shared';
import { validateTask } from '../domain/Todo/validators/validateTask.js';
import { validatePriority } from '../domain/Todo/validators/validatePriority.js';
import { validateDeadline } from '../domain/Todo/validators/validateDeadline.js';

describe('createErrors() のテスト：入力値の検証', () => {
  it('すべて成功なら errors は空', (t: TestContext) => {
    const results: ValidationResults<InputTodo, Error> = {
      task: validateTask('犬の散歩'),
      priority: validatePriority('middle'),
      deadline: validateDeadline('2029-10-11')
    };

    // !results[key].ok === true を満たすプロパティが存在しないため、errors が空のオブジェクトのまま
    t.assert.deepStrictEqual(createErrors(inputKeyList, results), {});
  });

  it('task 失敗なら errors is { task: string }', (t: TestContext) => {
    const results: ValidationResults<InputTodo, Error> = {
      task: validateTask(
        Array.from({ length: TASK_MAX_LENGTH + 1 })
          .fill('a')
          .join('')
      ),
      priority: validatePriority('middle'),
      deadline: validateDeadline('2030-04-11')
    };

    t.assert.deepStrictEqual(createErrors(inputKeyList, results), {
      task: `${TASK_MAX_LENGTH} 文字以内で入力してください`
    });
  });

  it('priority 失敗なら error is { priority: string }', (t: TestContext) => {
    const results: ValidationResults<InputTodo, Error> = {
      task: validateTask('猫のごはんを買う'),
      priority: validatePriority('extra high'),
      deadline: validateDeadline('2031-09-14')
    };

    t.assert.deepStrictEqual(createErrors(inputKeyList, results), {
      priority: '「低」「並」「高」のうちいずれかを選んでください'
    });
  });

  it('deadline 失敗なら error is { deadline: string }', (t: TestContext) => {
    const results: ValidationResults<InputTodo, Error> = {
      task: validateTask('朝顔の水やり'),
      priority: validatePriority('high'),
      deadline: validateDeadline('2026/08/01')
    };

    t.assert.deepStrictEqual(createErrors(inputKeyList, results), {
      deadline: '日付が無効な形式です'
    });
  });

  it('二つの入力が検証失敗なら error is { [key1]: string, [key2]: string }', (t: TestContext) => {
    const results1 = {
      task: validateTask('腹筋 10 回'), // 成功
      priority: validatePriority('HIGH'), // 失敗
      deadline: validateDeadline('2031-09-32') // 失敗
    };

    const results2 = {
      task: validateTask(''), // 失敗
      priority: validatePriority('middle'), // 成功
      deadline: validateDeadline('') // 失敗
    };

    const results3 = {
      task: validateTask(''), // 失敗
      priority: validatePriority(''), // 失敗
      deadline: validateDeadline('2101-09-22') // 成功
    };

    t.assert.deepStrictEqual(createErrors(inputKeyList, results1), {
      priority: '「低」「並」「高」のうちいずれかを選んでください',
      deadline: '入力された日付が存在しません'
    });
    t.assert.deepStrictEqual(createErrors(inputKeyList, results2), {
      task: 'タイトルを入力してください',
      deadline: '期日を入力してください'
    });
    t.assert.deepStrictEqual(createErrors(inputKeyList, results3), {
      task: 'タイトルを入力してください',
      priority: '「低」「並」「高」のうちいずれかを選んでください'
    });
  });

  it('すべて失敗なら error is { [key in InputKey ]: string }', (t: TestContext) => {
    const results = {
      task: validateTask(''),
      priority: validatePriority(''),
      deadline: validateDeadline('')
    };

    t.assert.deepStrictEqual(createErrors(inputKeyList, results), {
      task: 'タイトルを入力してください',
      priority: '「低」「並」「高」のうちいずれかを選んでください',
      deadline: '期日を入力してください'
    });
  });
});
