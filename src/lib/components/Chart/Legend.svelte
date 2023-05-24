<script lang="ts">
  import { getContext } from 'svelte';
  import {width, height} from '$lib/stores';
  const padding = getContext('padding');
  const legend = {
    width: 160,
    height: 120,
  };
</script>

<g class=legend transform="translate({$width - padding.right - legend.width - 5},{ $height - padding.bottom - legend.height - 30})">
    <!-- <rect x=0 y=0 width={legend.width} height={legend.height} rx=4 /> -->
    <line class='bmc bmc-power' x1=10 y1=20 x2=50 y2=20 />
    <text class="bmc" text-anchor=start x = 60 y=24>BMC power</text>

    <line class='bmc bmc-cap' x1=10 y1=50 x2=50 y2=50 />
    <text class="bmc " text-anchor=start x = 60 y=54>BMC cap</text>

    <line class='rapl rapl-total' x1=10 y1=80 x2=50 y2=80 />
    <text class="rapl rapl-total" text-anchor=start x = 60 y=84>RAPL total</text>

    <line class='rapl rapl-domain' x1=10 y1=110 x2=50 y2=110 />
    <text class="rapl rapl-domain" text-anchor=start x = 60 y=114>RAPL domain</text>
</g>


<style>
    rect {
        fill: hsla(30, 10%, 83%, 0.6);
        stroke: black;
        stroke-width: 0.5px;
    }

    line {
        stroke-width: 2px;
    }

    .bmc-power {
        stroke: red;
    }

    text {
        font-size: 15px;
    }



    .bmc-cap {
        stroke-dasharray: 5 5;
        stroke: red;
    }

    .rapl-total {
        stroke: blue;
        fill: blue;
    }

    .rapl-domain {
        stroke: teal;
        fill: teal;
    }

    .bmc {
        fill: red;
    }



</style>
