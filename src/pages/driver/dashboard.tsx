import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import { GOOGLE_APIKEY } from "../../constants";

interface ICoords {
  lat: number;
  lng: number;
}

export const Dashboard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({ lng: 0, lat: 0 });
  const [map, setMap] = useState<any>();
  const [maps, setMaps] = useState<any>();

  // @ts-ignore
  const onSucces = ({ coords: { latitude, longitude } }: Position) => {
    //위도 경도를 알수있다!
    //driverCoords 를 정해줌!!!
    setDriverCoords({ lat: latitude, lng: longitude });
  };
  // @ts-ignore
  const onError = (error: PositionError) => {
    console.log(error);
  };
  useEffect(() => {
    navigator.geolocation.watchPosition(onSucces, onError, {
      //watchPosition은 우리가 움직이는걸 알수있다!
      //이걸 onSuccess에 넒겨 우리가 움직일때마다 driverCoords.lat, driverCoords.lng
      //알수있다!
      enableHighAccuracy: true,
    });
  }, []);

  useEffect(() => {
    if (map && maps) {
      //map은 디폴트로 만들어진 맵! 우리가 화면에 보는거..
      //근데 maps(객체라 보면됨..)의 클래스를 이용하여 우리가  map을
      // 내가 있는위치로 driverCoords.lat, driverCoords.lng
      // 옮겨줌을 할수있는 클래스!! maps.LatLng 사용해 옮김!!
      map.panTo(new maps.LatLng(driverCoords.lat, driverCoords.lng));
      //panTo는 latLng객체를 매개변수로 받는데
      //new maps.LatLng(driverCoords.lat, driverCoords.lng) 이걸로 만들어주는것임!
      // panTo 해석: Changes the center of the map to the given LatLng
    }
  }, [driverCoords.lat, driverCoords.lng]);

  //************map 은 defaultCenter={{lat: 36.58, lng: 125.95,}} 로 우리가 만든 맵
  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    map.panTo(new maps.LatLng(driverCoords.lat, driverCoords.lng));
    //map은 보여지고 있는 위치!! maps는 내가 있는위치!!
    //panTo 는 원하는위치로 이동시켜준다!
    // map.getZoom(); 밑에 googlemapreact에서 정보를 받아옴!
    setMap(map);
    setMaps(maps);
  };
  return (
    <div>
      <div
        className="overflow-hidden"
        style={{ width: window.innerWidth, height: "50vh" }}
      >
        <GoogleMapReact
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
          //이것이 구글맵을 줄것임

          defaultZoom={16}
          draggable={false}
          defaultCenter={{
            lat: 36.58,
            lng: 125.95,
          }}
          bootstrapURLKeys={{ key: GOOGLE_APIKEY }}
        >
          <div
            // @ts-ignore
            lat={driverCoords.lat}
            lng={driverCoords.lng}
            //이것이 우리가 원하는 위치에 자동차를 놓을것이다!
            className="text-lg"
          >
            🚖
          </div>
        </GoogleMapReact>
      </div>
    </div>
  );
};
