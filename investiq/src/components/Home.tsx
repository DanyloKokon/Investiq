import { useState } from "react";
import Table from "./aditionalComp/Table";
import { useDispatch, useSelector } from "react-redux";
import { postRow } from "../redux/reducer";
import { getUserFromStorage } from "../utils/localStorage";
function Home() {

    // const { user } = useSelector((state) => state.users)
    const storedUser = getUserFromStorage();
    const [item, setItem] = useState<string>('')
    const [date, setDate] = useState<string>('')
    const [choise, setChoise] = useState<string>('')
    const [sum, setSum] = useState<number>(0)
    const [varr, setVar] = useState<number>(0)
    const dispatch = useDispatch()
    const options = [
        {
            value: '',
            text: 'Категорія товару'
        },
        {
            value: 'transport',
            text: 'Транспорт'
        },
        {
            value: 'products',
            text: 'Продукти'
        },
        {
            value: 'health',
            text: 'Здоров’я'
        },
        {
            value: 'alcohol',
            text: 'Алкоголь'
        },
        {
            value: 'entertainment',
            text: 'Розваги'
        },
        {
            value: 'all-for-home',
            text: 'Все для дому'
        },
        {
            value: 'electronic',
            text: 'Техніка'
        },
        {
            value: 'bills',
            text: 'Комуналка, зв’язок'
        },
        {
            value: 'sport-hobby',
            text: 'Спорт, хобі'
        },
        {
            value: 'education',
            text: 'Навчання'
        },
        {
            value: 'else',
            text: 'Інше'
        }
    ]

    function handelSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (varr === 1) {
            dispatch(postRow({ date: date, description: item, categorie: choise, sum: sum, user_id: storedUser.id }))
            console.log("post");
        }
    }

    return (<section className="home-sect">
        <div></div>
        <div className="home-wrap">
            <div className="home-btns">
                <button>Витрати</button>
                <button>Дохід</button>
            </div>
            <div className="home-main">
                <form onSubmit={handelSubmit} className="home-form" >
                    <input value={date} onChange={(e) => setDate(e.target.value)} type="date" name="date" />
                    <div className="home-input-wrap">
                        <input name="description" placeholder="Опис товару" value={item} onChange={(e) => setItem(e.target.value)} className="home-it" type="text" />
                        <select onChange={(e) => setChoise(e.target.value)} className="home-select" name="Категорія товару" id="">
                            {options.map((opt) => (
                                <option value={opt.value}>
                                    {opt.text}
                                </option>
                            ))}
                        </select>
                        <input name="sum" onChange={(e) => setSum(e.target.value)} value={sum}  className="home-summ" type="number" />
                    </div>
                    <button style={{ "marginLeft": "27px" }} onClick={() => setVar(1)} className="oath-btn oath-btn-or">Ввести</button>
                    <button onClick={() => setVar(2)} className="home-btn-cl">Очистити</button>
                </form>
                <div>
                    <Table />
                    <table></table>
                </div>
            </div>
        </div>
    </section>);
}

export default Home;