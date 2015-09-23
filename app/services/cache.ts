/// <reference path="../../typings/tsd.d.ts"/>

import * as Q from 'q';

type LoaderFunction<T> = (id: string) => Q.Promise<T>;
type CacheDict<T> = { [id: string]: T };

interface AsyncStorageEngine {
    setItem(id: string, val: any);
    getItem(id: string): any;
}

export class Cache<T> {
    loader: LoaderFunction<T>;
    memory: CacheDict<T> = {};
    ttl: number = 1000 * 60 * 15;

    constructor(loader: LoaderFunction<T>) {
        this.loader = loader;
    }

    has(id: string): Boolean {
        return id in this.memory;
    }

    set(id: string, val: T): T {
        this.memory[id] = val;
        return val;
    }

    get(id: string): Q.Promise<T> {
        var def: Q.Deferred<T> = Q.defer<T>();
        def.resolve(this.memory[id]);
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
    constructor(loader: LoaderFunction<T>) {
        super(loader, localStorage, 'LocalStorageCache');
    }

    get(id: string): Q.Promise<T> {
        return this.has(id) ? super.get(id) :
            this.loader(id).then((val: T) => super.set(id, val));
    }
}
