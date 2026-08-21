# iruagaru tools

写真、画像、文章、PDFなど、iruagaruのWebツールを一覧化する静的ポータルです。

- 公開URL: https://tools.iruagaru.com/
- 公開先: Xserver `/home/xs360830/iruagaru.com/public_html/tools.iruagaru.com/`
- 実装: HTML / CSS / vanilla JavaScript

## ローカル確認

```bash
npm test
npm run serve
```

## 公開

```bash
./deploy.sh
```

公開前に `npm test` が実行されます。ツール本体は各リポジトリでビルド・管理し、このリポジトリにはポータルのみを置きます。
