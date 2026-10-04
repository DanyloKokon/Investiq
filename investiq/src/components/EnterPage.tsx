import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postUser, getUser } from "../redux/reducer";
import { nanoid } from "@reduxjs/toolkit";
import { useNavigate } from "react-router";

function Enter() {
    const navigate = useNavigate()
    const { isLogined } = useSelector((state) => state.users)
    const [email, setEmail] = useState<string>('')
    const [password, setPass] = useState<string | number | null>('')
    const [choise, setChoise] = useState<number | null>(null)
    const dispatch = useDispatch()

    useEffect(() => {
        if (isLogined) {
            navigate('/investiq/home')
        }
    }, [isLogined, navigate])

    function handleSubmit(e) {
        const id = nanoid(10)

        e.preventDefault()
        if (choise === 2) {
            dispatch(postUser({ username: 'User', password: password, email: email }));
            setEmail('')
            setPass('')
            console.log(String(id));
        } else if (choise === 1) {
            dispatch(getUser({ password: password, email: email }));
            setEmail('')
            setPass('')
            console.log(1);
            navigate('/investiq/home')
        }
    }




    return (<div className="oath-wrap">
        <div>
            <h1 className="oath-h1">InvestIQ</h1>
            <h3 className="oath-h3">Smart Finance</h3>
        </div>
        <div>
            <form onSubmit={handleSubmit} className="oath-form">
                <p className="oath-p">Ви можете авторизуватися за допомогою акаунта Google</p>
                <label className="oath-label">Електронна пошта:</label>
                <input className="oath-inp" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" type="text" required />
                <label className="oath-label">Пароль:</label>
                <input className="oath-inp" value={password} onChange={(e) => setPass(e.target.value)} type="password" placeholder="passoword" required name="" id="" />
                <div style={{ "display": "flex", "gap": "15px" }}>
                    <button type="submit" onClick={() => setChoise(1)} className="oath-btn oath-btn-or" >Увійти</button>
                    <button type="submit" onClick={() => setChoise(2)} style={{ "backgroundColor": "#F5F6FB", "color": "#52555F" }} className="oath-btn">реєстрація</button>
                </div>
            </form>
        </div>
    </div>);
}

export default Enter;