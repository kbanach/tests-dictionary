Testing dictionary
==================

All examples in this dictionary are using [Sinon.JS](https://sinonjs.org/) as a testing library.

---

## Table of contents

1. [Theory](#theory)
    1. [How to write tests](#how-to-write-tests)
    1. [How I can save time by spending time on writing tests](#how-i-can-save-time-by-spending-time-on-writing-tests)
1. [What are unit/integration/E2E tests](#what-are-unitintegratione2e-tests)
    1. [Unit tests](#unit-tests)
    1. [Integration tests](#integration-tests)
    1. [E2E tests](#E2E-tests)
1. [Dictionary](#dictionary)
    1. [Happy-path](#happy-path)
    1. [Edge case](#edge-case)
    1. [Coverage](#coverage)
    1. [Spies](#spies)
    1. [Stubs](#stubs)
    1. [Mocks](#mocks)
    1. [Assertions](#assertions-expects)
1. [Tools](#tools)

---

## Theory

There are two kinds of developers:

* those who write automated tests
* those who will hit hard fail because of lack of tests and they will start to write automated tests

There are three reasons why writing tests is beneficial:

* ability to make random code changes (aka. "refactor") and be sure, as long as the tests pass, that it didn't break any other part of the system
* productivity boost - no time is wasted on running manual tests over and over again
* actual documentation what production code meant to do and does it still do that (on each run of automated tests)

Cons of writing tests:

* bad tests introduce more pain than gain (maintenance of badly designed tests consumes more time than production code change)
* they require more discipline than production code (to avoid issue mentioned above)
* introduction of maintainable tests to existing production code is as pleasant as reaching 8th Ring of Hell (9th Ring is entirely booked by devs who don't write tests and leave the company)

People don't want to write tests because of lack of knowledge to answer those questions:

* how to write tests?
* how I can save time by spending time on writing tests?
* where to find time on writing tests?


### How to write tests?

Short answer: before writing production code.

Long answer: It depends on the level of experience.
**Beginner** should be instructed to write any kind of tests cases in the existing framework and every line he creates should be reviewed by someone who has knowledge about general good practices, used frameworks and implemented custom solutions per project. **Intermediate** should write as much as possible BDD/TDD (depends on which is used by the team) for unit tests and E2E tests. **Experienced developer** should care about tests code review, maintain the testing framework, spread good practices and share as much knowledge about tests as he physically can (e.g. by pair-programming).


### How I can save time by spending time on writing tests?

This one is quite tricky. On the first glance writing automated test may seem to be a waste of time:

* there is literally no working production code that brings value to the client (aka. business value)
* tests are another piece of code to maintain
* setup working testing framework that is clean and doesn't require any introduction to rest of devs is difficult if not impossible

**BUT!**, all of above issues are a copy-pasted complains if anyone tries to introduce any random framework to the team. Having said that, nobody questions using a framework for any app that lifecycle is longer than two sprints and involves more than two developers.

So, in general, writing and using automated tests might be considered an investment of time now (when there is no time), to spend less time in the future on bug-fixing,  introducing new features and refactoring huge chunks of application (when there will be even less time + production is down + logging system is not working + devops aren't available + official release is delayed two times already + your app was written by five teams, including monkeys on drugs).


### Where to find time on writing tests?

Short answer: as a professional, you know writing tests as part of the development of any bug-fix or new feature. Period.

Long answer: as a professional, you know writing tests as part of the development of any bug-fix or new feature. Period. Consider them in estimates and add the existence of automated test cases as a required part of any code review.

## What are unit/integration/E2E tests?

Difference between them can be shortened to some characteristics:

Unit tests:
* white box tests, heavily integrated with current production code implementation, used framework and libraries, **BUT** they don't exactly mirror the logic
* basic documentation tool for other developers, that answers the question "how to use the module you've just written?"
* don't rely on any DB, service, whatsoever working in the background (basically you should be able to run them locally offline)
* pinpoint where the issue is in case of failure
* in case of a pass, developers know that they didn't break someone's else's code behavior (aka. methods still have the same output and impact on system)
* cheap to setup, write and maintain

Integration tests:
* testing of single features provided by some parts of system working together
* might require using some "hacks" to be able to put/read/remove stuff from DB or other sources of data
* may require running DB, have access to the Internet or other services running on the same machine
* their failure is informing that "there's some issue with this feature, it should be somewhere starting from here: ModuleXYZ.abc()" and it might mean anything
* gives an overview that developer break some essential feature in case of failure (but to be sure, should be run once more)
* gives certainty that main most features are working as before (but still kind of independently from each other)
* expensive to setup, cheap to write, average to maintain


E2E tests:
* black-box tests, that interact with the system as end-consumer would (e.g. by a web browser, hitting API endpoints with proper requests, etc.)
* their failure might be totally random, due to network issues, other processes running on the same machine, weird data in DB
* gives a tip that something changed in user experience - it requires a deeper look
* gives certainty that from the user perspective system is behaving "as before"
* expensive to setup, average to write, expensive to maintain


### Unit tests

**Important!**

Most of the points below are possible to fulfill when writing new code. Unit testing of existing code is a totally different beast and it won't be covered in this tutorial.

**Characteristics**:

aka. The Truth

* test small, independent things (for sake of simplicity you can consider the following sentence as true - "_unit test does not touch any logic outside of one file (constants in other files are not logic)_")
* every run gives **exactly the same result** if the code didn't change
* can be run fast and often, e.g. as background watcher on every file modification
* execution and checking results (pass/fail) are automatic, in other words, can be done with (best-case scenario) one command
* they are isolated from each other, so one none of the tests is changing the state of the environment, which means in practice that developer can skip/move/delete any test case and none of the other tests will be affected by this action
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
* before fixing any bug, write a unit test that exposes it


**My personal list of rules of thumb**:

aka. You Can Critically Consider This as Truth, because it's authors opinion about JavaScript unit tests good practices, based on his experience

* based on unit tests developer is able to write from scratch (or refactor existing code) any part of the system
* write tests first, because that will force you to e.g. write testable code, use dependency injection, etc.
* every `if()` in the code generates two test cases - see [examples](rules-of-thumb/every-if-two-test-cases.test.js)
* focus on covering meaningful edge cases instead of writing happy-paths for a proper, but random value - see [examples](rules-of-thumb/edge-cases-coverage.test.js)
* descriptions of failing test should combine a valuable and understandable sentence for the developer - see [examples](rules-of-thumb/informative-descriptions.test.js)
* unit tests should catch any logic mutation - see [examples](rules-of-thumb/logic-mutation.test.js)
* write stubs **with an additional test case for failure** (see [examples](rules-of-thumb/stubs.test.js)) if the tested module uses:
    * any asynchronous method
    * any request (especially the one outside of your control - separate service, etc.)
    * any third-party library method that in your opinion might do any of above
* use multiple nested describe blocks to at least separate tested methods
* do not use apostrophes ( `'` ), quotes ( `"` ) or other chars (`!`, `/`, `?`, `\`, etc.) that might have to be escaped in search - that will simplify developer's life to simply copy-paste last part of failing test name to random search, example: instead of `"don't throw when app's running"`, write `"do not throw when app is running"`
* testing time-related behavior (e.g. timeouts of requests, triggering with a delay) should be written in a way that does not impact tests execution time (e.g. by custom configuration) and ensures same execution on each run, [examples](rules-of-thumb/time-events.test.js)
* do not fake/mock global methods/objects like `Date`, `fs`, etc., because in case of a stupid mistake (forget to de-fake it) might bring unpredictable behavior of other tests (e.g. tests that suppose to fail, will now pass)


**No man's Land**:

aka. You Have To Figure That Out per Project:

* how to handle the faked modules API
* what should be abstracted to test helpers
* how to write tests to existing code

---

### Integration tests

**Long story**:
While unit tests are independently checking the behavior of single methods, integration tests are making sure that those single methods work fine together to deliver a specific functionality of the system. It doesn't have to be executed fast and often automagically, but can be triggered by the test team, build half of universe upfront and fail randomly because of the phase of moon. They are hard to debug, expensive in maintenance but in case they pass, you can be certain that implemented features are still able to do their job. They are equally valuable for developers as for the end users.



**TL;DR**:
Everything that violates at least one of the points of Unit Tests Characteristics is a most probably an integration test.

---

### E2E tests

The most important tests from the perspective of the user. They use only the interfaces available to the end user, thus they kind check so-called user experience with the system. If something slows down, some DB is down, some integrated service misbehaves, they will most probably fail. You can consider it as a measurement of the level of frustration of the system's end user.

---

## Dictionary

### Happy-path

Name for a default testing scenario that doesn't cover edge-cases or error conditions. It has widely known the input and expected output in the context of a tested system. You may consider it a low-effort test.

### Edge case (in testing)

In the context of testing, it means a scenario on which behavior of method changes, e.g. if tax changes for everything above $10 in some method, then you'll have 3 edge case scenarios: $9.99, $10.00 and $10.01.

### Assertions/expects

Those are simple methods provided by framework that verify given value. If given value does not match expected result (both are given per call), it throws. Some of them, like `expect` are quite self-explandatory or a bit less, like `assert`:

```javascript
// Jest's expect - https://github.com/mjackson/expect
expect(true).toExists(); // won't throw
excpect(false).toBe(true); // throws
excpect(false).toBe(true); // throws

// NodeJS assert - https://nodejs.org/api/assert.html
assert(true); // won't throw
assert.notStrictEqual(1, '1'); // won't throw
assert(false); // throws
assert.ok(typeof 123 === 'string'); // throws
```

### Test runners

Those are libraries that expose methods and commands that help to write tests. Let's use an example of vanilla JS script:

```javascript
/// The Method
function sum(...args) {
  let output = 0;

  if (args.length === 0) {
    throw new Error('Method needs at least one number input');
  }

  for (const a of args) {
    output += a;
  }

  return output;
}
```

```javascript
// The Tests

if (sum(1) !== 1) {
  throw new Error('Method sum() should return 1 for input of 1');
}

if (sum(1, 2) !== 3) {
  throw new Error('Method sum() should return 3 for input of 1 and 3');
}

if (sum(1, -1) !== 0) {
  throw new Error('Method sum() should be able to handle negative numbers by subtracting them from sum');
}

try {
  sum();
} catch(err) {
  if (!/INPUT/ig.test(err.message)) {
    throw new Error('Method sum() should throw an error mentioning INPUT when no parameters where passed');
  }
}

// ...

```

And with Jest/Expect:

```javascript
/// The Method
// ...

// The Tests

describe('Method sum() should', () => {
  test('return 1 for input of 1', () => {
    expect(sum(1)).toBe(1);
  });

  test('return 3 for input of 1 and 3', () => {
    expect(sum(1, 2)).toBe(3);
  });

  test('be able to handle negative numbers by subtracting them from sum', () => {
    expect(sum(1, -1)).toBe(0);
  });

  test('throw an error mentioning INPUT when no parameters where passed', () => {
    expect(() => {
      sum();
    }).toThrow(/INPUT/ig);
  });
});



// ...

```

There is no difference in simple examples, but it's starting to get complicated in vanilla JS when examples are getting more complex because most test runners expose helper methods like `describe`, `test`, `beforeEach`, etc. that make writing tests easier and more readable.


### Coverage

The easiest way of understanding "coverage" is how many lines of the production code were "touched"/executed during tests.


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
test('getPdf() method is calling PDF library with A4 format and passed content ', () => {
  const pdfAPI = { htmlToPdf: function() {} };
  const pdfLibMock = sinon.mock(pdfAPI);

  pdfLibMock.withArgs('a4', /SAMPLE TEST INPUT/ig);

  const INPUT = 'SAMPLE TEST INPUT';

  testedObj.getPdf(INPUT);

  mock.verify();
  expect(mock).to.have.been.calledOnce;
});
```
