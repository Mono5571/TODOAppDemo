import type { InputValues, InputKey, FormState } from '../../types/inputs.js';
import { shallowObjectEqual } from '../../utils/utils.js';
import { validateInputValues } from '../../validators/validateInputValues.js';
import { formStore, formActions } from '../../FormStore/index.js';
import { todoActions } from '../../TodoStore/index.js';

export const initTodoForm = ({
  taskInput,
  prioritySelect,
  deadlineInput,
  taskError,
  priorityError,
  deadlineError,
  submit
}: {
  taskInput: HTMLInputElement;
  prioritySelect: HTMLSelectElement;
  deadlineInput: HTMLInputElement;
  taskError: HTMLSpanElement;
  priorityError: HTMLSpanElement;
  deadlineError: HTMLSpanElement;
  submit: HTMLButtonElement;
}) => {
  const keyAndElmsList: {
    key: InputKey;
    el: HTMLInputElement | HTMLSelectElement;
    eventType: 'input' | 'change';
    errorMsg: HTMLElement;
  }[] = [
    { key: 'task', el: taskInput, eventType: 'input', errorMsg: taskError },
    { key: 'priority', el: prioritySelect, eventType: 'change', errorMsg: priorityError },
    { key: 'deadline', el: deadlineInput, eventType: 'input', errorMsg: deadlineError }
  ];

  // --- 1. Dispatch: ユーザー入力 -> State ---
  keyAndElmsList.forEach(({ el, key, eventType }) => {
    el.addEventListener(eventType, (e) => {
      formActions.update(key, (e.currentTarget as typeof el).value);
    });
  });

  // --- 2. Watch: State -> UI (バリデーション & ボタン制御) ---
  formStore.watch(
    (s) => s, // 全体の変更を監視
    ({ values, touched, hasAttemptedSubmit }) => {
      const result = validateInputValues(values);

      submit.disabled = !result.isSuccess;

      keyAndElmsList.forEach(({ el, key, errorMsg }) => {
        const shouldShowError = touched.has(key) || hasAttemptedSubmit;
        if (!shouldShowError) {
          errorMsg.textContent = '';
          errorMsg.classList.remove('visible');
          return;
        }

        // 制約検証 API でのエラーが erroMsg に反映されるように
        if (!el.checkValidity()) {
          // input.value が js に渡らないので、自動的に isSuccess === false
          errorMsg.textContent = el.validationMessage;
          errorMsg.classList.add('visible');
        } else if (!result.isSuccess && result.error[key]) {
          errorMsg.textContent = result.error[key];
          errorMsg.classList.add('visible');
        } else {
          errorMsg.textContent = '';
          errorMsg.classList.remove('visible');
        }
      });
    },
    shallowObjectEqual<FormState>
  );

  // --- 3. Watch: State -> UI (値の同期・初期化) ---
  // reset() が呼ばれたときに input.value を空にするための監視

  // 補助関数
  const watchInput = (el: HTMLInputElement | HTMLSelectElement, key: InputKey) =>
    formStore.watch(
      (s) => s.values[key],
      (value) => {
        if (el.value !== value) el.value = value;
      }
    );

  keyAndElmsList.forEach(({ el, key }) => watchInput(el, key));

  // --- 4. Submit 処理 ---
  submit.addEventListener('click', () => {
    const currentInputValues = formStore.state.values;
    const result = validateInputValues(currentInputValues);

    if (result.isSuccess) {
      todoActions.add(result.data);

      formActions.reset();
    } else {
      // エラー表示
    }
  });
};
