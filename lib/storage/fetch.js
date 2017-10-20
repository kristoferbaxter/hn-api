import fetch from 'node-fetch';
export async function fetchList(type) {
    try {
        const json = await (await fetch(`https://hacker-news.firebaseio.com/v0/${type}stories.json`)).json();
        return json.reduce(function (acc, value, index) {
            acc[index] = value;
            return acc;
        }, {});
    }
    catch (error) {
        console.log(`fetchList ${type}, error`, error);
        return null;
    }
}
export async function fetchItem(id) {
    try {
        const { title, points, user, time, time_ago, comments_count, type, url, domain, } = await (await fetch(`https://hnpwa.com/api/v0/item/${id}.json`)).json();
        return {
            id,
            title,
            points,
            user,
            time,
            time_ago,
            comments_count,
            type,
            url,
            domain,
        };
    }
    catch (error) {
        console.log(`Error updating item: ${id}`);
        return null;
    }
}
export async function fetchDetails(id) {
    try {
        const json = await (await fetch(`https://hnpwa.com/api/v0/item/${id}.json`)).json();
        return json;
    }
    catch (error) {
        console.log(`Error updating details: ${id}`);
        return null;
    }
}
