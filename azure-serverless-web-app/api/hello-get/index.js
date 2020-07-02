module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    context.res = {
        status: 200, 
        body: { message: 'Hello there!' } 
    };
};