import { ITEMS_PER_PAGE } from './constants';
export function listRange(page) {
    const from = (page - 1) * ITEMS_PER_PAGE;
    const to = from + (ITEMS_PER_PAGE - 1);
    return {
        from,
        to,
    };
}
