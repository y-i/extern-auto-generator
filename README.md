# extern-auto-generator
generator of extern.js for google-closure-compiler

## 概要
closure compilerの`ADVANCED_OPTIMIZATIONS`の際に利用する`externs.js`を外部ライブラリ向けに作成します。

## 利用法
`listAllExterns`の第一引数にそのライブラリで宣言される変数、第二引数にその変数名を入れると、出力結果の配列が返ります。
それを文字列として`externs.hoge.js`のようなファイル名で保存すれば準備完了です。
あとはclosure compilerの利用時に`--externs=externs.hoge.js`とすることで、利用できます。

### 例
`index.html`ではjQueryのexternsファイルの文字列を生成しています。
`<textarea>`の出力結果を`externs.jquery.js`に保存し、`externs.jquery.js`の先頭に`let jQuery; let $=jQuery`を加えます。
closure compiler実行時には`--externs=externs.jquery.js`をつけることで、jqueryで使っているメソッド名が圧縮されなくなります。
