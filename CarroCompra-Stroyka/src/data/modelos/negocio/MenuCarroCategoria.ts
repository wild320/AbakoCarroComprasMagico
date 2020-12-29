
export class MenuCarroCategoria {
    id: number;
    type: string;
    name: string;
    slug: string;
    path: string;
    items: number;
    children: Array<{
        id: number;
        type: string;
        name: string;
        slug: string;
        path: string;
        image: string;
        items: number;
        children: Array<{
            id: number;
            type: string;
            name: string;
            slug: string;
            path: string;
            items: number;
        }>;
    }>;
}
