import { getRAPLStats, getRAPLTotalPower } from '$lib/server/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url }) => {
    const start_time = url.searchParams.get('startTime');
    const end_time = url.searchParams.get('endTime');
    const totals = url.searchParams.get('totals') === 'true';

    let query;
    if (totals) {
        query = getRAPLTotalPower;
    } else {
        query = getRAPLStats;
    }
    return json(query(start_time, end_time)) ?? [];
}