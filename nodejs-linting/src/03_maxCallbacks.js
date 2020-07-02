const foo1 = cb => cb()
const foo2 = cb => cb()
const foo3 = cb => cb()
// const foo4 = cb => cb()

foo1(function () {
    foo2(function () {
        foo3(function () {
            // foo4(function () {
            //     // Do something
            // })
        })
    })
})