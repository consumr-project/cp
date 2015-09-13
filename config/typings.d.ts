declare module "reqwest" {
    function reqwest<T>(req: { url: string; type: string; }): Q.Promise<T>;
    export = reqwest
}
