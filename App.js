import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
} from "react-native";

const TEXT_COLOR = "#000000";
const PRIMARY_COLOR = "#29dcb84f";
const API_KEY = "8d65446c85d6112b04a3a647c47ae781";

const App = () => {
  const [search, setSearch] = useState("");
  const [temperature, setTemperature] = useState(null);
  const [city, setCity] = useState("");
  const [pais, setPais] = useState("");
  const [feelsLike, setFeelsLike] = useState(null);
  const [max, setMax] = useState(0);
  const [min, setMin] = useState(0);
  const [humedad, setHumedad] = useState(0);
  const [viento, setViento] = useState(0);
  const [description, setDescription] = useState("");
  const [tiempoNow, setTiempoNow] = useState("");
  const [amanece, setAmanece] = useState("");
  const [anochece, setAnochese] = useState("");
  const [estatus, setEstatus] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);


  const [forecastTomorrow, setForecastTomorrow] = useState(null);



  useEffect(() => {
    fetchWeatherData();
  }, []);

  const updateSearch = (text) => {
    setSearch(text);
  };

  const handleSearch = () => {
    fetchWeatherData();
  };

  const queDiaMes = () => {
    let diasSemana = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    let meses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    let now = new Date();
    let dia_semana = now.getDay();
    let mes = now.getMonth();
    let diafinal = diasSemana[dia_semana];
    let mesfinal = meses[mes];
    let arrayfinal = [diafinal, mesfinal];

    return arrayfinal;
  };

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${API_KEY}&units=metric&lang=sp`
      );

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${search}&appid=${API_KEY}&units=metric&lang=sp`
      );
      const data = await response.json();
      const forecastData = await forecastResponse.json();

      if (response.ok) {
        const currentTemperature = data.main.temp;
        const country = data.sys.country;
        const cityName = data.name;
        const feelsLikeTemperature = data.main.feels_like;
        const maxima = data.main.temp_max;
        const minima = data.main.temp_min;
        const hum = data.main.humidity;
        const wind = data.wind.speed;
        const descrip = data.weather[0].description;
        const horario = data.timezone / 3600;
        const sunrise = data.sys.sunrise * 1000;
        const sunset = data.sys.sunset * 1000;
        const estado = data.weather[0].main;
        const timezoneResponse = await fetch(
          `http://api.timezonedb.com/v2.1/get-time-zone?key=YOUR_TIMEZONEDB_API_KEY&format=json&by=position&lat=${data.coord.lat}&lng=${data.coord.lon}`
        );
        const timezoneData = await timezoneResponse.json();

        const currentDate = new Date();
        const timezoneOffset = timezoneData.gmtOffset;
        currentDate.setSeconds(currentDate.getSeconds() + timezoneOffset);

        setCurrentDateTime(currentDate.toLocaleString());
        setTemperature(currentTemperature);
        setCity(cityName);
        setPais(country);
        setFeelsLike(feelsLikeTemperature);
        setMax(maxima);
        setMin(minima);
        setHumedad(hum);
        setViento(wind);
        setDescription(descrip);
        setTiempoNow(horario);
        setErrorMessage(null);
        setAmanece(sunrise);
        setAnochese(sunset);
        setEstatus(estado);

        const forecastItems = forecastData.list;
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const forecastTomorrowItems = forecastItems.filter(item => {
          const itemDate = new Date(item.dt * 1000);
          itemDate.setHours(0, 0, 0, 0);
          return itemDate.getTime() === tomorrow.getTime();
        });

        const forecastTomorrowMax = Math.max(
          ...forecastTomorrowItems.map(item => item.main.temp_max)
        );
        const forecastTomorrowMin = Math.min(
          ...forecastTomorrowItems.map(item => item.main.temp_min)
        );

        setForecastTomorrow({
          max: forecastTomorrowMax,
          min: forecastTomorrowMin
        });



        
      } else {
        setTemperature(0);
        setCity(null);
        setPais(null);
        setFeelsLike(0);
        setMax(0);
        setMin(0);
        setHumedad(null);
        setViento(null);
        setTiempoNow(null);
        setDescription(null);
        setAmanece(null);
        setAnochese(null);
        setEstatus(null);
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.log("Error al obtener la temperatura:", error);
      setErrorMessage("Ha ocurrido un error. Inténtelo de nuevo más tarde.");
    }
  };

  const esDeDia = () => {
    let fechaActual = new Date();
    let horaLocal = fechaActual.getUTCHours() + tiempoNow;
    let dia = new Date(amanece).getUTCHours();
    let noche = new Date(anochece).getUTCHours();

    if (horaLocal >= dia && horaLocal < noche) {
      return true;
    } else {
      return false;
    }
  };

  const horaAmanece = (amanecer) => {
    const fechaAmanece = new Date(amanecer);
    const horaAmanece = fechaAmanece.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return horaAmanece;
  };

  const iconsStado = (estatus) => {
    let rutaImagen = "";
    if (esDeDia()) {
      switch (estatus) {
        case "Clear":
          rutaImagen = require("./assets/img/ClearD.png");
          break;
        case "Rain":
          rutaImagen = require("./assets/img/RainD.png");
          break;
        case "Atmosphere":
          rutaImagen = require("./assets/img/AtmosphereD.png");
          break;
        case "Clouds":
          rutaImagen = require("./assets/img/CloudsD.png");
          break;
        case "Drizzle":
          rutaImagen = require("./assets/img/DrizzleD.png");
          break;
        case "Snow":
          rutaImagen = require("./assets/img/SnowD.png");
          break;
        case "Thunderstorm":
          rutaImagen = require("./assets/img/ThunderstormD.png");
          break;
        case "Mist":
          rutaImagen = require("./assets/img/mistD.png");
          break;
        case "Smoke":
          rutaImagen = require("./assets/img/smoke.png");
          break;
        case "Haze":
          rutaImagen = require("./assets/img/haze.png");
          break;
        case "Dust":
          rutaImagen = require("./assets/img/dust.png");
          break;
        case "Fog":
          rutaImagen = require("./assets/img/fog.png");
          break;
        case "Sand":
          rutaImagen = require("./assets/img/sand.png");
          break;
        case "Ash":
          rutaImagen = require("./assets/img/ash.png");
          break;
        case "Squall":
          rutaImagen = require("./assets/img/squall.png");
          break;
        case "Tornado":
          rutaImagen = require("./assets/img/tornado.png");
          break;
        default:
          rutaImagen = null;
          break;
      }
    } else {
      switch (estatus) {
        case "Clear":
          rutaImagen = require("./assets/img/ClearN.png");
          break;
        case "Rain":
          rutaImagen = require("./assets/img/RainN.png");
          break;
        case "Atmosphere":
          rutaImagen = require("./assets/img/AtmosphereN.png");
          break;
        case "Clouds":
          rutaImagen = require("./assets/img/CloudsN.png");
          break;
        case "Drizzle":
          rutaImagen = require("./assets/img/DrizzleN.png");
          break;
        case "Snow":
          rutaImagen = require("./assets/img/SnowN.png");
          break;
        case "Thunderstorm":
          rutaImagen = require("./assets/img/ThunderstormN.png");
          break;
        case "Mist":
          rutaImagen = require("./assets/img/mistD.png");
          break;
        case "Smoke":
          rutaImagen = require("./assets/img/smoke.png");
          break;
        case "Haze":
          rutaImagen = require("./assets/img/haze.png");
          break;
        case "Dust":
          rutaImagen = require("./assets/img/dust.png");
          break;
        case "Fog":
          rutaImagen = require("./assets/img/fog.png");
          break;
        case "Sand":
          rutaImagen = require("./assets/img/sand.png");
          break;
        case "Ash":
          rutaImagen = require("./assets/img/ash.png");
          break;
        case "Squall":
          rutaImagen = require("./assets/img/squall.png");
          break;
        case "Tornado":
          rutaImagen = require("./assets/img/tornado.png");
          break;
        default:
          rutaImagen = null;
          break;
      }
    }

    return rutaImagen;
  };

  const mes = queDiaMes()[1];

  const estacionanio = () => {
    let ruta;

    switch (mes) {
      case "Septiembre":
      case "Octubre":
      case "Noviembre":
        ruta = require("./assets/img/wallpaper/Primavera1.png");
        break;
      case "Diciembre":
      case "Enero":
      case "Febrero":
        ruta = require("./assets/img/wallpaper/Verano1.png");
        break;
      case "Marzo":
      case "Abril":
      case "Mayo":
        ruta = require("./assets/img/wallpaper/otoño1.png");
        break;
      case "Junio":
      case "Julio":
      case "Agosto":
        ruta = require("./assets/img/wallpaper/invierno1.png");
        break;
      default:
        ruta = null;
        break;
    }

    return ruta;
  };

  const renderWeatherForecast = (day, tempMin, tempMax) => {
    return (
      <View style={styles.forecastContainer}>
        <View style={styles.forecastBox}>
          <Text style={styles.forecastDay}>{day}</Text>
          <Image
          source={iconsStado(estatus)}
        style={styles.iconsmini}
          />
          <Text style={styles.forecastTemperature}>
            Temp Min {tempMin}°C
          </Text>
          <Text style={styles.forecastTemperature}>
            Temp Max {tempMax}°C
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.background}
        source={estacionanio()}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={updateSearch}
            value={search}
            placeholder="Ingrese Ciudad"
            placeholderTextColor={TEXT_COLOR}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Buscar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.weatherContainer}>
          <Text style={styles.title}>
            {city} - {pais}
          </Text>
          <Text style={styles.date}>{queDiaMes()[0]}</Text>
          <Text style={styles.date}>{currentDateTime}</Text>
          <Image style={styles.weatherImage} source={iconsStado(estatus)} />
          <Text style={styles.temperature}>
            {temperature ? `Temp: ${temperature.toFixed(1)}°C` : "Temp: -"}
          </Text>
          <Text style={styles.feelsLike}>
            ST: {feelsLike ? `${feelsLike.toFixed(1)}°C` : "-"}
          </Text>
          <Text style={styles.weatherDescription}>{description}</Text>
        </View>

        {errorMessage && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        <View style={styles.infoContainer1}>
          <View style={styles.infoBox1}>
            <Text style={styles.infoText1}>Temp Min</Text>
            <Text style={styles.infoValue1}>{min.toFixed(1)}°C</Text>
          </View>
          <View style={styles.infoBox1}>
            <Text style={styles.infoText1}>Temp Max</Text>
            <Text style={styles.infoValue1}>{max.toFixed(1)}°C</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Humedad</Text>
            <Text style={styles.infoValue}>{humedad}%</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Velocidad Viento</Text>
            <Text style={styles.infoValue}>{viento} Km/H</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Amanecer</Text>
            <Text style={styles.infoValue}>
              {amanece ? horaAmanece(amanece) : "--"}
            </Text>
          </View>
        </View>

        <View style={styles.forecastContainer}>
        {forecastTomorrow && (
        renderWeatherForecast(
          "Mañana",
          forecastTomorrow.min,
          forecastTomorrow.max
        )
      )}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    color: TEXT_COLOR,
    fontSize: 40,
    textAlign: "center",
    backgroundColor: "#fdfdfdad",
    borderRadius: 50,
  },
  searchButton: {
    backgroundColor: "#ff9fff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
    marginLeft: 10,
  },
  searchButtonText: {
    color: TEXT_COLOR,
    fontSize: 25,
  },
  weatherContainer: {
    backgroundColor: "#fdfdfd7d",
    borderRadius: 80,
    alignItems: "center",
    marginRight: 60,
    marginLeft: 60,
    padding: 10,
    marginBottom: 20,
    marginTop: 20,
    borderColor: "black",
  },
  title: {
    fontSize: 45,
    fontWeight: "bold",
    color: TEXT_COLOR,
  },
  date: {
    marginVertical: 5,
    color: TEXT_COLOR,
    fontSize: 30,
    fontWeight: "bold"
  },
  weatherImage: {
    marginVertical: 20,
    resizeMode: "center",
    height: 130,
    width: 130,
  },
  temperature: {
    marginBottom: 10,
    fontSize: 40,
    fontWeight: "bold",
    color: TEXT_COLOR,
  },
  feelsLike: {
    fontSize: 35,
    fontWeight: "900",
    color: TEXT_COLOR,
    marginBottom: 5,
  },
  weatherDescription: {
    fontSize: 20,
    textDecorationLine: "underline",
    fontWeight: "bold",
    color: TEXT_COLOR,
  },

  infoContainer1: {
    backgroundColor: "#fdfdfd7d",
    marginRight: 70,
    marginLeft: 70,
    borderRadius: 60,
    marginBottom: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },

  infoBox1: {
    margin: 10,
  },
  infoText1: {
    color: TEXT_COLOR,
    textAlign: "center",
    fontSize: 20,
  },
  infoValue1: {
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
    color: TEXT_COLOR,
  },

  infoContainer: {
    backgroundColor: "#fdfdfd7d",
    borderRadius: 50,
    margin: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },

  infoBox: {
    margin: 10,
  },
  infoText: {
    color: TEXT_COLOR,
    textAlign: "center",
    fontSize: 25,
  },
  infoValue: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    color: TEXT_COLOR,
  },

  forecastContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#fdfdfdad",
    padding: 25,
    borderRadius: 80,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  forecastBox: {
    flexDirection: "column",
    alignItems: "center",
    margin: 11,
  },
  forecastDay: {
    color: TEXT_COLOR,
    fontSize: 30,
    textAlign: "center",
  },
  forecastImage: {
    width: 60,
    height: 60,
  },
  forecastTemperature: {
    color: TEXT_COLOR,
  },
  
  iconsmini:{
    height: 60,
    width: 60,
  },
  errorContainer: {
    backgroundColor: "red",
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
  errorText: {
    color: TEXT_COLOR,
    fontSize: 18,
    textAlign: "center",
  }
});

export default App;
