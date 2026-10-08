import Costs from "./Costs";
import Income from "./Income";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getUserFromStorage } from "../utils/localStorage";
import { getUsBal, postUserBalance } from "../redux/reducer";

function Home() {
    const storedUser = getUserFromStorage();
    const [usBalance, setUsBalance] = useState<number>(storedUser.balance)
    const [activeTab, setActiveTab] = useState<'spends' | 'income'>('spends')
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getUsBal({ id: storedUser.id }))
    }, [dispatch, usBalance])

    const handleSetbalance = (num: number) => {
        if (usBalance) {
            dispatch(postUserBalance({ balance: num, id: storedUser.id }))
        }
    }
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
                        className={`home-spends ${activeTab === 'spends' ? 'active' : ''}`}
                        onClick={() => setActiveTab('spends')}
                    >
                        Витрати
                    </button>
                    <button
                        className={`home-spends ${activeTab === 'income' ? 'active' : ''}`}
                        onClick={() => setActiveTab('income')}
                    >
                        Дохід
                    </button>
                </div>
                {activeTab === 'income' && <Income/>}
                {activeTab === 'spends' && <Costs/>}
            </div>

        </section>
    )
}

export default Home;