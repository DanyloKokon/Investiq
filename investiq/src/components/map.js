import { IoFastFoodOutline, IoCarSportOutline, IoReceiptOutline } from "react-icons/io5";
import { BiDrink } from "react-icons/bi";
import { GiKite, GiBookmarklet } from "react-icons/gi";
import { TbHealthRecognition } from "react-icons/tb";
import { LuSofa } from "react-icons/lu";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import { MdSportsFootball } from "react-icons/md";
import { FaMoneyBillWave } from "react-icons/fa6";
import { GiReceiveMoney } from "react-icons/gi";

export const trow = [
    { name: "Дата" }, { name: "Опис" }, { name: "Категорія" }, { name: "Сума" }, { name: "ㅤㅤ" }
]

export const months = [
    { month: "Січень" },
    { month: "Лютий" },
    { month: "Березень" },
    { month: "Квітень" },
    { month: "Травень" },
    { month: "Червень" },
    { month: "Липень" },
    { month: "Серпень" },
    { month: "Вересень" },
    { month: "Жовтень" },
    { month: "Листопад" },
    { month: "Грудень" },
]

export const options = [
    {
        value: '',
        text: 'Категорія товару',
        pic: null,
    },
    {
        value: 'transport',
        text: 'Транспорт',
        pic: IoCarSportOutline,
    },
    {
        value: 'products',
        text: 'Продукти',
        pic: IoFastFoodOutline,
    },
    {
        value: 'health',
        text: 'Здоров’я',
        pic: TbHealthRecognition,
    },
    {
        value: 'alcohol',
        text: 'Алкоголь',
        pic: BiDrink,
    },
    {
        value: 'entertainment',
        text: 'Розваги',
        pic: GiKite,
    },
    {
        value: 'all-for-home',
        text: 'Все для дому',
        pic: LuSofa,
    },
    {
        value: 'electronic',
        text: 'Техніка',
        pic: HiOutlineWrenchScrewdriver,
    },
    {
        value: 'bills',
        text: 'Комуналка, зв’язок',
        pic: IoReceiptOutline,
    },
    {
        value: 'sport-hobby',
        text: 'Спорт, хобі',
        pic: MdSportsFootball,
    },
    {
        value: 'education',
        text: 'Навчання',
        pic: GiBookmarklet,
    },
    {
        value: 'else',
        text: 'Інше',
        pic: null,
    }
]

export const opt2 = [
        {
            value: '',
            text: 'Категорія товару'
        },
        {
            value: 'salary',
            text: 'ЗП',
            pic: FaMoneyBillWave
        },
        {
            value: 'extra-income',
            text: 'Дод. прибуток',
            pic: GiReceiveMoney
        }
    ]
