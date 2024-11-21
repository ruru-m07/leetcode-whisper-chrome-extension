import fs from 'fs'
import path from 'path'

const __dirname = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([a-zA-Z]:)/, '$1')
const distFolderPath = path.join(__dirname, '../dist')
const outCssFilePath = path.join(__dirname, '../out.css')

function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.join(folderPath, file)
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(folderPath)
  }
}

deleteFolderRecursive(distFolderPath)

if (fs.existsSync(outCssFilePath)) {
  fs.unlinkSync(outCssFilePath)
}

console.log('dist folder and out.css file deleted successfully.')
