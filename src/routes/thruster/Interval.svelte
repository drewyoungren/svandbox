<script>
    import { createEventDispatcher } from 'svelte';

    export let acc = 'e';
    export let upper = 1;

    const dispatch = createEventDispatcher();
</script>

<div class="piecewise-item">
    <select name="acc" id="accselect" bind:value={acc} class="select">
        <option value={'e'}>&langle;1, 0&rangle;</option>
        <option value={'w'}>&langle;-1, 0&rangle;</option>
        <option value={'n'}>&langle;0, 1&rangle;</option>
        <option value={'s'}>&langle;0, -1&rangle;</option>
        <option value={'o'}>&langle;0, 0&rangle;</option>
    </select>

    <span class="text">for <em>t</em> ≤</span>

    <input
        type="number"
        name="upper"
        id="upper"
        value={upper}
        on:change={(e) => {
            upper = +e.target.value;
        }}
        class="input"
    />

    <button on:click={() => dispatch('deleteme')} class="delete-btn">
        &times;
    </button>
</div>

<style>
    .piecewise-item {
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: Arial, sans-serif;
        margin-bottom: 10px;
    }

    .select {
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 14px;
    }

    .input {
        padding: 5px;
        width: 60px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 14px;
    }

    .delete-btn {
        padding: 2px 5px;
        background-color: #ff4d4d;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
    }

    .delete-btn:hover {
        background-color: #ff1a1a;
    }
</style>
