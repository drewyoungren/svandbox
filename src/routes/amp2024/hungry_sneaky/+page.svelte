<script>
  import { onMount, SvelteComponentTyped } from "svelte";

  /**
   * @type Array<Number>
   */
  let selected = [];

  let clickLock = false;

  /**
   * @typedef ChocNode
   * @type {Object}
   * @property {number} i
   * @property {number} j
   * @property {boolean} choc
   * @property {boolean} hungrySelect
   * @property {boolean} sneakySelect
   */

  /**
   * @type Array<ChocNode>
   */
  let grid = [];

  /**
   *
   * @param i Number
   * @param j Number
   * @returns ChocNode
   */
  function getGrid(i, j) {
    return grid.find((n) => n.i == i && n.j == j);
  }

  let m = 2;
  let n = 3;

  for (let i = 0; i < 2 * m; i++) {
    for (let j = 0; j < 2 * n; j++) {
      grid.push({
        i: i,
        j: j,
        choc: true,
        hungrySelect: false,
        sneakySelect: false,
      });
    }
  }

  let score = [0, 0];

  /**
   * @returns Boolean
   */
  function checkBoard() {
    return grid
      .filter((node) => node.choc)
      .some((node) => {
        const { i, j } = node;
        return (
          (i < 2 * n && getGrid(i + 1, j)?.choc) ||
          (i > 0 && getGrid(i - 1, j)?.choc) ||
          (j < 2 * m && getGrid(i, j + 1)?.choc) ||
          (j > 0 && getGrid(i, j - 1)?.choc)
        );
      });
  }

  /**
   * @type Number
   */
  let sw = 2 * n * 100;
  /**
   * @type Number
   */
  let sh = 2 * m * 100;

  let turn = 1;

  onMount(() => console.log(grid));
</script>

<h1>Challenge 5.2: Hungry vs. Sneaky</h1>

<p>
  Hungry and Sneaky take turns selecting chocolates. Hungry can take any two
  adjacent pieces. Sneaky can take any single piece and gets the remaining if
  Hungry can't select any. How can Sneaky secure the most chocolate?
</p>

{#if turn % 3 > 0}
  <h4>
    Hungry's turn ({turn % 3} of 2).
  </h4>
{:else}
  <h4>Sneaky's turn.</h4>
{/if}

<div class="maindisplay">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style:height={(2 * m * 100).toString() + "px"}
    style:width={(2 * n * 100).toString() + "px"}
  >
    {#each grid as { i, j, choc, sneakySelect, hungrySelect }}
      <rect x={j * 100} y={i * 100} width="100" height="100" fill="black"
      ></rect>
      {#if choc}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <circle
          cx={j * 100 + 50}
          cy={i * 100 + 50}
          r="45"
          fill="brown"
          on:click={() => {
            if (turn % 3 == 1) {
              if (choc && !hungrySelect) {
                hungrySelect = true;
                selected = [i, j];
                turn += 1;
              }
            } else if (turn % 3 == 2) {
              if (!clickLock) {
                if (
                  choc &&
                  Math.abs(i - selected[0]) + Math.abs(j - selected[1]) == 1
                ) {
                  hungrySelect = true;
                  clickLock = true;
                  setTimeout(() => {
                    turn += 1;
                    hungrySelect = false;
                    choc = false;
                    getGrid(selected[0], selected[1]).choc = false;
                    getGrid(selected[0], selected[1]).hungrySelect = false;
                    score[0] += 2;
                    selected = [];
                    clickLock = false;
                  }, 500);
                } else if (
                  Math.abs(i - selected[0]) + Math.abs(j - selected[1]) ==
                  0
                ) {
                  selected = [];
                  hungrySelect = false;
                  turn -= 1;
                }
              }
            } else {
              if (!clickLock) {
                sneakySelect = true;
                clickLock = true;
                setTimeout(() => {
                  sneakySelect = false;
                  choc = false;
                  score[1] += 1;
                  turn += 1;
                  clickLock = false;
                }, 500);
              }
            }
          }}
          stroke={hungrySelect ? "yellow" : sneakySelect ? "lightblue" : ""}
          stroke-width="4"
        ></circle>
      {/if}
    {/each}
  </svg>

  <table border="1">
    <tr>
      <th>Hungry</th>
      <th>Sneaky</th>
    </tr>
    <tr>
      <td>{score[0]}</td>
      <td>{score[1]}</td>
    </tr>
  </table>
</div>

<div>
  <p>m:<input type="number" name="m" id="mnumber" bind:value={m} /></p>
  <p>n:<input type="number" name="n" id="nnumber" bind:value={n} /></p>
</div>

<style>
  .maindisplay {
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-wrap: wrap;
    max-width: 1000px;
  }

  th {
    font-weight: bold;
  }

  td {
    text-align: center;
  }
</style>
