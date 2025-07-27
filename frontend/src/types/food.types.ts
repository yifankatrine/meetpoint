export interface FoodIcon {
    id: number;
    src: string;
    alt: string;
}

export interface IconsGridProps {
    icons: FoodIcon[];
    itemsPerRow?: number;
    iconSize?: number;
    style?: object;
}