import PingLog from '../models/ping.model';
import { PingLogData } from '../data/PingLogData';

export default class PingService {
    static async createPingLog(device_id: number, status: number): Promise<{ id: number }> {
        return await PingLog.create(device_id, status);
    }

    static async getPingLogsByDeviceId(
        device_id: number,
        page: number,
        limit: number,
        keyword: string,
        status?: 'true' | 'false'
    ): Promise<{ items: PingLogData[]; total: number }> {
        let from: string | undefined;
        let to: string | undefined;

        if (keyword?.includes("~")) {
            const [fromRaw, toRaw] = keyword.split("~");
            from = this.toSQLiteDatetime(fromRaw);
            to = this.toSQLiteDatetime(toRaw);
        }

        const statusNumber = status === 'true' ? 1 : status === 'false' ? 0 : undefined;

        const [items, total] = await Promise.all([
            PingLog.fetchPingLogsData(device_id, page, limit, from, to, statusNumber),
            PingLog.countPingLogs(device_id, from, to, statusNumber),
        ]);

        return { items, total };
    }

    private static toSQLiteDatetime(input: string): string {
        const [time, date] = input.trim().split(' ');
        const [day, month, year] = date.split('-');
        return `${year}-${month}-${day} ${time}`;
    }

}
