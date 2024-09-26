<script>
    import Interval from './Interval.svelte';
    import { flip } from 'svelte/animate';

    /**
     * @typedef {Object} TimePiece
     * @property {string} id
     * @property {string} acc
     * @property {number} upper
     */

    /**
     * @type TimePiece[]
     */
    let intervals = [{ id: 'aabbcc33', acc: 'e', upper: 0 }];

    /**
     *
     * @param {string} id
     */
    function deleteMe(id) {
        intervals = intervals.filter((e) => id != e.id);
    }

    /**
     *
     * @param {TimePiece} a
     * @param {TimePiece} b
     * @returns {number}
     */
    function cmp(a, b) {
        return a.upper < b.upper ? -1 : a.upper > b.upper ? 1 : 0;
    }

    const DIRS = {
        n: [0, 1],
        e: [1, 0],
        s: [0, -1],
        w: [-1, 0],
        o: [0, 0],
    };
</script>

{#each intervals.sort(cmp) as { id, acc, upper } (id)}
    <div animate:flip>
        <Interval bind:acc bind:upper on:deleteme={() => deleteMe(id)} />
    </div>
{/each}

<button
    on:click={() => {
        intervals = [
            ...intervals,
            {
                id: crypto.randomUUID(),
                acc: 'o',
                upper: Math.ceil(intervals[intervals.length - 1].upper + 1),
            },
        ];
    }}
>
    +
</button>

{#each intervals as { acc }}
    <p>{acc}</p>
{/each}
