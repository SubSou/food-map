var container = document.getElementById("map"); //지도를 담을 영역의 DOM 레퍼런스
var options = {
  //지도를 생성할 때 필요한 기본 옵션
  center: new kakao.maps.LatLng(37.54, 126.96), //지도의 중심좌표.
  level: 8, //지도의 레벨(확대, 축소 정도)
};

var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

// 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
var mapTypeControl = new kakao.maps.MapTypeControl();

// 지도에 컨트롤을 추가해야 지도위에 표시됩니다
// kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

// 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
var zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
/*
**********************************************************
2. 더미데이터 준비하기 (제목, 주소, url, 카테고리)
*/

const dataSet = [
  {
    title: "희락돈까스",
    address: "서울 영등포구 양산로 210",
    url: "https://www.youtube.com/watch?v=1YOJbOUR4vw&t=88s",
    category: "양식",
  },
  {
    title: "즉석우동짜장",
    address: "서울 영등포구 대방천로 260",
    url: "https://www.youtube.com/watch?v=1YOJbOUR4vw&t=88s",
    category: "한식",
  },
  {
    title: "아카사카",
    address: "서울 서초구 서초대로74길 23",
    url: "https://www.youtube.com/watch?v=1YOJbOUR4vw&t=88s",
    category: "일식",
  },
];

// 주소-좌표 변환 객체를 생성합니다
var geocoder = new kakao.maps.services.Geocoder();

// 주소-좌표 변환 함수

function getContent(data) {
  // 유튜브 섬네일 가져오기
  let replaceUrl = data.url;
  let finUrl = "";
  replaceUrl = replaceUrl.replace("https://youtu.be/", "");
  replaceUrl = replaceUrl.replace("https://www.youtube.com/embed/", "");
  replaceUrl = replaceUrl.replace("https://www.youtube.com/watch?v=", "");
  finUrl = replaceUrl.split("&")[0];

  // 인포윈도우 가공하기
  return ` <div class="infowindow">
  <div class="infowindow-img-container">
    <img
      src="https://img.youtube.com/vi/${finUrl}/mqdefault.jpg"
      class="infowindow-img"
    />
  </div>
  <div class="infowindow-img-body">
    <h5 class="infowindow-title">${data.title}</h5>
    <p class="infowindow-address">${data.address}</p>
    <a href="${data.url}" class="infowindow-btn" target="_blank">영상이동</a>
  </div>
</div>`;
}

function getCoordsByAddress(address) {
  return new Promise((resovle, reject) => {
    // 주소로 좌표를 검색합니다
    geocoder.addressSearch(address, function (result, status) {
      // 정상적으로 검색이 완료됐으면
      if (status === kakao.maps.services.Status.OK) {
        var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        resovle(coords);
        return;
      }
      reject(new Error("getCoordsByAddress Error : not Vaild Address "));
    });
  });
}

async function setMap(dataSet) {
  for (var i = 0; i < dataSet.length; i++) {
    //마커를 생성합니다
    let coords = await getCoordsByAddress(dataSet[i].address);

    var marker = new kakao.maps.Marker({
      map: map, // 마커를 표시할 지도
      position: coords, // 마커를 표시할 위치
    });

    markerArray.push(marker);

    // 마커에 표시할 인포윈도우를 생성합니다
    var infowindow = new kakao.maps.InfoWindow({
      content: getContent(dataSet[i]), // 인포윈도우에 표시할 내용
    });

    infowindowArray.push(infowindow);

    // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
    // 이벤트 리스너로는 클로저를 만들어 등록합니다
    // for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
    kakao.maps.event.addListener(
      marker,
      "click",
      makeOverListener(map, marker, infowindow, coords)
    );
    kakao.maps.event.addListener(map, "click", makeOutListener(infowindow));
  }
}

//1. 클릭스 다른 인포윈도우 닫기
//2. 클릭한 곳으로 지도 중심 옯기기

// 인포윈도우를 표시하는 클로저를 만드는 함수입니다
function makeOverListener(map, marker, infowindow, coords) {
  return function () {
    //1. 클릭스 다른 인포윈도우 닫기
    closeInfowindow();
    infowindow.open(map, marker);
    //2. 클릭한 곳으로 지도 중심 옯기기
    map.panTo(coords);
  };
}

let infowindowArray = [];

function closeInfowindow() {
  for (let infowindow of infowindowArray) {
    infowindow.close();
  }
}

// 인포윈도우를 닫는 클로저를 만드는 함수입니다
function makeOutListener(infowindow) {
  return function () {
    infowindow.close();
  };
}

setMap(dataSet);

/**카테고리 분류 */

// 카테고리
const categoryMap = {
  korea: "한식",
  china: "중식",
  japan: "일식",
  america: "양식",
  wheat: "분식",
  meat: "구이",
  sushi: "회/초밥",
  etc: "기타",
};

const categoryList = document.querySelector(".category-list");
categoryList.addEventListener("click", categoryHandler);

function categoryHandler(event) {
  const categoryId = event.target.id;
  const category = categoryMap[categoryId];

  let categorizedDataSet = [];
  for (let data of dataSet) {
    if (data.category == category) {
      categorizedDataSet.push(data);
    }
  }

  // 기존 마커 삭제
  closeMarker();

  // 기존 윈도윈도우 닫기
  closeInfowindow();

  setMap(categorizedDataSet);
}

let markerArray = [];

function closeMarker() {
  for (marker of markerArray) {
    marker.setMap(null);
  }
}
