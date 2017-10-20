import { listRange } from '../utilities';
import { getLatestUUID, getFeed, getFeedItem } from 'storage/foreground';
async function generateJSON({ type, from, to, uuid }) {
    const feedItems = getFeed(type, uuid);
    if (feedItems === null) {
        return null;
    }
    let items = {};
    let $entities = {};
    for (const id in feedItems) {
        const formattedId = Number(id);
        const feedItemId = feedItems[id];
        if (formattedId >= from && formattedId <= to) {
            items[formattedId] = feedItemId;
            $entities[feedItemId] = await getFeedItem(feedItemId);
        }
        else if (formattedId > to) {
            break;
        }
    }
    return {
        uuid,
        type,
        from,
        to,
        max: Object.keys(feedItems).length,
        items,
        $entities,
    };
}
export async function route(req, res, next) {
    res.setHeader('content-type', 'application/json; charset=utf-8');
    const { type = 'top', from = 0, to = 29, uuid = getLatestUUID() } = req.params;
    try {
        const json = await generateJSON({
            type,
            from: Number(from),
            to: Number(to),
            uuid,
        });
        res.send(200, json);
    }
    catch (error) {
        res.send(200, {});
    }
    next();
}
export async function serverRoute(req, { type }) {
    const page = req.params.id || 1;
    const { from, to } = listRange(page);
    try {
        const json = await generateJSON({ type, from, to, uuid: getLatestUUID() });
        return Object.assign(json, { page });
    }
    catch (error) {
        return { from, to };
    }
}
