export default async function handler(req, res) {
  // Coordinates for Przedwojów, Poland
  const lat = 51.0475
  const lon = 21.8897

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weathercode,windspeed_10m,is_day&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Europe/Warsaw`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch weather data')
    }

    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: 'Nie udało się pobrać danych pogodowych' })
  }
}
