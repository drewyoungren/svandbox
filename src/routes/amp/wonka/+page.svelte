<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    let grid: number[] = $state([]);
    let loser = $derived(!grid.some((j) => j > 0 && j % 2 == 0));
    let uneaten = $derived(grid.reduce((x, y) => x + y, 0));

    function iToX(i: number) {
        return i < 4 ? 0 : i < 7 ? Math.sqrt(3) / 2 : -Math.sqrt(3) / 2;
    }
    function iToY(i: number) {
        return i < 4 ? 3 / 2 - i : i < 7 ? 5 - i : 8 - i;
    }

    function reset() {
        grid = [];
        for (let i = 0; i < 10; i++) {
            grid.push(7);
        }
        for (let i = 0; i < 30; i++) {
            const j = 9 - Math.floor(Math.random() * Math.random() * 10);
            grid[j] += 1;
        }
    }

    const neighbors = [
        [1, 4, 7],
        [0, 4, 7, 2, 5, 8],
        [1, 5, 8, 6, 9, 3],
        [2, 6, 9],
        [0, 1, 5],
        [4, 1, 2, 6],
        [5, 2, 3],
        [0, 1, 8],
        [1, 2, 7, 9],
        [8, 2, 3],
    ];

    function handleClick(i: number) {
        console.log(i, 'clicked');
        if (grid[i] % 2 == 0) {
            neighbors[i].forEach((j: number) => {
                if (grid[j] > 0) {
                    grid[j] += 1;
                }
            });
            grid[i] = 0;
        }
    }

    onMount(() => {
        reset();
    });
</script>

<h1>Augustus and Wonka</h1>

<p>
    Wonka has filled cups below with 100 pieces of chocolate (with a minimum of
    7 per cup). Augustus wants to eat all of them but can only select a cup with
    an even number of chocolates. When he does, he must distribute one piece to
    each neighbor before consuming the rest. Can he eat them all?
</p>

<div class="maindisplay">
    <h3>Uneaten chocolates: {uneaten}</h3>
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="-3 -2 6 4">
        {#each grid as count, i}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            {#if count > 0}
                <g transition:fade>
                    <circle
                        cx={iToX(i)}
                        cy={iToY(i)}
                        r="0.5"
                        stroke="black"
                        fill="none"
                        stroke-width="0.02"
                        onclick={() => handleClick(i)}
                    >
                    </circle>
                    {#key count}
                        <text
                            x={iToX(i)}
                            y={iToY(i)}
                            text-anchor="middle"
                            font-size="0.4"
                            dominant-baseline="middle"
                            transition:fade
                        >
                            {count}
                        </text>
                    {/key}
                </g>
            {/if}
        {/each}
    </svg>

    {#if loser}
        <h2>Augustus starves to death.</h2>
        <button onclick={reset}>Reset</button>
    {/if}
</div>

<style>
    .maindisplay {
        display: flex;
        align-items: center;
        justify-content: space-around;
        flex-wrap: wrap;
        max-width: 1000px;
        flex-direction: column;
    }
    svg {
        width: 600px;
        height: auto;
    }
    circle {
        pointer-events: all;
    }
    text {
        pointer-events: none;
    }
</style>
