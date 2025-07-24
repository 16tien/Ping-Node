export interface DeviceRaw {
    device_id: number;
    ip_address: string;
    address: string
    name: string
    manager: {
        manager_id: number;
        manager_name: string;
    };
    pinglog: {
        status: boolean;
        ping_time: string;
    };
}