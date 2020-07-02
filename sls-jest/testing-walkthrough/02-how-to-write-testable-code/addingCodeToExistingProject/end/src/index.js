const userSession = require('./userSession');
const tripDb = require('./tripDb');

const addDaysLeft = arr => {
    const day = 86400000
    const getTimeLeft = x => (x.startDate - Date.now()) / day
    
    return arr.map(x => ({
        ...x,
        daysLeft: x.startDate ? getTimeLeft(x) : 'NA'
    }))
}


const handler = async (user) => {
    let tripList = [];
    let loggedUser = userSession.getLoggedUser();
    let isFriend = false;
    if (loggedUser != null) {
        let friends = user.getFriends();
        for (let i=0; i < friends.length; i++) {
            let friend = friends[i];
            if (friend == loggedUser) {
                isFriend = true;
                break;
            }
        };
        if (isFriend) {
            tripList = tripDb.findTripsByUser(user)
        }   
        
        return addDaysLeft(tripList)
    } else {
        throw new Error('User not logged in.')
    }
}

exports.addDaysLeft = addDaysLeft
exports.handler = handler

