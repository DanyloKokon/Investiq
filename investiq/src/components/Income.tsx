import { months } from "./map";
import { useState } from "react";
import Table from "./aditionalComp/Table";
import { useDispatch, useSelector } from "react-redux";
import { setRows } from "../redux/reducer";
import { getUserFromStorage } from "../utils/localStorage";
import { supabase } from "../utils/supabase";
function Income() {
    const { rows } = useSelector((state) => state.rows)
    const { balance } = useSelector((state) => state.users)
    const storedUser = getUserFromStorage();
    const userId = storedUser?.id;
    const [item, setItem] = useState<string>('')
    const [date, setDate] = useState<string>('')
    const [choise, setChoise] = useState<string>('')
    const [sum, setSum] = useState<number>(0)
    const [submitError, setSubmitError] = useState<string | null>(null)

    const dispatch = useDispatch()
    const options = [
        {
            value: '',
            text: 'Категорія товару'
        },
        {
            value: 'salary',
            text: 'ЗП'
        },
        {
            value: 'extra-income',
            text: 'Дод. прибуток'
        }
    ]



    function clearForm() {
        setSum(0)
        setDate('')
        setChoise('')
        setItem('')
    }


    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setSubmitError(null)

        if (!userId) {
            setSubmitError("Не вдалося визначити користувача.")
            return
        }

        try {
            const var1 = (Number(balance) || 0) + Number(sum)
            const { data: insertedRow, error: insertError } = await supabase
                .from('data')
                .insert({ date, description: item, categorie: choise, sum, user_id: userId, type: 'income' })
                .select()
                .single()

            if (insertError) throw insertError
            if (!insertedRow) throw new Error("Не вдалося отримати збережений запис.")

            dispatch(setRows([...rows, insertedRow]))

            const { data: existingBalance, error: fetchError } = await supabase
                .from("userBalance")
                .select("user_id")
                .eq("user_id", userId)
                .maybeSingle()

            if (fetchError) throw fetchError

            const result = existingBalance
                ? await supabase
                    .from("userBalance")
                    .update({ balance: var1 })
                    .eq("user_id", userId)
                    .select("balance")
                    .single()
                : await supabase
                    .from("userBalance")
                    .insert({ user_id: userId, balance: var1 })
                    .select("balance")
                    .single()

            if (result.error) throw result.error

            const savedBalance = Number(result.data.balance)
            if (!Number.isFinite(savedBalance)) {
                throw new Error("Сервер повернув некоректне значення балансу.")
            }

            clearForm()
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : "Не вдалося зберегти витрату.")
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
            <form onSubmit={handleSubmit} className="home-form" >
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
                <button style={{ "marginLeft": "27px" }} className="oath-btn oath-btn-or">Ввести</button>
                <button onClick={clearForm} className="home-btn-cl">Очистити</button>
            </form>
            {submitError && <p role="alert">{submitError}</p>}
            <div className="table-wrap">
                <Table type="income" />
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

export default Income;