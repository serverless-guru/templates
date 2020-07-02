const endpointsMap = endpoint => ({
    endpoint1: endpoint + '/',
    endpoint2: endpoint + '/two',
})

const endpoints = endpointsMap(process.env.ENDPOINT)
const key = process.env.KEY

console.log('1: ', endpoints.endpoint1)
console.log('2: ', endpoints.endpoint2)

document.getElementById('button')
    .addEventListener('click', () => alert('clicked'))

window
    .fetch(endpoints.endpoint1)
    .then(x => x.json())
    .then(x => {
        console.log('RESULT: ', x)
    })