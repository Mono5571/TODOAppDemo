import type { TodoDataBase } from '../types/db.js';
import { todoActions, todoStore } from '../TodoStore/index.js';
import { generateTodoId } from '../utils/generateTodoId.js';
import type { Todo } from '../types/todo.js';

// initTodoDB: (db: TodoDataBase) => void
export const initTodoDB = async (db: TodoDataBase): Promise<void> => {
  /**
   * todoActions.setInitial() してから todoStore.watch() する、というコードの順序上、
   * 本来はフラグ変数をもちいた制御は不要である。
   * しかし、コードの順序による制御ではなく、変数をもちいて明示的に挙動を記述することで、
   * 初期化時の無限ループや二重保存を防ぐ意図を明確にしたいため、フラグ変数を導入した。
   */
  // 0. フラグ変数で初期読み込み時の save() を回避
  let isInitialized = false;

  // 1. 初回起動時に DB からデータをロード
  const loadedData = await db.load();

  // ロードしたデータがあれば、id 順に並べなおして新しい id を振る
  const initialData =
    loadedData.length > 0
      ? loadedData
          .toSorted((prev, next) => parseInt(prev.id) - parseInt(next.id))
          .map((todo): Todo => ({ ...todo, id: generateTodoId() }))
      : loadedData;

  // 2. ロードしたデータがあれば、Store に反映
  // ここで Store が更新されるが、初期化完了フラグがたっていないので save() されない
  if (initialData.length > 0) todoActions.setInitial(initialData);

  // 3. 初期化完了をマーク
  isInitialized = true;

  // 4. Store の変更を監視して、変更があるたびに DB に保存
  todoStore.watch(
    // 全体の変更を監視
    (s) => s,
    async (todos) => {
      // 初期化が終わっていないときは保存しない
      if (!isInitialized) return;
      await db.save(todos);
    }
  );
};
