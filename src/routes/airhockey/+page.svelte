<script>
    import { onMount } from 'svelte';
    import { proj, normalize, norm, headOnCollision } from '$lib/bouncy-utils';

    let go = false;
    let dim = 2;

    /**
     * Mouse positions for paddle
     */
    let mx = 250;
    let my = 250;

    let paddleOn = false;
    let stopper = false;

    /**
     * @type Circ
     */
    let paddle = {
        color: 'black',
        r: 70,
        px: 250,
        py: 250,
        vx: 0,
        vy: 0,
    };

    /**
     *
     * @type SVGElement
     */
    let svg;

    let cw = 500;
    let ch = 500;

    /**
     * @type number
     */
    let req = 0;

    /**
     * @type Circ[]
     */
    let circs = [
        {
            r: 50,
            px: 100,
            py: 100,
            vx: 125,
            vy: -100,
            color: 'red',
        },
        {
            r: 60 * Math.random() + 10,
            px: 1000 * Math.random(),
            py: 1000 * Math.random(),
            vx: 400 * Math.random() - 200,
            vy: 400 * Math.random() - 200,
            color: 'blue',
        },
    ];

    /**
     * @typedef {Object} Circ
     * @property {number} px
     * @property {number} py
     * @property {number} vx
     * @property {number} vy
     * @property {number} r
     * @property {string} color
     */

    /**
     * Set the color from the speed
     * @param {Circ} c
     */
    function setColorFromSpeed(c) {
        const speed = norm(c.vx, c.vy);
        c.color = `hsl(${Math.round((speed / 400) * 270)}deg 100% 45%)`;
    }

    circs.forEach(setColorFromSpeed);

    /**
     *
     * @param {Circ} c
     * @param {Circ} d
     */
    function collide(c, d, pad = false) {
        const dist = norm(c.px - d.px, c.py - d.py);
        const r = c.r;
        const R = pad ? 30 : d.r;

        if (dist < r + R) {
            const w = [c.px - d.px, c.py - d.py];
            const u = normalize(w);
            const cu = c.vx * u[0] + c.vy * u[1];
            const du = d.vx * u[0] + d.vy * u[1];
            const [cout, dout] = headOnCollision(
                Math.pow(c.r, dim),
                Math.pow(d.r, dim),
                cu,
                du,
            );

            // overlap time
            const olt = (r + R - dist) / Math.abs(cu - du);
            c.px = c.px - c.vx * olt;
            c.vx = c.vx - cu * u[0] + cout * u[0];
            c.px = c.px + c.vx * olt;
            c.py = c.py - c.vy * olt;
            c.vy = c.vy - cu * u[1] + cout * u[1];
            c.py = c.py + c.vy * olt;

            setColorFromSpeed(c);

            if (!pad) {
                d.px = d.px - d.vx * olt;
                d.vx = d.vx - du * u[0] + dout * u[0];
                d.px = d.px + d.vx * olt;
                d.py = d.py - d.vy * olt;
                d.vy = d.vy - du * u[1] + dout * u[1];
                d.py = d.py + d.vy * olt;
                setColorFromSpeed(d);
            }

            // c.color = `hsl(${Math.floor(360 * Math.random())}deg 100% 45%)`;
            // d.color = `hsl(${Math.floor(360 * Math.random())}deg 100% 45%)`;

            // debugger;
        }
    }

    /**
     * add a random circle
     *
     */
    const addCirc = () => {
        const px = cw * Math.random();
        const py = ch * Math.random();

        circs.push({
            color: `hsl(${Math.floor(360 * Math.random())}deg 100% 45%)`,
            r: 15 + 60 * Math.random(),
            px,
            py,
            vx: 350 * Math.random() - 175,
            vy: 350 * Math.random() - 175,
        });
    };

    /**
     *
     * @param e {PointerEvent}
     */
    const onPaddleMove = (e) => {
        const px = (cw * e.clientX) / svg.clientWidth;
        const py = (ch * e.clientY) / svg.clientHeight;

        const dt = (e.timeStamp - lastMouseTime) / 1000;
        lastMouseTime = e.timeStamp;
        paddle.vx = (px - paddle.px) / dt;
        paddle.px = px;
        paddle.vy = (py - paddle.py) / dt;
        paddle.py = py;
    };

    /**
     *
     * @param e {PointerEvent}
     */
    function onPaddleDown(e) {
        e.preventDefault();

        lastMouseTime = e.timeStamp;

        const px = (cw * e.clientX) / svg.clientWidth;
        const py = (ch * e.clientY) / svg.clientHeight;

        mx = px;
        my = py;

        paddle.vx = 0;
        paddle.px = px;
        paddle.vy = 0;
        paddle.py = py;

        paddleOn = true;

        for (let c of circs) {
            if (norm(c.px - px, c.py - py) < c.r + 30) {
                c.vx = 0;
                c.vy = 0;
                stopper = true;
            }
        }

        if (!stopper) svg.addEventListener('pointermove', onPaddleMove, true);
    }

    /**
     *
     * @param {PointerEvent} e
     */
    function onPaddleUp(e) {
        e.preventDefault();
        svg.removeEventListener('pointermove', onPaddleMove, true);
        paddleOn = false;
        stopper = false;
    }

    /**
     * @type {boolean|number}
     */
    let last = false;

    let lastMouseTime = 0;

    /**
     * Evolve the system of particles
     * @param t {number}
     */
    const animate = (t) => {
        if (!last) last = t;
        const dt = (t - last) / 1000;
        last = t;

        for (let i = 0; i < circs.length - 1; i++) {
            const circ1 = circs[i];

            for (let j = i + 1; j < circs.length; j++) {
                const circ2 = circs[j];
                collide(circ1, circ2);

                for (let circ of [circ1, circ2]) {
                    circ.px += circ.vx * dt;
                    circ.py += circ.vy * dt;

                    if (circ.px < circ.r) {
                        circ.px = circ.r * 2 - circ.px;
                        circ.vx *= -1;
                    } else if (circ.px > cw - circ.r) {
                        circ.px = 2 * (cw - circ.r) - circ.px;
                        circ.vx *= -1;
                    }
                    if (circ.py < circ.r) {
                        circ.py = circ.r * 2 - circ.py;
                        circ.vy *= -1;
                    } else if (circ.py > ch - circ.r) {
                        circ.py = 2 * (ch - circ.r) - circ.py;
                        circ.vy *= -1;
                    }
                }
            }
        }

        if (paddleOn && !stopper)
            circs.forEach((c) => collide(c, paddle, true));

        circs = [...circs];
        if (go) {
            req = requestAnimationFrame(animate);
        } else {
            last = false;
            console.log('off');
            cancelAnimationFrame(req);
        }
    };

    $: if (go) {
        requestAnimationFrame(animate);
    }
    onMount(() => {
        // svg.addEventListener('click', addCirc);
        svg.addEventListener('pointerdown', onPaddleDown, true);
        svg.addEventListener('pointerup', onPaddleUp, true);
    });
</script>

<div id="frame" bind:clientHeight={ch} bind:clientWidth={cw}>
    <svg
        bind:this={svg}
        version="1.1"
        viewBox="0 0 {cw} {ch}"
        xmlns="http://www.w3.org/2000/svg"
        width={cw}
        height={ch}
    >
        {#each circs as circ}
            <circle fill={circ.color} cx={circ.px} cy={circ.py} r={circ.r}
            ></circle>
        {/each}
        {#if paddleOn}
            <circle
                id="paddleCircle"
                fill="black"
                cx={paddle.px}
                cy={paddle.py}
                r="30"
                stroke="white"
            ></circle>
        {/if}
    </svg>
</div>

<div id="controls">
    <button id="go" on:click={() => (go = !go)}>{go ? 'Stop' : ' Go '}</button>
    <button on:click={addCirc}>&plus;</button>
    <!-- <label>
        <input
            type="range"
            name="dimension"
            id="dimslider"
            min="1"
            max="3"
            step="1"
            bind:value={dim}
        />
        {dim}
    </label> -->
</div>

<style>
    #frame {
        border: 1px solid black;
        position: fixed;
        height: 100vh;
        width: 100vw;
        top: 0;
        left: 0;
    }
    #controls {
        z-index: 3;
        top: 5px;
        left: 5px;
        position: absolute;
    }
    svg {
        background-color: rgb(55, 55, 55);
    }
    button#go {
        width: 3rem;
    }
    #paddleCircle {
        cursor: none;
    }
</style>
