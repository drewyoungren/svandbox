<script>
  import { onMount } from 'svelte';

  /**
   * @type Array<Array<Boolean>>
   */
  let status = [];

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
   * @type Array<Array<ChocNode>>
   */
  let grid = [];

  let m = 2;
  let n = 3;

  for (let i = 0; i < 2 * m; i++) {
    grid.push([]);
    for (let j = 0; j < 2 * n; j++) {
      grid[i].push({
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
   * @type Number
   */
  let sw = 2 * n * 100;
  /**
   * @type Number
   */
  let sh = 2 * m * 100;

  let turn = 0;

  onMount(() => console.log(grid));
</script>

<h1>Challenge 5.2: Hungry vs. Sneaky</h1>

<p>Hungry and Sneaky take turns alternating</p>

<div class="maindisplay">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style:height={2 * m * 100}
    style:width={2 * n * 100}
  >
    {#each grid as row}
      {#each row as { i, j, choc, sneakySelect, hungrySelect }}
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
              if (turn == 0) {
                hungrySelect = !hungrySelect;
              }
            }}
            stroke={hungrySelect ? 'yellow' : sneakySelect ? 'lightblue' : ''}
            stroke-width="4"
          ></circle>
        {/if}
      {/each}
    {/each}
  </svg>

  <table>
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
  }
  svg {
    max-width: 100%;
  }
</style>
