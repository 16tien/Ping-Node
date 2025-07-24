// controllers/pingController.ts
import { Request, Response } from 'express';
import PingService from '../service/ping.service';

export const getPingLogByDeviceId = async (req: Request, res: Response): Promise<void> => {
    const device_id = Number(req.query.device_id);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const status = req.query.status as 'true' | 'false' | undefined;
    const keyword = (req.query.keyword as string) || '';
    if (!device_id) {
        res.status(400).json({ error: 'Thiếu device_id' });
        return;
    }

    try {
        const result = await PingService.getPingLogsByDeviceId(device_id, page, limit, keyword, status);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Không lấy được ping logs', detail: err });
    }
};
