<script lang="ts">
    import type { Datapoint } from '$lib/types';
    import * as d3 from 'd3';


    export let data: Datapoint;
    export let x;
    export let y;
    export let css_class: string;


    $: path = (d3.line()
        .x(x)
        .y(y))(data)

</script>

<g>
    <path d={path} class={css_class}/>
</g>


<style>
    path {
        fill: none;
        stroke-width: 2px;
        stroke: black;
    }

    .bmc {
        stroke: red;
    }

    .bmc-cap {
        stroke-dasharray: 5 5;
    }

    .rapl {
        stroke: blue;
    }

    .rapl-domain {
        stroke: teal;
    }
</style>
