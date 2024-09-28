<script>
    import { createEventDispatcher } from 'svelte';

    export let acc = 'e';
    export let upper = 1;

    const dispatch = createEventDispatcher();
</script>

<div class="piecewise-item">
    <select name="acc" id="accselect" bind:value={acc} class="select">
        <option value={'e'}>i</option>
        <option value={'w'}>-i</option>
        <option value={'n'}>j</option>
        <option value={'s'}>-j</option>
        <option value={'o'}>0</option>
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
        padding: 5px 10px;
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
