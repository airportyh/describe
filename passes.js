if (typeof(require) != 'undefined'){
    require.paths.unshift('./')
    require('describe')
}

if (typeof(global) == 'undefined')
    window.global = window

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
    
describe('befores and afters')
    .beforeAll(function(){
        global.n = 0
    })
    .before(function(){
        global.n++
    })
    .should('beforeAll should be called once only', function(){
        expect(global.n).toBe(1)
    })
    .should('beforeAll should be called once only (2)', function(){
        expect(global.n).toBe(2)
    })
    

describe('befores and afters async', {async: true})
    .beforeAll(function(){
        global.n = 0
    })
    .before({async: false}, function(){
        global.n++
    })
    .should('beforeAll should be called once only', function(){
        var self = this
        setTimeout(function(){
            self.expect(global.n).toBe(1)
            self.finish()
        })
    })
    .should('beforeAll should be called once only (2)', function(){
        var self = this
        setTimeout(function(){
            self.expect(global.n).toBe(2)
            self.finish()
        })
    })
    
describe('async tests', {async: true})
    .should('test async', function(){
        var self = this
        setTimeout(function(){
            self.finish()
        }, 300)
    })
    
describe('async tests 2')
    .should('be able to set async at method-level', {async: true}, function(){
        var self = this
        setTimeout(function(){
            self.finish()
        }, 300)
    })
    .should('expect raise', {async: true}, function(){
        var self = this
        setTimeout(function(){
            self.expect(function(){ throw new Error('blah')}).toRaise('blah')
            self.finish()
        }, 300)
    })
    
describe('async tests 3', {async: true})
    .before({async: false}, function(){
        global.n = 1
    })
    .should('not run in parallel', function(){
        var self = this
        setTimeout(function(){
            self.expect(global.n).toBe(1)
            global.n = 2
            self.finish()
        }, 500)
    })
    .should('not run in parallel 2', function(){
        var self = this
        setTimeout(function(){
            self.expect(global.n).toBe(1)
            global.n = 2
            self.finish()
        }, 100)
    }) 
    
describe('async setup')
    .before({async: true}, function(){
        var self = this
        setTimeout(function(){
            self.n = 1
            self.finish()
        }, 500)
    })
    .should('run after setup', function(){
        expect(this.n).toBe(1)
    })
    
    
if (typeof(require) != 'undefined')
    describe.run({print: require('sys').puts})