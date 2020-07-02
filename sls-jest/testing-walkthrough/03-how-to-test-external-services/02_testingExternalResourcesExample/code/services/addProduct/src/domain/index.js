module.exports = io => ({
    create: async data => {

        const addedProduct = await io.addProduct({
            id: data.id,
            name: data.name
        })

        const output = {
            ...addedProduct,
            time: Date.now(),
            service: 'Service A'
        }

        return output
    }
})