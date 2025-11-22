import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { format } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ClickHistoryChartProps {
  clickHistory?: Array<{
    date: string;
    count: number;
  }>;
}

export const ClickHistoryChart = ({ clickHistory = [] }: ClickHistoryChartProps) => {
  const data = {
    labels: clickHistory.map((item) => format(new Date(item.date), "MMM d")),
    datasets: [
      {
        label: "Clicks",
        data: clickHistory.map((item) => item.count),
        borderColor: "hsl(var(--primary))",
        backgroundColor: "hsl(var(--primary) / 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "hsl(var(--primary))",
        pointBorderColor: "hsl(var(--background))",
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "hsl(var(--popover))",
        titleColor: "hsl(var(--popover-foreground))",
        bodyColor: "hsl(var(--popover-foreground))",
        borderColor: "hsl(var(--border))",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context: any) => `${context.parsed.y} clicks`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          color: "hsl(var(--muted-foreground))",
        },
        grid: {
          color: "hsl(var(--border) / 0.3)",
        },
        border: {
          display: false,
        },
      },
      x: {
        ticks: {
          color: "hsl(var(--muted-foreground))",
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="h-64">
      <Line data={data} options={options} />
    </div>
  );
};
