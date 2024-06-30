<script>
  /**
   * @type Element
   */
  let checker;

  /**
   * @type Element
   */
  let status;

  /**
   * @type Array<Array<Element>>
   */
  const grid = [[], [], []];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 7; j++) {
      // Garbage element replaced later
      grid[i].push(document.createElement('a'));
    }
  }

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
        grid[i][j]?.classList.remove('btop', 'bleft', 'bright', 'bbottom');
      }
    }
    if (status) status.innerHTML = '';
    cornerChoices = [];
  }

  /**
   * @type Number
   */
  let myTimeout;

  /**
   * @type Array<Array<Number>>
   */
  let cornerChoices = [];
  reset();

  /**
   * Handle click event for each box.
   * @param e {MouseEvent}
   * @param i {Number}
   * @param j {Number}
   */
  const leftClick = (e, i, j) => {
    if (cornerChoices.length % 2 === 0) {
      status.innerHTML = '';
      clearTimeout(myTimeout);
      cornerChoices = [[i, j]];
    } else {
      const [a, b] = cornerChoices[0];
      if (a != i && b != j) {
        cornerChoices = [...cornerChoices, [i, j]];
        const tl = [Math.min(a, i), Math.min(b, j)];
        const br = [Math.max(a, i), Math.max(b, j)];
        const corners = [
          color[tl[0]][tl[1]],
          color[tl[0]][br[1]],
          color[br[0]][tl[1]],
          color[br[0]][br[1]],
        ];
        if (corners.every((e) => e) || corners.every((e) => !e)) {
          for (let k = tl[0]; k <= br[0]; k++) {
            const el = tl[1];
            grid[k][el].classList.add('bleft');
            console.log(grid[k][el]);
          }
          for (let k = tl[0]; k <= br[0]; k++) {
            const el = br[1];
            grid[k][el].classList.add('bright');
          }
          for (let k = tl[1]; k <= br[1]; k++) {
            const el = tl[0];
            grid[el][k].classList.add('btop');
          }
          for (let k = tl[1]; k <= br[1]; k++) {
            const el = br[0];
            grid[el][k].classList.add('bbottom');
          }
          status.innerHTML = '<span style="color: green; ">Very good.</span>';
        } else {
          status.innerHTML = '<span style="color: red; ">No bueno.</span>';
          myTimeout = setTimeout(() => {
            cornerChoices = [];
            status.innerHTML = '';
          }, 1500);
        }
      }
    }
  };
</script>

<h1>Challenge 2.3</h1>
<p>
  Must every coloring of a 3 by 7 grid with two colors admit a rectangle with
  monochrome corners?
</p>

<p><kbd>Click</kbd> opposite corners to check for a valid rectangle.</p>

<div id="checker" bind:this={checker}>
  {#each [0, 1, 2] as i}
    {#each [0, 1, 2, 3, 4, 5, 6] as j}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        id="check{i}{j}"
        bind:this={grid[i][j]}
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

<div style="margin-top: 2em; height: 20px">
  <span
    class="bleft btop bright bbottom"
    style="border: 1px solid black; padding: 5px;"
  >
    choices:
    {#each cornerChoices as [a, b]}
      ({a}, {b})&nbsp;
    {/each}
  </span>
  <span bind:this={status}></span>
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

  .btop {
    border-top: 5px solid yellow;
  }
  .bbottom {
    border-bottom: 5px solid yellow;
  }
  .bleft {
    border-left: 5px solid yellow;
    /* background-color: transparent; */
  }
  .bright {
    border-right: 5px solid yellow;
  }
  button {
    margin-top: 10px;
  }
</style>
