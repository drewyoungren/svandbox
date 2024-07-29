<script>
    import { fly, fade } from 'svelte/transition';

    export let num = 14;

    export let selected = false;

    $: numster = String(num.toString(2)).padStart(6, '0');

    // console.log(3*"8")
</script>

{#if num >= 0}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
        class="card"
        class:selected
        class:divider={num < 0}
        in:fly|global={{ y: 200, delay: 200, duration: 200 }}
        out:fly|global={{ x: 200, duration: 200 }}
        on:click={() => {
            selected = !selected;
        }}
    >
        {#each numster as a, i}
            {#if a == '1'}
                <div class={`circle class${i}`}></div>
            {/if}
        {/each}
    </div>
{:else}
    <div class="divider"></div>
{/if}

<style>
    div {
        border: 1px solid black;
    }

    div.card {
        position: relative;
        height: 7rem;
        width: 5rem;
        padding: 10px;
        border-radius: 5%;
        flex-shrink: 1;
    }

    .selected {
        background-color: gray;
    }

    .circle {
        background-color: blue;
        color: white;
        height: 1.5rem;
        width: 1.5rem;
        border-radius: 1rem;
        position: absolute;
    }

    .class0 {
        background-color: red;
        left: 1rem;
        top: 1rem;
    }
    .class1 {
        background-color: orange;
        left: 4rem;
        top: 1rem;
    }
    .class2 {
        background-color: yellow;
        left: 1rem;
        top: 3.5rem;
    }
    .class3 {
        background-color: green;
        left: 4rem;
        top: 3.5rem;
    }
    .class4 {
        background-color: blue;
        left: 1rem;
        top: 6rem;
    }
    .class5 {
        background-color: purple;
        left: 4rem;
        top: 6rem;
    }

    .divider {
        border: unset;
        height: 0pt;
    }
</style>
