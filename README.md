*describe* is a simple BDD framework for Javascript.
====================================================

Example:
--------

    describe('remove()')
	    .before(function(){
	        this.array = ['a', 'b', 'c'];
	    })
	    .should('remove single elements', function(){
	        remove(this.array, 0)
	        expect(this.array.length).toBe(2);
	        expect(this.array).toEqual(['b', 'c'])
	    })
	    .should('remove multiple elements', function(){
	        remove(this.array, 0, 2)
	        expect(this.array.length).toBe(1)
	        expect(this.array).toEqual(['c'])
	    })
		
Async Example:
--------------

    describe('Simple Async Test')
	    .should('be able to finish test after timeout', {async: true}, function(){
	        var self = this
			var val = 1
	        setTimeout(function(){
				self.expect(val).toBe(1)
	            self.finish()
	        }, 300)
	    })

To Run the Specs:
-----------------

Describe outputs the results of the tests in plain text when run. To output to a DOM element by ID - 
if you are running in a web browser:
	
	describe.run({printTo: 'log'})
	
"log" is the ID of the element in the example.

If you are running in other Javascript environments such as node.js or narwhal, specify the *print*
function that describe should use for output (it should take one string argument):

	describe.run({print: require('sys').puts})

The above example would work for node.js.

The *describe* function
-----------------------

The describe function starts the definition of a spec. Its return value is a Spec object, which
you'd add individual fixtures or test cases to. It's signature is:

### describe(name, *options*)
	
### *Options*

These options apply to all test cases within this spec, but may be overriden in individual test cases.

- async: (true or false), whether the test cases in this spec should be run async by default.
- asyncTimeout: (number in milliseconds), applicable only for async tests, the max time to wait for a test to complete. If it does not complete within the specified time, it will fail with the "Timed out" error message. The default value is 1000, or 1 second.

Spec Object methods
-------------------

### should(description, *options*, function)
Adds a test case to the spec. It takes the same *options* as the *describe* function.

### it(description, *options*, function)
Adds a test case to the spec. It takes the same *options* as the *describe* function.

### before(function)
Adds a setup function that executes before each test case in this spec.

### beforeAll(function)
Adds a setup function that executes once before all test cases are run.

### after(function)
Adds a tear-down function that executes after each test case in this spec.

### afterAll(function)
Adds a tear-down function that executes after all test cases in this spec have finished.

Test Object methods
----------------
A Test object represents an individual test case within a spec, and is also the context
within which your test functions run(the *this* variable). These methods are available to you on the Test object.

### expect(one).toBe(other)
Okay, I lied, this is actually a combination of 2 method calls, but this way is easier to document,
I think. The *expect(one).toBe(other)* asserts that *one* is *===* *other*.

### expect(one).toEqual(other)
Asserts that one is *equal to* other. The definition of *equal to* is as follows:

1. if one and other are of different types, they are not equal
2. if one and other are Dates, they are equal when one.getTime() == other.getTime()
3. if one and other are Arrays, they are equal when they have the same length and for all i, one[i] == other[i]
4. if one and other are simple object literals, they are equal when they have the same JSON representation
5. otherwise, one and other are equal when one == other

### expect(function).toRaise(*errorMessage*)
Asserts that a function, when executed will throw an error, optionally with a specified error message.

### fail(*errorMessage*)
Fails this test case immediately, optionally with a specified error message.

### finish()
Applicable only to async test cases: finishes the test case immediately.

License
-------
(The MIT License)

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