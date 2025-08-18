<script lang="ts">
    import { onMount } from 'svelte';
    // import { List, Map } from 'immutable';
    import { SvelteMap } from 'svelte/reactivity';

    let gridSizeSetting = $state(4);
    let gridSize = $state(4);
    let gridStep = $derived(300 / gridSize);

    let currentPosition = $state([0, 0, 0, 0]);

    let marioWalls = new SvelteMap<string, Set<String>>();
    let luigiWalls = new SvelteMap<string, Set<String>>();

    function reset() {
        marioWalls.clear();
        luigiWalls.clear();
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const index = JSON.stringify([i, j]);
                const walls = new Set<String>();
                for (let dir of ['d', 'r']) {
                    if (Math.random() < 0.2) {
                        walls.add(dir);
                    }
                }
                if (walls.size > 0) marioWalls.set(index, walls);
                const walls2 = new Set<String>();
                for (let dir of ['d', 'r']) {
                    if (Math.random() < 0.2) {
                        walls2.add(dir);
                    }
                }
                if (walls2.size > 0) luigiWalls.set(index, walls2);
            }
        }
        // for (const [k, v] of marioWalls.entries()) {
        //     console.log(JSON.parse(k), v, v.has('d'));
        // }
        gridSize = gridSizeSetting;
    }

    onMount(() => {
        reset();
    });

    function onKeyPress(e: KeyboardEvent) {
        console.log(e.key);
        switch (e.key) {
            case 'ArrowRight':
                if (
                    !marioWalls
                        .get(
                            JSON.stringify([
                                currentPosition[0],
                                currentPosition[1],
                            ]),
                        )
                        ?.has('r')
                ) {
                    currentPosition[0] = Math.min(
                        currentPosition[0] + 1,
                        gridSize - 1,
                    );
                }
                if (
                    !luigiWalls
                        .get(
                            JSON.stringify([
                                currentPosition[2],
                                currentPosition[3],
                            ]),
                        )
                        ?.has('r')
                ) {
                    currentPosition[2] = Math.min(
                        currentPosition[2] + 1,
                        gridSize - 1,
                    );
                }
                break;
            case 'ArrowLeft':
                if (
                    !marioWalls
                        .get(
                            JSON.stringify([
                                currentPosition[0] - 1,
                                currentPosition[1],
                            ]),
                        )
                        ?.has('r')
                ) {
                    currentPosition[0] = Math.max(currentPosition[0] - 1, 0);
                }
                if (
                    !luigiWalls
                        .get(
                            JSON.stringify([
                                currentPosition[2] - 1,
                                currentPosition[3],
                            ]),
                        )
                        ?.has('r')
                ) {
                    currentPosition[2] = Math.max(currentPosition[2] - 1, 0);
                }

                break;
            case 'ArrowDown':
                if (
                    !marioWalls
                        .get(
                            JSON.stringify([
                                currentPosition[0],
                                currentPosition[1],
                            ]),
                        )
                        ?.has('d')
                ) {
                    currentPosition[1] = Math.min(
                        currentPosition[1] + 1,
                        gridSize - 1,
                    );
                }
                if (
                    !luigiWalls
                        .get(
                            JSON.stringify([
                                currentPosition[2],
                                currentPosition[3],
                            ]),
                        )
                        ?.has('d')
                ) {
                    currentPosition[3] = Math.min(
                        currentPosition[3] + 1,
                        gridSize - 1,
                    );
                }
                break;
            case 'ArrowUp':
                if (
                    !marioWalls
                        .get(
                            JSON.stringify([
                                currentPosition[0],
                                currentPosition[1] - 1,
                            ]),
                        )
                        ?.has('d')
                ) {
                    currentPosition[1] = Math.max(currentPosition[1] - 1, 0);
                }
                if (
                    !luigiWalls
                        .get(
                            JSON.stringify([
                                currentPosition[2],
                                currentPosition[3] - 1,
                            ]),
                        )
                        ?.has('d')
                ) {
                    currentPosition[3] = Math.max(currentPosition[3] - 1, 0);
                }
                break;

            default:
                break;
        }
    }

    document.addEventListener('keydown', onKeyPress);
</script>

<h1>Ramio &amp; Iulgi</h1>

<p>Ramio and Iulgi need to escape their respective mazes.</p>

<div class="maindisplay">
    <div class="rowdisplay">
        <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-1 -1 302 302"
        >
            <defs>
                <pattern
                    id="grid"
                    x="0"
                    y="0"
                    width={300 / gridSize}
                    height={300 / gridSize}
                    patternUnits="userSpaceOnUse"
                >
                    <!-- Vertical line -->
                    <line
                        x1="0"
                        y1="0"
                        x2="0"
                        y2={300 / gridSize}
                        stroke="#ccc"
                        stroke-width="1"
                    />
                    <!-- Horizontal line -->
                    <line
                        x1="0"
                        y1="0"
                        x2={300 / gridSize}
                        y2="0"
                        stroke="#ccc"
                        stroke-width="1"
                    />
                </pattern>
            </defs>

            <rect
                x="0"
                y="0"
                width="300"
                height="300"
                fill="url(#grid)"
                stroke="black"
                stroke-width="2"
            ></rect>

            {#each marioWalls.entries() as [k, v]}
                {@const [i, j] = JSON.parse(k)}
                {#if v.has('d')}
                    <line
                        x1={i * gridStep}
                        y1={(j + 1) * gridStep}
                        x2={(i + 1) * gridStep}
                        y2={(j + 1) * gridStep}
                        stroke="black"
                        stroke-width="2"
                    >
                    </line>
                {/if}
                {#if v.has('r')}
                    <line
                        x1={(i + 1) * gridStep}
                        y1={j * gridStep}
                        x2={(i + 1) * gridStep}
                        y2={(j + 1) * gridStep}
                        stroke="black"
                        stroke-width="2"
                    >
                    </line>
                {/if}
            {/each}

            <circle
                cx={(currentPosition[0] + 1 / 2) * gridStep}
                cy={(currentPosition[1] + 1 / 2) * gridStep}
                r={(gridStep / 2) * 0.9}
                stroke="2"
                fill="red"
            >
            </circle>
        </svg>
        <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-1 -1 302 302"
        >
            <rect
                x="0"
                y="0"
                width="300"
                height="300"
                stroke="black"
                stroke-width="2"
                fill="url(#grid)"
            ></rect>

            {#each luigiWalls.entries() as [k, v]}
                {@const [i, j] = JSON.parse(k)}
                {#if v.has('d')}
                    <line
                        x1={i * gridStep}
                        y1={(j + 1) * gridStep}
                        x2={(i + 1) * gridStep}
                        y2={(j + 1) * gridStep}
                        stroke="black"
                        stroke-width="2"
                    >
                    </line>
                {/if}
                {#if v.has('r')}
                    <line
                        x1={(i + 1) * gridStep}
                        y1={j * gridStep}
                        x2={(i + 1) * gridStep}
                        y2={(j + 1) * gridStep}
                        stroke="black"
                        stroke-width="2"
                    >
                    </line>
                {/if}
            {/each}
            <circle
                cx={(currentPosition[2] + 1 / 2) * gridStep}
                cy={(currentPosition[3] + 1 / 2) * gridStep}
                r={(gridStep / 2) * 0.9}
                stroke="2"
                fill="green"
            >
            </circle>
        </svg>
    </div>

    <div class="displaybox">
        <input
            type="range"
            min="4"
            step="1"
            max="12"
            bind:value={gridSizeSetting}
        />
        <button onclick={reset}> Reset </button>
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

    .rowdisplay {
        display: flex;
        align-items: center;
        justify-content: space-around;
        flex-wrap: wrap;
        width: 800px;
        flex-direction: row;
    }
    svg {
        width: 302px;
        height: auto;
    }

    text {
        pointer-events: none;
    }

    .displaybox {
        display: inline-block;
        width: 3ch;
    }
</style>
