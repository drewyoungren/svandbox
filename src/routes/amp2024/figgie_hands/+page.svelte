<script>
  import M from '$lib/M.svelte';
  let display = false;

  /**
   *
   * @param n {number}
   * @param k {number}
   * @returns {number} n choose k
   */
  function binomial(n, k) {
    // Initialize the coefficient variable to 1.
    var coeff = 1;
    // Calculate the numerator of the binomial coefficient.
    for (var x = n - k + 1; x <= n; x++) coeff *= x;
    // Calculate the denominator of the binomial coefficient.
    for (x = 1; x <= k; x++) coeff /= x;
    // Return the calculated binomial coefficient.
    return coeff;
  }
</script>

<h1>Figgie starting odds</h1>

<p>
  Given a starting hand with <M>n</M> of a particular suit, what are the odds that
  suit is the short suit (8 cards) or the common suit (12 cards)?

  <M display={true}
    >{`P(\\text{short} \\mid n) = \\frac{\\binom{8}{n}\\binom{32}{10 - n}}{\\binom{8}{n}\\binom{32}{10 - n} + 2\\binom{10}{n}\\binom{30}{10 - n} + \\binom{12}{n}\\binom{28}{10 - n}}`}</M
  >
</p>
<p>
  <M display={true}
    >{`P(\\text{long} \\mid n) = \\frac{\\binom{12}{n}\\binom{28}{10 - n}}{\\binom{8}{n}\\binom{32}{10 - n} + 2\\binom{10}{n}\\binom{30}{10 - n} + \\binom{12}{n}\\binom{28}{10 - n}}`}</M
  >
</p>

<table>
  <tr>
    <th><M>n</M></th>
    <th><M>{String.raw`P(\text{short} \mid n)`}</M></th>
    <th><M>{String.raw`P(\text{common} \mid n)`}</M></th>
  </tr>
  {#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as k}
    <tr>
      <td><M>{k}</M></td>
      <td
        ><M>
          {Math.round(
            1000 *
              ((binomial(32, 10 - k) * binomial(8, k)) /
                (binomial(32, 10 - k) * binomial(8, k) +
                  binomial(30, 10 - k) * binomial(10, k) * 2 +
                  binomial(28, 10 - k) * binomial(12, k)))
          ) / 1000}
        </M></td
      >
      <td
        ><M>
          {Math.round(
            1000 *
              ((binomial(28, 10 - k) * binomial(12, k)) /
                (binomial(32, 10 - k) * binomial(8, k) +
                  binomial(30, 10 - k) * binomial(10, k) * 2 +
                  binomial(28, 10 - k) * binomial(12, k)))
          ) / 1000}
        </M></td
      >
    </tr>
  {/each}
</table>

<style>
  table {
    font-family: Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    font-size: larger;
  }

  td,
  th {
    border: 1px solid #ddd;
    padding: 8px;
  }
  th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #04aa6d;
    color: white;
  }

  td {
    text-align: center;
  }
</style>
