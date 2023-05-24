export type TestDesc = {
    start_time: string,
    end_time: string,
    cap_time: string,
    cap_from: number,
    cap_to: number,
    threads_or_load: number,
}


export type BMCStats = {
    timestamp: Date,
    power: number,
    cap_limit: number,
    cap_is_active: boolean,
}

export type RAPLStats = {
    timestamp: Date,
    domain: string,
    power: number,
}

export type Datapoint = {
    x: number,
    y: number,
};


export const CappingOperation = {
    Activate: 'Activate',
    Deactivate: 'Deactivate',
};

export const CappingOrder = {
    LevelBeforeActivate: 'LevelBeforeActivate',
    LevelAfterActivate: 'LevelAfterActivate',
    LevelToLevel: 'LevelToLevel',
}

export const TestType = {
    DecreasingLoad: 'DecreasingLoad',
    DecreasingThreads: 'DecreasingThreads',
};

export enum CappingDirection {
    CapUp = 'CapUp',
    CapDown = 'CapDown',
};