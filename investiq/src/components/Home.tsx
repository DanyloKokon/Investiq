// import {options} from './still-data'
function Home() {

    const options = [
        {
            value: 'origin',
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

    return (<section className="home-sect">
        <div></div>
        <div>
            <div className="home-btns">
                <button>Витрати</button>
                <button>Дохід</button>
            </div>
            <div className="home-main">
                <form action="">
                    <label htmlFor=""></label>
                    <input type="text" />
                    <select name="Категорія товару" id="">
                        {options.map((opt) => (
                            <option value={opt.value}>
                                {opt.text}
                            </option>
                        ))}
                    </select>
                    <input type="text" />
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