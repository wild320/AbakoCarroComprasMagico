
export class MenuCarroCategoria {
    id: number;
    type: string;
    name: string;
    slug: string;
    items: number;
    selection: string;
    children: Array<{
        id: number;
        type: string;
        name: string;
        slug: string;
        items: number;
        children: Array<{
            id: number;
            type: string;
            name: string;
            slug: string;
            items: number;
        }>;
    }>;
}
