<script>
  import { afterUpdate } from 'svelte';
  import katex from 'katex';

  export let align = false;
  export let display = false;
  export let size = 'sm';

  /**
   * @type Element
   */
  let span;

  /**
   * @type Element
   */
  let span2;

  /* global MathJax */

  /**
   * Adds latex styling
   * @param formula {string}
   * @param [align=false] {boolean}
   * @param [size='sm'] {string}
   * @returns {string}
   */
  const formatMJ = function (formula, align = false, size = 'sm') {
    let textSize = size === 'lg' ? '\\Large' : '';

    if (align) {
      return `${textSize} \\begin{align} ${formula} \\end{align}`;
    } else {
      return `${textSize} ${formula}`;
    }
  };

  const render = () => {
    const s = formatMJ(span.innerText, align, size);
    console.log(s, ' renderin');
    katex.render(s, span2, {
      throwOnError: false,
      displayMode: display,
      output: 'mathml',
    });
  };

  afterUpdate(render);
</script>

<span bind:this={span} class="input">
  <slot />
</span>

<span bind:this={span2} class="output" />

<style>
  .input {
    display: none;
  }
</style>
