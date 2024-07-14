<script>
  import { base } from '$app/paths';
</script>

<svelte:head>
  <meta name="robots" content="noindex" />
</svelte:head>

<nav>
  <a href="{base}/amp2024/">Home</a>
</nav>

<slot></slot>

<style>
  nav {
    background-color: rgb(136, 220, 223);
    padding: 0.5rem;
  }
</style>
