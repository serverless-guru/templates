const io = require('../../io')
const domain = require('../index')

test('example unit test', async () => {
    /**
     * Mocking the IO
     * 
     * We are importing our io helper functions in to this test, but are passing
     * a true flag to it, which means we get the mocked version of the IO rather
     * than the real.
     */
    const mockIO = io(true)


    /**
     * Mock Input
     * 
     * This is simply passing a input to our function we want to test
     */
    const mockInput = {
        id: '1234',
        name: 'Product 1'
    }

    
    /**
     * Running our domain function with mocked input
     * 
     * Here we first setup our domain with our mock io,
     * we then call our create method with out mock input
     * 
     */
    const result = await domain(mockIO).create(mockInput)
    expect(result.id).toBe('1234')
    expect(result.name).toBe('Product 1')
    expect(result.time).toBeTruthy()
    expect(result.service).toBe('Service A')
})