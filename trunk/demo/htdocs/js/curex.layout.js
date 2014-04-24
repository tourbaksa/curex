/**
 * 
 */

(function(curex) {
	
	var self = {};
	self.event = $({});
	var screenId = ''; //화면별 고유 ID	
	var changeScreenId = '';// 최종 변경될 화면 ID
	var detachBody = {}; //화면 id="contents" 내용, floating bar, 화면 id, 대메뉴 id 저장.	
	var hasDetachBody = false;
		

	//기존 이미 열려 있는 screenId 반환
	//1depth 일때만 기존 화면 반환, 2depth, 3depth 선택일 경우는 새로운 화면 로드.
	function getDetachScreenId(id,depth){		
		if(id != null && id !== undefined && id != '' && id.length > 2 && depth == '1'){
			if(detachBody[id.substring(0,2)]){
				hasDetachBody = true;
				return detachBody[id.substring(0,2)].screenId;
			}else{
				hasDetachBody = false;
				return id;
			}			
		}else{
			hasDetachBody = false;
			return id;
		}		
	};
	
	//기존 열려 있던 page 화면에 붙이기
	function appendBody(id){		
		if(id.substring(0,2) != screenId.substring(0,2)){
			setDetachBody();
		}
		
		$('#contents').html(detachBody[id.substring(0,2)].body);
		$('#conteiner').append(detachBody[id.substring(0,2)].bar);
		$('#lipsPlanDiv').html(detachBody[id.substring(0,2)].lipsPlan);
		$('#lipsTabDiv').html(detachBody[id.substring(0,2)].lipsTab);
		screenId = id;
	};
	
	//ajax로 불러올 page load
	function setBody(id,data){		
		if(id.substring(0,2) != screenId.substring(0,2)){
			setDetachBody();
		}else{
			if($('#checkList').length > 0){
				$('#checkList').remove();
			}
		}
		screenId = id;
		$('#contents').html(data);
	};
	
	//현재 로드 되어 있는 page 저장
	function setDetachBody(){
		detachBody[screenId.substring(0,2)] = {
				body : $('#contents').children().detach(),
				bar : $('#checkList').detach(),
				lipsPlan : $('#lipsPlanDiv').children().detach(),
				lipsTab : $('#lipsTabDiv').children().detach(),
				screenId : screenId
		};		
	}
	
	
		
	
	//현재 화면의 screenId 반환
	function getScreenId(){		
		return screenId;
	};

	//location title 변경
	function setLocation(location_title){		
		var hgroup = $('#hgroup');
		var ul = hgroup.find('ul.location');
		if(ul.size() == 1){
			ul.empty();
		}else{
			if(ul.size() > 1){
				ul.remove();
			}
			ul = $('<ul class="location"></ul>');
		}
		
		ul.append('<li><a href="#">홈&nbsp;</a></li>');
		
		if(location_title['depth1']){
			ul.append('<li>&gt;<a href="'+location_title['depth1'].url+'">&nbsp;'+location_title['depth1'].title+'&nbsp;</a></li>');
			changeScreenId = location_title['depth1'].screenId;
			//title 변경
			window.document.title = location_title['depth1'].title;
		}
		if(location_title['depth2']){
			ul.append('<li>&gt;<a href="'+location_title['depth2'].url+'">&nbsp;'+location_title['depth2'].title+'&nbsp;</a></li>');
			changeScreenId = location_title['depth2'].screenId;
			//title 변경
			window.document.title = location_title['depth2'].title;
		}
		if(location_title['depth3']){
			ul.append('<li>&gt;<a href="'+location_title['depth3'].url+'">&nbsp;'+location_title['depth3'].title+'</a></li>');
			changeScreenId = location_title['depth3'].screenId;
			//title 변경
			window.document.title = location_title['depth3'].title;
		}
		hgroup.append(ul);


	}
	
	//현재 화면 로드시 screenId 저장
	self.setScreenId = function(id){		
		screenId = id;	
	};

	//gnb 메뉴 선택 시
	self.changePage =function (url,id,depth){		
		/*$('#wrap').removeClass('checkList');		

		//sitemap 등록된 popup 찾아서 닫기.
		$("[id$='_popup']").each(function(index){
			curex.dialog.close($(this).attr('id'));
		});


		if(url == '' || url === undefined || url == null){
			alert('화면 url 정보가 없습니다.');
			return;
		}

		//기존에 열려 있던 화면 id를 가져옴.
		id = getDetachScreenId(id,depth);

		if(id == '' || id === undefined || id == null){
			alert('화면 id 정보가 없습니다.');
			return;
		}*/


		location.hash=id;
		
		//gnb 초기화
		curex.globalnavi.clear();				


		//1depth 메뉴 클릭시에 기존에 하위 화면이 열려 있던게 있는지 체크
		//없으면 하위 메뉴중 1depth와 동일한 url 가진 화면이 열리고
		//있으면 기존 열린 화면이 로드 되고, 메뉴가 선택 될 수 있도록.
		

		
		var menuLink = $('#gnb').find('a[data-screenId='+id+']');
		var depth = menuLink.data('depth');
		var menuTitle = menuLink.text();
		var location_title = {};
		

		if("1" == depth){
			menuLink.not(".depth1-link-selected").addClass("depth1-link-selected");			
			menuLink.siblings('.depth2-wrap').not(".depth2-Wrap-selected").addClass("depth2-Wrap-selected");
			menuLink.not('.on').addClass('on');

			curex.globalnavi.setDepth2Wrap(menuLink.siblings('.depth2-wrap'));
			curex.globalnavi.setDepth1Link(menuLink);
			
			location_title['depth1'] = {
				title : menuTitle,
				url : menuLink.attr('href'),
				screenId : menuLink.attr('data-screenId')
			};
			//depth2 설정								
			menuLink.siblings('div.depth2-wrap').find('> ul li > a.depth2-link').each(function(){				
				var depth2 = $(this);				
				if(depth2.attr('href') == menuLink.attr('href')){
					depth2.not(".depth2-link-selected").addClass("depth2-link-selected");
					depth2.not('.on').addClass('on');										
					curex.globalnavi.setDepth2Link(depth2);

					menuTitle = depth2.text();					
					location_title['depth2'] = {
						title : menuTitle,
						url : depth2.attr('href'),
						screenId : depth2.attr('data-screenId')
					};

					//depth3 세팅
					depth2.parents('li').find('div.depth3-wrap > ul li > a.depth3-link').each(function(){

						if($(this).attr('href') == menuLink.attr('href')){
							$(this).not(".depth3-link-selected").addClass("depth3-link-selected");
							$(this).not('.on').addClass('on');

							menuTitle = $(this).text();							
							location_title['depth3'] = {
								title : menuTitle,
								url : $(this).attr('href'),
								screenId : $(this).attr('data-screenId')
							};
						}
					});
				}
				
			});
		}else if("2" == depth){
			
			//depth1 설정
			var depth1 = menuLink.parents().siblings('.depth1-link');
			depth1.not(".on").addClass('on');
			depth1.not(".depth1-link-selected").addClass("depth1-link-selected");			
			curex.globalnavi.setDepth1Link(depth1);

			location_title['depth1'] = {
				title : depth1.text(),
				url : depth1.attr('href'),
				screenId : depth1.attr('data-screenId')
			};

			
			//depth2 설정
			menuLink.not(".on").addClass('on');
			menuLink.not(".depth2-link-selected").addClass("depth2-link-selected");
			menuLink.parents('.depth2-wrap').not(".depth2-Wrap-selected").addClass("depth2-Wrap-selected");
			
			curex.globalnavi.setDepth2Wrap(menuLink.parents('.depth2-wrap'));
			curex.globalnavi.setDepth2Link(menuLink);
			
			location_title['depth2'] = {
				title : menuTitle,
				url : menuLink.attr('href'),
				screenId : menuLink.attr('data-screenId')
			};

			
			//depth3 설정
			menuLink.parents('li').find('div.depth3-wrap > ul li').each(function(){
				var depth3 = $(this).find('a');				
				if(depth3.attr('href') == menuLink.attr('href')){					
					depth3.parents('.depth2-wrap').not(".depth2-Wrap-selected").addClass("depth2-Wrap-selected");
					depth3.not(".depth3-link-selected").addClass("depth3-link-selected");
					depth3.not('.on').addClass('on');

					menuTitle = depth3.text();

					location_title['depth3'] = {
						title : menuTitle,
						url : depth3.attr('href'),
						screenId : depth3.attr('data-screenId')
					};
				}
			});
			
		}else if("3" == depth){
			
			
			//depth2 설정			
			var depth2 = menuLink.parents('li').children('.depth2-link');
			
			depth2.not(".depth2-link-selected").addClass("depth2-link-selected");
			depth2.not(".on").addClass('on');
			depth2.parents('.depth2-wrap').not(".depth2-Wrap-selected").addClass("depth2-Wrap-selected");
			
			curex.globalnavi.setDepth2Wrap(depth2.parents('.depth2-wrap'));
			curex.globalnavi.setDepth2Link(depth2);
			
			location_title['depth2'] = {
				title : depth2.text(),
				url : depth2.attr('href'),
				screenId : depth2.attr('data-screenId')
			};
			
			//depth1 설정
			var depth1 = depth2.parents().siblings('.depth1-link');			
			depth1.not(".on").addClass('on');
			depth1.not(".depth1-link-selected").addClass("depth1-link-selected");			
			curex.globalnavi.setDepth1Link(depth1);
			
			location_title['depth1'] = {
				title : depth1.text(),
				url : depth1.attr('href'),
				screenId : depth1.attr('data-screenId')
			};
			
			//depth3 설정
			menuLink.not(".depth3-link-selected").addClass("depth3-link-selected");
			menuLink.not('.on').addClass('on');
			
			location_title['depth3'] = {
				title : menuTitle,
				url : menuLink.attr('href'),
				screenId : menuLink.attr('data-screenId')
			};
		}else{
			return;
		}
				

		
		$('#menuTitle').text(menuTitle);
		setLocation(location_title);		

		//현재 열린 페이지면 화면 불러오지 않음.
		if(getScreenId() == changeScreenId){		
			//return;
			hasDetachBody = false;
		}		
		
		/*if(hasDetachBody){//유지되고 있는 화면이 있을경우
			appendBody(changeScreenId);
			self.event.trigger('screenchanged');
		}else{//ajax로 새로운 화면 불러오는 경우
			var linkUrl = "";
			if(typeof url == 'string'){
				linkUrl = url;
			}else{
				url = curex.util.checkJquery(url);	
				linkUrl = url.attr('href');
			}
			
			if(linkUrl.indexOf('?') > -1){
				linkUrl = linkUrl + "&";
			}else{
				linkUrl = linkUrl + "?";
			}
			var ajaxOption = {
					url : linkUrl+"templet=blank",
					cache : false,
				 	type : 'POST',
					contentType : "application/x-www-form-urlencoded; charset=UTF-8",			
					success : function(data){
						var $result = $(data);
						var contents = $result.siblings('#contents').children();
						setBody(changeScreenId,contents);
						self.event.trigger('screenchanged');
					},
					error:function(data){						
						location.href = linkUrl;
					}
			};
			$.ajax(ajaxOption);				
		}	*/		
	};
	
	//저장중인 화면 객체.
	self.getDetachBody = function(){
		return detachBody;
	};
	
	//화면 전환시 호출.
	self.event.on('screenchanged', function () {
		
		$.each($.fn.DataTable.fnTables(), function (i, table) {
			if ($.contains(document.getElementById('contents'), table)) {				
				$(table).dataTable().fnAdjustColumnSizing();	
			}			
		});
	});

	//화면 링크
	self.link = function(menu, param){
		var menuLink;
		var url = "";
		//필요한 부분 추가를 해줌.
		if("personal" == menu){
			menuLink = $('#gnb').find('a[data-screenId=CU_01]');
			url = menuLink.attr('href');
		}else{
			url = menu;
		}




		
		if(param != null && param != '' && param !== undefined){			
			if(url.indexOf('?') > -1){
				url = "&" + param;
			}else{
				url = "?" + param;
			}
		}


		var screenId = menuLink.attr('data-screenId');			
		var depth = menuLink.attr('data-depth');
		if(screenId == '' || screenId == null || screenId === undefined){
			location.href = linkUrl;
		}else{
			self.changePage(menuLink,screenId,depth);	
		}
		
	};

	self.initAllMenu = function () {
		$('#siteMap').on('click', function(e) {
			$('.allmenu').toggle();
			$('.siteMenu').toggle();
			e.preventDefault();
		});
		//siteMap 닫기
		$('.allMenuClose').on('click', function(e) {
			$('.allmenu').hide();
			$('.siteMenu').hide();
			e.preventDefault();
		});
	};

	self.initCustomerUI = function () {


		var personContTab = ci.tab.init($('.PersonCont')); // 고객정보탭
		var customerInfoTab = ci.tab.init($('.customer-info-tab')); //


		/**
		    고객검색레이어 열기 예시
		 */
		var customerSearchForm = $('#header-customer-serch-form');

		customerSearchForm.on('submit', function(e) {
			e.preventDefault();
			CustomerSearchLayer.open();
			CustomerInfoLayer.close();
		});

		var customerSearchResult = $('.personList');

		customerSearchResult.find('a').on('click', function(e) {

			e.preventDefault();
			CustomerInfoLayer.openfromResult();
		});

		/*고객정보보기 레이어 열기 예시*/
		var customerName = $('#personInfo');

		/**

		*/
		var CustomerSearchLayer = (function() {

			var self = {};
			var opened = false;

			var layer = $('.PersonCont');

			self.open = function() {

				opened = true;

				layer.addClass('opened', 500, 'easeOutQuint', function() {

				});
			};

			self.close = function() {
				layer.stop(true, true);
				layer.removeClass('opened');
				opened = false;
			};

			self.isOpened = function() {
				return opened;
			};


			return self;

		})();

		/**

		*/
		var CustomerInfoLayer = (function() {

			var self = {};

			var opened = false;

			var layer = $('.personDetail');

			self.open = function() {
				opened = true;
				layer.addClass('opened', 500, 'easeOutQuint', function() {

				});
			};

			self.openfromResult = function() {
				self.close();
				layer.addClass('from-result-before');
				layer.addClass('opened');
				opened = true;
				layer.addClass('from-result-after', 500, 'easeOutQuint', function() {

				});
			};

			self.close = function() {
				layer.stop(true, true);
				layer.removeClass('opened from-result-before from-result-after');
				opened = false;
			};

			self.isOpened = function() {
				return opened;
			};

			return self;

		})();

		customerName.on('click', function(e) {

			e.preventDefault();

			if (!CustomerSearchLayer.isOpened() && !CustomerInfoLayer.isOpened()) {

				CustomerInfoLayer.open();

			} else if (CustomerSearchLayer.isOpened() && !CustomerInfoLayer.isOpened()) {
				CustomerSearchLayer.close();
				CustomerInfoLayer.open();

			} else if (CustomerSearchLayer.isOpened() && CustomerInfoLayer.isOpened()) {

				CustomerInfoLayer.close();
				CustomerSearchLayer.close();
				CustomerInfoLayer.open();

			} else {
				CustomerInfoLayer.close();
				CustomerSearchLayer.close();
			}

		});

		/*검색결과로부터 고객정보보기 레이어 열기 예시*/
		var customerInfoLayerCloseButton = $('.userInfoclose');

		customerInfoLayerCloseButton.on('click', function(e) {
			CustomerInfoLayer.close();
			CustomerSearchLayer.close();
		});
	};
	//gnb, sitemap에서 layerPopup 띄우기 공통.
	self.openLayer = function(menuUrl,menuId,menuTitle){
		$('.allMenuClose').click();

		if(menuId == '' || menuId === undefined || menuId == null){
			return;
		}
		
		var width = "300";
		var height = "300";
		var title = menuTitle;
		var url = menuUrl;
		var data = "";
		//화면 ID에 따른 popup 구분
		if("" == menuId){
			width = "";
			height = "";
			title = "";
			url = "";
		}

		if(url.indexOf('?') > -1){
			url = url + "&templet-bypass=true";
		}else{
			url = url + "?templet-bypass=true";
		}

		var mainPopup = curex.dialog.open({
            id : menuId+"_popup",
            width : width,   
            height : height,
            title : title,
            dom : $('#menuPopup'),
            iframeUrl : url,
            ajaxOption : {
             data : data
            },
            main : true,
            reopen : true,
            focus : $(this)
        });
	};
	
	if (!curex) {
		window.curex = curex = {};
	}
	curex.layout = self;	
})(window.curex);