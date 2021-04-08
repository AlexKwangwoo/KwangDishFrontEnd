import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import { GOOGLE_APIKEY } from "../../constants";
import { gql, useMutation, useSubscription } from "@apollo/client";
import { FULL_ORDER_FRAGMENT } from "../../fragments";
import { coockedOrders } from "../../generated/coockedOrders";
import { Link, useHistory } from "react-router-dom";
import { takeOrder, takeOrderVariables } from "../../generated/takeOrder";
import { Helmet } from "react-helmet";

const COOCKED_ORDERS_SUBSCRIPTION = gql`
  subscription coockedOrders {
    cookedOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const TAKE_ORDER_MUTATION = gql`
  mutation takeOrder($input: TakeOrderInput!) {
    takeOrder(input: $input) {
      ok
      error
    }
  }
`;

interface ICoords {
  lat: number;
  lng: number;
}

interface IDriverProps {
  lat: number;
  lng: number;
  $hover?: any;
}
const Driver: React.FC<IDriverProps> = () => <div className="text-lg">🚖</div>;

export const Dashboard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({ lng: 0, lat: 0 });
  const [map, setMap] = useState<google.maps.Map>();
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
      // map.panTo(new maps.LatLng(driverCoords.lat, driverCoords.lng));
      //panTo는 latLng객체를 매개변수로 받는데
      //new maps.LatLng(driverCoords.lat, driverCoords.lng) 이걸로 만들어주는것임!
      // panTo 해석: Changes the center of the map to the given LatLng

      map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
      //geocoder는 우리가 주소를 입력하면 지도에 위치를 찍어준다~!
      //reverseGeocoder는 좌표를주면 지도에 위치를 ㅉㄱ어준다!
      /* const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        {
          location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
        },
        //location에 값바로 줘도되고 maps.LatLng해도된다!
        (results, status) => {
          console.log(status, results);
        }
      ); */
    }
  }, [driverCoords.lat, driverCoords.lng]);

  //************map 은 defaultCenter={{lat: 36.58, lng: 125.95,}} 로 우리가 만든 맵
  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
    //map은 보여지고 있는 위치!! maps는 내가 있는위치!!
    //panTo 는 원하는위치로 이동시켜준다!
    // map.getZoom(); 밑에 googlemapreact에서 정보를 받아옴!
    setMap(map);
    setMaps(maps);
  };

  const makeRoute = () => {
    if (map) {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        polylineOptions: {
          strokeColor: "#000",
          strokeOpacity: 1,
          strokeWeight: 5,
        },
      });
      directionsRenderer.setMap(map);
      //지금 우리가 가지고 있는 맵을 기준으로 해준다!
      directionsService.route(
        {
          //출발 지역
          origin: {
            location: new google.maps.LatLng(
              driverCoords.lat,
              driverCoords.lng
            ),
          },
          //도착
          destination: {
            location: new google.maps.LatLng(
              driverCoords.lat + 0.05,
              driverCoords.lng + 0.05
            ),
          },
          travelMode: google.maps.TravelMode.WALKING,
          //이걸 해줘야 지도를 그려준다!
        },
        (result) => {
          directionsRenderer.setDirections(result);
        }
      );
    }
  };

  const { data: coockedOrdersData } = useSubscription<coockedOrders>(
    COOCKED_ORDERS_SUBSCRIPTION
  );
  useEffect(() => {
    if (coockedOrdersData?.cookedOrders.id) {
      makeRoute();
    }
  }, [coockedOrdersData]);

  const history = useHistory();
  const onCompleted = (data: takeOrder) => {
    if (data.takeOrder.ok) {
      history.push(`/orders/${coockedOrdersData?.cookedOrders.id}`);
    }
  };
  const [takeOrderMutation] = useMutation<takeOrder, takeOrderVariables>(
    TAKE_ORDER_MUTATION,
    {
      onCompleted,
    }
  );
  const triggerMutation = (orderId: number) => {
    takeOrderMutation({
      variables: {
        input: {
          id: orderId,
        },
      },
    });
  };

  return (
    <div>
      <Helmet>
        <title>Home | KwangDish</title>
      </Helmet>
      <div
        className="overflow-hidden"
        style={{ width: window.innerWidth, height: "50vh" }}
      >
        <GoogleMapReact
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
          //이것이 구글맵을 줄것임

          defaultZoom={16}
          draggable={true}
          defaultCenter={{
            lat: 36.58,
            lng: 125.95,
          }}
          bootstrapURLKeys={{ key: GOOGLE_APIKEY }}
        ></GoogleMapReact>
      </div>
      <div className=" max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg py-8 px-5">
        {coockedOrdersData?.cookedOrders.restaurant ? (
          <>
            <h1 className="text-center  text-3xl font-medium">
              New Coocked Order
            </h1>
            <h1 className="text-center my-3 text-2xl font-medium">
              Pick it up soon @
              {coockedOrdersData?.cookedOrders.restaurant?.name}
            </h1>
            <button
              onClick={() =>
                triggerMutation(coockedOrdersData?.cookedOrders.id)
              }
              className="btn w-full  block  text-center mt-5"
            >
              Accept Challenge &rarr;
            </button>
          </>
        ) : (
          <h1 className="text-center  text-3xl font-medium">
            No orders yet...
          </h1>
        )}
      </div>
    </div>
  );
};
