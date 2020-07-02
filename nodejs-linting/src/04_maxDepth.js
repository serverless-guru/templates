// EsLint Rule
// https://eslint.org/docs/rules/max-depth

/*eslint max-depth: ["error", 4]*/
/*eslint max-lines-per-function: ["error", 100]*/

const x = true
module.exports.main = () => {
    for (;;) { // Nested 1 deep
        while (x) { // Nested 2 deep
            if (x) { // Nested 3 deep
                if (x) { // Nested 4 deep
                    if (x) { // Nested 5 deep
                    }
                }
            }
        }
    }
}

