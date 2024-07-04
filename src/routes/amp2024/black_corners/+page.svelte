<script>
  /**
   * @type Element
   */
  let checker;

  let shiftDown = false;

  document.addEventListener('keydown', (e) => {
    if (e.key == 'Shift') {
      shiftDown = true;
    }
  });
  document.addEventListener('keyup', (e) => {
    if (e.key == 'Shift') {
      shiftDown = false;
    }
  });

  /**
   * @type Array<Array<Boolean>>
   */
  const color = [[], [], [], [], [], [], [], []];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      color[i].push(true);
    }
  }

  function corners() {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        color[i][j] = true;
      }
    }
    color[0][0] = false;
    color[7][0] = false;
    color[0][7] = false;
    color[7][7] = false;
  }

  function blank() {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        color[i][j] = true;
      }
    }
  }

  corners();

  /**
   * Handle click event for each box.
   * @param e {MouseEvent}
   * @param i {Number}
   * @param j {Number}
   */
  const leftClick = (e, i, j) => {
    // const guy = e.target.id.slice(-2);
    // console.log(e.target.id.slice(-2));
    const els = document.querySelectorAll(`.check`);
    // console.log(els);
    // .filter((el) => el.id[5] == guy[0]);
    for (let el of els) {
      const row = Number(el.id[5]);
      const col = Number(el.id[6]);
      if (e.shiftKey || shiftDown) {
        if (col == j) {
          color[row][col] = !color[row][col];
        }
      } else if (row == i) {
        color[row][col] = !color[row][col];
      }
    }
  };
</script>

<h1>Challenge 4.1</h1>
<p>
  Can you get back to one color by swapping every tile in a row <kbd>Click</kbd>
  or a column <kbd>Shift</kbd>+<kbd>Click</kbd>. You can also use the button to
  switch.
</p>

<button on:click={() => (shiftDown = !shiftDown)}
  >{shiftDown ? 'Column' : 'Row'}</button
>

<div id="checker" bind:this={checker}>
  {#each [0, 1, 2, 3, 4, 5, 6, 7] as i}
    {#each [0, 1, 2, 3, 4, 5, 6, 7] as j}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        id="check{i}{j}"
        class="check"
        class:white={color[i][j]}
        on:click={(e) => leftClick(e, i, j)}
      >
        <!-- I am {i}
        {j}. -->
      </div>
    {/each}
  {/each}
</div>

<button on:click={corners}> Reset. </button>
<button on:click={blank}> Blank. </button>

<style>
  div#checker {
    background-color: rgba(128, 0, 0, 0.3);
    height: 50vw;
    width: 50vw;
    margin-left: 25%;
    display: grid;
    grid-template-columns: repeat(8, 1fr);
  }
  .check {
    border: 1px solid gray;
    background-color: black;
  }

  .white {
    background-color: white;
  }
  kbd {
    border: 1px solid black;
    border-radius: 2px;
  }
</style>
