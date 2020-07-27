const button = document.getElementById('make-payment')
const status = document.getElementById('status')

const endpoints = {
    start: 'YOUR_ENDPOINT/start',
    poll: 'YOUR_ENDPOINT/poll'
}

const appendChild = (id, text) => {
    var node = document.createElement("p")
    var textnode = document.createTextNode(text)
    node.appendChild(textnode)
    document.getElementById(id).appendChild(node)
}

const ui = {
    submitting: () => {
        appendChild('status', 'Submitting...')
    },

    addPending: () => {
        appendChild('status', 'polling...')
    },

    finalStatus: (x) => {
        if (x.status === 'COMPLETE') {
            appendChild('status', 'Success: ' + JSON.stringify(x.data))
        } else if (x.status === 'ERROR') {
            appendChild('status', 'Error: ' + JSON.stringify(x.data))
        } else {
            appendChild('status', 'Error: There was an issue on our end')
        }
    },

    timeout: () => {
        appendChild('status', 'Server is unavailable')
    },

    error: (e) => {
        appendChild('status', 'There was an issue: ' + e.message)
    }
}



const poll = (id, times) => {
    fetch(endpoints.poll, {
        method: 'post',
        body: JSON.stringify({
            userId: '1234',
            pollId: id
        })
    })
        .then(x => x.json())
        .then(x => {
            if (times > 6) {
                ui.timeout()
                return
            }

            if (x.status === 'PENDING') {
                ui.addPending()

                setTimeout(() => {
                    poll(id, times + 1)
                }, 2000)
                return
            }


            ui.finalStatus(x)
        })
        .catch(ui.error)
}



button.addEventListener('click', () => {
    ui.submitting()
    fetch(endpoints.start, {
        method: 'post',
        body: JSON.stringify({
            userId: '1234'
        })
    })
        .then(x => {
            if (x.status === 400) {
                throw new Error('Invalid input')
            }

            return x.json()
        })
        .then(x => {
            poll(x.pollId, 0)
        })
        .catch(ui.error)

})