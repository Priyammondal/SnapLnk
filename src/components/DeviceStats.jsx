import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = ['#FF5555', '#F97316', '#A855F7', '#22C55E'];

const renderOutsideLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  name,
}) => {
  if (percent < 0.06) return null;

  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 16; // keeps label inside card
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-xs fill-zinc-300"
    >
      <tspan className="font-medium">{name}</tspan>
      <tspan
        x={x}
        dy="1.2em"
        className="fill-zinc-400 text-[11px]"
      >
        {(percent * 100).toFixed(0)}%
      </tspan>
    </text>
  );
};

export default function DeviceStats({ stats = [] }) {
  if (!stats.length) return null;

  const deviceCount = stats.reduce((acc, curr) => {
    acc[curr.device] = (acc[curr.device] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(deviceCount).map(([device, count]) => ({
    name: device,
    value: count,
  }));

  return (
    <div className="w-full h-[260px] px-2">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius="52%"
            outerRadius="70%"
            paddingAngle={2}
            label={renderOutsideLabel}
            labelLine={false}
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
