export type UUID = string;
export type scalar = number | string | boolean;
export type Date2 = Date | number;

export type Duration = number;

export const Millisecond: Duration = 1;
export const Second = Millisecond * 1000;
export const Minute = Second * 60;
export const Hour = Minute * 60;
