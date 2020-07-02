module.exports = {
    postDataToExternalService: () => {
        return new Promise((res, rej) => {
            setTimeout(() => {
                res({
                    details: 'mock details'
                })
            }, 8000)
        })
    }
}