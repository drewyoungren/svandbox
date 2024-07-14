<script>
  import { flip } from 'svelte/animate';
  /**
   * @type Array<Number>
   */
  let status = [];

  let count = 0;

  let N = 10;

  /**
   * Shuffle via Knuth algorithm
   * @param array {Array<any>}
   */
  function shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
  }

  function reset() {
    count = 0;
    status = [];
    for (let i = 1; i <= N; i++) {
      status.push(i);
    }
    shuffle(status);
    status = [...status];
  }
  function flipStack() {
    const v = status[0];
    if (v != 1) {
      status = [...status.slice(0, v).reverse(), ...status.slice(v)];
      count++;
    }
  }

  reset();
</script>

<h1>Challenge: Pancake flipping</h1>

A stack of<em>N</em> pancakes has exactly one each number of blueberries from 1
to <em>N</em>. At each flip, one reverses the stack of the top <em>m</em>
pancakes where <em>m</em> is the number of blueberries in the top pancake. Show
that the pancake with 1 blueberry will <strong>always</strong> end up on top.

<p>
  Number of pancakes: <input type="number" bind:value={N} on:change={reset} />
</p>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div id="fullstack" on:click={flipStack}>
  {#each status as v (v)}
    <div class="pancake" animate:flip={{ duration: 400 }}>{v}</div>
  {/each}
</div>

<div class="buttonbank">
  <button on:click={flipStack}>Flip</button>
  <button on:click={reset}>Reset</button>
</div>

{#if status[0] == 1}
  <h3 style:color={'darkred'}>You did it in {count} flips.</h3>
{:else}
  <h4>{count} flips</h4>
{/if}

<style>
  div#fullstack {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  .pancake {
    height: 23px;
    width: 200px;
    text-align: center;
    border: 1px solid black;
    font-size: 20px;
    color: white;
    background-color: #c6983a;
    border-radius: 8px;
    font-weight: bolder;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .buttonbank {
    width: 200px;
    display: flex;
    flex: auto;
    margin-top: 10px;
    justify-content: space-around;
  }
</style>
