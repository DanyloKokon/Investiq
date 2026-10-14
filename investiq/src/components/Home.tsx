import Costs from "./Costs";
import Income from "./Income";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { getUserFromStorage } from "../utils/localStorage";
import { setBalance } from "../redux/reducer";
import { supabase } from "../utils/supabase";

function Home() {
    const navigate = useNavigate()
    const { type } = useParams()
    const storedUser = getUserFromStorage();
    const userId = storedUser?.id;
    const [usBalance, setUsBalance] = useState("0")
    const [isLoadingBalance, setIsLoadingBalance] = useState(true)
    const [isSavingBalance, setIsSavingBalance] = useState(false)
    const [balanceError, setBalanceError] = useState("")
    const dispatch = useDispatch()

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
    return (
        <section className="home-sect">
            <div className="home-top-wrap">
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
                <button className="checkout">Перейти до розрахунків</button>
                {balanceError && <p role="alert">{balanceError}</p>}
            </div>
            <div className="home-wrap">
                <div className="home-btns">
                    <button
                        className={`home-spends ${type === 'costs' ? 'active' : ''}`}
                        onClick={() => navigate("/Investiq/home/costs", { replace: true })}
                    >
                        Витрати
                    </button>
                    <button
                        className={`home-spends ${type === 'income' ? 'active' : ''}`}
                        onClick={() => navigate("/Investiq/home/income", { replace: true })}
                    >
                        Дохід
                    </button>
                </div>
                {type === 'income' && <Income />}
                {type === 'costs' && <Costs />}
            </div>

        </section>
    )
}

export default Home;