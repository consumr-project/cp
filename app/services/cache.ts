/// <reference path="../../typings/tsd.d.ts"/>

import * as Q from 'q';

type LoaderFunction<T> = (id: string) => Q.Promise<T>;
type CacheItem<T> = { val: T, ttt: number };
type CacheDict<T> = { [id: string]: CacheItem<T> };

interface AsyncStorageEngine {
    setItem(id: string, val: any);
    getItem(id: string): any;
}

export class Cache<T> {
    loader: LoaderFunction<T>;
    memory: CacheDict<T> = {};
    timers: { [id: string]: number } = {};
    ttl: number = 1000 * 60 * 15;

    constructor(loader: LoaderFunction<T>) {
        this.loader = loader;
    }

    queueRemoval(id: string): void {
        clearTimeout(this.timers[id]);
        this.timers[id] = setTimeout(() => {
            delete this.memory[id];
            this.write();
        }, this.ttl);
    }

    write(): void {
        // pass
    }

    has(id: string): Boolean {
        return id in this.memory && this.memory[id].ttt < Date.now();
    }

    set(id: string, val: T): T {
        var ttt = this.ttl + Date.now();
        this.memory[id] = { val, ttt };
        return val;
    }

    get(id: string): Q.Promise<T> {
        var def: Q.Deferred<T> = Q.defer<T>();
        def.resolve(this.memory[id].val);
        return def.promise;
    }
}

export class AsyncStorageCache<T> extends Cache<T> {
    storage: AsyncStorageEngine;
    key: string;

    constructor(loader: LoaderFunction<T>, storage: AsyncStorageEngine, key: string = 'AsyncStorageEngine') {
        super(loader);
        this.storage = storage;
        this.key = key;
        this.memory = this.read();
    }

    set(id: string, val: T): T {
        super.set(id, val);
        this.write();
        return val;
    }

    read(): CacheDict<T> {
        return JSON.parse(this.storage.getItem(this.key)) || {};
    }

    write(): void {
        this.storage.setItem(this.key, JSON.stringify(this.memory));
    }
}

export class LocalStorageCache<T> extends AsyncStorageCache<T> {
    constructor(loader: LoaderFunction<T>, key: string = 'LocalStorageCache') {
        super(loader, localStorage, key);
    }

    get(id: string): Q.Promise<T> {
        return this.has(id) ? super.get(id) :
            this.loader(id).then((val: T) => super.set(id, val));
    }
}
