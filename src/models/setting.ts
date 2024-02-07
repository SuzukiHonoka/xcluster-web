export type Plugin = {
    name: string;
    description: string
    valueType: "bool" | "string" | "object"
    value: object
};
