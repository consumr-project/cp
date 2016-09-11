import * as amqp from 'amqplib';
import * as config from 'acm';

const RABBITMQ_URL = config('rabbitmq.url');
const RABBITMQ_HOST = `amqp://${config('rabbitmq.host')}`;

export default function () {
    return amqp.connect(RABBITMQ_URL || RABBITMQ_HOST);
}
