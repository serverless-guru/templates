// EsLint Rule
// https://eslint.org/docs/rules/max-lines-per-function


const m = () => 3
const data = []

module.exports.main = function() {
    return m("div", [
        m("table", {className: "table table-striped latest-data"}, [
            m("tbody",
                data.map(function(db) {
                    return m("tr", {key: db.dbname}, [
                        m("td", {className: "dbname"}, db.dbname),
                        m("td", {className: "query-count"},  [
                            m("span", {className: db.lastSample.countClassName}, db.lastSample.nbQueries)
                        ])
                    ])
                })
            )
        ])
    ])
}