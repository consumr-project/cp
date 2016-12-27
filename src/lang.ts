export type UUID = string;
export type scalar = number | string | boolean;
export type Date2 = Date | number;

export type Lambda<V, T> = (...args: V[]) => T;
export type Lambda1<V1, T> = (arg1: V1) => T;
export type Lambda2<V1, V2, T> = (arg1: V1, arg2: V2) => T;
export type Lambda3<V1, V2, V3, T> = (arg1: V1, arg2: V2, arg3: V3) => T;
export type ErrorHandler = Lambda<Error | null, null>;

export type Duration = number;

export const Millisecond: Duration = 1;
export const Second = Millisecond * 1000;
export const Minute = Second * 60;
export const Hour = Minute * 60;
export const Day = Hour * 24;
