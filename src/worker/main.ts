import river from './river';

switch (process.argv[2]) {
    case 'river':
        river();
        break;

    default:
        console.log(`Invalid option ${process.argv[2]}`);
        process.exit(1);
        break;
}
