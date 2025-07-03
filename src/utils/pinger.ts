import ping from 'ping';

export const checkPing = async (IP: string): Promise<void> => {
  try {
    const res = await ping.promise.probe(IP, { timeout: 5 });
    if (res.alive) {
      console.log(`[${new Date().toLocaleString()}] ${IP} is reachable`);
    } else {
      console.log(`[${new Date().toLocaleString()}] ${IP} is unreachable`);
    }
  } catch (err) {
    console.error(`[${new Date().toLocaleString()}] Error pinging ${IP}:`, err);
  }
};
