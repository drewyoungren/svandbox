<script lang="ts">
    import { onMount } from 'svelte';
    // import { fade } from 'svelte/transition';
    import {
        shuffle,
        indexOfMax,
        generateUniqueRandomSum,
    } from '$lib/other-utils';

    let grid: number[] = $state([]);
    let loser = $derived.by(() => {
        const unique = new Set(grid);
        return unique.size < grid.length;
    });
    let marxCount = $state(0);
    let lockMarx = $state(false);

    function reset() {
        marxCount = 0;
        lockMarx = false;
        grid = generateUniqueRandomSum(10, 1000);
    }

    function sisIt() {
        marxCount = 0;
        lockMarx = false;
        grid = [];
        for (let i = 0; i < 10; i++) {
            grid.push(Math.floor(Math.random() * 20) * 10 + i);
        }
        shuffle(grid);
    }

    function marxIt() {
        const j = indexOfMax(grid);
        for (let index = 0; index < grid.length; index++) {
            if (index == j) {
                grid[index] -= 9;
            } else {
                grid[index] += 1;
            }
        }
        marxCount += 1;
        if (!loser) {
            setTimeout(marxIt, 40);
        }
    }

    onMount(() => {
        reset();
    });
</script>

<h1>Pirate Booty</h1>

<p>
    A pirate has 10 chests, each with a different amount of coins that sum to
    1000. Every hour he redistributes 1 coin from the most full chest to each of
    the other 9 until two chests have the same number of coins. Must he stop?
</p>

<div class="maindisplay">
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">
        {#each grid as count, i}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->

            <rect
                x={i * 60}
                y={400 - count}
                width="40"
                height={count}
                fill="gold"
            ></rect>

            {#key count}
                <text
                    x={60 * i + 20}
                    y={390 - count}
                    stroke="black"
                    text-anchor="middle"
                >
                    {count}
                </text>
            {/key}
        {/each}
    </svg>

    {#if !loser}
        <h2>
            Steps of redistribution: <span class="displaybox">{marxCount}</span>
        </h2>
        <button
            onclick={() => {
                lockMarx = true;
                marxIt();
            }}
            disabled={lockMarx}
        >
            MarxIt!
        </button>
    {:else}
        <h2>Some equality reached in {marxCount} hours!</h2>
        {#if window.location.hash == '#sis'}
            <button onclick={sisIt}>SisyphusIt!</button>
        {:else}
            <button onclick={reset}> SmithIt! </button>
        {/if}
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

    text {
        pointer-events: none;
    }

    .displaybox {
        display: inline-block;
        width: 3ch;
    }
</style>
