Testing dictionary
==================

All examples in this dictionary are using [Sinon.JS](https://sinonjs.org/) as a testing library

---

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

---

## Theory

### Unit tests

**Important!**

Most of the points below are possible to fulfil when writing new code. Unit testing of existing code is a totally different beast and it won't be covered in this tutorial.

**Characteristics**:

aka. The Truth

* test small, independent things (for sake of simplicity you can consider the following sentence as true - "_unit test does not touch any logic outside of one file (constants in other files are not logic)_")
* every run gives **exactly the same result** if the code didn't change
* can be run fast and often, e.g. as background watcher on every file modification
* execution and checking results (pass/fail) are automatic, in other words, can be done with (best-case scenario) one command
* they are isolated from eachother, so one none of the tests is changing the state of environment, which means in practice that developer can skip/move/delete any test case and none of other tests will be affected by this action
* they are **not substituting** other types of tests
* they **do not test the contract** between tested modules


**Good practices**:

aka. You Should Accept This as Truth if you don't want to reinvent the wheel

* are good documentation - are readable (clean code) and informative for developers (well described with proper variable names)
* highest possible coverage (100% is practically unachievable in big systems, everything above 85% is a good score)
* one expect per unit test
* red-green principle for writing tests
* expect matches test description
* unit tests code quality should be at least as high as production code, but please keep in mind that purpose of unit tests is documentation and readability, so there is no need to e.g. making them super DRY and move everything to constants and functions
* amount of testing code in most cases should be equal or higher than production code
* before fixing any bug, write an unit test that exposes it


**My personal list of rules of thumb**:

aka. You Can Critically Consider This as Truth, because it's authors opinion about JavaScript unit tests good practices, based on his experience

* based on unit tests developer is able to write from scratch (or refactor existing code) any part of the system
* write tests first, because that will force you to e.g. write testable code, use dependency injection, etc.
* every `if()` in the code generates two test cases - see [examples](rules-of-thumb/every-if-two-test-cases.test.js)
* focus on covering meaningful edge cases instead of writing happy-paths for a proper, but random value - see [examples](rules-of-thumb/edge-cases-coverage.test.js)
* descriptions of failing test should combine a valuable and understandable sentence for the developer - see [examples](rules-of-thumb/informative-descriptions.test.js)
* unit tests should catch any logic mutation - see [examples](rules-of-thumb/logic-mutation.test.js)
* write stubs (see [examples](rules-of-thumb/stubs.test.js)) **with an additional test case for failure** if the tested module uses:
    * any asynchronous method
    * any request (especially the one outside of your control - separate service, etc.)
    * any third-party library method that in your opinion might do any of above
* use multiple nested describe blocks to at least separate tested methods
* do not use apostrophes ( `'` ), quotes ( `"` ) or other chars (`!`, `/`, `?`, `\`, etc.) that might have to be escaped in search - that will simplify developer's life to simply copy-paste last part of failing test name to random search, example: instead of `"don't throw when app's running"`, write `"do not throw when app is running"`
* testing time-related behavior (e.g. timeouts of requests, triggering with a delay) should be written in a way that does not impact tests execution time (e.g. by custom configuration) and ensures same execution on each run, [examples](rules-of-thumb/time-events.test.js)
* do not fake/mock global methods/objects like `Date`, `fs`, etc.


**No man's Land**:

aka. You Have To Figure That Out per Project:

* how to handle the faked modules API
* what should be abstracted to test helpers
* how to write tests to existing code

---

### Integration tests

#### Long story



#### TL;DR
Everything that violates at least one of the points of Unit Tests Characteristics is a most probably an integration test.


---

### Acceptance tests

---

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
