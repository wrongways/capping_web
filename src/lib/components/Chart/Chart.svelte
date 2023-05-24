<script lang="ts">
  import {width, height} from '$lib/stores';

</script>


<svg width={$width} height={$height}>
    <slot />
</svg>


<style>
  svg {
    margin-top: 40px;
    border: black solid 0.2px;
    border-radius: 4px;
  }
</style>
