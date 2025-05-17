export interface Database {
    connect(): Promise<void>,
    query<T = unknown>(sql: string, params: unknown[]): Promise<T[] | null>,
    run(sql: string, params: unknown[]): Promise<boolean>,
}
