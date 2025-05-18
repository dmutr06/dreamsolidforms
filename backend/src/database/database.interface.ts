export interface Database {
    connect(): Promise<void>,
    query<T = unknown>(sql: string, params: unknown[]): Promise<T[]>,
    run(sql: string, params: unknown[]): Promise<boolean>,
}
