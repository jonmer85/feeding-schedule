'use strict'
const app = require('./app');

const PORT = process.env.PORT || 5000;

const start = () => {
    app.listen(PORT, () => {
        console.log(`Listening on port: ${PORT}`);
    })
}

const stop = module.exports = () => {
    app.close(PORT, () => {
        console.log(`Shut down on port: ${PORT}`)
    })
}

module.exports = {
    start,
    stop,
}

