'use strcit'

const QRReader = require('qrcode-reader')
const fs = require('fs')
const path = require('path')
const jimp = require('jimp')

/**
 * CONFIG
 */
const QR_FILE_DIR = './qr/' // QRコードが格納されるディレクトリ
const OUTPUT_FILE_NAME = 'result.csv' // 出力されるファイル名

class QRCodeLister {
  constructor (QR_FILE_DIR, OUTPUT_FILE_NAME, ENCODE) {
    this.dir = QR_FILE_DIR
    this.filename = OUTPUT_FILE_NAME
  }

  /**
   * 出力ファイルを初期化する関数
   */
  async initFile() {
    try {
      fs.writeFileSync(OUTPUT_FILE_NAME, "");
    }catch(e){
      console.log(e);
    }
  }

  /**
   * QRコードに書かれた文字列を取得する関数
   * @param {string} IMAGE_PATH 
   */
  async getQRData(IMAGE_PATH) {
    const img = await jimp.read(fs.readFileSync(IMAGE_PATH))
    const qr = new QRReader()

    const value = await new Promise((resolve, reject) => {
      qr.callback = (err, v) => err != null ? reject(err) : resolve(v)
      qr.decode(img.bitmap)
    });

    return value.result
  }

  /**
   * 引数のデータをコンストラクタで定義されたファイルに書き込む関数
   * @param {string} rowText 
   */
  async outputFile(rowText) {
    try {
      fs.writeFileSync(this.filename, rowText+"\n", {flag: "a"});
    }catch(e){
      console.log(e);
    }
  }

  /**
   * 引数で指定されたディレクトリのファイル一覧を取得して、
   * 各ファイルのQRコードを読み込んで出力処理を行う関数
   * @param {string} dir 
   */
  async showAllQRBody(dir) {
    const filenames = fs.readdirSync(dir);
    filenames.forEach((filename) => {
      const fullPath = path.join(dir, filename);
      const stats = fs.statSync(fullPath);
      if (stats.isFile()) {
        this.getQRData(fullPath).then(res => {
          const t = `${fullPath},${res}`
          this.outputFile(t);
          console.log(fullPath, res)
        })
      } else if (stats.isDirectory()) {
        this.showAllQRBody(fullPath)
      }
    })
  }

  /**
   * CSVを出力する
   */
  async output() {
    // ファイルの初期化
    this.initFile()
    this.showAllQRBody(this.dir);
  }

}

// 出力する
qr = new QRCodeLister(QR_FILE_DIR, OUTPUT_FILE_NAME)
qr.output()