import fs from 'fs/promises'
import chokidar from 'chokidar'

const cssFilePath = './out.css'

/**
 * Removes the .hidden rule from the given CSS file.
 * @param {string} filePath - The path to the CSS file.
 */
async function removeHiddenRule(filePath) {
  try {
    let cssContent = await fs.readFile(filePath, 'utf8')
    cssContent = cssContent.replace(/\.hidden\s*{\s*display:\s*none;\s*}/g, '')
    await fs.writeFile(filePath, cssContent, 'utf8')
    console.log('Removed .hidden rule from', filePath)
  } catch (error) {
    console.error('Error processing file:', error)
  }
}

const args = process.argv.slice(2)
const watchMode = args.includes('--watch')

if (watchMode) {
  const watcher = chokidar.watch(cssFilePath, {
    persistent: true,
  })

  watcher
    .on('change', (path) => {
      console.log(`File ${path} has been changed`)
      removeHiddenRule(path)
    })
    .on('error', (error) => console.error(`Watcher error: ${error}`))

  console.log(`Watching for changes in ${cssFilePath}`)
} else {
  removeHiddenRule(cssFilePath)
}
