<script>
    import { onMount } from 'svelte';
    import { Tween } from 'svelte/motion';
    // import { fade } from 'svelte/transition';

    const COLORS = ['P', 'Y', 'R', 'G', 'B'];

    let gameState = $state({ P: 0, Y: 0, R: 0, G: 0, B: 0 });

    let pyramid = $state([]);

    let rolled = $state([]);

    function reset() {
        gameState = { P: 0, Y: 0, R: 0, G: 0, B: 0 };
        reload();
    }

    const camels = {};

    for (const c of COLORS) {
        camels[c] = { x: new Tween(0), y: new Tween(0) };
    }

    function getKey(dict, val) {
        for (const [k, v] of Object.entries(dict)) {
            if (v == val) return k;
        }
    }

    let startingSquare = $state(0);

    function minFromMixedList(list) {
        const nums = list.map((item) => Number(item)).filter((n) => !isNaN(n));
        return nums.length > 0 ? Math.min(...nums) : undefined;
    }

    function getPos(state, camel) {
        let ht = 0;
        let c = camel;
        while (COLORS.indexOf(c) > -1) {
            ht++;
            c = state[c];
        }
        return [c, ht];
    }

    function getTopCamel(state, pos) {
        let p = pos;
        const vals = Object.values(state);
        while (vals.indexOf(p) > -1) {
            p = getKey(state, p);
        }
        return p;
    }

    function popRandom(arr) {
        if (arr.length === 0) return undefined;
        const index = Math.floor(Math.random() * arr.length);
        return arr.splice(index, 1)[0];
    }

    function reload() {
        pyramid = [...COLORS];
        rolled = [];
        startingSquare = minFromMixedList(Object.values(gameState));
    }

    function roll() {
        const cam = popRandom(pyramid);
        if (cam) {
            let [p, h] = getPos(gameState, cam);
            const die = Math.ceil(Math.random() * 3);

            rolled.push([cam, die]);

            gameState[cam] = getTopCamel(gameState, p + die);
        }
    }

    const camelColor = {
        R: 'red',
        Y: 'yellow',
        B: 'blue',
        P: 'purple',
        G: 'green',
    };

    $effect(() => {
        for (const cam of COLORS) {
            const [p, h] = getPos(gameState, cam);
            camels[cam].x.target = 25 * (p - startingSquare);
            camels[cam].y.target = 150 - 20 * h;
        }
    });

    onMount(() => {
        reset();
    });
</script>

<h1>Dromedary Up!</h1>

<p>
    5 colored droms (not a word) move around a board of sequential squares. Each
    color rolls a 3-sided die each round (in randomized order) and advances that
    number of spaces. If the resulting space is occupied, the camel stacks on
    top of whoever is there. Camels on top of a moving camel remain there.
</p>
<p>
    We aim to simulate who is most likely to win (the highest camel on the
    farthest square) after a round from a given starting position.
</p>

<div class="maindisplay">
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200">
        {#each Object.entries(camels) as [cam, { x, y }]}
            <rect
                x={x.current}
                y={y.current}
                width="20"
                height="20"
                fill={camelColor[cam]}
            ></rect>
        {/each}

        <text x={10} y={170} stroke="black" text-anchor="middle"
            >{startingSquare}</text
        >
    </svg>

    <div>
        <button onclick={roll} disabled={pyramid.length == 0}> Roll! </button>
        <button onclick={reload} disabled={pyramid.length > 0}>
            Reload!
        </button>
        <button onclick={reset}> Reset! </button>
    </div>
    <div class="displaybox">
        {#each rolled as [c, d]}
            <div class="die" style={`background-color: ${camelColor[c]}`}>
                {d}
            </div>
        {/each}
    </div>
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
        max-width: 600px;
        height: auto;
    }

    text {
        pointer-events: none;
    }

    .displaybox {
        display: flex;
        gap: 10px;
        margin: 15px;
    }

    .die {
        width: 3rem;
        height: 3rem;
        border-radius: 5px;
        color: white; /* Text color */
        font-weight: bold; /* Makes it fat */
        -webkit-text-stroke: 1px black; /* Thin black border */
        text-shadow: 0 0 1px black; /* Optional: helps cross-browser rendering */
        text-align: center;
        text-anchor: start;
        font-size: xxx-large;
    }
</style>
