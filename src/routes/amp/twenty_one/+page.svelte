<script>
    import { onMount } from 'svelte';
    import Stack from './Stack.svelte';

    let n = $state(10);

    let clickLock = $state(false);

    /**
     * @type Array<Array<number>>
     */
    let grid = $state([[1, 2], [], [7], [3, 4], [5]]);

    let score = $state([0, 0]);
    let turn = $state(0);

    let winner = $derived(!grid.some((c) => c.length > 0));

    function reset() {
        turn = 0;
        grid = [];
        score = [0, 0];
        for (let i = 0; i < n; i++) {
            grid.push([
                Math.ceil(Math.random() * 100),
                Math.ceil(Math.random() * 100),
            ]);
        }
        grid.push([Math.ceil(Math.random() * 100)]);
    }

    /**
     *
     * @param i {number}
     */
    function takeIt(i) {
        score[turn] += grid[i].pop() || 0;
        turn = (turn + 1) % 2;
    }

    onMount(reset);
</script>

<h1>Challenge: 21 Cards</h1>

<p>
    21 cards with visible positive integers are arranged into 10 stacks of 2 and
    1 of 1. Alice and Bob alternate selecting a top card from some stack. Can
    Alice always get the highest total?
</p>

<div class="maindisplay">
    <table border="1">
        <thead>
            <tr>
                <th>Alice</th>
                <th>Bob</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{score[0]}</td>
                <td>{score[1]}</td>
            </tr>
        </tbody>
    </table>

    {#if !winner}
        {#if turn % 2 == 1}
            <h4>Bob's turn</h4>
        {:else}
            <h4>Alice's turn.</h4>
        {/if}
    {/if}

    <div class="stacks">
        {#each grid as cards, i}
            <Stack {cards} click={() => takeIt(i)} />
        {/each}
    </div>
    {#key turn}
        {#if winner}
            <h2>{score[0] > score[1] ? 'Alice' : 'Bob'} wins!</h2>

            <div>
                <button onclick={reset}>Play again</button>
                Cards:
                <input type="range" bind:value={n} min="1" max="10" />
                <span class="fixed-width">
                    {n * 2 + 1}
                </span>
            </div>
        {/if}
    {/key}
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

    .stacks {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        max-width: 900px;
        gap: 10px;
    }

    table {
        font-family: Arial, Helvetica, sans-serif;
        border-collapse: collapse;
        font-size: larger;
    }

    td,
    th {
        border: 1px solid #ddd;
        padding: 8px;
    }
    th {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: left;
        background-color: #04aa6d;
        color: white;
    }

    td {
        text-align: center;
    }

    .fixed-width {
        display: inline-block;
        width: 2ch;
        text-align: right;
    }
</style>
