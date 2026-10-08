import { useState } from "react";
import Table from "./aditionalComp/Table";
import { useDispatch, useSelector } from "react-redux";
import { postRow } from "../redux/reducer";
import { getUserFromStorage } from "../utils/localStorage";
import { months } from "./map";
function Costs() {

    const { rows } = useSelector((state) => state.rows)
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
            dispatch(postRow({ date: date, description: item, categorie: choise, sum: sum, user_id: storedUser.id, type: 'costs' }))
            console.log("post");
            // setSum(0)
            // setDate('')
            // setChoise('')
            // setItem('')
        } else if (varr === 2) {
            setSum(0)
            setDate('')
            setChoise('')
            setItem('')
        }
    }

    const monthlyTotals = months.map((month, index) => {
        const monthNumber = String(index + 1).padStart(2, '0');

        const total = rows.reduce((sum: number, row) => {
            // Date input values use YYYY-MM-DD, so positions 5–6 contain the month.
            return row.date.slice(5, 7) === monthNumber
                ? sum + Number(row.sum)
                : sum;
        }, 0);

        return { ...month, total };
    });



    return (<>



        <div className="home-main">
            <form onSubmit={handelSubmit} className="home-form" >
                <input value={date} onChange={(e) => setDate(e.target.value)} type="date" className="home-date" name="date" />
                <div className="home-input-wrap">
                    <input name="description" placeholder="Опис товару" value={item} onChange={(e) => setItem(e.target.value)} className="home-it" type="text" />
                    <select onChange={(e) => setChoise(e.target.value)} className="home-select" name="Категорія товару" id="">
                        {options.map((opt) => (
                            <option value={opt.value}>
                                {opt.text}
                            </option>
                        ))}
                    </select>
                    <input name="sum" onChange={(e) => setSum(e.target.value)} value={sum} className="home-summ" type="number" />
                </div>
                <button style={{ "marginLeft": "27px" }} onClick={() => setVar(1)} className="oath-btn oath-btn-or">Ввести</button>
                <button onClick={() => setVar(2)} className="home-btn-cl">Очистити</button>
            </form>
            <div className="table-wrap">
                <Table type="costs" />
                {/* <table className="con-table">
                        <thead className="con-thead">
                            <tr className="con-tr">
                                <th className="con-th">
                                    зведення
                                </th>
                            </tr>
                        </thead>
                        <tbody className="con-body">
                            <ul role="listbox">
                                {monthlyTotals.map((month) => (
                                <li>
                                    <tr className="con-b-tr" key={month.month}>
                                    <td className="con-td">
                                        <p>{month.month}</p>
                                        <p>{month.total.toFixed(2)}</p>
                                    </td>

                                </tr>
                                </li>
                            ))}
                            </ul>


                        </tbody>
                    </table> */}
                <div className="monthly-summary">
                    <h2>зведення</h2>
                    <ul className="monthly-summary-list">
                        {monthlyTotals.map((month) => (
                            <li key={month.month}>
                                <p>{month.month}</p>
                                <p>{month.total.toFixed(2)}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>

    </>);
}

export default Costs;