import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function Home() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchWeather()
  }, [])

  const fetchWeather = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/weather')
      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setWeather(data)
      }
    } catch (err) {
      setError('Nie udało się pobrać danych pogodowych')
    } finally {
      setLoading(false)
    }
  }

  const getWeatherIcon = (code, isDay) => {
    if (code === 0) return isDay ? '☀️' : '🌙'
    if (code <= 3) return '⛅'
    if (code <= 48) return '☁️'
    if (code <= 67) return '🌧️'
    if (code <= 77) return '🌨️'
    if (code <= 82) return '🌧️'
    if (code <= 86) return '🌨️'
    if (code <= 99) return '⛈️'
    return '🌤️'
  }

  const getWeatherDescription = (code) => {
    if (code === 0) return 'Czyste niebo'
    if (code <= 3) return 'Częściowo pochmurno'
    if (code <= 48) return 'Pochmurno'
    if (code <= 67) return 'Deszcz'
    if (code <= 77) return 'Śnieg'
    if (code <= 82) return 'Przelotne opady'
    if (code <= 86) return 'Opady śniegu'
    if (code <= 99) return 'Burza'
    return 'Zmienne zachmurzenie'
  }

  return (
    <>
      <Head>
        <title>Pogoda w Przedwojów</title>
        <meta name="description" content="Aktualna pogoda w Przedwojów" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="container">
        <h1>🌤️ Pogoda w Przedwojów</h1>

        {loading && (
          <div className="card">
            <p>Ładowanie danych pogodowych...</p>
          </div>
        )}

        {error && (
          <div className="card error">
            <p>❌ {error}</p>
            <button onClick={fetchWeather}>Spróbuj ponownie</button>
          </div>
        )}

        {weather && !loading && (
          <>
            <div className="card current">
              <div className="weather-icon">
                {getWeatherIcon(weather.current.weathercode, weather.current.is_day)}
              </div>
              <h2>Aktualna pogoda</h2>
              <div className="temperature">{Math.round(weather.current.temperature_2m)}°C</div>
              <p className="description">{getWeatherDescription(weather.current.weathercode)}</p>
              <div className="details">
                <div className="detail-item">
                  <span>💨 Wiatr:</span>
                  <span>{Math.round(weather.current.windspeed_10m)} km/h</span>
                </div>
                <div className="detail-item">
                  <span>💧 Wilgotność:</span>
                  <span>{weather.current.relative_humidity_2m}%</span>
                </div>
                <div className="detail-item">
                  <span>☔ Opady:</span>
                  <span>{weather.current.precipitation} mm</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3>Prognoza na najbliższe dni</h3>
              <div className="forecast">
                {weather.daily.time.slice(0, 7).map((date, index) => (
                  <div key={date} className="forecast-day">
                    <div className="date">{new Date(date).toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric', month: 'numeric' })}</div>
                    <div className="forecast-icon">
                      {getWeatherIcon(weather.daily.weathercode[index], true)}
                    </div>
                    <div className="temp-range">
                      <span className="temp-max">{Math.round(weather.daily.temperature_2m_max[index])}°</span>
                      <span className="temp-min">{Math.round(weather.daily.temperature_2m_min[index])}°</span>
                    </div>
                    <div className="precipitation-prob">
                      ☔ {weather.daily.precipitation_probability_max[index]}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="footer">
              <p>Ostatnia aktualizacja: {new Date().toLocaleString('pl-PL')}</p>
              <button onClick={fetchWeather}>🔄 Odśwież</button>
            </div>
          </>
        )}
      </main>
    </>
  )
}
