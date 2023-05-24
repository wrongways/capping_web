<script lang="ts">
    import {scale, fade} from 'svelte/transition';
    import type {PageData} from './$types';
    import type { RAPLStats } from '$lib/types';
    import {TestType, CappingDirection, CappingOperation, CappingOrder} from '$lib/types';
    import {fetchBMCStats, fetchRAPLStats, fetchDescendingLoadTestDescs, fetchDescendingThreadsTestDescs} from '$lib/utils';
    import Timeline from '$lib/components/Timeline.svelte';


    export let data: PageData;
    let {
        test_type,
        test_descriptions,
        bmc_stats,
        rapl_stats,
        rapl_totals,
        load_periods,
        capping_orders,
    } = data;


    // change test_id: changes load % or n_threads
    const change_test_id = async ({target}) => {
        test_id += (target?.innerText === "+") ? 1 : -1;
        bmc_stats = await fetchBMCStats(current_test.start_time, current_test.end_time);
        refresh_data(test_id);
    }


    const change_test_type = async () => {
        test_id = 0;
        console.log("change_test_type() capping order:", capping_order);
        if (test_type === TestType.DecreasingLoad) {
            test_descriptions = await fetchDescendingLoadTestDescs(capping_operation, capping_order, capping_direction, load_period);
        } else {
            test_descriptions = await fetchDescendingThreadsTestDescs(capping_operation, capping_order, capping_direction);
        }
        refresh_data(test_id);
    }

    async function refresh_data(test_id: number) {
        current_test = test_descriptions[test_id];
        bmc_stats = await fetchBMCStats(current_test.start_time, current_test.end_time);
        rapl_stats = await fetchRAPLStats(current_test.start_time, current_test.end_time, false);
        rapl_totals = await fetchRAPLStats(current_test.start_time, current_test.end_time, true);
    }

    function rapl_power_by_domain(stats: RAPLStats[]): Map<string, {x:number, y:number}[]> {
        const power_by_domain = new Map();

        const domains = new Set(stats.map(item => item.domain));
        domains.forEach(domain =>
            power_by_domain.set(domain,
                stats.filter(d => d.domain === domain)
                    .map(s => {return {timestamp: s.timestamp, power: s.power}})));
        return power_by_domain;
    }

    let test_id = 0;
    $: max_test_id = test_descriptions.length - 1;

    let current_test = test_descriptions[test_id];
    $: capping_operation = CappingOperation.Activate;
    $: capping_order = capping_orders[0];
    $: capping_direction = CappingDirection.CapDown;
    $: load_period = load_periods[0];

    const test_types: string[] = [TestType.DecreasingLoad, TestType.DecreasingThreads];
    const capping_operations: string[] = [CappingOperation.Activate, CappingOperation.Deactivate];
    const capping_directions: string[] = [CappingDirection.CapDown, CappingDirection.CapUp];


</script>

<h1>Capping study</h1>


<table>
    <tr>
        <td>test id</td>
        <td>{test_id}
    </tr>

    <tr>
        <td>test type</td>
        <td>{test_type}
    </tr>


    <tr>
        <td>start</td>
        <td>{current_test.start_time}</td>
    </tr>

    <tr>
        <td>
            {#if test_type === TestType.DecreasingLoad}
                Load%
            {:else}
                n threads
            {/if}
        </td>
        <td>{current_test.threads_or_load}</td>
    </tr>

    <tr>
        <td>cap from</td>
        <td>{current_test.cap_from}</td>
    </tr>

    <tr>
        <td>cap to</td>
        <td>{current_test.cap_to}</td>
    </tr>

</table>

<button name=back on:click={change_test_id} disabled={test_id === 0}>-</button>
<button name=forward on:click={change_test_id} disabled={test_id === max_test_id}>+</button>

<!-- <table class=bmc_stats>
    <thead>
        <tr>
            <th>Time</th>
            <th>Power</th>
            <th>Cap</th>
            <th>Cap active</th>
        </tr>
    </thead>
    {#each bmc_stats as bmc}
        <tr>
            <td>{Math.round((new Date(bmc.timestamp) - new Date(current_test.start_time))/1000)}</td>
            <td>{bmc.power}</td>
            <td>{bmc.cap_limit}</td>
            <td>{bmc.cap_is_active}</td>
        </tr>
    {/each}

</table> -->

<hr>

<br>
<section>
    <label for=test_type>Test type</label>
    <select name=test_type id=test_type bind:value={test_type} on:change={change_test_type}>
        {#each test_types as test_type }
            <option value={test_type}>{test_type}</option>
        {/each}
    </select>

    <label for=capping_operation>Operation</label>
    <select name=capping_operation id=capping_operation bind:value={capping_operation} on:change={change_test_type}>
        {#each capping_operations as operation }
            <option value={operation}>{operation}</option>
        {/each}
    </select>

    <label for=capping_order>Cap order</label>
    <select name=capping_order id=capping_order bind:value={capping_order} on:change={change_test_type}>
        {#each capping_orders as order }
            <option value={order}>{order}</option>
        {/each}
    </select>

    <label for=capping_direction>Cap direction</label>
    <select name=capping_direction id=capping_direction bind:value={capping_direction} on:change={change_test_type}>
        {#each capping_directions as direction }
            <option value={direction}>{direction}</option>
        {/each}
    </select>

    {#if test_type === TestType.DecreasingLoad}
        <label for=load_period transition:fade>Load period</label>
        <select name=load_period id=load_period bind:value={load_period} on:change={change_test_type} transition:scale>
            {#each load_periods as period }
                <option value={period}>{period.toLocaleString()} µs</option>
            {/each}
        </select>
    {/if}
</section>

<Timeline
    start_time={current_test.start_time}
    end_time={current_test.end_time}
    cap_time={current_test.cap_time}
    {bmc_stats}
    {rapl_totals}
    rapl_stats={rapl_power_by_domain(rapl_stats)}
/>

<style>
    table {
        display: inline;
        table-layout: fixed;
        border-collapse: collapse;
    }

    section {
        margin-top: 2rem;
    }
    label:not(:nth-of-type(1)) {
        margin-left: 30px;
    }

    hr {
        width: 65%;
        margin-left: 0;
    }
</style>
