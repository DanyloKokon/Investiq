import { useEffect } from "react";
import { trow } from "../map";
import { useDispatch, useSelector } from "react-redux";
import { getData, deleteRow } from "../../redux/reducer";
import { IoTrashOutline } from "react-icons/io5";
import { getUserFromStorage } from "../../utils/localStorage";
import { store } from "../../redux/store";
import { useParams } from "react-router";
import { supabase } from "../../utils/supabase";

interface TableRow {
    row_id: string | number;
    date: string;
    description: string;
    categorie: string;
    sum: number;
    type: string;
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
    const { type } = useParams()
    const storedUser = getUserFromStorage();
    const id = storedUser?.id
    const visibleRows = rows.length > 0 ? rows : Array.from({ length: 9 }, (_, index) => ({
        row_id: `placeholder-${index}`,
        date: '',
        description: '',
        categorie: '',
        sum: 0,
    }));

    useEffect(() => {
        if (id) {
            console.log(type);
            // dispatch(getData({ user_id: id, type: type }))
            const { data, error } = supabase
                .from('data')
                .select()
                .eq('user_id', storedUser.id)
                .eq('type', type)
        }
    }, [id, status, type])


    function handleDeleteRow(userId: string | number, rowId: string | number) {
        dispatch(deleteRow({ user_id: userId, row_id: rowId }))
    }

    return (
        <>
            {error && <p role="alert">{error}</p>}
            <div className="table-scroll">
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
                        {visibleRows.map((r, index) => (
                            <tr key={r.row_id ?? `placeholder-${index}`} className="table-tr">
                                <td>{r.date || ' '}</td>
                                <td>{r.description || ' '}</td>
                                <td>{r.categorie || ' '}</td>
                                <td>{r.sum || ' '}</td>
                                <td>
                                    {rows.length > 0 ? (
                                        <IoTrashOutline className="pointer" onClick={() => handleDeleteRow(id, r.row_id)} />
                                    ) : (
                                        <span aria-hidden="true">&nbsp;</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Table;