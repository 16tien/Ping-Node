import { checkPing } from './pinger';
import Device from "../models/device.model";
import PingLog from "../models/ping.model"
import {DeviceStatus} from "./enum"
import { sendAlertEmail } from './sendEmail';
import { getDeviceByIdService } from '../service/device.service';
import userService from '../service/user.service';

const hanldeDevicePing = async (id: number, ip: string): Promise<void> => {
  try {
    const isAlive = await checkPing(ip);
    const device = await getDeviceByIdService(id);

    if (!device) {
      console.warn(`Device with id ${id} not found.`);
      return;
    }

    if (!device.manager_user_id) {
      console.warn(`Device ${device.name} does not have a manager assigned.`);
      return;
    }

    const manager = await userService.getUserByIdService(device.manager_user_id);

    if (!manager) {
      console.warn(`Manager with id ${device.manager_user_id} not found.`);
      return;
    }

    // console.log(`Device ${id} (${ip}) is ${isAlive ? "online" : "offline"}`);

    await PingLog.create(id, isAlive ? DeviceStatus.ONLINE : DeviceStatus.OFFLINE);

    if (!isAlive) {
      const threeTimes = await PingLog.isOfflineLast3Pings(id);
      if (threeTimes) {
        await sendAlertEmail(device.name!, manager.email, device.address!);
      }
    }
  } catch (error) {
    console.error(`Error pinging device ${id} (${ip}):`, error);
  }
};
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
