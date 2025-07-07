import dotenv from 'dotenv';
dotenv.config();

export interface CronConfig {
  repeatMinute: number;
  startTime: number;
  endTime: number;
}

const cronConfig: CronConfig = {
  repeatMinute: Number(process.env.CRON_REPEAT_MINUTE) || 5,
  startTime: Number(process.env.CRON_START_TIME) || 7,
  endTime: Number(process.env.CRON_END_TIME) || 18,
};

export default cronConfig;
