// module.exports = (fn) => {
//     return (req, res, next) => {
//         // Controllers may be synchronous (for example, rendering a form) or
//         // asynchronous. Promise.resolve ensures both kinds are handled without
//         // trying to call `.catch` on an undefined return value.
//         Promise.resolve()
//             .then(() => fn(req, res, next))
//             .catch(next);
//     }
// }
module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    }
}