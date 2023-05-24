import { getLoadPeriods, getCappingOrders, getDescendingLoadTestDescs, getBMCStats, getRAPLStats, getRAPLTotalPower } from '$lib/server/db';
import { TestType, CappingDirection, CappingOrder, CappingOperation } from '$lib/types';

export const load = () => {

    const test_type = TestType.DecreasingLoad;
    const capping_operation = CappingOperation.Activate;
    const capping_direction = CappingDirection.CapDown;
    const load_periods = getLoadPeriods();
    const capping_orders = getCappingOrders();
    const test_descriptions = getDescendingLoadTestDescs(capping_operation, capping_orders[0], capping_direction, load_periods[0]);

    const start_time = test_descriptions[0].start_time;
    const end_time = test_descriptions[0].end_time;
    const cap_time = test_descriptions[0].cap_time;

    const bmc_stats = getBMCStats(start_time, end_time);
    const rapl_stats = getRAPLStats(start_time, end_time);
    const rapl_totals = getRAPLTotalPower(start_time, end_time);

    return {
        test_type,
        test_descriptions,
        bmc_stats,
        rapl_stats,
        rapl_totals,
        load_periods,
        capping_orders,
    };
};