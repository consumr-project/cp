import { UUID, scalar } from '../lang';

export interface GetterOptions {
    since: Date | number;
}

export interface GetterFunction {
    (client: any, def: LinkDefinition, opt: GetterOptions): Promise<EntryDefinition[]>;
}

export interface UpdaterAck {
    ok: boolean;
    def: LinkDefinition;
}

export interface UpdaterFunction {
    (client: any, def: LinkDefinition, data: EntryDefinition[]): Promise<UpdaterAck>;
}

export interface EntryDefinition {
    __id: UUID;
    __deleted: boolean;
    __created: boolean;
    __label: string;
    [field: string]: scalar;
}

export interface LinkConfiguration {
    name: string;
    fields?: string[];
    query_file?: string;
    soft_delete?: boolean;
    primary_key?: string;
    label?: string;
}

export class LinkDefinition {
    constructor(
        public name: string,
        public fields: string[] = [],
        public query_file: string = null,
        public soft_delete = true,
        public field_primary_key = 'id',
        public field_label = 'name'
    ) {}
}
