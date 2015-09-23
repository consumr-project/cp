/// <reference path="../../typings/tsd.d.ts"/>

import * as Q from 'q';

interface LoaderFunction<T> {
    (id: string): Q.Promise<T>;
}

interface CacheItem<T> {
    val: T;
    ttt: number;
}

interface CacheDict<T> {
    [id: string]: CacheItem<T>;
}

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

        for (var id in this.memory) {
            if (!this.memory.hasOwnProperty(id)) {
                continue;
            }

            if (this.has(id)) {
                this.queueRemoval(id);
            } else {
                this.remove(id);
            }
        }
    }

    queueRemoval(id: string): void {
        clearTimeout(this.timers[id]);
        this.timers[id] = setTimeout(() => this.remove(id), this.ttl);
    }

    has(id: string): Boolean {
        return id in this.memory && this.memory[id].ttt > Date.now();
    }

    remove(id: string): void {
        delete this.memory[id];
    }

    set(id: string, val: T): T {
        var ttt = this.ttl + Date.now();
        this.memory[id] = { val, ttt };
        this.queueRemoval(id);
        return val;
    }

    get(id: string): Q.Promise<T> {
        var def: Q.Deferred<T> = Q.defer<T>();
        def.resolve(this.memory[id].val);
        this.queueRemoval(id);
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

    remove(id: string): void {
        super.remove(id);
        this.write();
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
