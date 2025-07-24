import { DeviceData } from '../data/DeviceData';
import Device from '../models/device.model';
import { DeviceRaw } from '../types/device.type';

interface GetDevicesParams {
  page: number;
  limit: number;
  orderBy: string;
  order: 'ASC' | 'DESC';
  status?: 'online' | 'offline';
  keyword: string
}

export const getAllDevicesService = async ({
  page,
  limit,
  orderBy,
  order,
  status,
  keyword,
}: GetDevicesParams): Promise<{ data: DeviceRaw[]; total: number }> => {
  const offset = (page - 1) * limit;
  const filters: string[] = [];
  const params: any[] = [];

  if (status === 'online') {
    filters.push('pl.status = ?');
    params.push(1);
  } else if (status === 'offline') {
    filters.push('pl.status = ?');
    params.push(0);
  }

  if (keyword) {
    filters.push(`(d.name LIKE ? OR d.ip_address LIKE ? OR u.name LIKE ? OR d.address LIKE ?)`);
    const keywordLike = `%${keyword}%`;
    params.push(keywordLike, keywordLike, keywordLike, keywordLike);
  }
  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

  const rawData = await Device.queryDevices(whereClause, params, limit, offset, orderBy, order);
  const total = await Device.countDevices(whereClause, params);

  const data: DeviceRaw[] = rawData.map((row: any) => ({
    device_id: row.id,
    name: row.name,
    address: row.address,
    ip_address: row.ip_address,
    manager: {
      manager_id: row.manager_id,
      manager_name: row.manager_name,
    },
    pinglog: {
      status: Boolean(row.status),
      ping_time: row.ping_time,
    },
  }));
  return { data, total };


};

export const getDeviceByIdService = async (id: number): Promise<DeviceData | null> => {
  const row = await Device.findById(id);

  if (!row) return null;

  const data: DeviceData = {
    id: row.id,
    name: row.name,
    address:row.address,
    ip_address: row.ip_address,
    manager_user_id: row.manager_user_id,
    created_at: row.created_at,
  };

  return data;
};

export const deleteDeviceByIdService = async (id: number): Promise<boolean> => {
  const existingDevice = await Device.findById(id);
  if (!existingDevice) return false;

  await Device.deleteById(id);
  return true;
};

export const addDeviceService = async (input: any): Promise<any> => {
  const insertedDevice = await Device.create(input);
  return insertedDevice;
};
export const updateDeviceService = async (id: number, data: any): Promise<any | null> => {
  const existingDevice = await Device.findById(id);
  if (!existingDevice) return null;

  const updatedDevice = await Device.updateById(id, data);
  return updatedDevice;
};
