<script>
    let { cards, click } = $props();

    let selected = $state(false);

    let clickLock = $state(false);
</script>

{#if cards.length > 0}
    <div class="stack">
        {#each cards as card, i}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                class="card"
                id="card{i}"
                style="top: {i * 20}px; z-index: {i}"
                class:selected={i == cards.length - 1 && selected}
                onclick={(event) => {
                    event.preventDefault();
                    // console.log(card, event.currentTarget);
                    if (!clickLock) {
                        clickLock = true;
                        if (i == cards.length - 1) {
                            selected = true;
                            setTimeout(() => {
                                click();
                                selected = false;
                                clickLock = false;
                            }, 200);
                        }
                    }
                }}
            >
                <div class="cardno">
                    {card}
                </div>
            </div>
        {/each}
    </div>
{/if}

<style>
    .stack {
        position: relative;
        width: 100px;
        height: 170px; /* accommodates the offset card */
        flex-shrink: 0; /* prevents it from collapsing in flex layouts */
    }
    .card {
        width: 100px;
        height: 150px;
        position: absolute;
        background-color: lightblue;
        border-radius: 7px;
        border: 1px solid black;
    }
    .selected {
        border: 4px solid yellow;
        background-color: pink;
    }
    .cardno {
        font-size: larger;
        margin: 4px;
    }
</style>
