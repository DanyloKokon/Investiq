import { useEffect, useState } from "react";
import { trow } from "../map";
import { useDispatch, useSelector } from "react-redux";
import { removeRow, setBalance, setRows } from "../../redux/reducer";
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
    const [deleteError, setDeleteError] = useState<string | null>(null)
    const visibleRows = rows.length > 0 ? rows : Array.from({ length: 9 }, (_, index) => ({
        row_id: `placeholder-${index}`,
        date: '',
        description: '',
        categorie: '',
        sum: 0,
    }));

    useEffect(() => {
        let isActive = true
        dispatch(setRows([]))

        async function fetchRows() {
            if (!id) {
                return
            }

            try {
                const { data, error } = await supabase
                    .from('data')
                    .select()
                    .eq('user_id', id)
                    .eq('type', type)

                if (error) throw error
                if (isActive) dispatch(setRows(data ?? []))
            } catch (error) {
                console.error('Failed to load transactions:', error)
            }
        }
        fetchRows()

        return () => {
            isActive = false
        }
    }, [dispatch, id, status, type])

    async function handleDeleteRow(rowId: string | number) {
        setDeleteError(null)

        try {
            const { data, error } = await supabase.rpc("delete_financial_transaction", {
                p_row_id: String(rowId),
            })

            if (error) throw error
            if (!data?.row) throw new Error("Не вдалося отримати видалений запис.")

            const savedBalance = Number(data.balance)
            if (!Number.isFinite(savedBalance)) {
                throw new Error("Сервер повернув некоректне значення балансу.")
            }

            dispatch(removeRow(rowId))
            dispatch(setBalance(savedBalance))
        } catch (error) {
            console.error("Failed to delete transaction:", error)
            setDeleteError(error instanceof Error ? error.message : "Не вдалося видалити запис.")
        }
    }

    return (
        <>
            {error && <p role="alert">{error}</p>}
            {deleteError && <p role="alert">{deleteError}</p>}
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
                                        <IoTrashOutline className="pointer hoverP" onClick={() => handleDeleteRow(r.row_id)} />
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