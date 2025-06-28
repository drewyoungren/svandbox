<script>
  let total = Math.ceil(Math.random() * 100);
  let moves = 0;
</script>

<h1>Challenge: 54/77</h1>
<div>
  <p>
    Starting with a random integer, will arbitrarily adding 54 or 77 repeatedly
    always result in a number whose last 2 digits are the same?
  </p>
  <p>Your total is:</p>
  <div id="totdisplay">
    <h1>{total}</h1>
  </div>
</div>

{#if (total % 100) % 11 == 0}
  <p><strong>You did it in {moves} move{moves == 1 ? '' : 's'}!</strong></p>

  <button
    on:click={() => {
      total = Math.ceil(Math.random() * 100);
      moves = 0;
    }}>Reset</button
  >
{:else}
  <div id="adders">
    {#each [54, 77] as num}
      <button
        on:click={() => {
          total += num;
          moves += 1;
        }}>{num}</button
      >
    {/each}
  </div>
{/if}

<style>
  #totdisplay {
    display: flex;
    justify-content: space-around;
    width: 200px;
    max-width: 100%;
  }
  #adders {
    display: flex;
    justify-content: space-around;
    width: 200px;
    max-width: 100%;
  }
</style>
