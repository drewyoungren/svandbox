<script>
  /**
   * @type Element
   */
  let checker;

  /**
   * @type Array<Array<Boolean>>
   */
  const color = [[], [], []];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 7; j++) {
      color[i].push(true);
    }
  }

  function reset() {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 7; j++) {
        color[i][j] = Math.random() > 0.5;
      }
    }
  }

  reset();
  /**
   * Handle click event for each box.
   * @param e {MouseEvent}
   * @param i {Number}
   * @param j {Number}
   */
  const leftclick = (e, i, j) => {
    // const guy = e.target?.id.slice(-2);
    // console.log(e.target.id.slice(-2));
    const els = document.querySelectorAll(`.check`);

    for (let el of els) {
      const row = Number(el.id[5]);
      const col = Number(el.id[6]);
      if (e.shiftKey) {
        if (row == i) {
          // console.log(row, col);
          color[row][col] = !color[row][col];
        }
      } else if (col == j) {
        color[row][col] = !color[row][col];
      }
    }
  };
</script>

<h1>Welcome to Challenge 4.1</h1>
<p>
  Can you get back to one color by swapping every tile in a row <kbd>Click</kbd>
  or a column <kbd>Shift</kbd>+<kbd>Click</kbd>.
</p>

<div id="checker" bind:this={checker}>
  {#each [0, 1, 2] as i}
    {#each [0, 1, 2, 3, 4, 5, 6] as j}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        id="check{i}{j}"
        class="check"
        class:white={color[i][j]}
        on:click={(e) => leftclick(e, i, j)}
      >
        <!-- I am {i}
        {j}. -->
      </div>
    {/each}
  {/each}
</div>

<button on:click={reset}> Reset </button>

<style>
  div#checker {
    background-color: rgba(128, 0, 0, 0.3);
    height: 30vw;
    width: 70vw;
    margin-left: 15%;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }
  .check {
    border: 1px solid gray;
    background-color: lightred;
  }

  .white {
    background-color: lightblue;
  }
  kbd {
    border: 1px solid black;
    border-radius: 2px;
  }
</style>
