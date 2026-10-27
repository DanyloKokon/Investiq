import { useEffect, useRef, useState } from "react";
import Table from "./aditionalComp/Table";
import { useDispatch, useSelector } from "react-redux";
import { setRows } from "../redux/reducer";
import { getUserFromStorage } from "../utils/localStorage";
import { months } from "./map";
import { supabase } from "../utils/supabase";
import { options } from "./map";

function Costs() {

    const { rows } = useSelector((state) => state.rows)
    const { balance } = useSelector((state) => state.users)
    const storedUser = getUserFromStorage();
    const userId = storedUser?.id;
    const [item, setItem] = useState<string>('')
    const [date, setDate] = useState<string>('')
    const [choise, setChoise] = useState<string>('')
    const [sum, setSum] = useState<number>(0)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)
    const triggerRef = useRef<HTMLButtonElement>(null)

    const dispatch = useDispatch()

    useEffect(() => {
        if (!isFormOpen) return

        const form = formRef.current
        const trigger = triggerRef.current
        const focusableElements = form?.querySelectorAll<HTMLElement>("input, select, button")
        focusableElements?.[0]?.focus()

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setIsFormOpen(false)
                return
            }

            if (event.key === "Tab" && focusableElements?.length) {
                const firstElement = focusableElements[0]
                const lastElement = focusableElements[focusableElements.length - 1]

                if (event.shiftKey && document.activeElement === firstElement) {
                    event.preventDefault()
                    lastElement.focus()
                } else if (!event.shiftKey && document.activeElement === lastElement) {
                    event.preventDefault()
                    firstElement.focus()
                }
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            trigger?.focus()
        }
    }, [isFormOpen])
    


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
            const var1 = (Number(balance) || 0) - Number(sum)
            const { data: insertedRow, error: insertError } = await supabase
                .from('data')
                .insert({ date, description: item, categorie: choise, sum, user_id: userId, type: 'costs' })
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
            setIsFormOpen(false)
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
            <button ref={triggerRef} type="button" className="mobile-form-trigger" onClick={() => setIsFormOpen(true)}>
                Додати витрату
            </button>
            <div
                className={`transaction-form-overlay${isFormOpen ? " is-open" : ""}`}
                onClick={() => setIsFormOpen(false)}
            >
                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="home-form"
                    role={isFormOpen ? "dialog" : undefined}
                    aria-modal={isFormOpen || undefined}
                    aria-labelledby={isFormOpen ? "cost-form-title" : undefined}
                    onClick={(event) => event.stopPropagation()}
                >
                    <div className="transaction-form-heading">
                        <h2 id="cost-form-title">Нова витрата</h2>
                        <button type="button" className="transaction-form-close" aria-label="Закрити форму" onClick={() => setIsFormOpen(false)}>
                            ×
                        </button>
                    </div>
                    <input value={date} onChange={(e) => setDate(e.target.value)} type="date" className="home-date" name="date" />

                    <div className="home-input-wrap">
                        <input name="description" placeholder="Опис товару" value={item} onChange={(e) => setItem(e.target.value)} className="home-it" type="text" />
                        <select value={choise} onChange={(e) => setChoise(e.target.value)} className="home-select" name="Категорія товару">
                            {options.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.text}
                                </option>
                            ))}
                        </select>
                        <input name="sum" onChange={(e) => setSum(e.target.value)} value={sum} className="home-summ" type="number" />
                    </div>
                    <button type="submit" className="oath-btn oath-btn-or">Ввести</button>
                    <button type="button" onClick={clearForm} className="home-btn-cl">Очистити</button>
                    {submitError && <p className="transaction-form-error" role="alert">{submitError}</p>}
                </form>
                </div>
            <div className="table-wrap">
                <Table type="costs" />
                
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