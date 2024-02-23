import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  ScrollView,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import Octicons from "react-native-vector-icons/Octicons";
import * as shape from "d3-shape";
import Data from "./Indexfund";
import Time from "./Time";
import Contribute from "./Contribute";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import CustomStackedBarChart from "./CustomStackedBarChart";
import CustomStackedAreaChart from "./CustomStackedAreaChart";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function Main() {
  const [isBarChartPressed, setBarChartPressed] = useState(true);
  const [isLineChartPressed, setLineChartPressed] = useState(false);
  const [initialInvestment, setInitialInvestment] = useState("");
  const [monthlyAddition, setMonthlyAddition] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);
  const [numYears, setNumYears] = useState("");
  const [isTimeModalVisible, setTimeModalVisible] = useState(false);
  const [isTimeSelected, setTimeSelected] = useState("");
  const [isTimeValue, setTimeValue] = useState(null);
  const [isContributeModalVisible, setContributeModalVisible] = useState(false);
  const [isContributeSelected, setContributeSelected] = useState("");
  const [isContributeValue, setContributeValue] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [AmountInvested, setAmountInvested] = useState(0);
  const [Profit, setProfit] = useState(0);
  const [investmentResults, setInvestmentResults] = useState([]);
  const [isDataReady, setDataReady] = useState(false);

  const handleBarChartPressed = () => {
    setBarChartPressed(true);
    setLineChartPressed(false);
  };

  const handleLineChartPressed = () => {
    setLineChartPressed(true);
    setBarChartPressed(false);
  };

  const calculateAndUpdate = () => {
    calculateCompoundInterest();
    setDataReady(true);
  };

  const ensureNumeric = (value) => {
    const numericValue = parseFloat(value);
    return isNaN(numericValue) ? "" : numericValue.toString();
  };

  const handleInitialInvestmentChange = (text) => {
    const numericValue = ensureNumeric(text);
    setInitialInvestment(numericValue);
  };

  const handleMonthlyAdditionChange = (text) => {
    const numericValue = ensureNumeric(text);
    setMonthlyAddition(numericValue);
  };

  const handleNumYearsChange = (text) => {
    const numericValue = ensureNumeric(text);
    setNumYears(numericValue);
  };

  const handleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleOptionSelect = (label, value) => {
    setSelectedOption(label);
    setSelectedValue(parseFloat(value));
    setModalVisible(false);
  };

  const handleTimeModal = () => {
    setTimeModalVisible(!isTimeModalVisible);
  };

  const handleTimeSelect = (label, value) => {
    setTimeSelected(label);
    setTimeValue(parseFloat(value));
    setTimeModalVisible(false);
    calculateAndUpdate();
  };

  const handleContributeModal = () => {
    setContributeModalVisible(!isContributeModalVisible);
  };

  const handleContributeSelect = (label, value) => {
    setContributeSelected(label);
    setContributeValue(parseFloat(value));
    setContributeModalVisible(false);
    calculateAndUpdate();
  };

  const handlePlusPress = () => {
    let currentValue = parseInt(monthlyAddition, 10);
    setMonthlyAddition((currentValue + 100).toString());
  };

  const handleMinusPress = () => {
    let currentValue = parseInt(monthlyAddition, 10);
    setMonthlyAddition((currentValue - 100).toString());
  };

  const calculateCompoundInterest = () => {
    const Principal = parseFloat(initialInvestment);
    const MonthlyContribution = parseFloat(monthlyAddition);
    const compoundingFrequency = parseFloat(isTimeValue);
    const AnnualInterestRate = parseFloat(selectedValue) / 100;
    const years = parseInt(numYears);
    const contributeFrequency = parseFloat(isContributeValue);

    const results = [];
    let currentBalance = Principal;
    let totalInvested = Principal;

    for (let year = 1; year <= years; year++) {
      const n = compoundingFrequency;
      const r = AnnualInterestRate;
      const t = year;

      totalInvested += MonthlyContribution * contributeFrequency;

      const FV_initial = Principal * Math.pow(1 + r / n, n * t);
      const FV_contributions =
        (MonthlyContribution *
          (contributeFrequency / n) *
          (Math.pow(1 + r / n, n * t) - 1)) /
        (r / n);

      currentBalance = FV_initial + FV_contributions;

      const Profit = currentBalance - totalInvested;

      results.push({
        year,
        totalAmount: currentBalance,
        investedAmount: totalInvested,
        Fvalue: Profit,
      });
    }

    const totalReturn = currentBalance;
    const netProfit = totalReturn - totalInvested;

    setCurrentBalance(totalReturn);
    setAmountInvested(totalInvested);
    setProfit(netProfit);
    setInvestmentResults(results);
  };
  const firebaseConfig = {
    apiKey: "AIzaSyDjJLI7-r-T0z_jezm42rAqk4_6Vd8ST1g",
    authDomain: "calculator-1e0bb.firebaseapp.com",
    databaseURL: "https://calculator-1e0bb-default-rtdb.firebaseio.com",
    projectId: "calculator-1e0bb",
    storageBucket: "calculator-1e0bb.appspot.com",
    messagingSenderId: "1088653754037",
    appId: "1:1088653754037:web:e57d79af1144a81b7d48fc",
    measurementId: "G-R5YGFGZ2GE",
  };

  const app = initializeApp(firebaseConfig);

  function storeCalculation(calc) {
    const db = getDatabase();
    const reference = ref(db, "Data/" + calc);
    set(reference, { totalValue: investmentResults });
  }

  useEffect(() => {
    calculateCompoundInterest();
  }, [
    initialInvestment,
    monthlyAddition,
    selectedValue,
    numYears,
    isContributeSelected,
    isTimeSelected,
  ]);

  return (
    <View style={styles.mainContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Feather name="menu" size={responsiveFontSize(3)} />
          <Text style={{ fontSize: responsiveFontSize(2.5) }}>
            New Calculation
          </Text>
          <FontAwesome name="save" size={responsiveFontSize(3)} />
        </View>
        <View style={styles.chartcontainer}>
          <TouchableOpacity
            style={[
              styles.chartbtn,
              isBarChartPressed ? { backgroundColor: "#1C90FC" } : {},
            ]}
            onPress={handleBarChartPressed}
          >
            <Text
              style={{
                fontSize: responsiveFontSize(2.3),
                color: isBarChartPressed ? "white" : "black",
              }}
            >
              Bar Chart
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.chartbtn,
              isLineChartPressed ? { backgroundColor: "#1C90FC" } : {},
            ]}
            onPress={handleLineChartPressed}
          >
            <Text
              style={{
                fontSize: responsiveFontSize(2.3),
                color: isLineChartPressed ? "white" : "black",
              }}
            >
              Line Chart
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <View style={styles.amountSection}>
            <View>
              <Text style={{ fontSize: responsiveFontSize(2.2) }}>
                Initial Amount ($)
              </Text>
              <View style={styles.amountInput}>
                <TextInput
                  placeholder="1,000"
                  keyboardType="numeric"
                  value={initialInvestment.toString()}
                  onChangeText={handleInitialInvestmentChange}
                />
              </View>
            </View>
            <View>
              <Text style={{ fontSize: responsiveFontSize(2.2) }}>
                Addition($)
              </Text>
              <View
                style={[
                  styles.amountInput,
                  {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  },
                ]}
              >
                <TextInput
                  placeholder="300"
                  keyboardType="numeric"
                  style={{
                    width: "50%",
                    height: "100%",
                  }}
                  value={monthlyAddition.toString()}
                  onChangeText={handleMonthlyAdditionChange}
                />

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      height: responsiveHeight(5),
                      width: responsiveWidth(10),
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onPress={handlePlusPress}
                  >
                    <MaterialCommunityIcons
                      name="plus-minus-variant"
                      size={responsiveFontSize(4)}
                      color="#33D881"
                      style={{ left: "60%", elevation: 10 }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      height: responsiveHeight(5),
                      width: responsiveWidth(10),
                      justifyContent: "center",
                    }}
                    onPress={handleMinusPress}
                  ></TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.section3}>
          <View>
            <Text style={{ fontSize: responsiveFontSize(2.2) }}>
              Growth Rate (%)
            </Text>
            <View
              style={{
                flexDirection: "row",
                width: windowWidth / 1.9,
                height: windowHeight / 18,
                justifyContent: "space-between",
                borderWidth: 1,
                borderRadius: 5,
                borderColor: "grey",
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "80%",
                  alignItems: "center",
                  paddingHorizontal: "3%",
                }}
                onPress={handleModal}
                onPressIn={storeCalculation}
              >
                <Text>{selectedOption}</Text>
                <AntDesign name="caretdown" size={responsiveFontSize(2)} />
              </TouchableOpacity>
              <View
                style={{
                  height: "100%",
                  width: "20%",
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                  borderLeftWidth: 1,
                  borderColor: "grey",
                }}
              >
                <TextInput>{selectedValue}</TextInput>
              </View>
            </View>
          </View>
          <View>
            <Text style={{ fontSize: responsiveFontSize(2.2) }}>
              Time Duration (Year)
            </Text>
            <TextInput
              placeholder="5"
              style={styles.timeinput}
              keyboardType="numeric"
              value={numYears.toString()}
              onChangeText={handleNumYearsChange}
            />
          </View>
          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="fade"
          >
            <View style={styles.modalContainer}>
              <View
                style={{
                  padding: "3%",
                  height: windowHeight / 3,
                  width: windowWidth / 1.5,
                  backgroundColor: "white",
                  elevation: 5,
                  justifyContent: "space-between",
                  borderRadius: 5,
                }}
              >
                <FlatList
                  data={Data}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalOption}
                      onPress={() => handleOptionSelect(item.label, item.value)}
                    >
                      <Text
                        style={{
                          fontSize: responsiveFontSize(2),
                          fontWeight: "600",
                        }}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </Modal>
        </View>
        <View style={styles.section4}>
          <View style={styles.compoundSection}>
            <Text style={{ fontSize: responsiveFontSize(2.2) }}>Compound</Text>
            <TouchableOpacity
              style={styles.compoundbtn}
              onPress={handleTimeModal}
            >
              <Text style={{ fontSize: responsiveFontSize(2.2) }}>
                {isTimeSelected}
              </Text>
              <AntDesign name="caretdown" size={responsiveFontSize(2)} />
            </TouchableOpacity>
          </View>
          <Modal
            visible={isTimeModalVisible}
            transparent={true}
            animationType="fade"
          >
            <View style={styles.modalContainer}>
              <View
                style={{
                  padding: "3%",
                  height: windowHeight / 2,
                  width: windowWidth / 1.2,
                  backgroundColor: "white",
                  elevation: 5,
                  justifyContent: "space-between",
                  borderRadius: 5,
                }}
              >
                <FlatList
                  data={Time}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalOption}
                      onPress={() => handleTimeSelect(item.label, item.value)}
                    >
                      <Text
                        style={{
                          fontSize: responsiveFontSize(2.3),
                          fontWeight: "600",
                        }}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </Modal>
        </View>
        <View style={styles.section5}>
          <View style={styles.compoundSection}>
            <Text style={{ fontSize: responsiveFontSize(2.2) }}>
              Contribute
            </Text>
            <TouchableOpacity
              style={styles.compoundbtn}
              onPress={handleContributeModal}
            >
              <Text style={{ fontSize: 18 }}>{isContributeSelected}</Text>
              <AntDesign name="caretdown" size={responsiveFontSize(2)} />
            </TouchableOpacity>
          </View>
          <Modal
            visible={isContributeModalVisible}
            transparent={true}
            animationType="fade"
          >
            <View style={styles.modalContainer}>
              <View
                style={{
                  padding: "3%",
                  height: windowHeight / 2.8,
                  width: windowWidth / 1.2,
                  backgroundColor: "white",
                  elevation: 5,
                  justifyContent: "space-between",
                  borderRadius: 5,
                }}
              >
                <FlatList
                  data={Contribute}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalOption}
                      onPress={() =>
                        handleContributeSelect(item.label, item.value)
                      }
                    >
                      <Text
                        style={{
                          fontSize: responsiveFontSize(2.3),
                          fontWeight: "600",
                        }}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </Modal>
        </View>
        <View
          style={{
            height: windowHeight / 10,
            marginTop: "4%",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <View style={styles.amountShown}>
            <View style={styles.infoShown}>
              <Octicons
                name="dot-fill"
                size={responsiveFontSize(2)}
                color="red"
              />
              <Text
                style={{
                  fontSize: responsiveFontSize(2.2),
                  marginLeft: "5%",
                  color: "grey",
                }}
              >
                Total
              </Text>
            </View>
            <Text style={{ fontSize: responsiveFontSize(2.2) }}>
              $ {isNaN(currentBalance) ? "0.00" : currentBalance.toFixed(2)}
            </Text>
          </View>
          <View style={styles.amountShown}>
            <View style={styles.infoShown}>
              <Octicons
                name="dot-fill"
                size={responsiveFontSize(2)}
                color="#1C90FC"
              />
              <Text
                style={{
                  fontSize: responsiveFontSize(2.2),
                  marginLeft: "5%",
                  color: "grey",
                }}
              >
                Contribution
              </Text>
            </View>
            <Text
              style={{
                fontSize: responsiveFontSize(2.2),
                color: "#1C90FC",
              }}
            >
              $ {isNaN(AmountInvested) ? "0.00" : AmountInvested.toFixed(2)}
            </Text>
          </View>
          <View style={styles.amountShown}>
            <View style={styles.infoShown}>
              <Octicons
                name="dot-fill"
                size={responsiveFontSize(2)}
                color="#48D88B"
              />
              <Text
                style={{
                  fontSize: responsiveFontSize(2.2),
                  marginLeft: "5%",
                  color: "grey",
                }}
              >
                Profit
              </Text>
            </View>
            <Text
              style={{
                fontSize: responsiveFontSize(2.2),
                color: "#48D88B",
              }}
            >
              $ {isNaN(Profit) ? "0.00" : Profit.toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={styles.charts}>
          {isBarChartPressed && (
            <CustomStackedBarChart investmentResults={investmentResults} />
          )}
          {isDataReady && isLineChartPressed && (
            <CustomStackedAreaChart investmentResults={investmentResults} />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <View
            style={{
              paddingHorizontal: responsiveWidth(2.5),
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              height: responsiveHeight(5),
              width: windowWidth,
              backgroundColor: "#D2D4D1",
              alignSelf: "center",
            }}
          >
            <Text
              style={{ fontSize: responsiveFontSize(2.2), fontWeight: 600 }}
            >
              Period
            </Text>
            <Text
              style={{ fontSize: responsiveFontSize(2.2), fontWeight: 600 }}
            >
              End Balance
            </Text>
          </View>
          <View>
            {investmentResults?.map((result) => (
              <View
                key={result.year}
                style={[
                  styles.detailComponent,
                  {
                    backgroundColor:
                      result.year % 2 === 0 ? "#D2D4D1" : "white",
                  },
                ]}
              >
                <Text
                  style={{ fontSize: responsiveFontSize(2), fontWeight: 600 }}
                >
                  Year {result.year}
                </Text>
                <View
                  style={{
                    justifyContent: "space-evenly",
                    alignItems: "flex-end",
                    height: "100%",
                  }}
                >
                  <Text
                    style={{
                      fontSize: responsiveFontSize(1.8),
                      fontWeight: 600,
                    }}
                  >
                    $ {result.totalAmount.toFixed(2).toLocaleString()}
                  </Text>
                  <Text
                    style={{
                      fontSize: responsiveFontSize(1.8),
                      fontWeight: 600,
                      color: "#1C90FD",
                    }}
                  >
                    $ {result.investedAmount.toFixed(2).toLocaleString()}
                  </Text>
                  <Text
                    style={{
                      fontSize: responsiveFontSize(1.8),
                      fontWeight: 600,
                      color: "#8EEF8E",
                    }}
                  >
                    $ {result.Fvalue.toFixed(2).toLocaleString()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  header: {
    marginTop: responsiveHeight(3),
    paddingHorizontal: responsiveWidth(2.2),
    height: windowHeight / 15,
    width: responsiveWidth(98),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chartbtn: {
    height: "100%",
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  chartcontainer: {
    flexDirection: "row",
    width: windowWidth / 1.05,
    height: windowHeight / 20,
    alignSelf: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "grey",
  },
  amountSection: {
    marginVertical: "2%",
    paddingHorizontal: "2%",
    flexDirection: "row",
    width: windowWidth,
    height: windowHeight / 13,
    alignSelf: "center",
    justifyContent: "space-between",
  },
  amountInput: {
    width: windowWidth / 2.12,
    height: windowHeight / 20,
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "grey",
    paddingLeft: "2%",
  },
  section3: {
    width: windowWidth / 1.05,
    height: windowHeight / 12,
    marginTop: responsiveHeight(0.1),
    alignSelf: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  timeinput: {
    width: windowWidth / 2.4,
    height: windowHeight / 18,
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "grey",
    paddingHorizontal: responsiveWidth(2),
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalOption: {
    paddingHorizontal: "3%",
    paddingVertical: "3%",
    height: responsiveHeight(7.5),
  },
  section4: {
    width: windowWidth / 1.05,
    height: windowHeight / 12,
    alignSelf: "center",
    marginTop: "2%",
  },
  compoundbtn: {
    height: "80%",
    paddingHorizontal: "3%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "grey",
  },
  compoundSection: {
    width: windowWidth / 1.05,
    height: windowHeight / 12,
  },
  section5: {
    width: windowWidth / 1.05,
    height: windowHeight / 12,
    alignSelf: "center",
    marginTop: "4%",
  },
  amountShown: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: windowWidth / 1.05,
    alignSelf: "center",
    zIndex: 2,
  },
  infoShown: {
    flexDirection: "row",
    width: windowWidth / 2,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  charts: {
    height: windowHeight / 3.5,
    width: windowWidth,
  },
  detailComponent: {
    paddingHorizontal: responsiveWidth(3),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: windowHeight / 11,
    width: windowWidth,
    alignSelf: "center",
  },
});
