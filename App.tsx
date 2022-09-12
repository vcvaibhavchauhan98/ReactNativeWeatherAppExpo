import * as React from 'react';
import { Button, View, Text, StyleSheet, TextInput, Image } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen({ navigation }:any) {
  const [text, onChangeText] = React.useState('');
  var dataSource :any;
  var flagData:any;

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TextInput  
      style={styles.input}
      value={text}
        onChangeText={(input:any) => {
          onChangeText(input)
        }}

        placeholder="Enter Country"
      />

      <Button
        title="Submit"
        onPress={async () => {
          var flagUrl = `https://restcountries.com/v3.1/name/${text}`;
          var mainUrl = `http://api.weatherstack.com/current?access_key=12039b280eecc1775816218a398a8091&query=${text}`;

          await fetch(mainUrl)
            .then((response) => response.json())
            .then((responseJson) => {
              dataSource = responseJson;
            })
            .catch((error) => {
              console.log(error);
            });
          await fetch(flagUrl)
            .then((response) => response.json())
            .then((responseJsonImage) => {
              flagData = responseJsonImage;
            })
            .catch((error) => {
              console.log(error);
            });
          navigation.navigate('Country', {
            dataSource: dataSource,
            flagData: flagData,
          });
        }}
      />
    </View>
  );
}

function CountryScreen({ navigation, route }:any) {
  const apiData = route.params.dataSource;
  const apiFlagData = route.params.flagData;
  const flagUri = apiFlagData[0].flags.png;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text
        style={{
          justifyContent: 'center',
          fontSize: 26,
          marginTop:100
        }}>
        {' '}
        Country Details
      </Text>
      <Image
        style={styles.flag}
        source={{
          uri: flagUri,
        }}
      />
      <View style={styles.detail}>
        <Text style={styles.font}> Capital : {apiData?.location?.name}</Text>
        <Text style={styles.font}>
          {' '}
          Country Population : {apiFlagData[0].population}
        </Text>
        <Text style={styles.font}>
          {' '}
          Latitude : {apiData?.location?.lat} deg{' '}
        </Text>
        <Text style={styles.font}>
          {' '}
          Longitude : {apiData?.location?.lon} deg
        </Text>
      </View>
      <Button
        title="Capital Weather"
        onPress={() => navigation.navigate('Weather', { apiData: apiData })}
      />
      <Button
      title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

function WeatherScreen({ navigation, route }:any) {
  const apiDataSource = route.params.apiData;
  const weatherIcon = apiDataSource.current.weather_icons[0];
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 22 }}> Weather Details </Text>
      <Image style={styles.icon} source={{ uri: weatherIcon }} />

      <View style={styles.detail}>
        <Text style={styles.font}>
          {' '}
          Temperature : {apiDataSource.current.temperature} C
        </Text>
        <Text style={styles.font}>
          {' '}
          Precipitation : {apiDataSource.current.precip} %
        </Text>
        <Text style={styles.font}>
          {' '}
          Wind Speed : {apiDataSource.current.wind_speed} Kmph
        </Text>
      </View>
    </View>
  );
}
const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Weather" component={WeatherScreen} />
      <Stack.Screen name="Country" component={CountryScreen} />
    </Stack.Navigator>
  );
}
const styles = StyleSheet.create({
  input: {
    width: 180,
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  flag: {
    width: '80%',
    height: '40%',
    marginTop: 70,
  },
  detail: {
    fontSize: 56,
    marginTop: 20,
    paddingBottom: 25,
  },
  font: {
    fontSize: 20,
    lineHeight: 40,
  },
  icon: {
    marginTop: 200,
    width: '50%',
    height: '30%',
  },
});

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}