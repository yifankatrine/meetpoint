import './restaurant-page.css';
import MyTitle from "../../components/title/MyTitle";
import MyBanner from "../../components/UI/banner/MyBanner";
import MyFilter from "../../components/filter/MyFilter";
import IconsGrid from "../../components/icons-grid/IconsGrid";
import { FoodIcon } from "../../types/food.types"
import bar from '../../assets/restauraunt-variables/bar.svg';
import berry from '../../assets/restauraunt-variables/berry.svg?url';
import bowl from '../../assets/restauraunt-variables/bowl.svg?url';
import burger from '../../assets/restauraunt-variables/burger.svg?url';
import glintveyn from '../../assets/restauraunt-variables/glintveyn.svg?url';
import hotchocolate from '../../assets/restauraunt-variables/hotchocolate.svg?url';
import kebab from '../../assets/restauraunt-variables/kebab.svg?url';
import milkshake from '../../assets/restauraunt-variables/milkshake.svg?url';
import pizza from '../../assets/restauraunt-variables/pizza.svg?url';
import ramen from '../../assets/restauraunt-variables/ramen.svg?url';
import shawarma from '../../assets/restauraunt-variables/shawarma.svg?url';
import soup from '../../assets/restauraunt-variables/soup.svg?url';
import rectangle from '../../assets/restauraunt-variables/rectangle.svg?url';
import RestaurantsList from "../../components/restaurants-list/RestaurantsList";

const RestaurantPage = () => {
    const foodIcons: FoodIcon[] = [
        { id: 1, src: shawarma, alt: "Шаурма" },
        { id: 2, src: kebab, alt: "Кебаб" },
        { id: 3, src: burger, alt: "Бургер" },
        { id: 4, src: pizza, alt: "Пицца" },
        { id: 5, src: bowl, alt: "Рис" },
        { id: 6, src: soup, alt: "Суп" },
        { id: 7, src: ramen, alt: "Рамен" },
        { id: 8, src: berry, alt: "Север" },
        { id: 9, src: rectangle, alt: "???" },
        { id: 10, src: rectangle, alt: "???" },
        { id: 11, src: milkshake, alt: "Милкшейк" },
        { id: 12, src: glintveyn, alt: "Глинтвейн" },
        { id: 13, src: hotchocolate, alt: "Какао" },
        { id: 14, src: bar, alt: "Бар" },
        { id: 15, src: rectangle, alt: "???" },
        { id: 16, src: rectangle, alt: "???" },
        { id: 17, src: rectangle, alt: "???" },
        { id: 18, src: rectangle, alt: "???" },
        { id: 19, src: rectangle, alt: "???" },
        { id: 20, src: rectangle, alt: "???" },
    ];

    return (
        <div className="restaurant-page">
            <div className="restaurant-page__container">
                <MyTitle text={"ВКУСНО ПОЕСТЬ"}/>
                <MyBanner>
                    <div className="text1"></div>
                </MyBanner>
                <IconsGrid
                    icons={foodIcons}
                    itemsPerRow={10}
                    iconSize={80}
                />

                <MyFilter/>
                <RestaurantsList/>
            </div>
        </div>
    );
};

export default RestaurantPage;