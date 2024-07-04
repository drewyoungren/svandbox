<script>
  let total = Math.ceil(Math.random()*100)
  let moves = 0
</script>

<div>
   <p>
      Starting with a random integer, will arbitrarily adding 54 or 77 repeatedly always result in a number whose last 2 digits are the same? 
   </p>
<p>Your total is:</p>
  <h1 style="margin-left: 5%">{total}</h1>
</div>

{#if ((total % 100) % 11 == 0)}
   <p><strong>You did it in {moves} moves!</strong></p>

   <button on:click={() => {total = Math.ceil(Math.random()*100); moves = 0}}>Reset</button>
{:else}
   <div id="adders">
    {#each [54, 77] as num}
       <button on:click={() => {total += num; moves += 1}}>{num}</button>
    {/each}
   </div>
{/if}

<style>
   #adders {
      display: flex;
      justify-content: space-around;
      width: 10%;
   }
</style>