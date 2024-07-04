<script>
  import { spring } from 'svelte/motion';
  import { fade } from 'svelte/transition';

  // @ts-nocheck

  let status = [3, 1, 4];

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
</script>

<h1>Challenge: Zap it!</h1>

<p>
  Select two numbers to "zap" them, i.e., reduce each by the average. Can you
  get to 0?
</p>

<div id="number_holder">
  {#each status.entries() as [id, value]}
    <button
      class="numberthing"
      transition:fade
      class:active={selected.indexOf(id) > -1}
      on:click={(e) => {
        if (selected.indexOf(id) == -1) {
          selected = [...selected, id];
        }
        if (selected.length == 2) {
          setTimeout(
            (i, j) => {
              zap(i, j);
              selected = [];
            },
            400,
            ...selected
          );
        }
      }}
    >
      {value}
    </button>
  {/each}
</div>

<div>
  <button
    on:click={() => {
      status = [3, 1, 4];
    }}>Reset</button
  >
</div>

<style>
  #number_holder {
    position: relative;
    display: flex;
    justify-content: space-around;
    height: 100px;
    width: 40%;
    left: 25%;
  }

  .active {
    background-color: red;
    border: 10px solid green;
  }

  button.numberthing {
    background-color: lemonchiffon;
    color: darkred;
    font-size: xx-large;
    padding: 0.4em;
    border-radius: 10px;
  }
</style>
