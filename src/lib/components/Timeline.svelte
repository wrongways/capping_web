<script lang="ts">
    import type { Datapoint } from '$lib/types';
    import * as d3 from 'd3';
    import { setContext } from 'svelte';


    import Chart from './Chart/Chart.svelte';
    import Line from './Chart/Line.svelte';
    import Axis from './Chart/Axis.svelte';
    import Legend from './Chart/Legend.svelte';

    import type { BMCStats, RAPLStats } from '$lib/types';
    import {width, height} from '$lib/stores';
    import {padding} from '$lib/chart_config';


    export let start_time: string;
    export let end_time: string;
    export let cap_time: string;
    export let bmc_stats: BMCStats[];
    export let rapl_totals: RAPLStats[];
    export let rapl_stats: Map<string, number[]>;


    setContext('padding', padding);

    $: start_timestamp = new Date(start_time);
    $: test_duration = (new Date(end_time) - start_timestamp) / 1000;
    $: cap_time_delta = (new Date(cap_time) - start_timestamp) / 1000;
    $: max_y = Math.max(...[bmc_power, bmc_cap, rapl_total_power].flat().map(d => d.y));

    $: bmc_power = make_stat(bmc_stats, d => d.power);
    $: bmc_cap = make_stat(bmc_stats.filter(bmc => bmc.cap_is_active), d => d.cap_limit);
    $: rapl_total_power = make_stat(rapl_totals, d => d.power);


    function make_stat(data: any, accessor: (arg0: any) => number): Datapoint {
        return data.map(d => {
            return {
                x: (new Date(d.timestamp) - start_timestamp) / 1000,
                y: accessor(d),
            } as Datapoint;
        });
    }


    $: x_domain = [0, test_duration];
    $: y_domain = [0, max_y]

    $: x_scale = d3.scaleLinear()
        .domain(x_domain)
        .range([padding.left, $width - padding.right])
        .nice();

    $: y_scale = d3.scaleLinear()
        .domain(y_domain)
        .range([$height - padding.bottom, padding.top])
        .nice();

    $: x = (d: Datapoint) => x_scale(d.x);
    $: y = (d: Datapoint) => y_scale(d.y);

    $: cap_mark = x_scale(cap_time_delta);
    $: console.log("cap time delta", cap_time_delta);
    $: console.log("cap x", cap_mark);


</script>

<section class="timeline" bind:clientWidth={$width}>
    <Chart >
        <Line data={bmc_power} {x} {y} css_class="bmc bmc-power"/>
        <Line data={bmc_cap} {x} {y} css_class="bmc bmc-cap"/>
        <Line data={rapl_total_power} {x} {y} css_class="rapl rapl-total"/>

        {#each [...rapl_stats.values()] as power }
            <Line data={make_stat(power, d => d.power)} {x} {y} css_class="rapl rapl-domain"/>
        {/each}

        <Axis dimension='x' scale={x_scale} label="Time (s)"/>
        <Axis dimension='y' scale={y_scale} label="Power (W)"/>
        <Legend />

        <!-- Cap time line -->
        <line x1={x_scale(cap_time_delta)} y1={$height - padding.bottom} x2={x_scale(cap_time_delta)} y2={padding.top} />
    </Chart>
</section>

<style>
    section {
        width: 100%;
    }

    line {
        stroke: blueviolet;
        stroke-width: 1px;
    }
</style>
