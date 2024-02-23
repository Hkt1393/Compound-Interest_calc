import { StyleSheet, Text, View, Dimensions } from "react-native";
import React from "react";
import {
  VictoryArea,
  VictoryChart,
  VictoryStack,
  VictoryLabel,
  VictoryAxis,
  VictoryContainer,
} from "victory-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function CustomStackedAreaChart({ investmentResults }) {
  const chartData = investmentResults || [];

  const chartLabels = investmentResults?.map((result) =>
    result.year.toString()
  );
  const totalAmountData = investmentResults?.map(
    (result) => result.totalAmount
  );
  const investedAmount = investmentResults?.map(
    (result) => result.investedAmount
  );
  const Fvalue = investmentResults?.map((result) => result.Fvalue);
  
  const graphData = investmentResults?.map((dataPoint) => ({
    x: dataPoint.investedAmount,
    y: dataPoint.Fvalue,
    totalAmount: dataPoint.totalAmount,
  }));

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {graphData.length > 0 && (
        <VictoryChart
          width={windowWidth * 1.2}
          height={windowHeight / 2.5}
          style={{
            background: { fill: "transparent" },
          }}
        >
          <VictoryAxis
            tickValues={[...Array(chartLabels.length).keys()]}
            tickFormat={chartLabels}
            dependentAxis
            style={{
              axis: { display: "none" },
              ticks: { display: "none" },
              tickLabels: { display: "none" },
              grid: { display: "none" },
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              axis: { display: "none" },
              ticks: { display: "none" },
              tickLabels: { display: "none" },
            }}
          />
          <VictoryStack colorScale={["#1C90FC", "#8EEF8E"]}>
            <VictoryArea
              data={graphData}
              x="x"
              y0={(data) => data.totalAmount}
              y={(data) => data.x}
            />
            <VictoryArea
              data={graphData}
              x="x"
              y0={(data) => data.totalAmount}
              y={(data) => data.y}
            />
          </VictoryStack>
        </VictoryChart>
      )}
    </View>
  );
}
