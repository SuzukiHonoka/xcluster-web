type ACL = {
    id: number;
    name: string;
    mode: 0 | 1; // 0 => blacklist, 1 => whitelist
    srcType: "ip" | "geoip" | "regex";
    src: string; // ip or country code,
    enabled: boolean;
}