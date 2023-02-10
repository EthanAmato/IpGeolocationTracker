import './index.scss'
import { useRef, useState } from 'react'
import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { Marker } from 'react-leaflet'
import { useMap } from 'react-leaflet'
import { useMapEvent } from 'react-leaflet'
import { Popup } from 'react-leaflet'
import $ from 'jquery'

function App() {
  const [ipData, setIpData] = useState();
  const [pos, setPos] = useState([40.730610, -73.935242]);
  // const map = useMap()
  const ipRef = useRef()
  const animateRef = useRef(false)
  async function handleSubmit(e) {
    e.preventDefault()
    let userIpInput = ipRef.current.value;

    //Check user input using regex for 255.255.255.255 notation for IP addresses
    if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(userIpInput)) {
      $(function () {
        $.ajax({
          url: "https://geo.ipify.org/api/v2/country,city",
          data: { apiKey: import.meta.env.VITE_IP_API_KEY, ipAddress: userIpInput },
          success: function (data) {
            setIpData(() => data)
            return data;
          }
        }).then((res) => {
          console.log("In meme");
          console.log(res.location)
          setPos(() => [res.location.lat, res.location.lng])
          return [res.location.lat, res.location.lng]
        })
      });
    } else {
      console.log('error')
    }
  }

  function SetViewOnSubmit() {
    const map = useMap()
    map.panTo(pos)

    return null
  }
  return (
    <>
      <main className='wrapper'>
        <header>
          <h1>IP Address Tracker</h1>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder='Search for any IP address or domain' ref={ipRef} />
            <input type={'submit'} />
          </form>
        </header>
        {/* <div className='results'>

        </div> */}
        <MapContainer center={pos} zoom={13} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        {ipData &&  <Marker position={pos}>
            <Popup className='popup'>
              <h2 className='popup'>Welcome to {ipData.location.city + ", " + ipData.location.region}</h2><br />
              <p className='popup'>Latitude: {pos[0]}, Longitude: {pos[1]}</p>
            </Popup>
          </Marker>}
          <SetViewOnSubmit />
        </MapContainer>
      </main>
    </>
  );

}
export default App
