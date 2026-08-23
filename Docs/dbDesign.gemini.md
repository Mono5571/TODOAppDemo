# TODO 初回読み込みクエリの実践的アプローチ

ご自身で考えられた基本クエリを出発点として、実務の要件を満たすためにどのように SQL が進化していくかを見ていきましょう。

## Step 1: 基本形（ご提示のクエリ）

```sql
SELECT todo_id, title, description, priority, due_date, completed
FROM todos
WHERE user_id = $target_user_id
LIMIT 40;
```

この状態でも動作しますが、「順序が不定」であり、「41件目以降を取得できない」という課題があります。

## Step 2: 順序の保証（ORDER BY）の追加

ユーザー体験として、TODO は「新しく追加したものから順に見たい」か、または「期限が近いものから順に見たい」はずです。ここでは「作成日時の新しい順（降順）」で取得する要件とします。

```sql
SELECT todo_id, title, description, priority, due_date, completed
FROM todos
WHERE user_id = $target_user_id
ORDER BY created_at DESC -- 作成日時の新しい順に並べる
LIMIT 40;
```

    💡 **インデックスのポイント**:
    実務では、このクエリが高速に動作するように、DB 側で (user_id, created_at) という複合インデックスを張るのが定石です。

## Step 3: デフォルトの絞り込み（未完了のみ表示など）

TODO アプリを開いた直後、完了済みのタスクが大量に表示されると邪魔になるため、「最初は未完了のタスクのみ 40 件表示する」という仕様になることが多いです。

```sql
SELECT todo_id, title, description, priority, due_date, completed
FROM todos
WHERE user_id = $target_user_id
AND completed = FALSE -- 未完了タスクのみに絞る
ORDER BY created_at DESC
LIMIT 40;
```

## Step 4: 次の40件を読み込む仕組み（ページネーション

ユーザーが画面を下までスクロールしたとき（無限スクロール）、次の 40 件（41〜80件目）を取得する必要があります。これには 2 つの代表的な手法があります。

### アプローチ A: OFFSET（オフセット）方式

最もシンプルで古典的な方法です。「先頭から 40 件飛ばして、次の 40 件を取る」という命令を出します。

```sql
-- 2ページ目の取得
SELECT todo_id, title, description, priority, due_date, completed
FROM todos
WHERE user_id = $target_user_id
  AND completed = FALSE
ORDER BY created_at DESC
LIMIT 40
OFFSET 40; -- 最初の40件を読み飛ばす
```

- **メリット**: 実装が直感的で簡単。

- **デメリット**: データ量が増えるとパフォーマンスが落ちる（DB は飛ばす分の 40 件も内部的に一度読み込むため）。また、1ページ目を見ている間に新しいタスクが追加されると、2ページ目の内容がズレる（重複して表示される）問題が起きやすい。

### アプローチ B: Cursor（カーソル）方式【実務の主流】

「前回取得した最後のタスクの ID や 作成日時」を基準（カーソル）にして、それより古いものを 40 件取得します。現代の SNS のタイムラインなどはほとんどこの方式です。

```sql
-- 2ページ目の取得 ($last_seen_created_at は、1ページ目の最後のタスクの created_at)
SELECT todo_id, title, description, priority, due_date, completed
FROM todos
WHERE user_id = $target_user_id
AND completed = FALSE
AND created_at < $last_seen_created_at -- 前回取得分の続きから
ORDER BY created_at DESC
LIMIT 40;
```

- **メリット**: 非常に高速で、データ追加時のズレも発生しない。無限スクロールと相性が良い。

## Step 5: ID設計のモダン化（UUID v7 による究極の最適化）

多数のユーザーが頻繁にタスクを追加する大規模なアプリケーションにおいて、主キー（PRIMARY KEY）の設計はパフォーマンスを大きく左右します。ここで UUID v7 を採用することは、非常に賢明でモダンな選択です。

### なぜ UUID v7 なのか？

1. **INSERT パフォーマンスの劇的な向上**: ランダムな UUID v4 を主キーにすると、B-Tree インデックスの中間への挿入が頻発し、「ページスプリット（断片化）」が起きてパフォーマンスが劣化します。UUID v7 は先頭がタイムスタンプであるため、インデックスの末尾にシーケンシャルに追記され、連番 ID（AUTO_INCREMENT）と同等の高速な INSERT 性能を発揮します。
2. **クエリとインデックスの簡略化**: UUID v7 はそれ自体が時系列順に並ぶため、「ID順」＝「作成日時順」が保証されます。これにより、クエリから ORDER BY created_at を外し、ORDER BY todo_id に置き換えることができます。

```sql
-- UUID v7 を採用した場合の究極のカーソル・ページネーションクエリ
SELECT todo_id, title, description, priority, due_date, completed
FROM todos
WHERE user_id = $target_user_id
AND completed = FALSE
AND todo_id < $last_seen_todo_id -- created_atの代わりにtodo_idを使える！
ORDER BY todo_id DESC
LIMIT 40;
```

    💡 **インデックスのポイント**:
    このクエリなら、DB側で用意するインデックスは (user_id, completed, todo_id) の複合インデックスだけで済み、created_at をインデックスに含める必要がなくなるため、メモリ効率もさらに向上します。

## TypeScript (バックエンド) での実装イメージ

Node.js 環境で pg (node-postgres) などのライブラリを使って実装する場合のイメージです。フロント側の TypeScript のキャメルケース (dueDate) と DB のスネークケース (due_date) を変換する（あるいはマッピングする）必要があります。

```ts
import { Pool } from 'pg';

const pool = new Pool(/_ DB接続設定 _/);

// フロント側の型定義
interface TODO {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly priority: 1 | 2 | 3;
  readonly dueDate: string; // フロントはキャメルケース
  readonly completed: boolean;
}

// UUID v7 を前提としたカーソル・ページネーションの実装例
async function fetchTodos(userId: string, lastSeenTodoId?: string, limit: number = 40): Promise<TODO[]> {
  // 初回読み込み（lastSeenTodoIdがない場合）と、2ページ目以降で条件を分岐
  const cursorCondition = lastSeenTodoId ? `AND todo_id < $3` : ``;
  const queryParams = lastSeenTodoId ? [userId, limit, lastSeenTodoId] : [userId, limit];

  const query = `     SELECT 
      todo_id AS "id",
      title, 
      description, 
      priority, 
      due_date AS "dueDate",
      completed 
    FROM todos
    WHERE user_id = $1 
      AND completed = FALSE
      ${cursorCondition}
    ORDER BY todo_id DESC 
    LIMIT $2;
  `;

  const result = await pool.query(query, queryParams);
  return result.rows as TODO[];
}
```
