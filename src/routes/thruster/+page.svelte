<script>
    import Interval from './Interval.svelte';
    import { flip } from 'svelte/animate';
    import { onMount } from 'svelte';

    let go = false;
    let clock = 0;
    let pos = { x: 1, y: 1, vx: 0, vy: 0, ax: 1, ay: 0 };
    let dPath = 'M 10 290 ';

    /**
     * @typedef {'path'|'vel'|'acc'} ShowOpt
     */

    let showOpts = { path: false, vel: false, acc: true };

    /**
     * @typedef {Object} TimePiece
     * @property {string} id
     * @property {Dir} acc
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

    /**
     * @typedef {'e'|'n'|'w'|'s'|'o'} Dir
     */

    const DIRS = {
        n: [0, 1],
        e: [1, 0],
        s: [0, -1],
        w: [-1, 0],
        o: [0, 0],
    };

    /**
     * @type Array<ShowOpt>
     */
    const OPTS = ['path', 'vel', 'acc'];

    /**
     * @type number
     */
    let last = 0;

    /**
     *
     * @param {number}x1
     * @param {number}y1
     * @param {number}vx1
     * @param {number}vy1
     * @param {number}x2
     * @param {number}y2
     * @param {number}vx2
     * @param {number}vy2
     * @returns {Number[]}
     */
    function controlPoint(x1, y1, vx1, vy1, x2, y2, vx2, vy2) {
        const [a11, a12, a21, a22] = [-vy1, vx1, -vy2, vx2];
        const d = a11 * a22 - a12 * a21;
        if (d === 0) {
            return [(x1 + x2) / 2, (y1 + y2) / 2];
        } else {
            const b1 = a11 * x1 + a12 * y1;
            const b2 = a21 * x2 + a22 * y2;
            return [(a22 * b1 - a12 * b2) / d, (a11 * b2 - a21 * b1) / d];
        }
    }

    /**
     *
     * @param {number} t
     */
    function evolve(t) {
        const dt = (t - (last > 0 ? last : t)) / 1000;
        last = t;
        clock += dt;
        if (go) {
            requestAnimationFrame(evolve);
        }
    }

    function serialize() {
        const outString = JSON.stringify(intervals);
        console.log(btoa(outString));
        window.location.search = btoa(outString);
    }

    // Reactive stuff

    $: sortedIntervals = intervals.sort(cmp);

    $: if (go) requestAnimationFrame(evolve);

    let initPos = [{ t: 0, x: 1, y: 1, vx: 0, vy: 0 }];
    $: {
        initPos = [{ t: 0, x: 1, y: 1, vx: 0, vy: 0 }];
        dPath = 'M 10 290 ';
        for (let { acc, upper } of sortedIntervals) {
            const [ax, ay] = DIRS[acc];
            const { t, x, y, vx, vy } = initPos[initPos.length - 1];
            const dt = upper - t;
            const [xNew, yNew, vxNew, vyNew] = [
                x + vx * dt + (ax * dt * dt) / 2,
                y + vy * dt + (ay * dt * dt) / 2,
                vx + ax * dt,
                vy + ay * dt,
            ];

            initPos.push({
                t: upper,
                x: xNew,
                y: yNew,
                vx: vxNew,
                vy: vyNew,
            });
            const [q1, q2] = controlPoint(
                x,
                y,
                vx,
                vy,
                xNew,
                yNew,
                vxNew,
                vyNew,
            );
            dPath += ` Q ${q1 * 10} ${300 - 10 * q2}, ${xNew * 10} ${300 - yNew * 10}`;
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
            last = 0;
        }
    }

    $: maxTime = sortedIntervals[sortedIntervals.length - 1].upper;

    $: braceHeight = intervals.length * 50; // Adjust multiplier for finer control

    onMount(() => {
        const search = window.location.search.slice(1);
        if (search) {
            try {
                console.log(search, atob(search));
                intervals = JSON.parse(atob(search));
            } catch (error) {
                console.log(error);
            }
        }
    });
</script>

<div id="intro">
    <h1>Rocket Escape</h1>
    <p>
        Pilot the rocket out of the maze-thing. You can set its acceleration in
        one of the cardinal directions (or 0).
    </p>
</div>
<div id="playingfield">
    <svg id="svg" viewBox="0 0 550 300">
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
                markerWidth="5"
                markerHeight="3.5"
                refX="0"
                refY="1.75"
                orient="auto"
                fill="currentColor"
            >
                <polygon points="0 0, 5 1.75, 0 3.5" />
            </marker>
        </defs>

        <!-- Draw a line with an arrowhead -->
        {#if showOpts.acc}
            <line
                x1={pos.x * 10}
                y1={300 - pos.y * 10}
                x2={pos.x * 10 + pos.ax * 10}
                y2={300 - pos.y * 10 - pos.ay * 10}
                stroke="black"
                stroke-width="2"
                marker-end="url(#arrowhead)"
            />
        {/if}
        {#if showOpts.vel}
            <line
                x1={pos.x * 10}
                y1={300 - pos.y * 10}
                x2={pos.x * 10 + pos.vx * 10}
                y2={300 - pos.y * 10 - pos.vy * 10}
                stroke="green"
                fill="green"
                stroke-width="2"
                marker-end="url(#arrowhead)"
            />
        {/if}
        {#if showOpts.path}
            <path
                d={dPath}
                stroke="black"
                stroke-width="1"
                fill="transparent"
                stroke-dasharray="5"
            />
        {/if}
        <image
            href="/rocket.png"
            x={pos.x * 10 - 10}
            y={300 - pos.y * 10 - 10}
            width="20"
            height="20"
            transform={`rotate(${(Math.atan2(pos.vx, pos.vy) * 180) / Math.PI} ${10 * pos.x} ${300 - 10 * pos.y})`}
        />
        <!-- <circle cx={pos.x * 10} cy={300 - pos.y * 10} fill="red" r="5" /> -->
        <polyline
            points="500,130 500,0 0,0 0,300 500,300 500,170"
            stroke="black"
            stroke-width="3"
            fill="transparent"
        />
    </svg>
</div>

<!-- The clock display -->
<div id="controlbox">
    <div>
        <h1><span class="number-container">{clock.toFixed(2)}</span></h1>
        <h3>
            x: <span class="number-container">{pos.x.toFixed(3)}</span>, y:
            <span class="number-container">{pos.y.toFixed(3)}</span>
        </h3>
        <button
            on:click={() => {
                go = !go;
                last = 0;
            }}
            id="playbutton"
            disabled={clock >= maxTime}
        >
            {go ? 'Pause' : 'Play'}
        </button>
        <button
            on:click={() => {
                go = false;
                last = 0;
                clock = 0;
            }}>Reset</button
        ><br />
        <input
            type="range"
            name="scrub"
            id="scrub"
            min="0"
            max={maxTime}
            bind:value={clock}
            step="0.01"
            on:input={() => (last = 0)}
        />
        <div class="controls">
            {#each OPTS as key}
                <div>
                    <label for={key}>{key}: </label>
                    <input
                        type="checkbox"
                        name={key}
                        id={`${key}Element`}
                        bind:checked={showOpts[key]}
                    />
                </div>
            {/each}
        </div>
    </div>
    <div id="accformula">
        <div class="piecewise-wrapper">
            <div
                class="piecewise-brace"
                style="--brace-height: {braceHeight}px;"
            >
                {#each sortedIntervals as { id, acc, upper } (id)}
                    <div animate:flip>
                        <Interval
                            bind:acc
                            bind:upper
                            on:deleteme={() => deleteMe(id)}
                        />
                    </div>
                {/each}
            </div>
        </div>
        <div class="contols">
            <button
                on:click={() => {
                    intervals = [
                        ...intervals,
                        {
                            id: crypto.randomUUID(),
                            acc: 'o',
                            upper: Math.ceil(
                                intervals[intervals.length - 1].upper + 1,
                            ),
                        },
                    ];
                }}
            >
                +
            </button>
            <button on:click={serialize} style="width:fit-content">
                Save in URL
            </button>
        </div>
    </div>
</div>

<style>
    svg {
        width: 100vw;
        max-width: 726px;
        height: 60vw;
        max-height: 396px;
    }
    button {
        width: 4rem;
    }

    #controlbox {
        display: flex;
        flex-direction: row;
        gap: 10px;
        justify-content: space-around;
        align-items: baseline;
        max-width: 726px;
        width: 100vw;
        margin: 0 auto;
    }
    #accformula {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        gap: 5px;
    }
    .number-container {
        display: inline-block;
        font-family: monospace;
        text-align: right;
    }
    .controls {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }
    #playingfield,
    svg {
        width: fit-content;
        margin: 0 auto;
    }
    .piecewise-wrapper {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
    }

    .piecewise-brace {
        position: relative;
        display: flex;
        flex-direction: column;
        width: 20px; /* Fixed width to contain the curly brace */
    }

    .piecewise-brace::before {
        content: '{';
        font-size: calc(var(--brace-height) / 1); /* Dynamic font size */
        position: absolute;
        left: -20px;
        top: 0;
        font-weight: bold;
        line-height: 1; /*Prevents vertical stretching of the brace */
    }
</style>
