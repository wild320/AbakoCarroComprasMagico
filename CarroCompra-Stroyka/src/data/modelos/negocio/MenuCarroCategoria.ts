
export class MenuCarroCategoria {
    name: string;
    slug: string;
    items: number;
    children: Array<{
        name: string;
        slug: string;
        image: string;
        items: number;
        children: Array<{
            name: string;
            slug: string;
            items: number;
        }>;
    }>;
}
