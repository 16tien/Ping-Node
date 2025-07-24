export interface DeviceData {
  id: number;
  name: string | null;
  address: string |null;
  ip_address: string;
  manager_user_id?: number | null;
  created_at?: string;
}
