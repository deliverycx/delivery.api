export const schema: ISchema = {
    HI: {
        min: 3
    }
};

export interface ISchema {
    [key: string]: {
        min: number;
        max?: number;
    };
}
