import { type InputKey, type FormState, type ValidInputs, type InputValues, inputKeyList } from '../../types/inputs.js';
import { shallowObjectEqual } from '../../utils/utils.js';
import { validateInputValues } from '../../validators/validateInputValues.js';
import { generateTodo } from '../../utils/generateTodo.js';
import { generateTodoId } from '../../utils/generateTodoId.js';
import { formActions, formStore, todoActions } from '../../context/index.js';
import { createElement } from '../../libs/createElement/index.js';
import type { Priority } from '../../types/todo.js';
import type { Result } from '../../types/result.js';
import { refreshContainer } from '../../utils/refreshContainer.js';

export function initTodoForm(formContainer: HTMLElement) {
  const handleInputOrChange = (key: InputKey, e?: Event) => {
    const target = e?.currentTarget;
    if (!(target instanceof HTMLInputElement) && !(target instanceof HTMLSelectElement)) return;
    formActions.update(key, target.value);
  };

  const handleSubmit = () => {
    const currentInputValues = formStore.state.values;
    const result = validateInputValues(currentInputValues);
    const idResult = generateTodoId();

    // 入力値が不正な場合
    // 本当はちゃんと書くべき
    if (!result.isSuccess) {
      console.error(result.error);
      return;
    }

    // generateTodId() が失敗したとき
    // 本当はちゃんと書くべき
    // たとえば... submitError を作る
    if (!idResult.isSuccess) {
      console.error(idResult.error);
      return;
    }

    const newTodo = generateTodo({ validData: result.data, id: idResult.data });
    todoActions.add(newTodo);

    formActions.reset();
  };

  const renderErrorMsg = ({
    key,
    result,
    touched,
    hasAttemptedSubmit
  }: {
    key: InputKey;
    result: Result<ValidInputs, Partial<Record<'task' | 'priority' | 'deadline', string>>>;
    touched: Set<InputKey>;
    hasAttemptedSubmit: boolean;
  }) => {
    const shouldShowError = hasAttemptedSubmit || touched.has(key);
    if (!shouldShowError) {
      return { textContent: '', isVisible: false };
    }

    if (!result.isSuccess && result.error[key]) {
      return { textContent: result.error[key], isVisible: true };
    } else {
      return { textContent: '', isVisible: false };
    }
  };

  const renderForm = ({
    values,
    touched,
    hasAttemptedSubmit
  }: {
    values: InputValues;
    touched: Set<InputKey>;
    hasAttemptedSubmit: boolean;
  }) => {
    const result = validateInputValues(values);

    // 各項目の <input>, <select> 要素を作成
    const taskInput = createElement('input', {
      id: 'input-task',
      placeholder: '32文字以内で入力してください',
      value: values.task,
      onChange: (e?: Event) => handleInputOrChange('task', e)
    });
    const prioritySelect = createElement(
      'select',
      { id: 'select-priority', onChange: (e?: Event) => handleInputOrChange('priority', e) },
      createElement('option', {
        value: 'low' satisfies Priority,
        textContent: '低',
        selected: formStore.state.values.priority === 'low' ? 'true' : 'false'
      }),
      createElement('option', {
        value: 'middle' satisfies Priority,
        textContent: '並',
        selected: formStore.state.values.priority === 'middle' ? 'true' : 'false'
      }),
      createElement('option', {
        value: 'high' satisfies Priority,
        textContent: '高',
        selected: formStore.state.values.priority === 'high' ? 'true' : 'false'
      })
    );
    const deadlineInput = createElement('input', {
      id: 'input-deadline',
      type: 'date',
      value: values.deadline,
      onInput: (e?: Event) => handleInputOrChange('deadline', e)
    });

    // エラーメッセージの内容を取得
    const taskErrorMsg = renderErrorMsg({ key: 'task', result, touched, hasAttemptedSubmit });
    const priorityErrorMsg = renderErrorMsg({ key: 'priority', result, touched, hasAttemptedSubmit });
    const deadlineErrorMsg = renderErrorMsg({ key: 'deadline', result, touched, hasAttemptedSubmit });

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

    const submitButton = createElement('button', {
      type: 'button',
      id: 'submit',
      disabled: result.isSuccess ? 'false' : 'true',
      textContent: '登録',
      onClick: handleSubmit
    });

    const todoForm = createElement(
      'div',
      {},
      createElement('label', { textContent: 'TODO: ', className: 'form-label' }, taskInput, taskError),
      createElement('label', { textContent: '優先度: ', className: 'form-label' }, prioritySelect, priorityError),
      createElement('label', { textContent: '期日: ', className: 'form-label' }, deadlineInput, deadlineError),
      submitButton
    );

    return todoForm;
  };

  // --- 2. Watch: State -> UI (バリデーション & ボタン制御) ---
  formStore.watch(
    (s) => s, // 全体の変更を監視
    ({ values, touched, hasAttemptedSubmit }) => {
      refreshContainer(formContainer);

      const todoForm = renderForm({ values, touched, hasAttemptedSubmit });

      formContainer.appendChild(todoForm);

      /* 
      // 制約検証 API でのエラーが erroMsg に反映されるように
      if (!el.checkValidity()) -> errorMsg.textContent = el.validationMessage;
      // input.value が js に渡らないので、自動的に isSuccess === false
      */
    },
    shallowObjectEqual<FormState>
  );

  // 初回のレンダリング
  const todoForm = renderForm(formStore.state);
  formContainer.appendChild(todoForm);
}
