import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BarChartType } from "../components/admin/monitoring-form/hooks/hook";

interface SdgComparisonChartProps {
  data: BarChartType;
}

const SdgComparisonChart: React.FC<SdgComparisonChartProps> = ({ data }) => {
  const sdgKeys = Object.keys(data[0] || {}).filter((key) => key !== "name");

  const sdgNamesMap: { [key: string]: string } = {
    no_poverty: "No Poverty",
    zero_hunger: "Zero Hunger",
    "good_health_and_well-being": "Good Health & Well-being",
    quality_education: "Quality Education",
    gender_equality: "Gender Equality",
    clean_water_and_sanitation: "Clean Water & Sanitation",
    affordable_and_clean_energy: "Affordable & Clean Energy",
    decent_work_and_economic_growth: "Decent Work & Economic Growth",
    "industry,_innovation,_and_infrastructure":
      "Industry, Innovation & Infrastructure",
    reduced_inequalities: "Reduced Inequalities",
    sustainable_cities_and_communities: "Sustainable Cities & Communities",
    responsible_consumption_and_production:
      "Responsible Consumption & Production",
    climate_action: "Climate Action",
    life_below_water: "Life Below Water",
    life_on_land: "Life on Land",
    "peace,_justice,_and_strong_institutions":
      "Peace, Justice & Strong Institutions",
    partnerships_for_the_goals: "Partnerships for the Goals",
  };

  return (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          label={{ value: "College", position: "bottom" }}
        />
        <YAxis
          label={{
            value: "Number of Submissions",
            angle: -90,
            position: "left",
          }}
        />
        <Tooltip />
        <Legend />
        {sdgKeys.map((key) => (
          <Bar
            key={key}
            dataKey={key}
            name={sdgNamesMap[key] || key}
            stackId="a" // Same stackId groups bars for each college
            fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SdgComparisonChart;
