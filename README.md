# iruagaru tools

写真、画像、文章、PDFなど、iruagaruのWebツールを一覧化する静的ポータルです。

- 公開URL: https://tools.iruagaru.com/
- 公開先: Xserver `/home/xs360830/iruagaru.com/public_html/tools/`
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

公開前に `npm test` が実行されます。ツール本体は各リポジトリでビルド・管理し、このリポジトリにはポータルと一括公開スクリプトだけを置きます。

全ツールをビルドして公開する場合は次を使います。

```bash
./scripts/deploy-all.sh
```

`deploy-all.sh` は各ツールのビルド成果物を一時ディレクトリへ複製し、
`/assets/analytics.js` の読み込みタグをHTMLへ追加してから公開します。
元のビルド成果物や各ツールのリポジトリは変更しません。

Google Analyticsはtools専用プロパティで標準ページビューだけを計測します。
共通スクリプトは閲覧ページと参照元からクエリ文字列とハッシュを除いたURLを送信し、ツールへ入力した
ファイル名、画像、文章、金額、位置情報などをイベントとして送信しません。
