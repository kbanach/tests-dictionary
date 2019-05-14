/* ***********************
 * Code example for:
 *
 *     "descriptions of failing test should combine a valuable
 *      and understandable sentence for developer"
 *
 */

class BubbleGum { }

class Kiosk {
  constructor(initialState = { bubbleGums: 0 }) {
    this.state = {
      ...initialState,
    };
  }

  getBubbleGum() {
    if (this.state.bubbleGums <= 0) {
      throw new Error('There are no bubblegums left in kiosk!');
    }

    this.state.bubbleGums -= 1;
    return new BubbleGum();
  }
}

/* ***********************
 * Test cases
 */

describe('Kiosk class', () => {
  describe('has method getBubbleGum() which', () => {

    // ...previous unit tests

    it('throws when more than avaibale BubbleGums requested', () => {
      const kiosk = new Kiosk({
        bubbleGums: 1,
      });

      expect(() => {
        kiosk.getBubbleGum(); // 1 gum
        kiosk.getBubbleGum(); // should throw
      }).toThrow();
    });

    it('will throw if no bubblegums where initialized', () => {
      const kiosk = new Kiosk();

      expect(() => {
        kiosk.getBubbleGum(); // should throw
      }).toThrow();
    });

    it('does not modify passed initial state', () => {
      const INITIAL_STATE = {
        bubbleGums: 2,
      };

      const kiosk = new Kiosk(INITIAL_STATE);
      kiosk.getBubbleGum();

      expect(INITIAL_STATE.bubbleGums).toBe(2);
    });
  });
});
