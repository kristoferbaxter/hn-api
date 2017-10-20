import { fetchItem, fetchList } from './fetch';
// Update a single item.
async function updateItem(id) {
    try {
        const item = await fetchItem(id);
        const update = {
            type: 2 /* FeedItemRetieved */,
            item,
        };
        process.send(update);
        return true;
    }
    catch (error) {
        console.log(`unable to update ${id}`, error);
        return true;
    }
}
// Fetch a list of specific type, and update all the items in the list.
async function updateListItems(type) {
    const list = await fetchList(type);
    for (const id in list) {
        updateItem(list[id]);
    }
    return list;
}
function findDeletionCandidates(newLists, oldLists) {
    if (newLists === null || oldLists === null) {
        return [];
    }
    let flatNewLists = [];
    Object.values(newLists).forEach((list, index) => {
        flatNewLists = flatNewLists.concat(Object.values(list));
    });
    let flatOldLists = [];
    Object.values(oldLists).forEach((list, index) => {
        flatOldLists = flatOldLists.concat(Object.values(list));
    });
    return flatNewLists.filter(feedItemId => !flatOldLists.includes(feedItemId));
}
process.on('message', async (message) => {
    const { type } = message;
    if (type === 1 /* RetrieveFeeds */) {
        const { lastUpdate } = message;
        const newLists = {
            top: await updateListItems("top"),
            new: await updateListItems("new"),
            show: await updateListItems("show"),
            ask: await updateListItems("ask"),
            job: await updateListItems("job"),
        };
        const deletionCandidates = findDeletionCandidates(newLists, lastUpdate);
        process.send({
            type: 0 /* FeedsRetrieved */,
            feeds: newLists,
            deletionCandidates,
        });
        return;
    }
    else if (type === 3 /* RetrieveFeedItem */) {
        const { id } = message;
        await updateItem(id);
        return;
    }
});
process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Background Rejection at:', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
});
