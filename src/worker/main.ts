import river from './river';
import { Minute } from '../lang';

switch (process.argv[2]) {
    case 'river':
        /* setInterval(() => { */
        river(Minute * 60 * 10000);
        /* } , 5000); */
        break;

    default:
        console.log(`Invalid option ${process.argv[2]}`);
        process.exit(1);
        break;
}
