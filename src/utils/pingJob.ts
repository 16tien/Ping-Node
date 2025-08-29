import { checkPing } from './pinger';
import Device from "../models/device.model";
import PingLog from "../models/ping.model"
import { DeviceStatus } from "./enum"
import { sendAlertEmail } from './sendEmail';
import { getDeviceByIdService } from '../service/device.service';
import userService from '../service/user.service';
import StatusChange from '../models/statusChange.model';

const handleStatusChange = async (deviceId: number, newStatus: DeviceStatus) => {
  const lastLog = await PingLog.findLastByDeviceId(deviceId);

  if (lastLog && lastLog.status !== newStatus) {
    await StatusChange.create({
      device_id: deviceId,
      old_status: lastLog.status,
      new_status: newStatus
    });
    console.log(`Device ${deviceId} changed: ${lastLog.status} → ${newStatus}`);
  }
};

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
    const newStatus = isAlive ? DeviceStatus.ONLINE : DeviceStatus.OFFLINE;

    await PingLog.create(id, newStatus);

    await handleStatusChange(id, newStatus);

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
      devices.map(({ id, ip_address }) => hanldeDevicePing(id, ip_address))
    )
  } catch (error) {

  }
};

export default runPingJob;
