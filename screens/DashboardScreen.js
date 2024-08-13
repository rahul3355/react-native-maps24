import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import CovidData from './../ukhsa-chart-download.json';

const screenWidth = Dimensions.get('window').width;

const generateRandomColor = () => {
  return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
};

export default function DashboardScreen() {
  const [data1, setData1] = useState([]);
  const [lineData, setLineData] = useState({ labels: [], datasets: [{ data: [] }] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await fetch('https://covid-api.com/api/reports?date=2021-12-20&iso=GBR');
        const data1 = await response1.json();
        
        const formattedData1 = data1.data.map(region => ({
          name: region.region.province,
          cases: region.confirmed,
          color: generateRandomColor(),  // Correct color generation
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        }));
        setData1(formattedData1);
        console.log("Data 1: ", formattedData1);

        const formattedLineData = {
          labels: CovidData.slice(0, 4).map(item => item.date),
          datasets: [{
            data: CovidData.slice(0, 4).map(item => parseFloat(item.metric_value)),
            strokeWidth: 2, 
          }]
        };
        setLineData(formattedLineData);
        console.log("Line Data: ", formattedLineData);

        setLoading(false); 
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.text}>COVID-19 Dashboard</Text>

      {data1.length > 0 && (
        <>
          <Text style={styles.chartTitle}>Confirmed Cases by Region</Text>
          <BarChart
            style={styles.chart}
            data={{
              labels: data1.map(item => item.name),
              datasets: [{ data: data1.map(item => item.cases) }]
            }}
            width={screenWidth - 16}
            height={220}
            yAxisLabel=""
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            verticalLabelRotation={30}
          />
        </>
      )}

      {data1.length > 0 && (
        <>
          <Text style={styles.chartTitle}>Active Cases Distribution</Text>
          <PieChart
            data={data1}
            width={screenWidth - 16}
            height={220}
            chartConfig={{
              backgroundColor: "#1cc910",
              backgroundGradientFrom: "#eff3ff",
              backgroundGradientTo: "#efefef",
              color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="cases"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </>
      )}

      {lineData.labels.length > 0 && (
        <>
          <Text style={styles.chartTitle}>COVID-19 Rolling Mean (England)</Text>
          <LineChart
            data={lineData}
            width={screenWidth - 16}
            height={220}
            chartConfig={{
              backgroundColor: "#022173",
              backgroundGradientFrom: "#1e3d73",
              backgroundGradientTo: "#2a5298",
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            bezier
          />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  }
});
