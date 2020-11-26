const EXTENSION_LOG_DESTINATIONS = process.env.EXTENSION_LOG_DESTINATIONS;

const registeredDestinations = () => {
    if (!EXTENSION_LOG_DESTINATIONS) {
        return [];
    }

    return EXTENSION_LOG_DESTINATIONS.split(",").map((destinationName) => {
        try {
            const destination = require(`./${destinationName}.js`)

            if (!destination.hasOwnProperty('sendLogs')) {
                return null;
            }

            return destination;
        } catch (e) {
            return null;
        }
    }).filter(Boolean)
}

module.exports = {
    registeredDestinations
};