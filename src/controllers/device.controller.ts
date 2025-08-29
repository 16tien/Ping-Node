import { Request, Response } from 'express';
import {updateDeviceService, getAllDevicesService, getDeviceByIdService, deleteDeviceByIdService,addDeviceService } from '../service/device.service';

export const allInfoDevices = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const orderBy = (req.query.orderby as string) || 'id';
  const order = (req.query.order as string)?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  const pinglogStatus = req.query['pinglog.status'];
  const status = (pinglogStatus === 'true')
    ? 'online'
    : (pinglogStatus === 'false') ? 'offline' : undefined;

  const keyword = (req.query.keyword as string) || ''
  try {
    const result = await getAllDevicesService({ page, limit, orderBy, order, status, keyword });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
export const getDeviceById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: 'Invalid device ID' }); 
    return;
  }

  try {
    const device = await getDeviceByIdService(id);
    if (!device) {
      res.status(404).json({ message: 'Device not found' }); 
      return;
    }

    res.json(device);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' }); 
  }
};
export const deleteDeviceById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: 'Invalid device ID' });
  }

  try {
    const deleted = await deleteDeviceByIdService(id);
    if (!deleted) {
      res.status(404).json({ message: 'Device not found or could not be deleted' });
    }

    res.json({ message: 'Device deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }

};
export const createDeviceController = async (req: Request, res: Response) => {
  try {
    const input = req.body;
    const newDevice = await addDeviceService(input);
    res.status(201).json(newDevice);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo thiết bị', error });
  }
};

export const updateDeviceController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
     res.status(400).json({ message: 'Invalid device ID' });
  }

  try {
    const updatedDevice = await updateDeviceService(id, req.body);
    if (!updatedDevice) {
       res.status(404).json({ message: 'Device not found or could not be updated' });
    }
    res.json(updatedDevice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi cập nhật thiết bị' });
  }
};