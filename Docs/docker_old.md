# docker の旧設定

## frontend/Dockerfile

```
# Node.jsのLTSバージョンを使用
FROM node:24-alpine

# pnpmをインストール
RUN corepack enable && corepack prepare pnpm@11.18.0 --activate

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonをコピーして依存関係をインストール
# pnpm-lock.yamlが古い場合は自動的に更新される
COPY package.json ./
RUN pnpm install

# プロジェクトファイルをコピー
COPY . .

# TypeScriptをコンパイル
RUN pnpm run build

# distディレクトリをsrc内にシンボリックリンク（http-serverがsrcをルートとして提供するため）
# RUN ln -s ../dist src/dist

# ポート8080を公開
EXPOSE 8080

# サーバーを起動
CMD ["pnpm", "run", "serve"]
```

### 変更すべき点

- EXPOSE は Vite にあわせて 5173 にする
- `CMD ["pnpm", "run", "dev"]` に変更
- frontend/package.json に以下の変更を加える

  ```json
  "scripts": {
    // ...
    - "dev": "vite"
    + "serve": "vite",
    + "dev": "pnpm run build && pnpm run serve",
  }
  ```

## compose.yaml (old)

```
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: ToDoAppContainer
    ports:
      - '8080:8080'
    environment:
      - NODE_ENV=production
    volumes:
      - type: bind
        source: ./src
        target: /app/src
      - type: bind
        source: ./public
        target: /app/public
```

## 変更すべき点

- web -> frontend
- context: frontend (パスを現在のディレクトリ構成に合わせる)
- container_name: todo_frontend
- ports: - '5173:5173'
- バインドマウントの設定は見直す
