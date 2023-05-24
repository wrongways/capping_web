import type { CappingOperation, CappingDirection } from '$lib/types';
import { TestType } from '$lib/types';


const DESC_API = '/api/test/';
const BMC_API = '/api/bmc_stats/';
const RAPL_API = '/api/rapl_stats/';


export const fetchBMCStats = (async (start: string, end: string) => {
    const query = `${BMC_API}?startTime=${start}&endTime=${end}`;
    const response = await fetch(query);
    const data = await response.json();
    return data;
});

export const fetchRAPLStats = async (start: string, end: string, totals: boolean) => {
    const query = `${RAPL_API}?startTime=${start}&endTime=${end}&totals=${totals}`;
    const response = await fetch(query);
    const data = await response.json();
    return data;
}

export const fetchDescendingLoadTestDescs = async (
    capping_operation: string,
    capping_order: string,
    capping_direction: string,
    load_period: number
) => {
    console.log("fetchDescendingLoadTestDescs() capping order", capping_order);
    const query = `?testType=${TestType.DecreasingLoad}` +
        `&operation=${capping_operation}` +
        `&order=${capping_order}` +
        `&direction=${capping_direction}` +
        `&loadPeriod=${load_period}`;

    const endpoint = DESC_API + query;
    const response = await fetch(endpoint);
    const data = await response.json();
    return data;
}

export const fetchDescendingThreadsTestDescs = async (
    capping_operation: string,
    capping_order: string,
    capping_direction: string,
) => {
    const query = `?testType=${TestType.DecreasingThreads}` +
        `&operation=${capping_operation}` +
        `&order=${capping_order}` +
        `&direction=${capping_direction}`;

    const endpoint = DESC_API + query;
    const response = await fetch(endpoint);
    const data = await response.json();
    return data;
}