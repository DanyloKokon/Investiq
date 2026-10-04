import { useState } from "react";
function Home() {

    const [item, setItem] = useState<string>('')
    const [choise, setChoise] = useState<string>('')
    const [sum, setSum] = useState<number | null>(null)
    const [varr, setVar] = useState<number>(0)

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

    function handelSubmit(e) {
        e.preventDefault()
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
                    <label className="home-date">10.04.2026</label>
                    <div className="home-input-wrap">
                        <input placeholder="Опис товару" value={item} onChange={(e) => setItem(e.target.value)} className="home-it" type="text" />
                        <select onChange={(e) => setChoise(e.target.value)} className="home-select" name="Категорія товару" id="">
                            {options.map((opt) => (
                                <option value={opt.value}>
                                    {opt.text}
                                </option>
                            ))}
                        </select>
                        <input value={sum} onChange={(e) => setSum(e.target.value)} placeholder='0.00' className="home-summ" type="number" />
                    </div>
                    <button onClick={() => setVar(1)} className="oath-btn oath-btn-or">Ввести</button>
                    <button onClick={() => setVar(2)} className="home-btn-cl">Очистити</button>
                </form>
                <div>
                    <table></table>
                    <table></table>
                </div>
            </div>
        </div>
    </section>);
}

export default Home;