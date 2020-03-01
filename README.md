## Configuration
コンフィグは `app.js` 内に記述されています。
```js
/**
 * CONFIG
 */
const QR_FILE_DIR = './qr/'
const OUTPUT_FILE_NAME = 'result.csv'
```

## Usage
```sh
npm install
node app.js
```
`OUTPUT_FILE_NAME`に指定したファイル名で、Rootに保存されます。
