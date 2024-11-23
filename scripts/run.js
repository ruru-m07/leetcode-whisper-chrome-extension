import { execSync } from 'child_process'

try {
  execSync('npx tailwindcss -i ./src/index.css -o ./out.css', {
    stdio: 'inherit',
  })
  execSync('node ./scripts/css-cleaner.js', { stdio: 'inherit' })
  execSync('npx concurrently "pnpm run watch:tailwind" "pnpm run watch:cleaner" "vite"', {
    stdio: 'inherit',
  })
} catch (error) {
  console.error('Error occurred:', error.message)
}
