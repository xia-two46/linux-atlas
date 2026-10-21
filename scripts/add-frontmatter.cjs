const fs = require('fs')
const path = require('path')

const dir = path.join(__dirname, '..', 'docs', 'commands')
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md') && f !== 'index.md' && f !== 'terminal.md')

let count = 0
for (const f of files) {
  const p = path.join(dir, f)
  let content = fs.readFileSync(p, 'utf8')

  const nameMatch = content.match(/^name:\s*(.+)$/m)
  const summaryMatch = content.match(/^summary:\s*(.+)$/m)
  if (!nameMatch) { console.log('跳过(无name): ' + f); continue }

  const name = nameMatch[1].trim()
  const summary = summaryMatch ? summaryMatch[1].trim() : name

  // 若已有 title 则跳过
  if (/^title:/m.test(content)) { console.log('已有title: ' + f); continue }

  content = content.replace(/^name:\s*.+$/m, (m) => m + '\ntitle: ' + name + '\ndescription: ' + summary)
  fs.writeFileSync(p, content)
  count++
}
console.log('处理完成，共 ' + count + ' 个文件')
