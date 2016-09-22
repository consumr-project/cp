import { interval as river_interval } from './river';
import { Minute } from '../lang';

const RIVER_REFRESH_RATE = Minute * 15;

switch (process.argv[2]) {
    case 'river':
        river_interval(RIVER_REFRESH_RATE);
        break;

    default:
        console.log(`Invalid option ${process.argv[2]}`);
        process.exit(1);
        break;
}
