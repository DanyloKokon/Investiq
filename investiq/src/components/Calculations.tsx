// import { IoFastFoodOutline, IoCarSportOutline, IoReceiptOutline  } from "react-icons/io5";
// import { BiDrink } from "react-icons/bi";
// import { GiKite, GiBookmarklet } from "react-icons/gi";
// import { TbHealthRecognition } from "react-icons/tb";
// import { LuSofa } from "react-icons/lu";
// import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
// import { MdSportsFootball } from "react-icons/md";

import { Link } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router";
import { getUserFromStorage } from "../utils/localStorage";
import { setBalance, setRows } from "../redux/reducer";
import { supabase } from "../utils/supabase";
import { action, getMonthList, getRowsForMonth, type MonthRow } from "./aditionalComp/AdditionalFunc";
import Chart from "./aditionalComp/Chart";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { options as opt1, opt2 } from "./map";


interface RowsState {
    rows: {
        rows: MonthRow[];
    };
}

function Calculations() {
     const { rows } = useSelector((state: RowsState) => state.rows)
    
    const storedUser = getUserFromStorage();
    const userId = storedUser?.id;
    const [usBalance, setUsBalance] = useState<string>("0")
    const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(true)
    const [isSavingBalance, setIsSavingBalance] = useState<boolean>(false)
    const [balanceError, setBalanceError] = useState<string>("")
    const dispatch = useDispatch()
    const [current, setCurrent] = useState<number>(0)
    const [monthRow, setMonthRow] = useState<MonthRow[]>([])
    const [selectedCategory, setSelectedCategory] = useState<{ cat: string; name: string } | null>(null)
    const allMonth = useMemo(() => getMonthList(rows), [rows])
    const [costsUse, setCostsUse] = useState<boolean>(true)
    let options = costsUse ? opt1 : opt2


    useEffect(() => {
        async function fetchRows() {
            try {
                let query = supabase
                    .from('data')
                    .select()
                    .eq('user_id', userId)
                    

                const { data, error } = await query
                if (data) {
                    dispatch(setRows(data))
                }
            }
            catch (error) {
                console.error('Unexpected error');
            }
        }
        fetchRows()
    }, [userId])


    useEffect(() => {
        if (!allMonth.length) {
            setMonthRow([])
            setCurrent(0)
            return
        }

        const safeCurrent = Math.min(current, allMonth.length - 1)
        const currentMonth = allMonth[safeCurrent]
        setMonthRow(getRowsForMonth(currentMonth, rows))
    }, [allMonth, current, rows])

    useEffect(() => {
        let isActive = true

        async function fetchBalance() {
            if (!userId) {
                setBalanceError("Не вдалося завантажити баланс: користувача не знайдено.")
                setIsLoadingBalance(false)
                return
            }

            try {
                const { data, error } = await supabase
                    .from("userBalance")
                    .select("balance")
                    .eq("user_id", userId)
                    .maybeSingle()

                if (error) throw error

                const balance = Number(data?.balance ?? 0)
                if (!Number.isFinite(balance)) {
                    throw new Error("Отримано некоректне значення балансу.")
                }

                if (isActive) {
                    setUsBalance(String(balance))
                    dispatch(setBalance(balance))
                }
            } catch (error) {
                console.error("Не вдалося завантажити баланс:", error)
                if (isActive) {
                    setBalanceError(error instanceof Error ? error.message : "Не вдалося завантажити баланс.")
                }
            } finally {
                if (isActive) setIsLoadingBalance(false)
            }
        }
        fetchBalance()
        return () => {
            isActive = false
        }
    }, [dispatch, userId])

    async function handleSetBalance() {
        if (!userId) {
            setBalanceError("Не вдалося зберегти баланс: користувача не знайдено.")
            return
        }

        const balance = Number(usBalance)
        if (usBalance.trim() === "" || !Number.isFinite(balance)) {
            setBalanceError("Введіть коректне числове значення балансу.")
            return
        }

        setIsSavingBalance(true)
        setBalanceError("")

        try {
            const { data: existingBalance, error: fetchError } = await supabase
                .from("userBalance")
                .select("user_id")
                .eq("user_id", userId)
                .maybeSingle()

            if (fetchError) throw fetchError

            const result = existingBalance
                ? await supabase
                    .from("userBalance")
                    .update({ balance })
                    .eq("user_id", userId)
                    .select("balance")
                    .single()
                : await supabase
                    .from("userBalance")
                    .insert({ user_id: userId, balance })
                    .select("balance")
                    .single()

            if (result.error) throw result.error

            const savedBalance = Number(result.data.balance)
            if (!Number.isFinite(savedBalance)) {
                throw new Error("Сервер повернув некоректне значення балансу.")
            }

            setUsBalance(String(savedBalance))
            dispatch(setBalance(savedBalance))
        } catch (error) {
            console.error("Не вдалося зберегти баланс:", error)
            setBalanceError(error instanceof Error ? error.message : "Не вдалося зберегти баланс.")
        } finally {
            setIsSavingBalance(false)
        }
    }


    return (<section className="calc-section">
        <div className="home-top-wrap">
            <Link to={'/Investiq/home/costs'}> Повернутись на головну </Link>
            <p>Баланс:</p>
            <input
                value={usBalance}
                onChange={(e) => setUsBalance(e.target.value)}
                type="number"
                step="any"
                className="home-btn-inp"
                disabled={isLoadingBalance || isSavingBalance}
            />
            <button
                onClick={handleSetBalance}
                className="home-btn-inp home-btn-inp-button"
                disabled={isLoadingBalance || isSavingBalance}
            >
                {isSavingBalance ? "Збереження..." : "підтвердити"}
            </button>
            <div className="calc-wrap-date">
                <p className="calc-mini">Поточний періoд</p>
                <div className="calc-month-switcher">
                    <IoIosArrowBack className="calc-arrows" onClick={() => setCurrent(current > 0 ? current - 1 : 0)} />
                    <p className="calc-date">{allMonth[current]}</p>
                    <IoIosArrowForward className="calc-arrows" onClick={() => setCurrent(current + 1)} />
                </div>
            </div>
        </div>
        <div className="calc-calc">
            <p className="calc-total calc-total-expenses">Витрати: -{action(monthRow, "-", null)}</p>
            <p className="calc-total calc-total-income">Доходи: {action(monthRow, "+", null)}</p>
        </div>
        <div className="calc-ul-wrap">
            <div className="calc-category-heading">
                 <IoIosArrowBack className="calc-arrows" onClick={() => {
                    setCostsUse(costsUse ? false : true)
                    setSelectedCategory(null)
                 }} />
                    <p className="calc-date">{costsUse ? 'Витрати' : 'Дохід'}</p>
                    <IoIosArrowForward className="calc-arrows" onClick={() => {
                        setCostsUse(costsUse ? false : true)
                        setSelectedCategory(null)
                    }} />
            </div>
            <ul className="calc-ul">
            {options.slice(1).map((op) => {
                const Icon = op.pic;

                return (
                    <li key={op.value || "empty-category"}>
                        <button
                            type="button"
                            className="calc-category-button"
                            aria-pressed={selectedCategory?.cat === op.value}
                            onClick={() => {
                                setSelectedCategory({ cat: op.value, name: op.text })
                            }}
                        >
                            <p>{action(monthRow, "+", op.value)}</p>
                            {Icon ? <Icon className="calc-pic" /> : null}
                            <p>{op.text}</p>
                        </button>
                    </li>
                );
            })}
        </ul>
        </div>
        {costsUse && selectedCategory && (
            <Chart
                cat={selectedCategory.cat}
                categoryName={selectedCategory.name}
                rows={monthRow}
                ifCosts={true}
            />
        )}

        {costsUse === false && selectedCategory && (
            <Chart
                cat={selectedCategory.cat}
                categoryName={selectedCategory.name}
                rows={monthRow}
                ifCosts={false}
            />
        )}
        
    </section>);
}

export default Calculations;