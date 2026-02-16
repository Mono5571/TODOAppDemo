const createStore = <T>(initial: T) => {
  let state: T = initial;
  let listeners: ((s: T) => void)[] = [];

  /**
   * state が更新されるたびに実行される処理の **購読 (subscription)**
   * @param fn - 購読する関数
   * @returns removeFn - 解除関数
   */
  const subscribe = (fn: (s: T) => void) => {
    listeners = [...listeners, fn];
    return () => {
      listeners = listeners.filter((l) => l !== fn);
    };
  };

  return {
    get state() {
      return state;
    },
    subscribe,
    /**
     * state の更新 (dispatch) 時、**immutable fn** で指定した監視対象の差分を検知して変更がある場合のみコールバックを実行するよう購読する
     * - **解除関数** を返すので、使用時に変数に格納して受け取ること
     * @param selector state から監視対象を取り出す **immutable fn**
     * @param callback キーに対応する値が変わった時に実行する処理
     * @param isEqual 比較ロジック [オプショナル]
     * @returns remover 解除関数
     */
    watch: <V>(
      selector: (s: T) => V,
      callback: (value: V) => void,
      isEqual: (a: V, b: V) => boolean = (a, b) => a === b
    ) => {
      let prevValue = selector(state); // 初期値の保持

      // subscribe メソッドを利用して、内部で差分を監視する
      return subscribe((newState) => {
        const currentValue = selector(newState);
        // 比較ロジックに基づいて、差分を検知したら...
        if (!isEqual(currentValue, prevValue)) {
          prevValue = currentValue; // 保持する値の更新
          callback(currentValue); // コールバックの実行
        }
      });
    },
    /**
     * state の更新をおこない、購読中の関数群を実行する処理
     * @param action - 関数の形で渡す state の更新処理: 変更する要素のみ変え、その他の要素は **参照をそのままにする** ことが重要
     */
    dispatch: (action: (current: T) => T) => {
      state = action(state);
      listeners.forEach((listener) => listener(state));
    }
  };
};

export { createStore };
