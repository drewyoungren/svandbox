<script>
    import { onMount } from 'svelte';
    import { proj, normalize, norm, headOnCollision } from '$lib/bouncy-utils';

    let go = false;
    let dim = 2;
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
            color: 'blue',
            r: 60 * Math.random(),
            px: 1000 * Math.random(),
            py: 1000 * Math.random(),
            vx: 400 * Math.random() - 200,
            vy: 400 * Math.random() - 200,
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
     *
     * @param {Circ} c
     * @param {Circ} d
     */
    function collide(c, d, dim = 2) {
        if (
            Math.sqrt(
                (c.px - d.px) * (c.px - d.px) + (c.py - d.py) * (c.py - d.py),
            ) <
            c.r + d.r
        ) {
            c.color = `rgb(${Math.floor(255 * Math.random())},${Math.floor(255 * Math.random())},${Math.floor(255 * Math.random())})`;
            d.color = `rgb(${Math.floor(255 * Math.random())},${Math.floor(255 * Math.random())},${Math.floor(255 * Math.random())})`;

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

            // debugger;

            c.vx = c.vx - cu * u[0] + cout * u[0];
            c.vy = c.vy - cu * u[1] + cout * u[1];

            d.vx = d.vx - du * u[0] + dout * u[0];
            d.vy = d.vy - du * u[1] + dout * u[1];

            // debugger;
        }
    }

    /**
     *
     * @param e {MouseEvent}
     */
    const addCirc = (e) => {
        const px = (cw * e.clientX) / e.target.clientWidth;
        const py = (ch * e.clientY) / e.target.clientHeight;

        circs.push({
            color: `rgb(${Math.floor(255 * Math.random())},${Math.floor(255 * Math.random())},${Math.floor(255 * Math.random())})`,
            r: 50 * Math.random(),
            px,
            py,
            vx: 400 * Math.random() - 200,
            vy: 400 * Math.random() - 200,
        });
    };

    /**
     * @type {boolean|number}
     */
    let last = false;

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
                collide(circ1, circ2, dim);

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
        console.log(typeof svg);
        svg.addEventListener('click', addCirc);
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
    </svg>
</div>

<div id="controls">
    <button on:click={() => (go = !go)}>{go ? 'Stodiv' : 'Go'}</button>
    <label>
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
    </label>
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
</style>
