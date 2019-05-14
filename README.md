Testing dictionary
==================

All examples in this dictionary are using [Sinon.JS](https://sinonjs.org/) as a testing library

## Table of contents

1. [Theory](#theory)
    1. [Unit tests](#unit-tests)
    1. [Integration tests](#integration-tests)
    1. [Acceptance tests](#acceptance-tests)
1. [Dictionary](#dictionary)
    1. [Coverage](#coverage)
    1. [Spies](#spies)
    1. [Stubs](#stubs)
    1. [Mocks](#mocks)
    1. [Assertions](#assertions)

## Theory

### Unit tests

Characteristics:

* test small, independent things (for sake of simplicity you can consider the following sentence as true - "_unit test does not touch any logic outside of one file (constants in other files are not logic)_")
* every run gives **exactly the same result** if the code didn't change
* can be run fast and often
* execution and checking results (pass/fail) are automatic, in other words, can be done with (best-case scenario) one command
* they are **not substituting** other types of tests


Good practices:

* are good documentation - are readable (clean code) and informative for developers (well described with proper variable names)
* highest possible coverage (100% is practically unachievable in big systems, everything above 85% is a good score)
* one expect per unit test
* expect matches test description
* unit tests code quality and the amount should be at least as high as production code, but having on mind that those tests can (and should) be used as documentation, quality should be even higher and more strict than production code

My personal list of rules of thumb:

* based on unit tests developer is able to write from scratch (or refactor existing code) any part of the system (all `rules-of-thumb/` examples combined)
* write tests first, because that will force you to e.g. write
testable code, use dependency injection, etc. (all `rules-of-thumb/` examples combined)
* every `if()` in the code generates two test cases - see [examples](rules-of-thumb/every-if-two-test-cases.test.js)
* descriptions of failing test should combine a valuable and understandable sentence for developer - see [examples](rules-of-thumb/informative-descriptions.test.js)
* unit tests should catch any logic mutation - see [examples](rules-of-thumb/logic-mutation.test.js)
* write stubs (see [examples](rules-of-thumb/stubs.test.js)) with additional test case for failure if tested module uses:
    * any asynchronous method
    * any request (especially the one outside of your controll - separate service, etc.)
    * any third-party library method that in your opinion might do any of above
* use multiple nested describe blocks to at least separate tested methods
* do not use apostrophes ( `'` ), quotes ( `"` ) or other chars (`!`, `/`, `?`, `\`, etc.) that might have to be escaped in search - that will simplify developer's life to simply copy-paste last part of failing test name to random search, example: instead of `"don't throw when app's running"`, write `"do not throw when app is running"`
* testing time related behavior (e.g. timeouts of requests, triggering with a delay) should be written in a way that does not impact tests execution time (e.g. by custom configuration), [examples](rules-of-thumb/time-events.test.js)


### Integration tests

### Acceptance tests

## Dictionary

### Coverage

### Spies

Test **spy** is a function, that records all calls, its returned values, the value of `this` and thrown exceptions.

There are two types of spies:
- anonymous functions that might be used for injecting into the tested module
- wrappers to existing methods

#### Examples

Spy as anonymous function:

```javascript
test('module should execute callback when triggered', () => {
  const callbackSpy = sinon.spy();

  testedModule.register('TEST', callbackSpy);
  testedModule.trigger('TEST');

  expect(callbackSpy).to.have.been.calledOnce;
});
```


Spy on call arguments:

```javascript
test('module execute callback with second argument passed to trigger', () => {
  const callbackSpy = sinon.spy();
  const TEST_ARG = 41;

  testedModule.register('TEST', callbackSpy);
  testedModule.trigger('TEST', TEST_ARG);

  expect(callbackSpy).to.have.been.calledWith(TEST_ARG);
});
```


Spy as a wrapper to the existing method:

```javascript
test('module should call method saveToDb on itself when triggered', () => {
  const saveToDbSpy = sinon.spy(testedModule, 'saveToDb');

  testedModule.trigger();

  expect(saveToDbSpy).to.have.been.calledOnce;
});
```

### Stubs

Test **stubs** are **spies** with pre-programmed behavior. They share methods with
spies, but additionally expose helper methods that can change their behavior on-the-fly.

Stubs are quite handy when you want to achieve a specific path of code execution.

#### Examples

Stubs as a function which are forced to throw in the test example

```javascript
test('module is able to handle callback throws', () => {
  const callbackThrowingStub = sinon.stub().throws();

  testedModule.register('TEST_1', callbackThrowingStub);

  expect(function() {
    testedModule.trigger('TEST_1');
  }).toNotThrow();

  expect(callbackThrowingStub).to.have.been.calledOnce;
});

test('module calls saveToDb even when callback throws', () => {
  const saveToDbSpy = sinon.spy(testedModule, 'saveToDb');

  const callbackStub = sinon.stub();
  const callbackThrowingStub = sinon.stub().throws();

  testedModule.register('TEST_1', callbackStub);
  testedModule.register('TEST_2', callbackThrowingStub);

  testedModule.trigger('TEST_1');
  testedModule.trigger('TEST_2');

  expect(saveToDbSpy).to.have.been.calledTwice;
});
```

As said before, stubs behavior can be changed during the test.
Specific order execution paths are a good place to use that feature.

```javascript
test('module calls fetch() method whenever trigger() was called', () => {
  const fetchSpy = sinon.spy(testedModule, 'fetch');

  testedModule.trigger();

  expect(fetchSpy).to.have.been.calledOnce;
});

test('after throw of fetch(), module will retry to call fetch() again', () => {
  const fetchStub = sinon.stub(testedModule, 'fetch');

  fetchStub.onCall(0).throws();
  fetchStub.return({ all: 'fine' });

  testedModule.trigger();

  expect(fetchStub).to.have.been.calledTwice;
});

test('after multiple failing of fetch(), module trigger() method will throw', () => {
  const fetchStub = sinon.stub(testedModule, 'fetch');

  fetchStub.throws();

  expect(function() {
    testedModule.trigger();
  }).toThrow();

});

test('fetch() method should be retried 3 times max', () => {
  const fetchStub = sinon.stub(testedModule, 'fetch');

  fetchStub.throws();

  // muting throw
  try {
    testedModule.trigger();
  } catch() {}

  expect(fetchStub).to.have.been.calledThrice;
});
```


### Mocks

It's a common misunderstanding to call stubs "mocks". The main (and only) difference
between them is **built-in expectations** (aka. assertions).

This small difference has big consequences because it **forces** developer to
use the mock in unit tests in a particular way.

#### Examples

```javascript
test();
```

### Assertions/expects
