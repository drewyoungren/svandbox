<script>
  import { onMount } from 'svelte';
  import Xbox from './Xbox.svelte';
  import { flip } from 'svelte/animate';
  import { fade } from 'svelte/transition';

  /**
   * @type Array<Number>
   */
  let status = [];
  let billieTurn = 1;

  let loaded = false;

  /**
   * How many positions to "store" offscreen
   * @type number
   */
  const offset = 17;

  /**
   * viewable width of strip
   * @type Number
   */
  let w;

  let leftEnd = -offset;
  $: nBoxes = Math.floor(w / 60) || 20;
  $: rightEnd = leftEnd + nBoxes + 2 * offset;

  onMount(() => {
    leftEnd = -Math.floor(nBoxes / 2) - offset;
    // window.alert('continue?');
    loaded = true;
  });

  /**
   * Make list of consecutive integers a la Python
   * @param a {Number} beginning
   * @param b {Number} end
   */
  function range(a, b) {
    if (b <= a) {
      return [];
    }
    let n = a;
    const out = [];
    while (n < b) {
      out.push(n);
      n++;
    }
    return out;
  }

  $: viewRange = range(leftEnd, rightEnd);

  /**
   * Callback to delete all Xs adjacent to id
   * @param event {CustomEvent} index of one entry in strip to be deleted
   */
  function handleDeleteMe(event) {
    let n = event.detail + 1;
    while (status.indexOf(n) > -1) {
      status = status.filter((i) => i != n);
      n++;
    }
    n = event.detail - 1;
    while (status.indexOf(n) > -1) {
      status = status.filter((i) => i != n);
      n--;
    }
  }
</script>

<h1>Challenge: Infinite Strip</h1>

<p>
  Billie and Charlie alternate turns. Billie can mark 2 <code>X</code>'s
  anywhere on the strip. Charlie can delete any run of adjacent
  <code>X</code>'s. Can Billie make a 2024-long strip of <code>X</code>'s?
</p>

{#if billieTurn}
  <h2>Billie's Turn ({billieTurn} of 2)</h2>
  <p>Choose any 2 boxes to mark with an <code>X</code>.</p>
{:else}
  <h2>Charlie's Turn</h2>
  <p>Choose any run of <code>X</code>'s to erase them.</p>
{/if}

<div id="strip" bind:clientWidth={w}>
  {#if loaded}
    {#each viewRange as index (index)}
      <div
        animate:flip={{ duration: 300 }}
        in:fade={{ delay: 300, duration: 0 }}
      >
        <Xbox
          id={index}
          bind:status
          bind:billieTurn
          on:deleteMe={handleDeleteMe}
        ></Xbox>
      </div>
    {/each}
  {/if}
</div>

{#if loaded}
  <div id="buttonBox">
    <span>{leftEnd + offset}</span>
    <button
      on:click={(e) => {
        e.preventDefault();
        leftEnd--;
      }}>&larr;</button
    >
    <button
      on:click={(e) => {
        e.preventDefault();
        leftEnd = -Math.floor(nBoxes / 2) - offset;
      }}
    >
      reset view
    </button>
    <button
      on:click={(e) => {
        e.preventDefault();
        leftEnd++;
      }}>&rarr;</button
    >
    <span>{rightEnd - offset}</span>
  </div>

  <button
    on:click={(e) => {
      e.preventDefault();
      status = [];
      leftEnd = -Math.floor(nBoxes / 2);
      billieTurn = 1;
    }}>Reset</button
  >
{/if}

<style>
  div#strip {
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    height: 100px;
    justify-content: center;
    overflow: hidden;
  }

  div#buttonBox {
    display: flex;
    justify-content: center;
  }

  div#buttonBox > span {
    margin: 7px;
    width: 4rem;
    text-align: center;
  }
</style>
