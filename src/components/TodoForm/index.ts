import type { InputKey, FormState } from '../../types/inputs.js';
import { shallowObjectEqual } from '../../utils/utils.js';
import { validateInputValues } from '../../validators/validateInputValues.js';
import { formStore, formActions } from '../../FormStore/index.js';
import { todoActions } from '../../todoActions/index.js';
import { generateTodo } from '../../utils/generateTodo.js';
import { generateTodoId } from '../../utils/generateTodoId.js';

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
  // キー、html 要素、イベント種別、エラーを表示する span 要素の対応関係のリスト
  const keyAndElmsList = [
    { key: 'task', el: taskInput, eventType: 'input', errorMsg: taskError },
    { key: 'priority', el: prioritySelect, eventType: 'change', errorMsg: priorityError },
    { key: 'deadline', el: deadlineInput, eventType: 'input', errorMsg: deadlineError }
  ] as const;

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
  });
};
