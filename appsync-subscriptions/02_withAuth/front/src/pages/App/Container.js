import React, { useState, useEffect } from 'react';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import auth from '../../lib/Auth'
import PresentationSuccess from './PresentationSuccess'
import PresentationLoading from './PresentationLoading'
import PresentationEmpty from './PresentationEmpty'
import PresentationError from './PresentationError'
import { v4 as uuid } from 'uuid'

const GET_ITEMS = `
  query listTasks {
    listTasks {
        PK
        status
        SK
    }
  }
`

const CREATE_ITEM = `
  mutation createTask($createTaskinput: CreateTaskInput!) {
    createTask(input: $createTaskinput) {
            PK
            status
            SK
        }
    }
`

const UPDATE_TO_COMPLETED = `
  mutation updateToComplete($createTaskinput: UpdateTaskInput!) {
    updateToComplete(input: $createTaskinput) {
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
        }
    }
`

let userId = 'user_1234'
let eventId = 'task_' + uuid()

function App() {
    const [state, updateState] = useState('loading')
    const [data, updateData] = useState([])
    const [completedItem, updateCompletedItem] = useState([])
    const [processingStatus, updateProcessingStatus] = useState('no')

    useEffect(() => {
        (async () => {
            try {
                const getResult = await API.graphql(graphqlOperation(GET_ITEMS))
                const items = getResult.data.listTasks

                if (items.length === 0) {
                    updateState('empty')
                    return
                }

                updateState('loaded')
                updateData(items)
            } catch (e) {
                console.log('err ', e)

            }
        })()
    }, [])

    useEffect(() => {
        API.graphql(
            graphqlOperation(SUBSCRIPTION, { PK: userId, SK: eventId })
        ).subscribe({
            next: (todoData) => {
                console.log('SUBSCRIBED EVENT', todoData.value.data.onCompleted);
                updateCompletedItem([todoData.value.data.onCompleted])
                updateProcessingStatus('processed!')
            }
        })
    }, [data])

    const createItem = () => {
        updateProcessingStatus('processing...')
        API.graphql(graphqlOperation(CREATE_ITEM, {
            "createTaskinput": {
                "PK": userId,
                "status": "PROCESSING",
                "SK": eventId
            }
        }))
    }

    const updateToComplete = () => {
        API.graphql(graphqlOperation(UPDATE_TO_COMPLETED, {
            "createTaskinput": {
                "PK": userId,
                "status": "COMPLETE",
                "SK": eventId
            }
        }))
    }

    const signOut = () => {
        Auth.signOut();
    }

    if (state === 'loading') return <PresentationLoading />
    if (state === 'error') return <PresentationError />
    if ([...data, ...completedItem].length === 0) {
        return <PresentationEmpty
            create={createItem}
            complete={updateToComplete}
            processing={processingStatus}
            signout={signOut}
        />
    }

    return <PresentationSuccess
        items={[...data, ...completedItem]}
        create={createItem}
        complete={updateToComplete}
        processing={processingStatus}
        signout={signOut}
    />
}

export default auth(App)
