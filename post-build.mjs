import { copyFile, mkdir } from 'fs/promises'
import { glob } from 'glob'
import * as path from 'path'

for (const src of await glob(['*.ttf', '*.png'])) {
  await copyFile(src, path.join('dist', '_assets', src))
  console.log('★', src)
}

await mkdir(path.join('dist', 'mermaid', 'dist'), { recursive: true })

await copyFile(
  path.join('node_modules', 'mermaid', 'dist', 'mermaid.min.js'),
  path.join('dist', 'mermaid', 'dist', 'mermaid.min.js')
)
console.log('★', 'mermaid HACK')
