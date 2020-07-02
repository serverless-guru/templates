exports.handler = async event => {
    console.log('event', event);
    switch(event.field) {
        case 'getNote':
            return {};
        case 'createNote':
            return {};
        case 'listNotes':
            return {};
        case 'getNoteById':
            return {
                id: event.arguments.id,
                title: 'my-note-name',
                content: 'this is a note.'
            }
        case 'deleteNote':
            return {};
        case 'updateNote':
            return {};
        default:
            return `${event.field} not found!`
    }
};