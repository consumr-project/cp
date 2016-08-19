import { Request, Response } from 'express';

export type ServiceRequestHandler = (req: Request, res: Response, next: (err?: Error) => {}) => void;
export type ServiceRequestPromise<T> = (req: Request, res: Response, next: (err?: Error) => {}) => Promise<T>;

export interface ServiceResultMetadata {
    ok: boolean;
    took?: number;
    from_cache?: boolean;
    message?: string;
}

export interface ServiceResponseV1<T> {
    body: T | T[] | { [index: string]: T };
    meta: ServiceResultMetadata;
}
