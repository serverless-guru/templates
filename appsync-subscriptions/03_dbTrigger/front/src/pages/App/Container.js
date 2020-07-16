import React, { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import PresentationSuccess from './PresentationSuccess'
import PresentationLoading from './PresentationLoading'
import PresentationEmpty from './PresentationEmpty'
import PresentationError from './PresentationError'
import { v4 as uuid } from 'uuid'

const GET_ITEMS = `
  query getProfile {
    getProfile {
        PK
        status
        SK
        favouriteColor
        favouriteCity
        lastUpdated
    }
  }
`

const CREATE_ITEM = `
  mutation createProfile($createProfileInput: CreateProfileInput!) {
    createProfile(input: $createProfileInput) {
            PK
            status
            SK
        }
    }
`

const SUBSCRIPTION = `
    subscription OnCompleted($PK: String, $SK: String) {
        onCompleted(PK: $PK, SK: $SK) {
            PK
            status
            SK
            favouriteColor
            favouriteCity
            lastUpdated
        }
    }
`

let userId = 'user_1234'
let eventId = 'task_' + uuid()

function App() {
    const [state, updateState] = useState('loading')
    const [data, updateData] = useState({
        favouriteColor: 'default value',
        favouriteCity: 'default value',
        lastUpdated: 'never',
        status: 'none'
    })

    const [sendingStatus, sending] = useState(false)

    useEffect(() => {
        (async () => {
            try {
                const getResult = await API.graphql(graphqlOperation(GET_ITEMS))
                const item = getResult.data.getProfile

                if (item) {
                    updateData(item)
                }

                updateState('loaded')
                API.graphql(
                    graphqlOperation(SUBSCRIPTION, { PK: userId, SK: 'profile' })
                ).subscribe({
                    next: (todoData) => {
                        console.log('SUBSCRIBED EVENT', todoData.value.data.onCompleted);
                        updateData(todoData.value.data.onCompleted)
                        sending(false)
                    }
                })
            } catch (e) {
                console.log('err ', e)

            }
        })()
    }, [])

    const createItem = () => {
        sending(true)
        API.graphql(graphqlOperation(CREATE_ITEM, {
            "createProfileInput": {
                "PK": userId,
                "status": "PROCESSING",
                "SK": eventId
            }
        }))
    }

    if (state === 'loading') return <PresentationLoading />
    if (state === 'error') return <PresentationError />
    if (data.status === 'none') {
        return <PresentationEmpty
            create={createItem}
            sendingStatus={sendingStatus}
        />
    }

    return <PresentationSuccess
        profile={data}
        create={createItem}
        sendingStatus={sendingStatus}
    />
}

export default App
