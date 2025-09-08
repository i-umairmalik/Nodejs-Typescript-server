export interface IConfigProvider {
    get(key: string): any;
    env(): IConfigProvider;
    argv(): IConfigProvider;
    file(options: { file: string }): IConfigProvider;
    set(key: string, value: any): void;
    has(key: string): boolean;
    getAll(): any;
}