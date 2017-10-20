import uuid from 'uuid/v4';
import cp from 'child_process';
import { fetchItem, fetchDetails } from './fetch';
const UPDATE_TIMER = 300000;
const MAXIMUM_SIMULTANEOUS_UUID = UPDATE_TIMER / 1000 / 60 * 6;
// Maximum of six hours of supported UUIDs.
let supportedUUIDs = [];
let storedFeeds = {};
let itemDeletionCandidates = {};
let storedItems = {};
function handleNewDeletionCandidates({ deletionCandidates }) {
    console.log('handleNewDeletionCandidates', deletionCandidates);
    deletionCandidates.forEach(candidate => {
        switch (itemDeletionCandidates[candidate]) {
            case 2:
                // Already marked for deletion twice
                // now it's time to remove it.
                delete storedItems[candidate];
                break;
            default:
                // Either not present in the candidate list, or only has been marked once.
                // Increment the marker.
                itemDeletionCandidates[candidate] = itemDeletionCandidates[candidate] ? 2 : 1;
        }
    });
}
function handleNewFeeds({ feeds }) {
    const newUUID = uuid();
    const uuidSupportedCount = supportedUUIDs.length;
    if (uuidSupportedCount > MAXIMUM_SIMULTANEOUS_UUID) {
        const removed = supportedUUIDs.splice(0, MAXIMUM_SIMULTANEOUS_UUID - supportedUUIDs.length);
        removed.forEach(remove => {
            delete storedFeeds[remove];
        });
    }
    supportedUUIDs.push(newUUID);
    storedFeeds[newUUID] = feeds;
}
export function init(backgroundLocation) {
    const updateThread = cp.fork(backgroundLocation);
    updateThread.on('message', message => {
        const { type } = message;
        if (type === 0 /* FeedsRetrieved */) {
            // This is the updated set of feeds that have been successfully retrieved.
            handleNewFeeds(message);
            handleNewDeletionCandidates(message);
            const { feeds } = message;
            setTimeout(() => {
                const message = { type: 1 /* RetrieveFeeds */, lastUpdate: feeds };
                updateThread.send(message);
            }, UPDATE_TIMER);
        }
        else if (type === 2 /* FeedItemRetieved */) {
            const { item } = message;
            if (item && item.id) {
                storedItems[item.id] = item;
            }
        }
    });
    const message = { type: 1 /* RetrieveFeeds */, lastUpdate: null };
    updateThread.send(message);
}
export function getLatestUUID() {
    return supportedUUIDs[supportedUUIDs.length - 1];
}
export function getFeed(type, uuid = getLatestUUID()) {
    if (storedFeeds[uuid] && storedFeeds[uuid] && storedFeeds[uuid][type]) {
        return storedFeeds[uuid][type];
    }
    return null;
}
export async function getFeedItem(id) {
    if (storedItems[id]) {
        return storedItems[id];
    }
    console.log(`${id} requested, and not in storedItems`);
    return await fetchItem(id);
}
export async function getDetailsItem(id) {
    return await fetchDetails(id);
}
