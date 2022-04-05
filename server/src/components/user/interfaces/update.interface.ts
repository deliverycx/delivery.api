export interface IUpdateProps {
    name?: string;
    phone?: string;
    address?: {
        street: string;
        home: number;
    };
    organizationId?: string;
}
