import classes from './MyFilter.module.css';
import filter from "../../assets/filter.svg";
import MySearch from "../../components/UI/search/MySearch";

const MyBanner = () => {
    return (
        <div className={classes.filter}>
            <MySearch/>
            <img
                src={filter}
                alt="Filter"
                width={57}
                height={57}
            />
        </div>
    );
};

export default MyBanner;