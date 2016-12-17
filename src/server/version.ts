import { Router } from 'express';

export const router = Router();

const STAMP = require('../../dist/stamp.json');

router.use((req, res) => {
    res.json({
        date: STAMP.date,
        head: STAMP.head,
        branch: STAMP.branch,
    });
});
