import classes from './MyTitle.module.css';

interface MyTitleProps {
    text: string;
}

const MyTitle = ({ text }: MyTitleProps) => {
    return (
        <div className={classes.container}>
            <h1 className={classes.text}>{text}</h1>
            <div className={classes.line}/>
        </div>
    );
};

export default MyTitle;