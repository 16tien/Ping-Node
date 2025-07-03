import dotenv from 'dotenv';
dotenv.config();

export interface CronConfig {
  repeatMinute: number;
  hourStart: number;
  hourEnd: number;
}

const cronConfig: CronConfig = {
  repeatMinute: Number(process.env.CRON_REPEAT_MINUTE) || 5,
  hourStart: Number(process.env.CRON_HOUR_START) || 7,
  hourEnd: Number(process.env.CRON_HOUR_END) || 18,
};

export default cronConfig;
