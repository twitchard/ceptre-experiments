'use strict'
const {promisify}  = require('util')
const fs           = require('fs')
const spawn        = require('child_process').spawn
const writeFile    = promisify(fs.writeFile)
const readFile     = promisify(fs.readFile)
const mkdtemp      = promisify(fs.mkdtemp)
const rmdir        = promisify(fs.rmdir)
const unlink       = promisify(fs.unlink)
const path         = require('path')

/**
 * Takes a readable stream, and buffers it line-wise,
 * yielding one line at a time.
 */
async function* lines (input) {
    let acc = ''
    for await (const chunk of input) {
        acc+=chunk.toString()
        while (acc.indexOf('\n') !== -1) {
            yield acc.slice(0, acc.indexOf('\n'))
            acc = acc.slice(acc.indexOf('\n') + 1)
        }
    }
}

async function* executeCeptre (ceptreProgram, inputStream) {
    const folder = await mkdtemp('cep-temp')
    const inputFile = path.join(folder, 'ceptreProgram')
    await writeFile(inputFile, ceptreProgram)

    const subprocess = spawn('../ceptre', ['ceptreProgram'], { cwd: folder })
    process.stdin.pipe(inputStream)

    for await (const line of lines(subprocess.stdout)) {
        yield JSON.parse(line)
    }

    try {
        await unlink(inputFile)
        await unlink(path.join(folder, 'trace.dot'))
        await unlink(path.join(folder, 'ceptre.json'))
        await rmdir(folder)
    } catch {}
}

async function main() {
    const ceptreProgram = await readFile('./rock_paper_scissors.cep')
    for await (const event of executeCeptre(ceptreProgram, process.stdin)) {
        console.log(event)
    }
}

main().catch(e => console.error(e))
