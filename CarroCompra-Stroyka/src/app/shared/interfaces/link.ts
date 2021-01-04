export interface Link {
    label: string;
    external?: boolean;
    url?: string;
    slug?: string;
    target?: '_self'|'_blank';
}
