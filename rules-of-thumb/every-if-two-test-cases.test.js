/* ***********************
 * Code example for:
 *
 *     "every `if()` in the code generates two test cases"
 *
 */

 function isInputTruthy(input) {
   if (input) {
     return true;
   }

   return false;
 }


/* ***********************
 * Test cases
 */

describe('every `if()` in the code generates two test cases', () => {
  it('runs returns TRUE when passing truthy value', () => {
    expect(isInputTruthy(1)).toBe(true);
  });

  it('runs returns FALSE when passing falsy value', () => {
    expect(isInputTruthy()).toBe(false);
  });
});

