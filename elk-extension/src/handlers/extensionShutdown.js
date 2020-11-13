exports.handler = async event => {
    console.log('event', event);
    console.log('triggered from the lambda container shutdown trigger firing..');
    console.log('push logs to ELK');
    return event;
};