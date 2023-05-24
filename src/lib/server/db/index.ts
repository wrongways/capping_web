import Database from 'better-sqlite3';
import { DB_PATH } from '$env/static/private';
import type { TestDesc, BMCStats, RAPLStats } from '$lib/types';
import { CappingOperation, CappingOrder, TestType, CappingDirection } from '$lib/types';


const db_options = {
    verbose: console.log,
    readonly: true,
    fileMustExist: true,
}

const db = new Database(DB_PATH, db_options);

export function getDescendingLoadTestDescs(operation: CappingOperation, order: CappingOrder, direction: CappingDirection, load_period: number): TestDesc[] {
    const sql_select = `select start_time, end_time, cap_request_time as cap_time, cap_from, cap_to, load_pct as threads_or_load from driver `;

    // where clause
    // if direction == CapDown cap_from > cap_to, otherwise cap_from < cap_to
    const cap_direction_test = direction === CappingDirection.CapDown ? '>' : '<';

    // If the test is decrease load, then load_period is not 0
    const sql_where = `where capping_operation = '${operation}' ` +
        `and capping_order = '${order}' ` +
        `and cap_from ${cap_direction_test} cap_to ` +
        `and load_period = ${load_period} `;

    const sql_order_by = 'order by load_pct desc';
    const sql = sql_select + sql_where + sql_order_by;
    return runTestDescQuery(sql);
}


export function getDescendingThreadsTestDescs(operation: typeof CappingOperation, order: typeof CappingOrder, direction: typeof CappingDirection): TestDesc[] {
    const sql_select = `select start_time, end_time, cap_request_time as cap_time, cap_from, cap_to, n_threads as threads_or_load from driver `;

    // where clause
    // if direction == CapDown cap_from > cap_to, otherwise cap_from < cap_to
    const cap_direction_test = direction === CappingDirection.CapDown ? '>' : '<';

    // If the test is decrease load, then n_threads == 0
    const sql_where = `where capping_operation = '${operation}' ` +
        `and capping_order = '${order}' ` +
        `and n_threads != 0 ` +
        `and cap_from ${cap_direction_test} cap_to `;

    const sql_order_by = 'order by n_threads desc';
    const sql = sql_select + sql_where + sql_order_by;
    return runTestDescQuery(sql);
}


function runTestDescQuery(sql: string): TestDesc[] {
    const stmnt = db.prepare(sql);
    return stmnt.all().map((row: any) => {
        const result = {
            start_time: row.start_time,
            end_time: row.end_time,
            cap_time: row.cap_time,
            cap_from: parseInt(row.cap_from),
            cap_to: parseInt(row.cap_to),
            threads_or_load: parseInt(row.threads_or_load),
        };
        return result as TestDesc;
    });
}


export function getBMCStats(start: string, end: string): BMCStats[] {
    console.log("BMC:", start, end);
    const sql =
        `select timestamp, power, cap_limit, cap_is_active from bmc where timestamp between '${start}' and '${end}' order by timestamp`;
    const stmnt = db.prepare(sql);
    return stmnt.all().map((row: any) => {
        return {
            timestamp: row.timestamp,
            power: parseInt(row.power),
            cap_limit: parseInt(row.cap_limit),
            cap_is_active: row.cap_is_active === 'true',
        }
    });
}

export function getRAPLStats(start: string, end: string): RAPLStats[] {
    console.log("RAPL:", start, end);
    const sql =
        `select timestamp, domain, power_mW / 1000 as power from rapl where timestamp between '${start}' and '${end}' and domain like 'pkg%' order by timestamp, domain`;
    const stmnt = db.prepare(sql);
    return stmnt.all() as RAPLStats[]
}

export function getRAPLTotalPower(start: string, end: string): RAPLStats[] {
    console.log("RAPL:", start, end);
    const sql =
        `select timestamp, sum(power_mW) / 1000 as power from rapl where domain like 'pkg%' and timestamp between '${start}' and '${end}' group by timestamp order by timestamp`;
    const stmnt = db.prepare(sql);
    return stmnt.all() as RAPLStats[]
}



export function getLoadPeriods(): [number] {
    const sql = " select distinct load_period from driver where load_period > 0";
    const stmnt = db.prepare(sql);
    const rows = stmnt.all();
    const load_periods = rows.map(d => d.load_period);
    return load_periods as LoadPeriods;
}

export function getCappingOrders(): [string] {
    const sql = "select distinct capping_order from driver";
    const stmnt = db.prepare(sql);
    const rows = stmnt.all();
    const capping_orders = (rows.map(d => d.capping_order)) as [string];
    return capping_orders;
}