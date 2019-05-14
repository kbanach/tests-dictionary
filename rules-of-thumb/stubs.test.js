const sinon = require('sinon');


/* ***********************
 * Code example for:
 *
 *     "write fakes"
 *
 */

class WebCrawler {
  constructor(getMethod) {
    if (typeof getMethod !== 'function') {
      throw new Error('GET method should be a function');
    }

    this.getMethod = getMethod;

    this.RETRY_REQUEST = 3;
  }

  async fetchHtmlContent(url) {
    let callsLeft = 1 + this.RETRY_REQUEST;

    while (callsLeft > 0) {
      callsLeft--;

      try {
        const body =  await this.getMethod(url);
        return body;
      } catch(err) {
        if (callsLeft <= 0) {
          return {
            error: true,
            message: 'Something went wrong.'
          };
        }
      }
    }
  }
}

/* ***********************
 * Test cases
 */

describe('WebCrawler class', () => {
  describe('needs a GET method injected', () => {
    it('should throw when instantiated without it', () => {
      expect(() => {
        new WebCrawler();
      }).toThrow();
    });

    it('should not throw when passed argument is a function', () => {
      expect(() => {
        new WebCrawler(function (){});
      }).not.toThrow();
    });
  });

  describe('has method fetchHtmlContent() which', () => {
    let TEST_INSTANCE;
    const STUB_FETCH = sinon.stub().resolves();

    beforeEach(() => {
      STUB_FETCH.reset();
      STUB_FETCH.resolves();

      TEST_INSTANCE = new WebCrawler(STUB_FETCH);
    });

    it('is exposed', () => {
      expect(typeof TEST_INSTANCE.fetchHtmlContent).toBe('function');
    });

    it('returns HTML content of passed URL', () => {
      STUB_FETCH.resolves('<body>GOOGLE CONTENT</body>');

      // if it's a Promise, it HAS TO BE returned
      return expect(TEST_INSTANCE.fetchHtmlContent('www.google.com'))
        .resolves.toBe('<body>GOOGLE CONTENT</body>');
    });

    it('still resolves in case GET method throws', () => {
      STUB_FETCH.throws();

      return expect(TEST_INSTANCE.fetchHtmlContent('www.google.com'))
        .resolves.toBeTruthy();
    });

    it('retries three times to fetch in case of GET method failure', async () => {
      STUB_FETCH
        .onCall(0).throws()
        .onCall(1).throws()
        .onCall(2).throws()
        .resolves('');

      await TEST_INSTANCE.fetchHtmlContent('www.google.com');

      // first failed and then three retries, last one successful
      expect(STUB_FETCH.callCount).toBe(4);
    });

  })
});
