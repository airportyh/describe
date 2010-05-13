/*
Copyright (c) 2010, Toby Ho

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/


describe = function(name, options){
	var spec = new describe.Spec(name, options)
	describe.specs.push(spec)
	return spec
}

describe.Spec = function(name, options){
    this.options = options
	this.name = name
	this.tests = []
	this.results = []
}
describe.Spec.prototype = {
    before: function(f){
    	this.before = f
    	return this
    },
    beforeAll: function(f){
    	this.beforeAll = f
    	return this
    },
    after: function(f){
        this.after = f
        return this
    },
    afterAll: function(f){
        this.afterAll = f
        return this
    },
    it: function(name, arg2, arg3){
        return this.__newTest__('it ' + name, arg2, arg3)
    },
    should: function(name, arg2, arg3){
        return this.__newTest__('should ' + name, arg2, arg3)
    },
    __newTest__: function(name, arg2, arg3){
        var testFunc, options
        if (typeof(arg2) == 'function'){
            options = this.options
            testFunc = arg2
        }else if (typeof(arg2) == 'object'){
            arg2.__proto__ = this.options
            options = arg2
            testFunc = arg3
        }
    	this.tests.push(new describe.Test(this, this.tests.length, name, testFunc, options))
    	return this
    },
    run: function(){
    	if (this.beforeAll) this.beforeAll()
    	for (var i = 0; i < this.tests.length; i++){
    		var testCase = this.tests[i]
    		var context = testCase
    		try{
    			if (this.before) this.before.apply(context)
    			testCase.testFunc()
    			if (!testCase.options.async)
    			    this.results[i] = new describe.TestResult()
    			if (testCase.options.async){
    			    var timeout = testCase.options.asyncTimeout || 1000
    			    setTimeout((function(test){
    			        return function(){
    			            test.fail('Timed out')
    			        }
    			    })(testCase), timeout)
    			}
    		}catch(e){
    			this.results[i] = new describe.TestResult(e)
    		}    
    		if (!testCase.options.async || this.results[i]){
        		if (this.after) this.after.apply(context)
    		}
    	}
    	this.tryFinish()
    },
    printError: function(test, error){
        with(describe){
            print(this.name + ' ' + test.name + ':')
            if (error.message == 'Timed out')
                print('    ' + error)
            else
                print(error.stack.split('\n').slice(0, 3).map(function(p){return '    ' + p}).join('\n'))
        }
    },
    tryFinish: function(){
        var summary = this.getSummary()
        if (summary){
        	if (this.afterAll) this.afterAll()
            with(describe){
                for (var i = 0; i < summary.failures.length; i++){
                    var idx = summary.failures[i]
                    var result = this.results[idx]
                    var test = this.tests[idx]
                    this.printError(test, result.error)
                }
                print('Ran ' + summary.total + ' specs for ' + this.name + '.')
                print(summary.failures.length + ' failures.')
            }
        }
    },
    getSummary: function(){
        var failures = []
        for (var i = 0; i < this.tests.length; i++){
            var result = this.results[i]
            if (!result) return null
            if (!result.passed) failures.push(i)
        }
        return {total: this.results.length, failures: failures}
    },
    reportResult: function(idx, result){
        if (this.results[idx] == undefined){
            this.results[idx] = result
            this.tryFinish()
        }
    }
}


describe.Test = function(spec, idx, name, func, options){
    this.spec = spec
    this.idx = idx
    this.name = name
    this.testFunc = func
    this.options = options || {}
    if (this.options.asyncTimeout && !this.options.async)
        this.options.async = true
}
describe.Test.prototype = {
    finish: function(){
        this.spec.reportResult(this.idx, new describe.TestResult())
    },
    reportResult: function(result){
        this.spec.reportResult(this.idx, result)
    },
    expect: function(one, context){
        return new describe.Assertion(this, one, context)
    },
    fail: function(reason){
        this.spec.reportResult(this.idx, new describe.TestResult(new Error(reason)))
    }
}

describe.TestResult = function(error){
    this.error = error
    this.passed = !Boolean(this.error)
}

describe.specs = []
describe.runSpec = function(spec){
    spec.run()
}
describe.Assertion = function(test, one, context){
    this.test = test
    this.one = one
    this.context = context
}
describe.Assertion.prototype = {
    toEqual: function(other){
        var e = null
        var one = this.one
        if ((one && one.constructor === Date) && 
            (other && other.constructor === Date)){
            one = one.getTime()
            other = other.getTime()
        }
        else if ((one && one.constructor === Array) && 
            (other && other.constructor === Array)){
            if (one.length != other.length)
                error = new Error(one + " is not equal to " + other)
            for (var i = 0; i < one.length; i++)
                if (one[i] != other[i])
                    e = new Error(one + " is not equal to " + other)
        }
        else if ((one && one.constructor === Object) && 
            (other && other.constructor === Object)){
          function listRepr(obj){
            var ret = []
            for (var key in obj){
              ret.push(key + ':' + obj[key])
            }
            return ret
          }
          e = this.test.expect(listRepr(one)).toEqual(listRepr(other))
        }
        else if (one != other)
            e = Error(one + " is not equal to " + other)
        if (this.test && this.test.options.async)
            this.test.reportResult(new describe.TestResult(e))
        else
            throw e
    },
    toBe: function(other){
        var one = this.one
        if (one !== other){
            var e = new Error(one + " is not the same object as " + other)
            if (this.test && this.test.options.async)
                this.test.reportResult(new describe.TestResult(e))
            else
                throw e
        }
    },
    toRaise: function(msg){
        var one = this.one
        var through = false
        try{
            one.apply(this.context)
            through = true
            throw new Error("Should have raised: " + msg)
        }catch(e){
            if (through){
                if (this.test && this.test.options.async)
                    this.test.reportResult(new describe.TestResult(e))
                else
                    throw e
            }
            else if (msg !== undefined){
                this.test.expect(e.message).toEqual(msg)
            }
        }
    }
}

expect = function expect(one, context){
    return new describe.Assertion(null, one, context);
}

fail = function fail(reason){
    throw new Error(reason || 'Failed');
};
describe.print = function(msg){
  if (console && console.log)
        console.log(msg);
}
describe.run = function(options){
    var options = options || {}
    if ('printTo' in options)
        describe.print = function(msg){
            function escape(s){
              if (!s || s.length == 0) return s;
              return s.replace(/</g, '&lt;').replace(/>/g, '&gt;')
            }
            document.getElementById(options.printTo).innerHTML += escape(msg) + '<br>';
        }
    else if ('print' in options)
        describe.print = options.print
    else
        describe.print = function(){}
	var specs = describe.specs;
	for (var i = 0; i < specs.length; i++){
		var spec = specs[i]
		var res = spec.run()
	}
	return describe
}