import Costs from "./Costs";
import Income from "./Income";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { getUserFromStorage } from "../utils/localStorage";
import { getUsBal, postUserBalance } from "../redux/reducer";

function Home() {
    const navigate = useNavigate()
    const {type} = useParams()
    const storedUser = getUserFromStorage();
    const [usBalance, setUsBalance] = useState<number>(0)
    const [activeTab, setActiveTab] = useState<'spends' | 'income'>('spends')
    const dispatch = useDispatch()
    console.log(type);

    // useEffect(() => {
    //     dispatch(getUsBal({ id: storedUser.id }))
    // }, [dispatch, usBalance])

    // const handleSetbalance = (num: number) => {
    //     if (usBalance) {
    //         dispatch(postUserBalance({ balance: num, id: storedUser.id }))
    //     }
    // }
    return (
        <section className="home-sect">
            <div className="home-top-wrap">
                <p>Баланс:</p>
                <input value={usBalance} onChange={(e) => setUsBalance(e.target.value)} type="number" className="home-btn-inp" />
                <button onClick={() => handleSetbalance(usBalance)} className="home-btn-inp home-btn-inp-button">підтвердити</button>
                <button className="checkout">Перейти до розрахунків</button>
            </div>
            <div className="home-wrap">
                <div className="home-btns">
                    <button
                        className={`home-spends ${type === 'costs' ? 'active' : ''}`}
                        onClick={() =>  navigate("/investiq/home/costs", { replace: true })}
                    >
                        Витрати
                    </button>
                    <button
                        className={`home-spends ${type === 'income' ? 'active' : ''}`}
                        onClick={() =>  navigate("/investiq/home/income", { replace: true })}
                    >
                        Дохід
                    </button>
                </div>
                {type === 'income' && <Income/>}
                {type === 'costs' && <Costs/>}
            </div>

        </section>
    )
}

export default Home;