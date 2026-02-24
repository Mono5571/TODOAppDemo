# TODOアプリケーション 実行手順

このプロジェクトをサーバーで実行してブラウザから見るための手順です。

## Dockerを使用した実行方法（推奨）

ローカル環境に直接ライブラリをインストールせずに、Dockerコンテナ内で実行できます。

### 前提条件

- Docker がインストールされていること
- Docker Compose がインストールされていること（Docker Desktopには含まれています）

### 実行手順

1. **Dockerイメージのビルドとコンテナの起動**

```bash
docker-compose up --build
```

初回実行時は、Dockerイメージのビルドと依存関係のインストールに時間がかかります。

2. **ブラウザでアクセス**

コンテナが起動したら、以下のURLにアクセスしてください：

```
http://localhost:8080
```

3. **コンテナの停止**

コンテナを停止する場合は、`Ctrl+C`を押すか、別のターミナルで以下を実行：

```bash
docker-compose down
```

### Dockerコマンドの詳細

- **バックグラウンドで起動する場合**:
  ```bash
  docker-compose up -d --build
  ```

- **ログを確認する場合**:
  ```bash
  docker-compose logs -f
  ```

- **コンテナを再ビルドする場合**:
  ```bash
  docker-compose build --no-cache
  docker-compose up
  ```

## ローカル環境での実行方法

ローカル環境にNode.jsをインストールして実行する場合の手順です。

### 前提条件

- Node.js がインストールされていること（v16以上推奨）

### セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. TypeScriptのコンパイル

```bash
npm run build
```

これにより、`src`ディレクトリ内のTypeScriptファイルが`dist`ディレクトリにコンパイルされます。

### 3. ローカルサーバーの起動

```bash
npm run serve
```

または、開発用にビルドとサーバー起動を一度に実行する場合：

```bash
npm run dev
```

### 4. ブラウザでアクセス

サーバーが起動すると、自動的にブラウザが開きます。開かない場合は、以下のURLにアクセスしてください：

```
http://localhost:8080
```

## 手動でサーバーを起動する場合

`http-server`を使わずに、PythonやNode.jsの組み込みサーバーを使う場合：

### Python 3の場合
```bash
cd src
python3 -m http.server 8080
```

### Node.jsの場合（npx serveを使用）
```bash
npm run build
npx serve src -p 8080
```

## 注意事項

- ES Modulesを使用しているため、`file://`プロトコルでは動作しません。必ずHTTPサーバー経由でアクセスしてください。
- `src/index.html`が`dist/main.js`を参照しているため、ビルド後にサーバーを起動してください。
