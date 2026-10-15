export interface MonthRow {
    row_id?: string | number;
    date?: string;
    description?: string;
    categorie?: string;
    sum?: number | string;
    type?: string;
    [key: string]: unknown;
}

export const getMonthList = (rows: MonthRow[]): string[] => {
    return Array.from(
        new Set(
            rows
                .map((row) => row.date?.slice(0, 7))
                .filter((month): month is string => Boolean(month))
        )
    ).sort();
};

export const getRowsForMonth = (currentMonth: string, rows: MonthRow[]): MonthRow[] => {
    return rows.filter((row) => row.date?.slice(0, 7) === currentMonth);
};

export const action = (monthRow: MonthRow[], act: "+" | "-", cat: string | null): number => {
    return monthRow.reduce((sum, row) => {
        const value = Number(row.sum ?? 0);

        if (!Number.isFinite(value) || value <= 0) {
            return sum;
        }

        const rowType = String(row.type ?? "").toLowerCase();

        if (act === "+" && rowType === "income" && cat === null) {
            return sum + value;
        }

        if (act === "-" && rowType === "costs" && cat === null) {
            return sum + value;
        }

        if (act === '+' && cat === row.categorie && rowType === "costs"){
             return sum + value;
        }

        if (act === '+' && cat === row.categorie && rowType === "income"){
             return sum + value;
        }

        return sum;
    }, 0);
};