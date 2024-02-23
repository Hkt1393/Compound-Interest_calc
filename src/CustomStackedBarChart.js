import { StyleSheet, Text, View, Dimensions } from "react-native";
import React from "react";
import { StackedBarChart } from "react-native-chart-kit";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function CustomStackedBarChart({ investmentResults }) {
  const chartData = {
    data: investmentResults?.map((result) => [
      result.investedAmount,
      result.Fvalue,
    ]),
    barColors: ["#1C90FC", "#8EEF8E"],
  };

  const chartConfig = {
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientTo: "#FFFFFF",
    fromZero: true,
    color: () => "transparent",
    gridLabel: () => "",
    barPercentage: 1.1,
    strokeWidth: 1,
    useShadowColorFromDataset: false,
    decorator: () => [],
    withVerticalLabels: true,
    withHorizontalLabels: true,
  };

  return (
    <View>
      <StackedBarChart
        style={{
          height: windowHeight / 30,
          right: windowWidth / 5,
        }}
        data={chartData}
        width={windowWidth * 1.2}
        height={windowHeight / 2.9}
        chartConfig={chartConfig}
        showGrid={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
