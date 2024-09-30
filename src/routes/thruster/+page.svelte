<script>
    // Solution: W3siaWQiOiIyNjQyMmI0Yy03MjU2LTQ3ZTUtYmVkYi1jNTQ5MmY3YmI0N2QiLCJhY2MiOiJlIiwidXBwZXIiOjIuNX0seyJpZCI6ImFmZTIyMmYzLWYyMDItNGZkZi05NjQwLTAxNjg0OWQ2NGFiYyIsImFjYyI6Im4iLCJ1cHBlciI6N30seyJpZCI6IjdiZTI4OWUzLWM5MzctNDg3MC1iOTQzLWIzMTg3MWRmYmE5MiIsImFjYyI6InciLCJ1cHBlciI6Ny41fSx7ImlkIjoiMTkyZDlhZGYtZmY3OS00OTQ0LThlZDEtMzgyOGQzMWVmMWI0IiwiYWNjIjoicyIsInVwcGVyIjoxNX0seyJpZCI6ImY4NDMzYmE4LWFmOWMtNDExYy05Yjk1LTEyNmUwZDg2YmE2NiIsImFjYyI6InciLCJ1cHBlciI6MTZ9LHsiaWQiOiI3ZTc0OTI5OS1mYzRhLTQzYjctOTYzOS0zYTcxNzM5ZDhmOTMiLCJhY2MiOiJvIiwidXBwZXIiOjE4fSx7ImlkIjoiYmE4OTcwNDktYWU1ZS00NDU0LWEwNDQtOTk3ZWUxNzFhYjI0IiwiYWNjIjoibiIsInVwcGVyIjoyM30seyJpZCI6IjM0ZjY4YzVlLTA1ZmMtNDdiOS05YzViLTYwZmNiMmVlMGRlMCIsImFjYyI6ImUiLCJ1cHBlciI6Mjd9XQ

    import Interval from './Interval.svelte';
    import { flip } from 'svelte/animate';
    import { onMount } from 'svelte';

    let go = false;
    let clock = 0;
    let pos = { x: 1, y: 1, vx: 0, vy: 0, ax: 1, ay: 0 };
    let lastX = 1;
    let lastY = 1;
    let dPath = 'M 10 290 ';
    let endMessage = '';

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
    const OPTS = ['vel', 'acc'];

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
     * Finds the y-coord of the line through (x1,y1) and (x2,y2) at x = lev
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {number} lev
     */
    function crossing(x1, y1, x2, y2, lev) {
        return y1 + ((y2 - y1) * (lev - x1)) / (x2 - x1);
    }

    /**
     * Detect win or loss
     * @param {number} x0
     * @param {number} y0
     * @param {number} x
     * @param {number} y
     * @returns string
     */
    function isFinished(x0, y0, x, y) {
        if (y >= 30 || y <= 0 || x <= 0) {
            // console.log('topleftright');
            return 'lose';
        }
        if (x >= 50 && x0 < 50) {
            const ylev = crossing(x0, y0, x, y, 50);
            if (13 <= ylev && ylev <= 17) {
                return 'win';
            } else {
                // console.log('endline');
                return 'lose';
            }
        } else if ((x >= 25 && 25 >= x0) || (x0 >= 25 && 25 >= x)) {
            const ylev = crossing(x0, y0, x, y, 25);
            // console.log('first barrier', x, x0, ylev);
            if (ylev <= 22.5) {
                return 'lose';
            } else {
                return '';
            }
        } else if ((x >= 37.5 && x0 < 37.5) || (x0 >= 37.5 && x < 37.5)) {
            const ylev = crossing(x0, y0, x, y, 37.5);
            // console.log('second barrier', x, x0, ylev);
            if (ylev >= 7.5) {
                return 'lose';
            } else {
                return '';
            }
        } else {
            return '';
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
        // console.log(btoa(outString));
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
            const status = isFinished(lastX, lastY, pos.x, pos.y);
            lastX = pos.x;
            lastY = pos.y;
            if (status == 'win') {
                go = false;
                last = 0;
                endMessage = 'WIN!';
            } else if (status == 'lose') {
                go = false;
                last = 0;
                endMessage = 'CRASH!';
            } else {
                endMessage = '';
            }
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
                // console.log(search, atob(search));
                intervals = JSON.parse(atob(search));
            } catch (error) {
                console.log(error);
            }
        }
        document.addEventListener('keypress', (e) => {
            if (e.key === 'p') {
                showOpts.path = !showOpts.path;
            }
        });
    });
</script>

<div id="intro">
    <h1>Rocket Escape</h1>
    <p>
        Pilot the rocket out of the maze-thing without crashing. You can set its
        acceleration vector as one of &pm;<b>i</b>, &pm;<b>j</b>, or <b>0</b> at
        time intervals of your choosing (for any <em>t</em>, the first valid
        rule is applied).
    </p>
    <p>
        Try to escape as quickly as possible. To submit your time, click "Save
        in URL" below and copy the address into <a
            href="https://forms.gle/Jcf7Jv7NKhzVr4NK6"
            target="_blank"
            rel="noopener noreferrer">this form</a
        >.
    </p>
</div>
<div id="playingfield">
    <svg id="svg" viewBox="0 0 550 300">
        <rect
            x="0"
            y="0"
            width="500"
            height="300"
            fill="rgba(200, 200, 255, 0.5)"
        />
        <rect
            x="500"
            y="0"
            width="50"
            height="300"
            fill="rgba(200, 255, 200, 0.5)"
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
                <polygon points="0 0, 5 1.5, 0 3" />
            </marker>
        </defs>

        <!-- Draw a line with an arrowhead -->
        {#if showOpts.acc}
            <line
                x1={pos.x * 10}
                y1={300 - pos.y * 10}
                x2={pos.x * 10 + pos.ax * 10}
                y2={300 - pos.y * 10 - pos.ay * 10}
                stroke="red"
                stroke-width="2"
                marker-end="url(#arrowhead)"
                fill="red"
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
            href={'/rocketwfire.png'}
            x={pos.x * 10 - 12.5}
            y={300 - pos.y * 10 - 12.5}
            width="25"
            height="25"
            transform={`rotate(${(Math.atan2(pos.vx, pos.vy) * 180) / Math.PI} ${10 * pos.x} ${300 - 10 * pos.y})`}
        />
        <!-- <circle cx={pos.x * 10} cy={300 - pos.y * 10} fill="red" r="5" /> -->
        <polyline
            points="500,130 500,0 0,0 0,300 500,300 500,170"
            stroke="black"
            stroke-width="3"
            fill="transparent"
        />
        <line
            x1="250"
            y1="75"
            x2="250"
            y2="300"
            stroke="black"
            stroke-width="2"
        />
        <line
            x1="375"
            y1="0"
            x2="375"
            y2="225"
            stroke="black"
            stroke-width="2"
        />
    </svg>
</div>

<div id="controlbox">
    <div id="colbox">
        <!-- The clock display -->
        <!-- {#if endMessage} -->
        <!-- <h3 style="color: #aa1111;">{endMessage}</h3> -->
        <!-- {/if} -->
        <h1>
            <span class="number-container">{clock.toFixed(2)}s</span>
            <span
                style={`color: ${endMessage == 'ESCAPE!' ? '#11aa11' : '#aa1111'}`}
                >{endMessage}</span
            >
        </h1>
        <h3>
            x: <span class="number-container">{pos.x.toFixed(3)}</span>, y:
            <span class="number-container">{pos.y.toFixed(3)}</span>
        </h3>
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
        <br />
        <button
            on:click={() => {
                go = !go;
                last = 0;
            }}
            id="playbutton"
            disabled={endMessage.length > 0 || clock >= maxTime}
        >
            {go ? 'Pause' : 'Play'}
        </button>
        <button
            on:click={() => {
                go = false;
                last = 0;
                clock = 0;
                endMessage = '';
                lastX = 1;
                lastY = 1;
            }}>Reset</button
        >
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
            {#each sortedIntervals as { id, acc, upper } (id)}
                <div animate:flip>
                    <Interval
                        bind:acc
                        bind:upper
                        on:deleteme={() => {
                            if (intervals.length > 1) {
                                deleteMe(id);
                            }
                        }}
                    />
                </div>
            {/each}
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

    #colbox {
        width: 40%;
    }
    #accformula {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        gap: 5px;
        width: 40%;
    }
    .number-container {
        display: inline-block;
        font-family: monospace;
        text-align: right;
    }
    .controls {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        gap: 26px;
    }
    #playingfield,
    svg {
        width: fit-content;
        margin: 0 auto;
    }
    .piecewise-wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    #intro {
        max-width: 726px;
        width: 100vw;
        margin: 0 auto;
    }
</style>
