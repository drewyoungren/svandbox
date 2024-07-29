<script>
    import { fly } from 'svelte/transition';

    export let num = 14;

    export let selected = false;

    $: numster = String(num.toString(2)).padStart(6, '0');

    // console.log(3*"8")
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class:selected
    in:fly={{ x: -200, duration: 300 }}
    out:fly={{ x: 200, duration: 300 }}
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

<style>
    div {
        position: relative;
        height: 7rem;
        width: 5rem;
        padding: 10px;
        border: 1px solid black;
        border-radius: 5%;
        flex-shrink: 1;
    }

    .selected {
        background-color: gray;
    }

    .circle {
        background-color: blue;
        color: white;
        height: 1rem;
        width: 1rem;
        border-radius: 2rem;
        position: absolute;
    }

    .class0 {
        background-color: red;
        left: 1rem;
        top: 1rem;
    }
    .class1 {
        background-color: orange;
        left: 3rem;
        top: 1rem;
    }
    .class2 {
        background-color: yellow;
        left: 1rem;
        top: 3rem;
    }
    .class3 {
        background-color: green;
        left: 3rem;
        top: 3rem;
    }
    .class4 {
        background-color: blue;
        left: 1rem;
        top: 5rem;
    }
    .class5 {
        background-color: purple;
        left: 3rem;
        top: 5rem;
    }
</style>
