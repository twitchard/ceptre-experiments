'use strict'
const {promisify} = require('util')
const exec        = promisify(require('child_process').exec)
const writeFile   = promisify(require('fs').writeFile)
const readFile    = promisify(require('fs').readFile)
const mkdtemp     = promisify(require('fs').mkdtemp)
const rmdir       = promisify(require('fs').rmdir)
const path        = require('path')

async function invokeCeptre (input) {
    const folder = await mkdtemp('cep')
    try {
        await writeFile(path.join(folder, 'input'), input)
        const {stdout, stderr} = await exec(`ceptre input`, { cwd: folder })
        if (stderr) {
            throw new Error(`Ceptre output something to stderr: ${stderr}`)
        }
        return await readFile(
            path.join(folder, 'ceptre.json'),
            { encoding: 'utf8' }
        )
    } finally {
        await exec(`rm -r ${folder}`)
    }
}

module.exports = {
    invokeCeptre
}
