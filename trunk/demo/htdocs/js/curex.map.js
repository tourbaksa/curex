(function(curex) {
	
	var self = {};

	var map = null;
	var convMap = null;
	var data = null;
	var markers = null;

	self.create = function(selector) {

		// 맵 생성
		map = new daum.maps.Map(selector.get(0), {
			center: new daum.maps.LatLng(37.488, 127.031),				
			level: 2
		});

		// 좌표변환을 위한 Daum API V2 맵 객체 생성 (V3에는 변환메서드가 없음)
		selector.after("<div id='mapConv' style='width:0; height:0; display:none;'></div>");
		convMap = new DMap("mapConv", { point : new DLatLng(37.488, 127.031), level:2 });

	};
	
	self.setData = function(d) {
		data = $.extend({ selected : 0, level : 2, control : 'Y' }, d);
		
		for (var i=0; i<data.addrs.length; i++) {
			// icon 설정
			data.addrs[i].icon = "/mobile/images/common/ico_map_" + data.addrs[i].icon + ".png";

			// 주소체계변환 (congnamul -> wsg84)
			var coord = self.getTransCoord(data.addrs[i].x, data.addrs[i].y, "congnamul", "wgs84");
			data.addrs[i].lng = coord.x;
			data.addrs[i].lat = coord.y;
		}

		// 선택된 좌표로 설정
		self.move(data.selected);

		// 컨트롤 추가
		if (data.control == 'Y') {
			map.addControl(new daum.maps.ZoomControl(), daum.maps.ControlPosition.RIGHT);
			map.addControl(new daum.maps.MapTypeControl(), daum.maps.ControlPosition.TOPRIGHT);
		}

		// 마커 추가 
		var iconSize = new daum.maps.Size(20, 26);
		markers = [];
		for (var i=0; i<data.addrs.length; i++) {
			var marker = new daum.maps.Marker({
				position : new daum.maps.LatLng(data.addrs[i].lat, data.addrs[i].lng),
				image : new daum.maps.MarkerImage(data.addrs[i].icon, iconSize)
			});
			marker.setMap(map);
			markers.push(marker);
		}

		// infoWindow 생성
		var infoWindow = new daum.maps.InfoWindow({
			content: '<p style="margin:10px;"></p>',
			removable : true
		});

		// 마커 클릭시 처리 
		$("map").each(function(i) {			
			$(this).click(function() {
				infoWindow.setContent("<p style='margin:10px;'>" + data.addrs[i].name + "</p>");
				infoWindow.open(map, markers[i]);
			});
		});
	}

	self.move = function(i) {
		map.setCenter(new daum.maps.LatLng(data.addrs[i].lat, data.addrs[i].lng));
	};
	
	// 좌표변환을 위한 Daum API V2 사용(V3에는 변환메서드가 없음)
	self.getTransCoord = function(x, y, from, to) {
		return convMap.getTransCoord(new DPoint(x, y), from, to);
	};

	if (!curex) window.curex = curex = {};
	curex.map = self;
  
})(window.curex);