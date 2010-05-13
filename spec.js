#! /usr/bin/env node

require.paths.unshift('./')
require('describe')

describe('Describe')
    .should('check expect', function(){
        try{
            expect(1).toBe(2)
            throw new Error('Should have failed.')
        }catch(e){
            expect(e.message).toBe('1 is not the same object as 2')
        }
    })
    .should('expect met', function(){
        expect(1).toBe(1)
    })
    .should('expect not met', function(){
        expect(1).toBe(2)
    })
    .should('fail should throw error', function(){
        try{
            fail('This failure is intended.')
            throw new Error('Should have failed.')
        }catch(e){
            expect(e.message).toBe('This failure is intended.')
        }
    })
    .should('expect to raise', function(){
        try{
            expect(function(){}).toRaise('SomeError')
        }catch(e){
            expect(e.message).toBe('Should have raised: SomeError')
        }
    })
    .should('expect to raise met', function(){
        expect(function(){
            throw new Error('SomeError')
        }).toRaise('SomeError')
    })
    
describe('Describe async tests', {async: true})
    .should('test async', function(){
        var self = this
        setTimeout(function(){
            self.endTest()
        }, 300)
    })
    .should('fail async test', function(){
        var self = this
        setTimeout(function(){
            self.expect(1).toBe(2)
            self.endTest()
        }, 300)
    })
    /*
    .should('fail if timed out', function(){
        var self = this
        setTimeout(function(){
            self.endTest()
        }, 2000)
    })
    */
    
describe.run({print: require('sys').puts})