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
    
describe('async tests', {async: true})
    .should('test async', function(){
        var self = this
        setTimeout(function(){
            self.finish()
        }, 300)
    })
    .should('fail async test', function(){
        var self = this
        setTimeout(function(){
            self.expect(1).toBe(2)
            self.finish()
        }, 300)
    })
    .should('fail if timed out', function(){
        var self = this
        setTimeout(function(){
            self.finish()
        }, 2000)
    })
    .should('be able to set time out', {asyncTimeout: 2000}, function(){
        var self = this
        setTimeout(function(){
            self.finish()
        }, 1500)
    })
    .should('check to equal', function(){
        var self = this
        setTimeout(function(){
            self.expect([1,3]).toEqual([1,2])
            self.finish()
        }, 100)
    })
    
describe('async tests 2')
    .should('be able to set async at method-level', {async: true}, function(){
        var self = this
        setTimeout(function(){
            self.finish()
        }, 300)
    })
    .should('auto async when asyncTimeout is set', {asyncTimeout: 100}, function(){
        var self = this
        setTimeout(function(){
            self.finish()
        }, 50)
    })
    .should('expect raise', {async: true}, function(){
        var self = this
        setTimeout(function(){
            self.expect(function(){ throw new Error('blah')}).toRaise('blah')
        }, 300)
    })
    .should('expect raise fail', {async: true}, function(){
        var self = this
        setTimeout(function(){
            self.expect(function(){}).toRaise('blah')
        }, 300)
    })
    
describe.run({print: require('sys').puts})