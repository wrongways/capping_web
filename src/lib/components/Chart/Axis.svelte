<script lang="ts">
    import * as d3 from 'd3';
    import { getContext } from 'svelte';
    import {width, height} from '$lib/stores';


    export let dimension: string;  // x or y
    export let label: string;
    export let scale;

    $: n_ticks = ticks_for(dimension);
    $: ticks = scale.ticks(n_ticks);

    const padding = getContext('padding');


    // DANGER: Magic numbers below
    function ticks_for(dimension): number {
        if (dimension === 'x') {
            // return Math.round($width > 600 ? $width / 150 : $width / 100);
            return Math.round($width/150);
        } else if (dimension === 'y') {
            return Math.round($height / 70);
        }
    }
</script>

{#if dimension === 'x'}
    <g class=horizontal>
        <line x1={padding.left} y1={$height - padding.bottom} x2={$width - padding.right} y2={$height - padding.bottom} />
        {#each ticks as tick}
            <text transform="translate({scale(tick)-7}, { $height - padding.bottom + 23})">{tick}</text>
            <line x1={scale(tick)} y1={$height - padding.bottom + 10} x2={scale(tick)} y2={$height - padding.bottom} />
        {/each}

        {#if label}
            <text text-anchor=middle
                x = {padding.left + ($width - padding.left - padding.right) / 2}
                y = {$height - 10}
            >
                {label}
            </text>
        {/if}
    </g>

{:else if dimension === 'y'}
    <g class=vertical>
        <line x1={padding.left} y1={$height - padding.bottom} x2={padding.left} y2={padding.top} />
        {#each ticks as tick}
            <text text-anchor=end transform="translate({padding.left / 1.2}, { scale(tick) + 4 })">{tick}</text>
            <line x1={padding.left / 1.1} y1={scale(tick)} x2={padding.left} y2={scale(tick)} />
        {/each}

        {#if label}
            <text text-anchor=middle
                x = 5
                y = {padding.top + 15 + ($height - padding.top - padding.bottom) / 2}
                transform="rotate(-90, 5, {padding.top + ($height - padding.top - padding.bottom) / 2})"
            >
                {label}
            </text>
        {/if}
    </g>
{:else}
    <text>Only want 'x' or 'y' for dimension</text>
{/if}



<style>
    line {
        stroke: rebeccapurple;
        stroke-width: 1px;
    }
</style>
