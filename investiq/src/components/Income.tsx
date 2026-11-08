import { useEffect, useMemo, useRef, useState } from "react";
import Table from "./aditionalComp/Table";
import { useDispatch, useSelector } from "react-redux";
import { addRow, setBalance } from "../redux/reducer";
import { getUserFromStorage } from "../utils/localStorage";
import { supabase } from "../utils/supabase";
import { opt2 as options } from "./map";
import { getMonthlyTotals } from "./aditionalComp/AdditionalFunc";

function Income() {

    const { rows } = useSelector((state) => state.rows)
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
            const { data, error } = await supabase.rpc("add_financial_transaction", {
                p_date: date,
                p_description: item,
                p_categorie: choise,
                p_sum: Number(sum),
                p_type: "income",
            })

            if (error) throw error
            if (!data?.row) throw new Error("Не вдалося отримати збережений запис.")

            const savedBalance = Number(data.balance)
            if (!Number.isFinite(savedBalance)) {
                throw new Error("Сервер повернув некоректне значення балансу.")
            }

            dispatch(addRow(data.row))
            dispatch(setBalance(savedBalance))
            clearForm()
            setIsFormOpen(false)
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : "Не вдалося зберегти дохід.")
        }
    }

    const monthlyTotals = useMemo(() => getMonthlyTotals(rows, "income"), [rows]);


    return (<>
        <div className="home-main">
            <button ref={triggerRef} type="button" className="mobile-form-trigger" onClick={() => setIsFormOpen(true)}>
                Додати дохід
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
                    aria-labelledby={isFormOpen ? "income-form-title" : undefined}
                    onClick={(event) => event.stopPropagation()}
                >
                    <div className="transaction-form-heading">
                        <h2 id="income-form-title">Новий дохід</h2>
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
                <Table/>
                
                <div className="monthly-summary">
                    <h2>зведення</h2>
                    <ul className="monthly-summary-list">
                        {monthlyTotals.map((month) => (
                            <li key={month.key}>
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