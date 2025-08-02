<script lang="ts">
    import { onMount } from 'svelte';
    import { List, Map } from 'immutable';

    let gridSize = $state(4);

    function reset() {}

    onMount(() => {
        reset();
    });
</script>

<h1>Ramio &amp; Iulgi</h1>

<p>Ramio and Iulgi need to escape their respective mazes.</p>

<div class="maindisplay">
    <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-1 -1 702 302"
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
        <rect
            x="400"
            y="0"
            width="300"
            height="300"
            stroke="black"
            stroke-width="2"
            fill="url(#grid)"
        ></rect>
    </svg>
    <div class="displaybox">
        <input type="range" min="4" step="1" max="12" bind:value={gridSize} />
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
    svg {
        max-width: 600px;
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
