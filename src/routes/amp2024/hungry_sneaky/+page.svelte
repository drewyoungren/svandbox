<script>
  import { onMount, SvelteComponentTyped } from 'svelte';

  /**
   * @type Array<Number>
   */
  let selected = [];

  let clickLock = false;
  let unit = 100;

  /**
   * @typedef ChocNode
   * @type {Object}
   * @property {number} i
   * @property {number} j
   * @property {boolean} choc
   * @property {boolean} hungrySelect
   * @property {boolean} sneakySelect
   * @property {number} shape
   */

  /**
   * @type Array<ChocNode>
   */
  let grid = [];

  let score = [0, 0];
  let turn = 1;
  /**
   * Returns the object with the given coords.
   * @param i {Number}
   * @param j {Number}
   * @returns {ChocNode|undefined}
   */
  const getGrid = (i, j) => {
    return grid.find((n) => n.i == i && n.j == j);
  };

  let m = 2;
  let n = 3;

  const reset = () => {
    turn = 1;
    score = [0, 0];
    clickLock = false;
    grid = [];
    for (let i = 0; i < 2 * m; i++) {
      for (let j = 0; j < 2 * n; j++) {
        grid.push({
          i: i,
          j: j,
          choc: true,
          hungrySelect: false,
          sneakySelect: false,
          shape: Math.floor(Math.random() * 4),
        });
      }
    }
  };

  /**
   * @returns {Boolean}
   */
  function checkBoard() {
    const goOn = grid
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
    if (!goOn) {
      clickLock = true;
      grid
        .filter((node) => node.choc)
        .forEach((node) => {
          node.sneakySelect = true;
          setTimeout(() => {
            score[1] += 1;
            node.sneakySelect = false;
            node.choc = false;
            grid = [...grid];
          }, 500);
        });
    }
    grid = [...grid];

    return goOn;
  }

  /**
   * @type Number
   */
  let sw;
  /**
   * @type Number
   */
  let sh;

  /**
   *
   * @param node {ChocNode}
   */
  const handleClick = (node) => {
    let { i, j, choc, hungrySelect, sneakySelect } = node;
    console.log('Got click', node);
    if (turn % 3 == 1) {
      if (choc && !hungrySelect) {
        node.hungrySelect = true;
        selected = [i, j];
        turn += 1;
      }
    } else if (turn % 3 == 2) {
      if (!clickLock) {
        if (
          choc &&
          Math.abs(i - selected[0]) + Math.abs(j - selected[1]) == 1
        ) {
          node.hungrySelect = true;
          clickLock = true;
          setTimeout(() => {
            turn += 1;
            node.hungrySelect = false;
            node.choc = false;
            getGrid(selected[0], selected[1]).choc = false;
            getGrid(selected[0], selected[1]).hungrySelect = false;
            score[0] += 2;
            selected = [];
            clickLock = false;
            grid = [...grid];
          }, 500);
        } else if (Math.abs(i - selected[0]) + Math.abs(j - selected[1]) == 0) {
          selected = [];
          node.hungrySelect = false;
          turn -= 1;
        }
      }
    } else {
      if (!clickLock) {
        node.sneakySelect = true;
        clickLock = true;
        setTimeout(() => {
          node.sneakySelect = false;
          node.choc = false;
          score[1] += 1;
          turn += 1;
          clickLock = false;
          grid = [...grid];
        }, 500);
      }
    }
    grid = [...grid];
  };

  /**
   *
   * @param i {number} row in grid
   * @param j {number} col in grid
   * @returns {string} string for svg polynomial
   */
  const makeTrap = (i, j) => {
    let s = `${j * 100 + 30},${i * 100 + 10} `;
    s += `${j * 100 + 70},${i * 100 + 10} `;
    s += `${j * 100 + 90},${i * 100 + 90} `;
    s += `${j * 100 + 10},${i * 100 + 90} `;
    return s;
  };

  onMount(reset);
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
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    style:height={(2 * m * 100).toString() + 'px'}
    style:width={(2 * n * 100).toString() + 'px'}
    viewBox={`0 0 ${2 * n * 100} ${2 * m * 100}`}
  >
    {#each grid as node}
      {#if node.choc}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->

        {#if node.shape < 2}
          <circle
            cx={node.j * 100 + 50}
            cy={node.i * 100 + 50}
            r="45"
            fill="#66350F"
            on:click={() => handleClick(node)}
            stroke={node.hungrySelect
              ? 'yellow'
              : node.sneakySelect
                ? 'lightblue'
                : ''}
            stroke-width="4"
          ></circle>
        {:else if node.shape == 2}
          <rect
            x={node.j * 100 + 10}
            y={node.i * 100 + 10}
            height="80"
            width="80"
            fill="#45200D"
            on:click={() => handleClick(node)}
            stroke={node.hungrySelect
              ? 'yellow'
              : node.sneakySelect
                ? 'lightblue'
                : ''}
            stroke-width="4"
          ></rect>
        {:else if node.shape == 3}
          <polygon
            points={makeTrap(node.i, node.j)}
            fill="#9A7B4D"
            on:click={() => handleClick(node)}
            stroke={node.hungrySelect
              ? 'yellow'
              : node.sneakySelect
                ? 'lightblue'
                : ''}
            stroke-width="4"
          ></polygon>
        {/if}
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

{#key turn}
  {#if !checkBoard()}
    <h2>
      Game Over in {2 * Math.floor(turn / 3) + (turn % 3 ? 1 : 0) - 1} turns.
    </h2>

    <div class="ifwinner">
      <span>
        <label for="m">m:</label><input
          class="paramPut"
          type="number"
          name="m"
          id="mnumber"
          bind:value={m}
        />
      </span>
      <span>
        <label for="n">n:</label><input
          class="paramPut"
          type="number"
          name="n"
          id="nnumber"
          bind:value={n}
        />
      </span>
      <button on:click={reset}>Play again</button>
    </div>
  {/if}
{/key}

<style>
  .maindisplay {
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-wrap: wrap;
    max-width: 1000px;
  }

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

  .ifwinner {
    display: flex;
    justify-content: space-between;
    max-width: 300px;
  }
  .paramPut {
    width: 3rem;
  }
  svg {
    background-color: black;
  }
</style>
