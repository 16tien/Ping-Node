import ping from 'ping';

export const checkPing = async (IP: string): Promise<Boolean> => {
  try {
    const res = await ping.promise.probe(IP, { timeout: 5 });
    if (res.alive) {
      return true
    } else {
      return false
    }
  } catch (err) {
    return false
  }
};
