import cron from 'node-cron';
import cronConfig from '../config/cronConfig';
import runPingJob from './pingJob';

const startScheduler = () => {
  const schedule = `*/${cronConfig.repeatMinute} ${cronConfig.startTime}-${cronConfig.endTime} * * *`;

  console.log(`✅ Scheduler đã khởi động với lịch: ${schedule}`);

  cron.schedule(schedule, async () => {
    try {
      await runPingJob();
    } catch (e) {
      console.error(`[${new Date().toLocaleString()}] Lỗi cron:`, e);
    }
  });
};

export default startScheduler;
