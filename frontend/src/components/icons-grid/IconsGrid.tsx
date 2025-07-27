import { IconsGridProps } from '@/types/food.types';
import classes from './IconsGrid.module.css';

const IconsGrid: React.FC<IconsGridProps> = ({
                                                 icons,
                                                 itemsPerRow = 10,
                                                 iconSize = 100,
                                                 style,
                                             }) => {
    const iconGroups = [];
    for (let i = 0; i < icons.length; i += itemsPerRow) {
        iconGroups.push(icons.slice(i, i + itemsPerRow));
    }

    return (
        <div className={classes.list} style={style}>
            {iconGroups.map((group, groupIndex) => (
                <div key={groupIndex} className={classes.group}>
                    {group.map((icon) => (
                        <div key={icon.id} className={classes.iconContainer}>
                            <img
                                src={icon.src}
                                alt={icon.alt}
                                width={iconSize}
                                height={iconSize}
                                className={classes.iconImage}
                            />
                            <div className={classes.caption}>{icon.alt}</div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default IconsGrid;