import React from "react";

// ui
import { LineGraph } from "components/ui";
// helpers
import { renderShortNumericDateFormat } from "helpers/date-time.helper";
//types
import { TCompletionChartDistribution } from "types";

type Props = {
  distribution: TCompletionChartDistribution;
  startDate: string | Date;
  endDate: string | Date;
  totalIssues: number;
};

const styleById = {
  ideal: {
    strokeDasharray: "6, 3",
    strokeWidth: 1,
  },
  default: {
    strokeWidth: 1,
  },
};

const DashedLine = ({ series, lineGenerator, xScale, yScale }: any) =>
  series.map(({ id, data, color }: any) => (
    <path
      key={id}
      d={lineGenerator(
        data.map((d: any) => ({
          x: xScale(d.data.x),
          y: yScale(d.data.y),
        }))
      )}
      fill="none"
      stroke={color ?? "#ddd"}
      style={styleById[id as keyof typeof styleById] || styleById.default}
    />
  ));

const ProgressChart: React.FC<Props> = ({ distribution, startDate, endDate, totalIssues }) => {
  const chartData = Object.keys(distribution).map((key) => ({
    currentDate: renderShortNumericDateFormat(key),
    pending: distribution[key],
  }));

  return (
    <div className="w-full flex justify-center items-center">
      <LineGraph
        animate
        curve="monotoneX"
        height="160px"
        width="100%"
        enableGridY={false}
        lineWidth={1}
        margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
        data={[
          {
            id: "pending",
            color: "#3F76FF",
            data: chartData.map((item, index) => ({
              index,
              x: item.currentDate,
              y: item.pending,
              color: "#3F76FF",
            })),
            enableArea: true,
          },
          {
            id: "ideal",
            color: "#a9bbd0",
            fill: "transparent",
            data: [
              {
                x: chartData[0].currentDate,
                y: totalIssues,
              },
              {
                x: chartData[chartData.length - 1].currentDate,
                y: 0,
              },
            ],
          },
        ]}
        layers={["grid", "markers", "areas", DashedLine, "slices", "points", "axes", "legends"]}
        axisBottom={{
          tickValues: chartData.map((item, index) => (index % 2 === 0 ? item.currentDate : "")),
        }}
        enablePoints={false}
        enableArea
        colors={(datum) => datum.color ?? "#3F76FF"}
        customYAxisTickValues={[0, totalIssues]}
        gridXValues={chartData.map((item, index) => (index % 2 === 0 ? item.currentDate : ""))}
        theme={{
          background: "transparent",
          axis: {
            domain: {
              line: {
                stroke: "rgb(var(--color-border))",
                strokeWidth: 1,
              },
            },
          },
        }}
      />
    </div>
  );
};

export default ProgressChart;
