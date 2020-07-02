// See https://jsdoc.app/tags-param.html

/**
 * GetProps
 * 
 * @param {string|number[]} p - List of props representing the path to property
 * @param {object} o - Any object you want to extrat a property out of.
 * @returns {*}
 *  
 * Takes an array of strings and numbers to safely get 
 * props out of an object
 * 
 */
const path = (p, o) =>
    p.reduce((xs, x) =>
        (xs && xs[x]) ? xs[x] : null, o)


module.exports = {
    path
}