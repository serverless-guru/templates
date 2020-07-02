module.exports = {
    getData: async () => {
        return {
            id: 'product_1234',
            name: 'Dark Coffee',
            price: 200,
            stock: 150000,
            popularity: 34,
            stores: [
                'store_1234',
                'store_1236',
                'store_1237',
                'store_1240',
                'store_1258'
            ]
        }
    }
}