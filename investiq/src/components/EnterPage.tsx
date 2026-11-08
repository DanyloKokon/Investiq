import { useEffect, useState, type FormEvent, type JSX } from "react";
import { useSelector } from "react-redux";
//import { postUser, getUser } from "../redux/reducer";
import { nanoid } from "@reduxjs/toolkit";
import { useNavigate } from "react-router";
import { supabase } from "@/utils/supabase"


interface EnterState {
    users: {
        isLogined: boolean;
    };
}

function Enter(): JSX.Element {
    const navigate = useNavigate()
    const { isLogined } = useSelector((state: EnterState) => state.users)
    const [erro, setError] = useState<string | null>(null)
    const [usEmail, setEmail] = useState<string>('')
    const [usPassword, setPass] = useState<string>('')
    const [choise, setChoise] = useState<1 | 2 | null>(null)
    useEffect(() => {
        if (isLogined) {
            navigate('/home/costs')
        }
    }, [isLogined, navigate])

     const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        const id = nanoid(10)

        e.preventDefault()
        if (choise === 2) {
            // dispatch(postUser({ username: 'User', password: password, email: email }));
            const { error } = await supabase.auth.signUp({
                email: usEmail,
                password: usPassword
            })
            setEmail('')
            setPass('')
            console.log(String(id));
            if (error) {
                setError(error.message)
            }
        } else if (choise === 1) {
            const { error } = await supabase.auth.signInWithPassword({
                email: usEmail,
                password: usPassword
            })
            setEmail('')
            setPass('')
            console.log(1);
            if(error){
                setError(error.message)
            } else {
                navigate('/home/costs')
            }
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
                <input className="oath-inp" value={usEmail} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" type="text" required />
                <label className="oath-label">Пароль:</label>
                <input className="oath-inp" value={usPassword} onChange={(e) => setPass(e.target.value)} type="password" placeholder="passoword" required name="" id="" />
                {erro && <p style={{"color": 'red', "fontSize": '20px'}}>{erro}</p>}
                <div style={{ "display": "flex", "gap": "15px" }}>
                    <button type="submit" onClick={() => setChoise(1)} className="oath-btn oath-btn-or" >Увійти</button>
                    <button type="submit" onClick={() => setChoise(2)} style={{ "backgroundColor": "#F5F6FB", "color": "#52555F" }} className="oath-btn">реєстрація</button>
                </div>
            </form>
        </div>
        <a href="../utils/app-release.apk" download>Install App</a>
    </div>);
}

export default Enter;