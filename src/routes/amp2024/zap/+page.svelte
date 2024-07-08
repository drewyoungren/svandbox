<script>
  import katex from 'katex';
  import { fade, slide } from 'svelte/transition';
  import Fraction from 'fraction.js';
  import { tweened } from 'svelte/motion';
  // @ts-nocheck

  let status = [new Fraction(3), new Fraction(1), new Fraction(4)];
  let customStatus = false;

  let dispX = tweened(3, { duration: 400 });
  let dispY = tweened(1, { duration: 400 });
  let dispZ = tweened(4, { duration: 400 });

  $: dispX.set((status[0].s * status[0].n) / status[0].d);
  $: dispY.set((status[1].s * status[1].n) / status[1].d);
  $: dispZ.set((status[2].s * status[2].n) / status[2].d);

  /**
   * @type Element
   */
  let nodeX;
  /**
   * @type Element
   */
  let nodeY;
  /**
   * @type Element
   */
  let nodeZ;

  /**
   * render rational number to node
   * @param f {Fraction}
   * @param node {Element}
   */
  function pprint(f) {
    let s = f.s < 0 ? '-' : '';
    if (f.d == 1) {
      s += f.n.toString();
    } else {
      s += `\\frac\{${f.n}\}\{${f.d}\}`;
    }
    return katex.renderToString(s, { output: 'mathml' });
  }

  // $: nodeX && pprint(status[0], nodeX);
  // $: pprint(status[1], nodeY);
  // $: pprint(status[2], nodeZ);

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
      <div in:fade={{ delay: 0, duration: 500 }} bind:this={nodeX}>
        {@html pprint(status[0])}
      </div>
    {/key}
  </button>

  <button
    class="numberthing"
    transition:fade
    class:active={selected.indexOf(1) > -1}
    on:click={() => handleClick(1)}
  >
    {#key dispY}
      <div in:fade={{ delay: 0, duration: 500 }} bind:this={nodeX}>
        {@html pprint(status[1])}
      </div>
    {/key}
  </button>

  <button
    class="numberthing"
    transition:fade
    class:active={selected.indexOf(2) > -1}
    on:click={() => handleClick(2)}
  >
    {#key dispZ}
      <div in:fade={{ delay: 0, duration: 500 }} bind:this={nodeX}>
        {@html pprint(status[2])}
      </div>
    {/key}
  </button>
</div>

<div id="controlbox">
  <div>
    <div style="margin: 0.5rem;">
      Average: {@html pprint(status.reduce((a, b) => a.add(b)).div(3))}
    </div>

    <div>
      <button
        on:click={() => {
          status = [new Fraction(3), new Fraction(1), new Fraction(4)];
        }}>Reset</button
      >
    </div>

    <p>
      <input type="checkbox" bind:checked={customStatus} /> Customize input:
    </p>
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
  </div>
  <div>
    <svg
      version="1.1"
      width="300"
      height="200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="80"
        x="10"
        y={$dispX > 0 ? 150 - $dispX * 20 : 150}
        height={Math.abs($dispX * 20)}
        fill={$dispX > 0 ? 'green' : 'red'}
      />
      <rect
        width="80"
        x="110"
        y={$dispY > 0 ? 150 - $dispY * 20 : 150}
        height={Math.abs($dispY * 20)}
        fill={$dispY > 0 ? 'green' : 'red'}
      />
      <rect
        width="80"
        x="210"
        y={$dispZ > 0 ? 150 - $dispZ * 20 : 150}
        height={Math.abs($dispZ * 20)}
        fill={$dispZ > 0 ? 'green' : 'red'}
      />

      <line x1="0" x2="300" y1="150" y2="150" stroke="black" />

      <!-- <circle cx="150" cy="100" r="80" fill="green" />

      <text x="150" y="125" font-size="60" text-anchor="middle" fill="white"
        >SVG</text
      > -->
    </svg>
  </div>
</div>

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

  div#controlbox {
    display: flex;
    width: 800px;
    max-width: 100%;
    margin-top: 1rem;
    justify-content: space-between;
  }
</style>
