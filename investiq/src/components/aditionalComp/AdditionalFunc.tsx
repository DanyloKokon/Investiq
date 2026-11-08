import { months } from "../map";

export interface MonthRow {
    row_id?: string | number;
    date?: string;
    description?: string;
    categorie?: string;
    sum?: number | string;
    type?: string;
    [key: string]: unknown;
}

export const getMonthlyTotals = (rows: MonthRow[], type: "costs" | "income") => {
    const totals = new Map<string, number>();
    const years = new Set<string>();

    rows.forEach((row) => {
        const month = row.date?.slice(0, 7);
        const rowType = String(row.type ?? "").toLowerCase();
        const value = Number(row.sum ?? 0);

        if (
            !month ||
            !/^\d{4}-(0[1-9]|1[0-2])$/.test(month) ||
            rowType !== type ||
            !Number.isFinite(value)
        ) {
            return;
        }

        years.add(month.slice(0, 4));
        totals.set(month, (totals.get(month) ?? 0) + value);
    });

    if (years.size === 0) {
        years.add(String(new Date().getFullYear()));
    }

    return Array.from(years)
        .sort()
        .flatMap((year) => months.map((month, index) => {
            const key = `${year}-${String(index + 1).padStart(2, "0")}`;
            return { key, month: `${month.month} ${year}`, total: totals.get(key) ?? 0 };
        }));
};

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

        if (act === '+' && cat === row.categorie && rowType === "costs") {
            return sum + value;
        }

        if (act === '+' && cat === row.categorie && rowType === "income") {
            return sum + value;
        }

        return sum;
    }, 0);
};
