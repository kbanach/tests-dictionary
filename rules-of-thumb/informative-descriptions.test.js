/* ***********************
 * Code example for:
 *
 *     "descriptions of failing test should combine a valuable
 *      and understandable sentence for developer"
 *
 */

class BubbleGum { }

class Kiosk {
  getBubbleGum() {
    return new BubbleGum();
  }
}

/* ***********************
 * Test cases
 */

describe('Kiosk class', () => {
  describe('has method getBubbleGum()', () => {
    it('exposed', () => {
      const kiosk = new Kiosk();

      expect(typeof kiosk.getBubbleGum).toBe('function');
    });

    it('that returns a BubbleGum object', () => {
      const kiosk = new Kiosk();

      expect(kiosk.getBubbleGum()).toBeInstanceOf(BubbleGum);
    });
  });
});
