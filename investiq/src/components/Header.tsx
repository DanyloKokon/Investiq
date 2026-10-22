import { useNavigate } from "react-router";
import { supabase } from "../utils/supabase";
import { useSelector } from "react-redux";
import { getUserFromStorage } from "../utils/localStorage";
function Header() {
    const navigate = useNavigate()
    const user = getUserFromStorage()
    async function handleOut() {
        const { error } = await supabase.auth.signOut()
        navigate('/oath')
    }

    return (
        <header className="app-header">
            <div className="logo">
                <p>Investiq</p>
            </div>
            {user && <div className="user-wrap">
                <p className="user-name">User Name</p>
                <button className="user-out" onClick={handleOut}>Вийти</button>
            </div>}
        </header>
    );
}

export default Header;