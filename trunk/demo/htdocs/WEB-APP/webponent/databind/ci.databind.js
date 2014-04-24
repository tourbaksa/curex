/**
 * ci.databind.js (databind.js wrapper)
 * @copyright CyberImagination [All rights reserved]
 * @author Kookbun Park, Sangwon Oh


	<form id="frm">


	</form>

	var input = new DataSet();	
	input.put("name","park");
	
	param은 dataSource가 jsonObject 일 경우는 불필요.
	
	var option = {
		dataSource : "/prototype/main/CT_010201_C.cmd" or "bld:sample/board/list" or jsonObjcet 
		param : input or jquery selector('#frm' or $('#frm')
		success : function(data, elemId, jqXHR){
		
		}
	}
		
	ci.databind.bind('frm', optino);



 */
(function(ci){

	var self = {};


	var PAGE = "PAGE";
		
	/**
	* - url 데이터 가져오기.
	* - bld 데이터 가져오기.
	* - json 데이터 자체로 넣기.
	*/
	function bind (binder, options) {		
		if (options) {
			// 데이터소스 타타입 설정
			if (typeof options.dataSource == 'string') {
				var url = options.dataSource;
				var bld = url.indexOf('bld:');
				
				if (bld > -1) {;					
					options.param += "&bld="+url.substring(url.indexOf(':')+1);
					url = "/WEB-APP/webponent/databind/databindController/executeBLD.cmd";					
				}
				var async = false;
				if(options.async){
					async = options.async; 
				}
				
				var ajaxOption = {
					url : url,
					cache : false,
					async : async,
					type : 'POST',
					contentType : "application/x-www-form-urlencoded; charset=UTF-8",
					data : options.param,
					success : function(data, textStatus, jqXHR){
						binder.bind(data);						
						//화면에서 지정한 callBack 함수 호출
						if(options.success){
							options.success(data, options.elemId, jqXHR);
						}

						if(options.pagingArea !== undefined && options.pagingArea != null && options.pagingArea !=''){
							drawPagingView(binder, options, data, options.pagingArea);
						}
					}
				}
				$.ajax(ajaxOption);

			} else if (typeof options.dataSource == 'object') {
				binder.bind(options.dataSource);
				if(options.success){
					options.success(options.dataSource);
				}
			}else{
				return;
			}
		}else{//options 없는 경우는 bind 안함.
			return;
		}			
	}


	/**
	*
	*/
	self.bind = function (elemId, option) {
		var options = {
				elemId : elemId, 
				param : ''
		};
		if (!option) {			
			return;
		}else{
			$.extend(options, option);
		}
		//ajax에 필요한 data 생성.
		var param = "_r_=" + Math.random();		
		
		if(typeof option.dataSource == 'string'){						
			if(typeof option.param == 'object'){
				var paramObj = option.param;
				if(paramObj instanceof jQuery){ //jquery selector					
					if(paramObj.is("form")){
						//PAGE 파라미터 추가.						
						param += "&"+paramObj.serialize();
					}
				}else if(paramObj instanceof DataSet){//DataSet
					param += "&"+paramObj.getParam();
				}else{
					return;
				}
			}else if(typeof option.param == 'string'){
				if(option.param.indexOf('#') > -1 || option.param.indexOf('.') > -1){
					var paramObj = $(option.param);
					if(paramObj.is("form")){						
						param += "&"+paramObj.serialize();	
					}
				}else{					
					return;
				}
			}
		}
		//페이징 처리 필요한 경우 파라미터에 PAGE 없으면 1로 기본 세팅.
		if(option.pagingArea !== undefined && option.pagingArea != null && option.pagingArea !=''){
			if (param.indexOf(PAGE) < 0) {
				param += "&"+PAGE+"=1";
			}
		}
		options.param = param;
		
		var exist = manager.binderMap[elemId];		
		if (exist === undefined) {//data-bind 등록 안된 elemId			
			var binder = manager.addBinder(elemId,true);			
			bind(binder, options);			
		} else {//data-bind 이미 등록 된경우.
			var binder = manager.getBinder(elemId);
			
			bind(binder, options);
		}

	};

	//페이징 영역 그리기
	function drawPagingView(binder, options, bindData, pagingArea){	
		var pagingInfo = {
			currPage : bindData.PAGE,
			totalNum : bindData.TOTAL_CNT,
			totalPageNum : bindData.TOTAL_PAGE_CNT,
			pageCount : 10,
			box : pagingArea
		};

		//페이지 버튼 클릭시 function.
		pagingInfo.method = function (pagingNumber) {
			if (options.param.indexOf(PAGE) < 0) {
				options.param += "&"+PAGE+"=1";
			}else{
				var params = options.param.split('&');
				var changeParam = "";
				for(var i=0; i<params.length; i++){
					if(i > 0){
						changeParam += "&";
					}
					if(params[i].indexOf(PAGE+"=") != -1){
						changeParam += PAGE+"="+pagingNumber
					}else{
						changeParam += params[i];	
					}					
				}
				options.param = changeParam;
			}
			bind(binder, options);
		};

		ci.util.setNavigator(pagingInfo);
	}	

	//검색 결과에 따른 테이블 메세지 처리.
	self.bindResult = function(obj,msg){
		var tbody = $(obj).find('tbody');
		var tdCnt = tbody.find('tr:first-child > td').length;
		var resultMsg = "조회 결과가 없습니다.";
		if(msg){
			resultMsg = msg;
		}
		tbody.html('<tr><td colspan="'+tdCnt+'">'+resultMsg+'</td></tr>');
	};
	
	//regist self object to global scope
	if(!ci) window.ci = ci = {};
	ci.databind = self;

})(window.ci);