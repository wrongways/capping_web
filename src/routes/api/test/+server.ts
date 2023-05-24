import { getDescendingLoadTestDescs, getDescendingThreadsTestDescs } from '$lib/server/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { TestType, CappingOperation, CappingOrder, CappingDirection } from '$lib/types';

export const GET: RequestHandler = ({ url }) => {
    const test_type = TestType[url.searchParams.get('testType') ?? 'DecreasingLoad'] as TestType;
    const operation = CappingOperation[url.searchParams.get('operation') ?? 'Activate'] as CappingOperation;
    const order = CappingOrder[url.searchParams.get('order') ?? 'LevelBeforeActivate'] as CappingOrder;
    const direction = CappingDirection[url.searchParams.get('direction') ?? 'CapDown'] as CappingDirection;
    const load_period = parseInt(url.searchParams.get('loadPeriod') ?? "0") ?? 0;
    console.log("Test params", test_type, operation, order, direction);

    if (test_type === TestType.DecreasingLoad) {
        return json(getDescendingLoadTestDescs(operation, order, direction, load_period));
    } else {
        return json(getDescendingThreadsTestDescs(operation, order, direction));
    }

}