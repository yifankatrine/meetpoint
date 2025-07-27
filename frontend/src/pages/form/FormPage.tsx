import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import './form-page.css'
import MyButton from "../../components/UI/button/MyButton";
import MyInput from "../../components/UI/input/MyInput";


const FormPage = () => {
    const [organization, setOrganization] = useState("")
    const [favorites, setFavorites] = useState("")
    const [allergy, setAllergy] = useState("")
    const [dontLike, setDontLike] = useState("")
    const inputRef = useRef<HTMLInputElement>(null);
    const toMain = useNavigate();

    const handleClickToMain = () => {
        toMain("/");
    };

    return (
        <div className="form-page">
            <div className="form-page__window">
                <div className="form-page__title">
                    <div className="form-page__text">Анкета</div>
                    <div className="form-page__line"/>
                </div>

                <MyInput
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Ваша организация"
                    ref={inputRef}
                />
                <MyInput
                    type="text"
                    value={favorites}
                    onChange={(e) => setFavorites(e.target.value)}
                    placeholder="Предпочтения"
                    ref={inputRef}
                />
                <MyInput
                    type="text"
                    value={allergy}
                    onChange={(e) => setAllergy(e.target.value)}
                    placeholder="Аллергии"
                    ref={inputRef}
                />
                <MyInput
                    type="text"
                    value={dontLike}
                    onChange={(e) => setDontLike(e.target.value)}
                    placeholder="Ненавидите"
                    ref={inputRef}
                />

                <MyButton
                    onClick={handleClickToMain}
                    style={{
                        backgroundColor: "#00B6FE",
                        padding: "10px 50px",
                        fontSize: "20px",
                        marginTop: "20px",
                    }}
                    text={'Выбрать город'}
                />
                <MyButton
                    onClick={handleClickToMain}
                    style={{
                        backgroundColor: "#00B6FE",
                        padding: "10px 50px",
                        fontSize: "20px",
                    }}
                    text={'Далее'}
                />

            </div>
        </div>
    );
};

export default FormPage;