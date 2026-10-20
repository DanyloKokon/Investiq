import ChartJS from "chart.js/auto";
import { useEffect, useMemo, useRef } from "react";
import type { MonthRow } from "./AdditionalFunc";

interface ChartProps {
    cat: string;
    categoryName: string;
    rows: MonthRow[];
    ifCosts: boolean
}

function Chart({ cat, categoryName, rows, ifCosts }: ChartProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<ChartJS | null>(null);

    const productTotals = useMemo(() => {
        const totals = new Map<string, number>();

        rows.forEach((row) => {
            if (row.categorie !== cat || String(row.type ?? "").toLowerCase() !== "costs") {
                return;
            }

            const amount = Number(row.sum ?? 0);
            if (!Number.isFinite(amount) || amount <= 0) {
                return;
            }

            const productName = row.description?.trim() || "Без назви";
            totals.set(productName, (totals.get(productName) ?? 0) + amount);
        });

        return Array.from(totals, ([product, amount]) => ({ product, amount }));
    }, [cat, rows]);

    const incomeTotals = useMemo(() => {
        const totals = new Map<string, number>();
        rows.forEach((row) => {
            if (row.categorie !== cat || String(row.type ?? "").toLowerCase() !== "income") {
                return;
            }

            const amount = Number(row.sum ?? 0);
            if (!Number.isFinite(amount) || amount <= 0) {
                return;
            }

            const productName = row.description?.trim() || "Без назви";
            totals.set(productName, (totals.get(productName) ?? 0) + amount);
        });

        return Array.from(totals, ([product, amount]) => ({ product, amount }));
    }, [cat, rows]);

    const chartTotals = ifCosts ? productTotals : incomeTotals;
    const chartLabel = ifCosts ? "Витрати" : "Доходи";

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || chartTotals.length === 0) {
            return;
        }

        chartRef.current?.destroy();
        const chart = new ChartJS(canvas, {
            type: "bar",
            data: {
                labels: chartTotals.map(({ product }) => product),
                datasets: [{
                    label: chartLabel,
                    data: chartTotals.map(({ amount }) => amount),
                    backgroundColor: "#f4a261",
                    borderColor: "#e76f51",
                    borderWidth: 1,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });

        chartRef.current = chart;
        return () => {
            chart.destroy();
            if (chartRef.current === chart) {
                chartRef.current = null;
            }
        };
    }, [chartTotals, chartLabel]);

    const emptyMessage = ifCosts
        ? "У цій категорії за період немає витрат."
        : "У цій категорії за період немає доходів.";

    return (
        <section className="category-chart" aria-label={`${chartLabel} категорії ${categoryName}`}>
            <h2>{chartLabel} за записами: {categoryName}</h2>
            {chartTotals.length > 0 ? (
                <div className="category-chart-canvas">
                    <canvas ref={canvasRef} role="img" aria-label={`${chartLabel} за кожним записом у категорії ${categoryName}`} />
                </div>
            ) : (
                <p>{emptyMessage}</p>
            )}
        </section>
    );
}

export default Chart;
