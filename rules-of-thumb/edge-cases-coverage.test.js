/* ***********************
 * Code example for:
 *
 *     "covering meaningful edge cases"
 *
 */

class Kiosk {
  static addTax(amount) {
    if (typeof amount !== 'string') {
      throw new Error('Passed amount must be a string');
    }

    const separatorsRegExp = /\./ig;
    const separators = amount.match(separatorsRegExp);

    if (!separators || (separators && separators.length !== 1)) {
      throw new Error('Passed amount should have exactly one separator');
    }

    const allowedChars = /^[0-9\.]+$/;

    if (!allowedChars.test(amount)) {
      throw new Error('Passed amount can contain only digits and separator');
    }

    const [ parsedDollars, parsedCents ] = amount.split(separatorsRegExp);

    let cents = parseInt(parsedDollars, 10) * 100 + parseInt(parsedCents, 10);

    if (cents <= 0) {
      throw new Error('Passed amount should be greather than zero');
    }

    if (cents >= (10 * 100)) {
      cents *= 1.1;
    }

    cents = Math.round(cents);

    const outputDollarsStr = String(parseInt(cents / 100, 10));
    let outputCentsStr = String(cents % 100);

    if (outputCentsStr.length === 1) {
      outputCentsStr = '0' + outputCentsStr;
    }

    return  outputDollarsStr + '.' + outputCentsStr;
  }
}

/* ***********************
 * Test cases
 */
describe('Kiosk class', () => {
  describe('has method addTax() which', () => {
    it('is exposed', () => {
      expect(typeof Kiosk.addTax).toBe('function');
    });

    it('should throw when amount parameter is not string with STRING word in error message', () => {
      expect(() => {
        Kiosk.addTax(1);
      }).toThrow(/STRING/ig);
    });

    it('should throw when amount parameter has more than one separator with SEPARATOR word in error message', () => {
      expect(() => {
        Kiosk.addTax('1.1.1');
      }).toThrow(/SEPARATOR/ig);
    });

    it('should throw when amount parameter does not have a separator with SEPARATOR word in error message', () => {
      expect(() => {
        Kiosk.addTax('11');
      }).toThrow(/SEPARATOR/ig);
    });

    it('should throw when amount equals zero with ZERO word in error message', () => {
      expect(() => {
        Kiosk.addTax('0.00');
      }).toThrow(/ZERO/ig);
    });

    it('should throw when amount contains anything besides digits and a dot than zero with DIGITS word in error message', () => {
      expect(() => {
        Kiosk.addTax('-0.01');
      }).toThrow(/DIGITS/ig);
    });

    // // useless happy-path test with proper but random (far away from edge-case) value
    // it('adds 0% to price below 10', () => {
    //   expect(Kiosk.addTax('5.00')).toBe('5.00');
    // });

    it('adds 0% to price below 10', () => {
      expect(Kiosk.addTax('9.99')).toBe('9.99');
    });

    it('adds 10% to price equal 10', () => {
      expect(Kiosk.addTax('10.00')).toBe('11.00');
    });

    it('adds 10% to price above 10', () => {
      expect(Kiosk.addTax('10.01')).toBe('11.01');
    });
  });
});
