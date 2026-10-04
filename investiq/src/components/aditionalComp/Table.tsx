import { useEffect } from "react";
import { trow } from "../map";
import { useDispatch, useSelector } from "react-redux";
import { getData } from "../../redux/reducer";
function Table() {
    const { rows, status } = useSelector((state) => state.rows)
    const dispatch = useDispatch()
    useEffect(()=>{
        if (status === 'idle') {
            dispatch(getData())
        }
    },[])
    return (
        <table style={{"width": "760px"}}>
            <thead>
                <tr>
                    {trow.map((i) => (
                        <th>
                            {i.name}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((r) => (
                    <tr>
                        <td>{r.date}</td>
                        <td>{r.description}</td>
                        <td>{r.categorie}</td>
                        <td>{r.sum}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default Table;