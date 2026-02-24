# Node.jsのLTSバージョンを使用
FROM node:20-alpine

# pnpmをインストール
RUN corepack enable && corepack prepare pnpm@10.30.0 --activate

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
RUN ln -s ../dist src/dist

# ポート8080を公開
EXPOSE 8080

# サーバーを起動
CMD ["pnpm", "run", "serve"]
