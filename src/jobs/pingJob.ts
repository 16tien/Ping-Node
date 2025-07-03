import cronConfig from '../config/cronConfig';
import { checkPing } from '../utils/pinger'; // giả sử bạn tách các hàm này

const runPingJob = async (): Promise<void> => {
  // console.log(`[${new Date().toLocaleString()}] Bắt đầu kiểm tra danh sách IP...`);

  // await Promise.all(
  //   targetIPs.map((ip: string) => checkPing(ip.trim()))
  // );
};

export default runPingJob;
