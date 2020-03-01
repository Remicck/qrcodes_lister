'use strcit';

const QRReader = require('qrcode-reader');
const fs = require('fs');
const path = require('path');
const jimp = require('jimp');

/**
 * CONFIG
 */
const QR_FILE_DIR = './qr/'
const OUTPUT_FILE_NAME = 'result.csv'


async function getQRUrl(IMAGE_PATH) {
  const img = await jimp.read(fs.readFileSync(IMAGE_PATH))
  const qr = new QRReader()

  const value = await new Promise((resolve, reject) => {
    qr.callback = (err, v) => err != null ? reject(err) : resolve(v)
    qr.decode(img.bitmap)
  });

  return value.result
}

async function outputFile(rowText) {
  try {
    fs.writeFileSync(OUTPUT_FILE_NAME, rowText+"\n", {flag: "a"});
  }catch(e){
    console.log(e);
  }
}

//呼び出し
async function showAllQRBody(dir) {
  const filenames = fs.readdirSync(dir);
  filenames.forEach((filename) => {
    const fullPath = path.join(dir, filename);
    const stats = fs.statSync(fullPath);
    if (stats.isFile()) {
      getQRUrl(fullPath).then(res => {
        const t = `${fullPath},${res}`
        outputFile(t);
        console.log(fullPath, res)
      })
    } else if (stats.isDirectory()) {
      showAllQRBody(fullPath)
    }
  })
}

// ファイルの初期化
try {
  fs.writeFileSync(OUTPUT_FILE_NAME, "");
}catch(e){
  console.log(e);
}

// 出力
showAllQRBody(QR_FILE_DIR);