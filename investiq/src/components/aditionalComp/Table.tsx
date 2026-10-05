import { useEffect } from "react";
import { trow } from "../map";
import { useDispatch, useSelector } from "react-redux";
import { getData, deleteRow } from "../../redux/reducer";
import { IoTrashOutline } from "react-icons/io5";
import { getUserFromStorage } from "../../utils/localStorage";
import { store } from "../../redux/store";

interface TableRow {
    row_id: string | number;
    date: string;
    description: string;
    categorie: string;
    sum: number;
}

interface TableState {
    rows: {
        rows: TableRow[];
        status: string;
        error: string | null;
    };
}

function Table() {
    const { rows, status, error } = useSelector((state: TableState) => state.rows)
    const dispatch = useDispatch<typeof store.dispatch>()
    const storedUser = getUserFromStorage();
    const id = storedUser.id
    useEffect(() => {
        if (status === 'idle') {
            dispatch(getData({ user_id: id }))
            return
        }
    }, [dispatch, id, status])


    function handleDeleteRow(userId: string | number, rowId: string | number) {
        dispatch(deleteRow({ user_id: userId, row_id: rowId }))
    }

    return (
        <>
            {error && <p role="alert">{error}</p>}
            <table className="table">
                <thead>
                    <tr className="table-head">
                        {trow.map((i) => (
                            <th key={i.name}>
                                {i.name}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="table-body">
                    {rows.map((r) => (
                        <tr key={r.row_id} className="table-tr">
                            <td>{r.date}</td>
                            <td>{r.description}</td>
                            <td>{r.categorie}</td>
                            <td>{r.sum}</td>
                            <td>
                                <button
                                    type="button"
                                    aria-label="Delete row"
                                    title="Delete row"
                                    onClick={() => handleDeleteRow(id, r.row_id)}
                                >
                                    <IoTrashOutline aria-hidden="true" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default Table;