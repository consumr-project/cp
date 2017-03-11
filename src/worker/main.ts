import { run as river_run, interval as river_interval } from './river';
import { Minute } from '../lang';
import * as toes from '../toe';

const ARGV = process.argv;
const DEFAULT_RATE = Minute * 15;

var command = ARGV[2];
var rate = ARGV[3] ? parseInt(ARGV[3]) : DEFAULT_RATE;

toes.initialize(Math.random().toString(), () => {
    switch (command) {
        case 'river:interval':
            river_interval(rate);
            break;

        case 'river:reindex':
            river_run(Date.now(), 'reindex', 0)
                .then(() => process.exit(0))
                .catch(() => process.exit(1));
            break;

        case 'river':
            river_run(rate, 'oneoff', 0)
                .then(() => process.exit(0))
                .catch(() => process.exit(1));
            break;

        default:
            console.log(`Invalid option ${command}`);
            process.exit(1);
            break;
    }
});
