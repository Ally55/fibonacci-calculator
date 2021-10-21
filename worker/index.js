const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000 
    // if loses connection, retry to connect to the server one at every 1 sec
});

const sub = redisClient.duplicate();

function fibonacci(index) {
    if (index < 2) return 1;
    return fibonacci(index - 1) + fibonacci(index - 2);
}

// everytime the redis server get the message, calculate fibonacci
sub.on('message', (channel) => {
    redisClient.hset('values', message, fibonacci(parseInt(message)));
}); 
sub.subscribe('insert');


