import {ITEMS_PER_PAGE} from './constants';
import {ListRange} from './types';

export function listRange(page: number): ListRange {
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + (ITEMS_PER_PAGE - 1);

  return {
    from,
    to,
  };
}