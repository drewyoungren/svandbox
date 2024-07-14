<script>
  import { createEventDispatcher } from 'svelte';

  export let billieTurn = 1;
  export let id = 0;
  /**
   * @type Array<Number>
   */
  export let status = [];

  const dispatch = createEventDispatcher();

  $: marked = status.indexOf(id) > -1;

  /**
   *
   * @param e {Event}
   */
  const leftClick = (e) => {
    e.preventDefault();
    if (billieTurn && !marked) {
      status = [...status, id];
      billieTurn = (billieTurn + 1) % 3;
    } else if (billieTurn == 0 && marked) {
      status = status.filter((i) => i != id);
      dispatch('deleteMe', id);
      billieTurn = (billieTurn + 1) % 3;
    }
  };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:click={leftClick} class="unselectable">
  {#if marked}X{/if}
</div>

<style>
  div {
    width: 60px;
    height: 60px;
    border-top: 1px solid black;
    border-left: 1px solid black;
    border-bottom: 1px solid black;
    display: flex;
    align-items: center;
    justify-content: center;
    align-content: center;
    flex-direction: column;
    font-family: 'Franklin Gothic Medium', Arial, sans-serif;
    font-size: 2.5rem;
  }

  .unselectable {
    user-select: none;
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -o-user-select: none;
  }
</style>
