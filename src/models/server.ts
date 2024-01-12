export type Specification = {
    ram: string // eg: 512MB, 1GB, 2GB, ...
    cpu?: string // eg: Intel(R) Xeon(R) Platinum 8259CL CPU @ 2.50GHz, ...
    cpuCore: number // eg: 1, 2, 4, ...
    disk: string // eg: 50GB
    diskType?: "ssd" | "hdd"
}

export type Server = {
    id: number;
    name: string;
    groupID: number;
    specification: Specification;
    ip: string,
    online: boolean,
};
