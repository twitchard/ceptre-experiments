'use strict'
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const expect = chai.expect

const {invokeCeptre} = require('./ceptre.js')

describe('invoking ceptre', () => {
    describe('with invalid input', () => {
        it('returns an error', () => {
            const input = 'not valid ceptre'
            return expect(invokeCeptre(input))
                .to.be.rejected;
        })
    })
    describe('with valid input', () => {
        it('returns the expected trace', async () => {
            const input = `
                richard : pred.
                pizza : pred.
                
                context init = {
                richard, pizza
                }
                
                stage main
                {
                  eat_pizza : richard * pizza -o richard.
                }
                
                #trace _ main init.
            `
            const output = JSON.parse(await invokeCeptre(input))
            expect(output).to.deep.equal(
                {
                    "command": {
                        "rulename": "eat_pizza",
                        "args": []
                    },
                    "removed": [
                        {
                            "varname": "x2",
                            "mode": "lin",
                            "pred": "pizza",
                            "args": []
                        },
                        {
                            "varname": "x1",
                            "mode": "lin",
                            "pred": "richard",
                            "args": []
                        }
                    ],
                    "added": [
                        {
                            "varname": "x3",
                            "mode": "lin",
                            "pred": "richard",
                            "args": []
                        }
                    ],
                    "context": [
                        "richard",
                        "(stage main)"
                    ]
                }
            )
        })
    })
})
