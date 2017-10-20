import { getDetailsItem } from 'storage/foreground';
export async function route(req, res, next) {
    res.setHeader('content-type', 'application/json; charset=utf-8');
    const details = await getDetailsItem(req.params.id);
    res.send(200, {
        $entities: {
            [req.params.id]: details,
        },
    });
    next();
}
