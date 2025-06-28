<script>
    import { tweened } from 'svelte/motion';

    import Card from './Card.svelte';
    import { flip } from 'svelte/animate';

    let winner = false;
    let showStanding = false;

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
        status = status.filter((e) => e.num >= 0);
        while (status.length < 7) {
            const num = Math.floor(Math.random() * 64);
            if (!status.find((e) => e.num == num)) {
                status.push({ num, selected: false });
            }
        }
        status = [
            ...status.slice(0, 2),
            { num: -1, selected: false },
            ...status.slice(2, 5),
            { num: -2, selected: false },
            ...status.slice(5),
        ];
    }

    reset();

    $: standingCardNo = status.filter((e) => e.selected)
        ? status
              .filter((e) => e.selected)
              .map((e) => e.num)
              .reduce((p, c) => p ^ c, 0)
        : 0;

    function cheat() {
        for (let i = 127; i > 0; i--) {
            const v = String(i.toString(2)).padStart(7, '0');
            const cards = status.filter((e) => e.num >= 0);
            const pick = cards.filter((e, j) => v[j] == '1');
            if (isSet(pick)) {
                pick.forEach((e) => {
                    e.selected = true;
                });
                cards
                    .filter((e, j) => v[j] == '0')
                    .forEach((e) => {
                        e.selected = false;
                    });
                reset();
                return;
            }
        }
    }

    /**
     *
     * @param {Array<ProSet>} group
     * @returns boolean
     */
    function isSet(group) {
        console.log(
            group.map((e) => e.num),
            group.map((e) => e.num).reduce((p, c) => p ^ c, 0),
        );
        return group.map((e) => e.num).reduce((p, c) => p ^ c, 0) == 0;
    }
</script>

<h1>ProSet</h1>
<p>
    Select a subset of the cards presented such that each color is present an
    even number of times. Higher scores for larger sets.
</p>

<div class="field">
    {#each status as { num, selected }, i (num)}
        <div animate:flip={{ duration: 200 }} class:break={num < 0}>
            <Card {num} bind:selected></Card>
        </div>
    {/each}
</div>
<div class="field">
    <button
        class="endthing submit"
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
                displayString = 'You are cooked';
                status.forEach((e) => {
                    e.selected = false;
                });
                reset();
            }
            setTimeout(() => {
                displayString = '';
            }, 1500);
        }}>Submit</button
    > <span class="score endthing">Score: {Math.round($score)}</span>
    <button class="endthing cheat" on:click={cheat}>Cheat</button>
</div>

<div class="field standing">
    <label for="standbox"
        >Guide: <input type="checkbox" bind:checked={showStanding} /></label
    >
    {#if showStanding}
        <Card num={standingCardNo}></Card>
    {/if}
    <div id="dspStr" class:winner>
        {displayString}
    </div>
</div>

<style>
    .field {
        width: 100%;
        max-width: 600px;
        display: flex;
        justify-content: center;
        row-gap: 2px;
        flex-wrap: wrap;
        align-items: center;
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
    .endthing {
        margin-top: 10px;
        flex: 1 1 50%;
        text-align: center;
    }
    .score {
        font-size: x-large;
        font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande',
            'Lucida Sans', Arial, sans-serif;
        flex: 1 1 20%;
    }

    .cheat {
        flex: 1 1 20%;
    }

    #dspStr {
        font-size: x-large;
    }

    .winner {
        font-size: xx-large;
        color: blueviolet;
    }
    .standing {
        align-items: start;
        justify-content: flex-start;
    }
</style>
