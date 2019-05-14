const sinon = require('sinon');


/* ***********************
 * Code example for:
 *
 *     "testing time related behavior"
 *
 */

const fs = require('fs');

class ReadFile {
  static getTimestamp() { return Date.now(); };
  static getFileContent(filename) { return fs.readFileSync(filename); }

  // some crazy-recursive method
  // ATTENTION: for testing purposes only, don't write anything like this!
  static readFileLoop(filename, startTimestamp, timeoutInMs, successCb, failCb) {
    if (ReadFile.getTimestamp() <= (startTimestamp + timeoutInMs)) {
      try {
        const content = ReadFile.getFileContent(filename);

        if (content) {
          return successCb(content);
        }
      } catch(err) {
        // log some possible errors
      } finally {
        setTimeout(() => {
          ReadFile.readFileLoop(...arguments);
        }, 100);
      }
    } else {
      failCb(new Error(`Timeout for file ${filename}`));
    }
  }

  // ////////////////////////////////////////////////
  // the issue is here ------------------------    //
  //                                           |   //
  // default timeout is 10s, while             |   //
  // tests will fail after 2s (by default),    |   //
  // so this behavior should be overriden      |   //
  // ///////////////////////////////////////   V   //
  static waitAndRead(filename, timeoutInMs = 10000) {
    const timestamp = ReadFile.getTimestamp();

    return new Promise((resolve, reject) => {
      ReadFile.readFileLoop(filename, timestamp, timeoutInMs, resolve, reject);
    });
  }
}


/* ***********************
 * Test cases
 */
describe('ReadFile class', () => {
  describe('has method waitAndRead that', () => {
    const stubReadFile = sinon.stub(ReadFile, 'getFileContent');
    const stubGetTimestamp = sinon.stub(ReadFile, 'getTimestamp');

    beforeEach(() => {
      stubReadFile.reset();
      stubReadFile.returns('FAKE CONTENT');

      stubGetTimestamp.reset();
      stubGetTimestamp.callThrough();
    });

    afterAll(() => {
      stubReadFile.restore();
    });

    it('should return files content if it exists', () => {
      return expect(ReadFile.waitAndRead('SOME.FILE'))
        .resolves.toBe('FAKE CONTENT');
    })

    it('should reject with error containing TIMEOUT string for non-existing file after a timeout', () => {
      stubReadFile.throws();

      // comment below to not fake Date.now
      stubGetTimestamp
        .onFirstCall().returns(1) // first call is getting initial timestamp
        .returns(10000);          // every other is done during the loop

      return expect(ReadFile.waitAndRead('NON-EXISTING.FILE'))
        .rejects.toThrow(/timeout/ig);
    });

  });
});
