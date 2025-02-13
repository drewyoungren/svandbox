<script>
    import M from '$lib/M.svelte';

    /**
     * @type number
     */
    export let i;
    /**
     * @type number
     */
    export let j;
    /**
     * @type Array<Object>
     */
    export let status;
    /**
     * @type Array<Array<number>>
     */
    export let blockBoxes;

    function unblock() {
        // need to fix backward indexing
        status.find((e) => e.i == j && e.j == i).blocked = false;
        status = [...status];
        blockBoxes = blockBoxes.filter((v) => v[0] != i || v[1] != j);
    }
</script>

<div>
    <M>({i},{j})</M> <button on:click={unblock}>&times;</button>
</div>

<style>
    div {
        background-color: maroon;
        color: white;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
    }
    button {
        background-color: inherit;
        color: inherit;
        border: inherit;
    }
</style>
