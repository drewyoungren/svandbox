<script>
  import { tweened } from 'svelte/motion';
  import { fade, slide } from 'svelte/transition';
  import Fraction from 'fraction.js';
  // @ts-nocheck

  let status = [new Fraction(3), new Fraction(1), new Fraction(4)];
  let customStatus = false;

  $: dispX =
    status[0].d == 1
      ? (status[0].s * status[0].n).toString()
      : (status[0].s * status[0].n).toString() + '/' + status[0].d.toString();
  $: dispY =
    status[1].d == 1
      ? (status[1].s * status[1].n).toString()
      : (status[1].s * status[1].n).toString() + '/' + status[1].d.toString();
  $: dispZ =
    status[2].d == 1
      ? (status[2].s * status[2].n).toString()
      : (status[2].s * status[2].n).toString() + '/' + status[2].d.toString();

  // $: dispX.set(status[0] || 0);
  // $: dispY.set(status[1] || 0);
  // $: dispZ.set(status[2] || 0);

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
    const avg = status[i].add(status[j]).div(2);
    status[i] = status[i].sub(avg);
    status[j] = status[j].sub(avg);
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
  get to an average of 0?
</p>

<div class="number_holder">
  <button
    class="numberthing"
    transition:fade
    class:active={selected.indexOf(0) > -1}
    on:click={() => handleClick(0)}
  >
    {#key dispX}
      <span in:fade={{ delay: 0, duration: 500 }}>
        {dispX}
      </span>
    {/key}
  </button>

  <button
    class="numberthing"
    transition:fade
    class:active={selected.indexOf(1) > -1}
    on:click={() => handleClick(1)}
  >
    {#key dispY}
      <span in:fade={{ delay: 0, duration: 500 }}>
        {dispY}
      </span>
    {/key}
  </button>

  <button
    class="numberthing"
    transition:fade
    class:active={selected.indexOf(2) > -1}
    on:click={() => handleClick(2)}
  >
    {#key dispZ}
      <span in:fade={{ delay: 0, duration: 500 }}>
        {dispZ}
      </span>
    {/key}
  </button>
</div>

<div>
  Average: {status.reduce((a, b) => a.add(b)).div(3)}
</div>

<div>
  <button
    on:click={() => {
      status = [new Fraction(3), new Fraction(1), new Fraction(4)];
    }}>Reset</button
  >
</div>

<p><input type="checkbox" bind:checked={customStatus} /> Customize input:</p>
{#if customStatus}
  <div transition:fade>
    <input
      class="customInput"
      type="text"
      on:change={(e) => {
        status[0] = new Fraction(e.target?.value);
      }}
    />
    <input
      class="customInput"
      type="text"
      on:change={(e) => {
        status[1] = new Fraction(e.target?.value);
      }}
    />
    <input
      class="customInput"
      type="text"
      on:change={(e) => {
        status[2] = new Fraction(e.target?.value);
      }}
    />
  </div>
{/if}

<style>
  .number_holder {
    position: relative;
    display: flex;
    justify-content: space-around;
    height: 100px;
    width: 100%;
    max-width: 600px;
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
    min-width: 30%;
  }
  .customInput {
    width: 100px;
    font-size: larger;
    text-align: center;
  }
</style>
