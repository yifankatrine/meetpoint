import back from "../../assets/arrow-back.svg";
import {Link} from "react-router-dom";
import classes from "./ArrowBack.module.css"

const ArrowBack = () => {
    return (
        <Link to={"/map"} className={classes.back}>
            <img
                src={back}
                alt="arrow-back"
                width={6.35}
                height={11.37}
            />
            <div className={classes.txtBack}>
                Назад
            </div>
        </Link>
    );
};

export default ArrowBack;