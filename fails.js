#! /usr/bin/env node

require.paths.unshift('./')
require('describe')

describe('Describe')
    .should('expect not met', function(){
        expect(1).toBe(2)
    })
    
describe('See Fail')
    .should('fail', function(){
        fail('You are fired!')
    })
    
describe('async tests', {async: true})
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
    .should('check to equal', function(){
        var self = this
        setTimeout(function(){
            self.expect([1,3]).toEqual([1,2])
            self.finish()
        }, 100)
    })
    
describe('async tests 2')
    .should('auto async when asyncTimeout is set', {asyncTimeout: 100}, function(){
        var self = this
        setTimeout(function(){
            self.finish()
        }, 200)
    })
    .should('expect raise fail', {async: true}, function(){
        var self = this
        setTimeout(function(){
            self.expect(function(){}).toRaise('blah')
            self.finish()
        }, 300)
    })

describe('async error thrown', {async: true})
    .should('display error', function(){
        this.hutnesoa.hotuse
    })
        
describe.run({print: require('sys').puts, showErrors: false})