import { getBMCStats } from '$lib/server/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url }) => {
    console.log("Getting BMC stats")
    const start_time = url.searchParams.get('startTime');
    const end_time = url.searchParams.get('endTime');
    console.log("BMC Start time", start_time, "end time:", end_time);

    const db_response = getBMCStats(start_time, end_time);
    return json(db_response) ?? [];
}