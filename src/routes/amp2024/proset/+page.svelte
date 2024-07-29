<script>
    import { tweened } from 'svelte/motion';

    import Card from './Card.svelte';
    import { flip } from 'svelte/animate';
    import { div } from 'three/examples/jsm/nodes/Nodes.js';

    let winner = false;

    /**
     * @typedef {Object} ProSet
     * @property {number} num
     * @property {boolean} selected
     */

    /**
     * @type Array<ProSet>
     */
    let status = [];

    let displayString = '';

    const score = tweened(0);

    function reset() {
        while (status.length < 7) {
            const num = Math.floor(Math.random() * 64);
            if (!status.find((e) => e.num == num)) {
                status = [...status, { num, selected: false }];
            }
        }
    }

    reset();

    /**
     *
     * @param {Array<ProSet>} group
     * @returns boolean
     */
    function isSet(group) {
        console.log(
            group.map((e) => e.num),
            group.map((e) => e.num).reduce((p, c) => p ^ c),
        );
        return group.map((e) => e.num).reduce((p, c) => p ^ c) == 0;
    }
</script>

<div class="field">
    {#each status as { num, selected }, i}
        {#if i == 2 || i == 5}
            <div class="break"></div>
        {/if}

        <Card {num} bind:selected></Card>
    {/each}
</div>
<div class="field">
    <button
        class="endthing"
        on:click={() => {
            const sel = status.filter((e) => e.selected);
            if (isSet(sel)) {
                score.update((x) => x + sel.length);
                status = status.filter((e) => !e.selected);
                reset();
                winner = true;
                displayString = 'You are Pro Set.';
            } else {
                winner = false;
                displayString = 'You are No Set';
            }
            setTimeout(() => {
                displayString = '';
                status.forEach((e) => {
                    e.selected = false;
                });
            }, 1500);
        }}>Submit</button
    > <span class="score endthing">Score: {Math.round($score)}</span>
</div>

<div id="dspStr" class:winner>{displayString}</div>

<style>
    .field {
        width: 100%;
        max-width: 600px;
        display: flex;
        justify-content: center;
        row-gap: 2px;
        flex-wrap: wrap;
    }

    .break {
        flex-basis: 100%;
        height: 0pt;
    }

    button {
        height: 3rem;
        width: 5rem;
        padding-left: 10ps;
        padding-right: 10px;
        background-color: darkgrey;
        border-radius: 5px;
        color: white;
    }

    button:active {
        background-color: lightgray;
        color: darkgrey;
    }
    .score {
        font-size: x-large;
        font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande',
            'Lucida Sans', Arial, sans-serif;
    }

    #dspStr {
        font-size: x-large;
    }

    .winner {
        font-size: xx-large;
        color: blueviolet;
    }
    .endthing {
        margin-top: 10px;
        flex: 1 1 50%;
        text-align: center;
    }
</style>
