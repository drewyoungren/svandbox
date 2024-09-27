<script>
    import Interval from './Interval.svelte';
    import { flip } from 'svelte/animate';

    let go = false;
    let clock = 0;
    let pos = { x: 1, y: 1, vx: 0, vy: 0, ax: 1, ay: 0 };

    /**
     * @typedef {Object} TimePiece
     * @property {string} id
     * @property {string} acc
     * @property {number} upper
     */

    /**
     * @type TimePiece[]
     */
    let intervals = [{ id: crypto.randomUUID(), acc: 'e', upper: 1 }];

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

    /**
     * @type boolean|number
     */
    let last = false;

    /**
     *
     * @param {number} t
     */
    function evolve(t) {
        const dt = (t - (last ? last : t)) / 1000;
        last = t;
        clock += dt;
        if (go) {
            requestAnimationFrame(evolve);
        }
    }

    $: sortedIntervals = intervals.sort(cmp);

    $: if (go) requestAnimationFrame(evolve);

    let initPos = [{ t: 0, x: 1, y: 1, vx: 0, vy: 0 }];
    $: {
        initPos = [{ t: 0, x: 1, y: 1, vx: 0, vy: 0 }];
        for (let { acc, upper } of sortedIntervals) {
            const [ax, ay] = DIRS[acc];
            const { t, x, y, vx, vy } = initPos[initPos.length - 1];
            const dt = upper - t;
            initPos.push({
                t: upper,
                x: x + vx * dt + (ax * dt * dt) / 2,
                y: y + vy * dt + (ay * dt * dt) / 2,
                vx: vx + ax * dt,
                vy: vy + ay * dt,
            });
        }
        // console.log(initPos);
    }

    $: {
        const index = sortedIntervals.findIndex((tp) => clock <= tp.upper);
        if (index > -1) {
            const { t, x, y, vx, vy } = initPos[index];
            const dt = clock - t;
            const [ax, ay] = DIRS[sortedIntervals[index].acc];
            pos.x = x + vx * dt + (ax * dt * dt) / 2;
            pos.y = y + vy * dt + (ay * dt * dt) / 2;
            pos.vx = vx + ax * dt;
            pos.vy = vy + ay * dt;
            pos.ax = ax;
            pos.ay = ay;
        } else {
            go = false;
            last = false;
        }
    }
</script>

<div id="playingfield">
    <svg id="svg" viewBox="0 0 500 300">
        <rect
            rx="0"
            ry="0"
            width="500"
            height="300"
            fill="rgba(200, 200, 255, 0.5)"
        />
        <!-- Define the arrow marker -->
        <defs>
            <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="0"
                refY="3.5"
                orient="auto"
            >
                <polygon points="0 0, 10 3.5, 0 7" />
            </marker>
        </defs>

        <!-- Draw a line with an arrowhead -->
        <line
            x1={pos.x * 10}
            y1={300 - pos.y * 10}
            x2={pos.x * 10 + pos.ax * 10}
            y2={300 - pos.y * 10 - pos.ay * 10}
            stroke="black"
            stroke-width="2"
            marker-end="url(#arrowhead)"
        />
        <line
            x1={pos.x * 10}
            y1={300 - pos.y * 10}
            x2={pos.x * 10 + pos.vx * 10}
            y2={300 - pos.y * 10 - pos.vy * 10}
            stroke="green"
            stroke-width="2"
            marker-end="url(#arrowhead)"
        />
        <circle cx={pos.x * 10} cy={300 - pos.y * 10} fill="red" r="10" />
        <polyline
            points="500,130 500,0 0,0 0,300 500,300 500,170"
            stroke="black"
            stroke-width="3"
            fill="transparent"
        />
    </svg>
</div>

<!-- The clock display -->
<div>
    <h1>{Math.round(100 * clock) / 100}</h1>
    <h3>
        x: {Math.round(1000 * pos.x) / 1000}, y: {Math.round(1000 * pos.y) /
            1000}
    </h3>
    <button on:click={() => (go = !go)} id="playbutton">
        {go ? 'Pause' : 'Play'}
    </button>
    <button
        on:click={() => {
            go = false;
            last = false;
            clock = 0;
        }}>Reset</button
    >
</div>
<div id="accformula">
    {#each sortedIntervals as { id, acc, upper } (id)}
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
</div>

<style>
    svg {
        width: 100vw;
        max-width: 660px;
        height: 60vw;
        max-height: 396px;
    }
    button {
        width: 4rem;
    }
    h1 {
        text-align: left;
    }
</style>
