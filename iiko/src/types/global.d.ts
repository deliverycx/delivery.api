type UniqueId = string;
type ImagePath = string;

// iiko responses
type Token = string;
type ImagesObject = Array<{ imageUrl: string }>;

interface ICategory {
    code: string;
    description: string;
    id: UniqueId;
    name: string;
    tags: Array<string>;
    images: ImagesObject;
    isIncludedInMenu: boolean;
    order: string;
    parentGroup: UniqueId;
}

interface IProduct {
    additionalInfo: string;
    code: string;
    description: string;
    id: UniqueId;
    name: string;
    tags: Array<string>;
    measureUnit: "порц" | "шт";
    price: number;
    type: string;
    weight: number;
    images: ImagesObject;
    order: number;
    parentGroup: UniqueId;
}

interface IOrganization {
    address: string;
    contact: {
        email: string;
        phone: string;
    };
    description: string;
    fullName: string;
    id: UniqueId;
    isActive: true;
    workTime: string | null;
}
