import { checkPing } from '../utils/pinger';
import Device from "../models/device.model";
import PingLog from "../models/ping_log.model"
import {DeviceStatus} from "../utils/ENUM"

const hanldeDevicePing = async (id: number, ip: string) :Promise<void> =>{
  try {
    const isAlive = await checkPing(ip);
    console.log(`Device ${id} (${ip}) is ${isAlive ? "online" : "offline"}`);
    await PingLog.create(id, isAlive ? DeviceStatus.ONLINE: DeviceStatus.OFFLINE)
    if(!isAlive){
      const threeTimes = await PingLog.isOfflineLast3Pings(id)
      if(threeTimes){
        console.log("Thiet bi da bi ngat 3 lan")
        //TODO : SEND Notify
      }
    }
  } catch (error) {
    console.error(`Error pinging device ${id} (${ip}):`, error);
  }
}

const runPingJob = async (): Promise<void> => {
    try {
      const devices = await Device.findAllIdAndIP();
      await Promise.all(
        devices.map(({id,ip_address}) => hanldeDevicePing(id, ip_address))
      )
    } catch (error) {
      
    }
};

export default runPingJob;
