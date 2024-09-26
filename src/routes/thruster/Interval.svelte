<script>
    import { createEventDispatcher } from 'svelte';

    export let acc = 'e';
    export let upper = 1;

    const dispatch = createEventDispatcher();
</script>

<div>
    <select name="acc" id="accselect" bind:value={acc}>
        <option value={'e'}><b>i</b></option>
        <option value={'w'}>-<b>i</b></option>
        <option value={'n'}><b>j</b></option>
        <option value={'s'}>-<b>j</b></option>
        <option value={'o'}><b>0</b></option>
    </select>
    for <em>t</em> ≤
    <input type="number" name="upper" id="upper" bind:value={upper} />
    <button on:click={() => dispatch('deleteme')}>X</button>
</div>
