'use strict'
const {promisify}  = require('util')
const fs           = require('fs')
const spawn        = require('child_process').spawn
const writeFile    = promisify(fs.writeFile)
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

async function executeCeptre (ceptreProgram) {
    const folder = await mkdtemp('cep-temp')
    const inputFile = path.join(folder, 'ceptreProgram')
    await writeFile(inputFile, ceptreProgram)

    const subprocess = spawn(__dirname + '/ceptre', ['ceptreProgram'], { cwd: folder })

    const eventStream = async function* () {
        for await (const line of lines(subprocess.stdout)) {
            yield JSON.parse(line)
        }
        await unlink(inputFile).catch(()=>{})
        await unlink(path.join(folder, 'trace.dot')).catch(()=>{})
        await unlink(path.join(folder, 'ceptre.json')).catch(()=>{})
        await rmdir(folder)
    }

    const input = subprocess.stdin

    return {
        eventStream,
        input
    }

}

module.exports = {
    executeCeptre
}
