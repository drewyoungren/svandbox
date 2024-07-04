<script>
  import { tweened } from 'svelte/motion';
  import { fade } from 'svelte/transition';

  // @ts-nocheck

  let status = [3, 1, 4];
  let customStatus = false;

  let dispX = tweened(3);
  let dispY = tweened(1);
  let dispZ = tweened(4);

  $: dispX.set(status[0]);
  $: dispY.set(status[1]);
  $: dispZ.set(status[2]);

  /**
   * @type Array<Number>
   */
  let selected = [];

  /**
   *
   * @param i {Number}
   * @param j {Number}
   */
  function zap(i, j) {
    const avg = (status[i] + status[j]) / 2;
    status[i] -= avg;
    status[j] -= avg;
  }

  /**
   *
   * @param id {Number} index of clicked entry
   */
  function handleClick(id) {
    if (selected.indexOf(id) == -1) {
      selected = [...selected, id];
    }
    if (selected.length == 2) {
      zap(selected[0], selected[1]);
      setTimeout(() => {
        selected = [];
      }, 400);
    }
  }
</script>

<h1>Challenge: Zap it!</h1>

<p>
  Select two numbers to "zap" them, i.e., reduce each by the average. Can you
  get to 0?
</p>

<div class="number_holder">
  <button
    class="numberthing"
    transition:fade
    class:active={selected.indexOf(0) > -1}
    on:click={() => handleClick(0)}
  >
    {Math.round(100 * $dispX) / 100}
  </button>

  <button
    class="numberthing"
    transition:fade
    class:active={selected.indexOf(1) > -1}
    on:click={() => handleClick(1)}
  >
    {Math.round(100 * $dispY) / 100}
  </button>

  <button
    class="numberthing"
    transition:fade
    class:active={selected.indexOf(2) > -1}
    on:click={() => handleClick(2)}
  >
    {Math.round(100 * $dispZ) / 100}
  </button>
</div>

<div>
  Average: {Math.round((1000 * status.reduce((a, b) => a + b)) / 3) / 1000}
</div>

<div>
  <button
    on:click={() => {
      status = [3, 1, 4];
    }}>Reset</button
  >
</div>

<p><input type="checkbox" bind:checked={customStatus} /> Customize input:</p>
{#if customStatus}
  <div transition:fade>
    <input class="customInput" type="number" bind:value={status[0]} />
    <input class="customInput" type="number" bind:value={status[1]} />
    <input class="customInput" type="number" bind:value={status[2]} />
  </div>
{/if}

<style>
  .number_holder {
    position: relative;
    display: flex;
    justify-content: space-around;
    height: 100px;
    width: 40%;
    left: 25%;
  }

  .active {
    /* background-color: red; */
    border: 10px solid green;
  }

  button.numberthing {
    background-color: lemonchiffon;
    color: darkred;
    font-size: xx-large;
    padding: 0.4em;
    border-radius: 10px;
    width: 30%;
  }
  .customInput {
    width: 100px;
    font-size: larger;
    text-align: center;
  }
</style>
