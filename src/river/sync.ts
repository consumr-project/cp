import { UUID, scalar } from '../lang';

export interface GetterOptions {
    since: Date | number;
}

export interface GetterFunction {
    (client, def: LinkDefinition, opt: GetterOptions): Promise<EntryDefinition[]>;
}

export interface UpdaterAck {
    ok: boolean;
    def: LinkDefinition;
}

export interface UpdaterFunction {
    (client, def: LinkDefinition, data: EntryDefinition[]): Promise<UpdaterAck>;
}

export interface EntryDefinition {
    __id: UUID;
    __deleted: boolean;
    __created: boolean;
    __label: string;
    [field: string]: scalar;
}

export class LinkDefinition {
    constructor(
        public name: string,
        public fields: string[] = [],
        public soft_delete = true,
        public field_primary_key = 'id',
        public field_label = 'name'
    ) {}
}
