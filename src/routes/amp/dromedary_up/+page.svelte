<script>
    import { onMount } from 'svelte';
    import { Tween } from 'svelte/motion';
    // import { fade } from 'svelte/transition';

    const COLORS = ['P', 'Y', 'R', 'G', 'B'];

    let gameState = $state({ P: 0, Y: 0, R: 0, G: 0, B: 0 });

    let prevState = $state({ P: 0, Y: 0, R: 0, G: 0, B: 0 });

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

    function maxFromMixedList(list) {
        const nums = list.map((item) => Number(item)).filter((n) => !isNaN(n));
        return nums.length > 0 ? Math.max(...nums) : undefined;
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
    function rewind() {
        gameState = { ...prevState };
        pyramid = [...COLORS];
        rolled = [];
    }

    function reload() {
        prevState = { ...gameState };
        pyramid = [...COLORS];
        rolled = [];
        startingSquare = minFromMixedList(Object.values(gameState));
        lineStart.target = startingSquare;
        winStats = { R: 0, Y: 0, P: 0, G: 0, B: 0 };
    }

    let lineStart = new Tween(0);

    function roll() {
        const cam = popRandom(pyramid);
        if (cam) {
            let [p, h] = getPos(gameState, cam);
            const die = Math.ceil(Math.random() * 3);

            rolled.push([cam, die]);

            gameState[cam] = getTopCamel(gameState, p + die);

            if (pyramid.length == 0) {
                const winner = getWinner(gameState)[0][2];
                winStats[winner] += 1;
            }
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
            camels[cam].x.target =
                25 * (p - startingSquare) +
                (p == 0 ? -COLORS.indexOf(cam) * 3 : 0);
            camels[cam].y.target =
                150 - 14 * h + (p == 0 ? COLORS.indexOf(cam) * 3 - 15 : 0);
        }
    });

    function getWinner(state) {
        const rank = [];
        for (const c of COLORS) {
            const [p, h] = getPos(state, c);
            rank.push([p, h, c]);
        }
        return rank.sort((a, b) => b[0] - a[0] || b[1] - a[1]);
    }

    let winStats = $state({ R: 0, Y: 0, P: 0, G: 0, B: 0 });
    let winRanks = $derived.by(() => {
        const rank = Object.entries(winStats);
        rank.sort((a, b) => b[1] - a[1]);
        return rank;
    });
    let trials = $derived(winRanks.reduce((p, c) => p + c[1], 0));

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
    <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-10 -30 510 200"
    >
        <defs>
            <symbol id="camelSymbol" viewBox="0 0 21 21">
                <polygon points="0,7 0,21 7,14 14,21 21,14 21,0 14,7 7,0" />
            </symbol>
        </defs>

        <line
            x1="0"
            y1="157"
            x2="410"
            y2="157"
            stroke="black"
            stroke-width="2"
            stroke-dasharray="23 2"
            stroke-dashoffset={((25 * lineStart.current) % 25) + 1}
        />

        {#each Object.entries(camels) as [cam, { x, y }]}
            <use
                href="#camelSymbol"
                x={x.current}
                y={y.current}
                width="21"
                height="21"
                fill={camelColor[cam]}
            ></use>
        {/each}

        <text
            x={10}
            y={170}
            stroke="black"
            text-anchor="middle"
            font-size="10px">{startingSquare}</text
        >

        {#each winRanks as [c, r], i}
            <rect
                x={12 + 24 * i}
                y={30 - (100 * r) / trials}
                width="16"
                height={(100 * r) / trials}
                fill={camelColor[c]}
            ></rect>
        {/each}

        <line
            x1="10"
            y1="30"
            x2="130"
            y2="30"
            stroke="black"
            stroke-width="1"
            stroke-dasharray="20 4"
            stroke-dashoffset="0"
        /><text x="70" y="40" font-size="8">1st place</text>
    </svg>

    <div>
        <button onclick={roll} disabled={pyramid.length == 0}> Roll! </button>
        <button onclick={rewind} disabled={pyramid.length > 0}> &larr; </button>
        <button onclick={reload} disabled={pyramid.length > 0}> &rarr; </button>
        <button onclick={reset}> Reset! </button>
    </div>
    <div class="displaybox">
        {#each rolled as [c, d]}
            <div class="die" style={`background-color: ${camelColor[c]}`}>
                {d}
            </div>
        {/each}
    </div>

    <div>
        {Object.entries(winStats)}
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
        max-width: 800px;
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
