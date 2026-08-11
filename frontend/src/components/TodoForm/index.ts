import type { InputKey, FormState, ValidInputs } from '../../types/inputs.js';
import { shallowObjectEqual } from '../../utils/utils.js';
import { validateInputValues } from '../../domain/Todo/validators/validateInputValues.js';
import { createTodo } from '../../domain/Todo/createTodo.js';
import { generateTodoId } from '../../services/generateTodoId.js';
import { formActions, formStore, todoActions } from '../../context/index.js';
import { createElement } from '../../libs/createElement/index.js';
import type { Priority } from '../../domain/Todo/types.js';
import type { Result } from '@todo/shared';
import { refreshContainer } from '../../utils/refreshContainer.js';

export function initTodoForm(formContainer: HTMLElement) {
  const handleInput = (key: InputKey, e?: Event) => {
    const target = e?.currentTarget;
    if (!(target instanceof HTMLInputElement) && !(target instanceof HTMLSelectElement)) return;
    formActions.update(key, target.value);
  };

  // FormState から <option> が選択されているかを判別する
  const getSelected = (priority: Priority): 'true' | 'false' =>
    formStore.state.values.priority === priority ? 'true' : 'false';

  const handleSubmit = () => {
    const currentInputValues = formStore.state.values;
    const result = validateInputValues(currentInputValues);
    const idResult = generateTodoId();

    // 入力値が不正な場合
    // 本当はちゃんと書くべき
    if (!result.ok) {
      console.error(result.err);
      return;
    }

    // generateTodId() が失敗したとき
    // 本当はちゃんと書くべき
    // たとえば... submitError を作る
    if (!idResult.ok) {
      console.error(idResult.err);
      return;
    }

    const newTodo = createTodo({ id: idResult.data, validData: result.data });
    todoActions.add(newTodo);

    formActions.reset();
  };

  // State および入力の検証結果から、エラーメッセージと <span> 要素の表示・非表示を返す
  const createErrorMsg = ({
    el,
    key,
    result,
    touched,
    hasAttemptedSubmit
  }: {
    el: HTMLInputElement | HTMLSelectElement;
    key: InputKey;
    result: Result<ValidInputs, Partial<Record<'task' | 'priority' | 'deadline', string>>>;
    touched: Set<InputKey>;
    hasAttemptedSubmit: boolean;
  }): { textContent: ''; isVisible: false } | { textContent: string; isVisible: true } => {
    const shouldShowError = hasAttemptedSubmit || touched.has(key);
    if (!shouldShowError) return { textContent: '', isVisible: false };

    // 制約検証 API でのエラーが erroMsg に反映されるように
    // input.value が js に渡らないので、自動的に ok === false
    if (!el.checkValidity()) return { textContent: el.validationMessage, isVisible: true };

    // 入力値の検証が inputKey について失敗していたらエラーメッセージを表示
    if (!result.ok && result.err[key]) return { textContent: result.err[key], isVisible: true };

    // 入力値検証に成功 / 検証失敗だが inputKey については成功 -> エラーメッセージは表示しない
    return { textContent: '', isVisible: false };
  };

  const renderForm = (
    result: Result<ValidInputs, Partial<Record<InputKey, string>>>,
    { values, touched, hasAttemptedSubmit }: FormState
  ) => {
    try {
      // 各項目の <input>, <select> 要素を作成
      const taskInput = createElement('input', {
        id: 'input-task',
        placeholder: '32文字以内で入力してください',
        value: values.task,
        onChange: (e?: Event) => handleInput('task', e)
      });
      const prioritySelect = createElement(
        'select',
        { id: 'select-priority', onChange: (e?: Event) => handleInput('priority', e) },
        createElement('option', {
          value: 'low' satisfies Priority,
          textContent: '低',
          selected: getSelected('low')
        }),
        createElement('option', {
          value: 'middle' satisfies Priority,
          textContent: '並',
          selected: getSelected('middle')
        }),
        createElement('option', {
          value: 'high' satisfies Priority,
          textContent: '高',
          selected: getSelected('high')
        })
      );
      const deadlineInput = createElement('input', {
        id: 'input-deadline',
        type: 'date',
        value: values.deadline,
        onInput: (e?: Event) => handleInput('deadline', e)
      });

      // エラーメッセージの内容を取得
      const taskErrorMsg = createErrorMsg({ el: taskInput, key: 'task', result, touched, hasAttemptedSubmit });
      const priorityErrorMsg = createErrorMsg({
        el: prioritySelect,
        key: 'priority',
        result,
        touched,
        hasAttemptedSubmit
      });
      const deadlineErrorMsg = createErrorMsg({
        el: deadlineInput,
        key: 'deadline',
        result,
        touched,
        hasAttemptedSubmit
      });

      // 各項目のエラーメッセージを表示する <span> 要素を作成
      const taskError = createElement('span', {
        id: 'error-task',
        className: ['error-msg', taskErrorMsg.isVisible && 'is-visible'].filter(Boolean).join(' '),
        textContent: taskErrorMsg.textContent
      });
      const priorityError = createElement('span', {
        id: 'error-priority',
        className: ['error-msg', priorityErrorMsg.isVisible && 'is-visible'].filter(Boolean).join(' '),
        textContent: priorityErrorMsg.textContent
      });
      const deadlineError = createElement('span', {
        id: 'error-deadline',
        className: ['error-msg', deadlineErrorMsg.isVisible && 'is-visible'].filter(Boolean).join(' '),
        textContent: deadlineErrorMsg.textContent
      });

      // 登録ボタンを作成
      const submitButton = createElement('button', {
        type: 'button',
        id: 'submit',
        disabled: result.ok ? 'false' : 'true',
        textContent: '登録',
        onClick: handleSubmit
      });

      // フォーム本体を作成
      const todoForm = createElement(
        'div',
        {},
        createElement('label', { textContent: 'TODO: ', className: 'form-label' }, taskInput, taskError),
        createElement('label', { textContent: '優先度: ', className: 'form-label' }, prioritySelect, priorityError),
        createElement('label', { textContent: '期日: ', className: 'form-label' }, deadlineInput, deadlineError),
        submitButton
      );

      return todoForm;
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
      console.error('unknown error occurred on rendering todo form.');
    }
  };

  // --- Watch: State -> render UI ---
  formStore.watch(
    (s) => s, // 全体の変更を監視
    (s) => {
      // コンテナの DOM 要素をクリア
      refreshContainer(formContainer);

      // 入力値の検証とレンダリング
      const r = validateInputValues(s.values);
      const todoForm = renderForm(r, s);
      if (todoForm) formContainer.appendChild(todoForm);
    },
    shallowObjectEqual<FormState>
  );

  // 初回の検証とレンダリング
  const result = validateInputValues(formStore.state.values);
  const todoForm = renderForm(result, formStore.state);
  if (todoForm) formContainer.appendChild(todoForm);
}
