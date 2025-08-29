import DeviceModel from "../models/device.model";


class DashboardService {
  async getDashboardData() {
    const kpi = await DeviceModel.getDeviceStatusSummary();
    const offlineDevices = await DeviceModel.getRecentOfflineDevices();
    const logs = await DeviceModel.getRecentLogs();
    const chart = await DeviceModel.getChartData();  

    return {
      kpi,
      chart,
      offlineDevices,
      logs,
    };
  }
}

export default new DashboardService();
