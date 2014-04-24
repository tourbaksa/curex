/**
 * DOM 조작이 들어가지 않는 공통 로직들
 */

(function(curex) {
	var self = {};
	function init() {
		if (typeof console === "undefined") {
			console = {};
			console.log = function() {
				return;
			};
		}
	}
	
	init();

	//금액 한글 표시
	self.transKoreanFromNumber = function(num) {

		num = ci.util.removeCommas(num);
		var gab = num;

		num = parseInt(num);

		var han1 = [ "", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구" ];
		var han2 = [ "", "만", "억", "조", "경", "해", "시", "양", "구", "간" ];
		var han3 = [ "", "십", "백", "천" ];

		var result = "";
		var str = [];
		var str2 = "";
		var strTmp = [];

		if (num == 0 || isNaN(num)) {
			result = "영";
		}

		if (gab.length > han2.length * 4) {
			result = "too much number"; // 범위를 넘는 숫자 처리 자리수 배열 han2에 자리수 단위만
			// 추가하면 범위가 늘어남.
		}

		var i = 0;
		var j = 0;
		var k = 0;

		for (i = gab.length; i > 0; i = i - 4) {
			str[j] = gab.substring(i - 4, i); // 4자리씩 끊는다.
			for (k = str[j].length; k > 0; k--) {
				strTmp[k] = (str[j].substring(k - 1, k)) ? str[j].substring(k - 1, k) : "";
				strTmp[k] = han1[Number(strTmp[k])];
				if (strTmp[k])
					strTmp[k] += han3[str[j].length - k];
				str2 = strTmp[k] + str2;
			}
			str[j] = str2;
			if (str[j])
				result = str[j] + han2[j] + result;
			// 4자리마다 한칸씩 띄워서 보여주는 부분. 우선은 주석처리
			// result = (str[j])? " "+str[j]+han2[j]+result : " " + result;

			j++;
			str2 = "";
		}

		return result;

	};

	/**
	 * 선택한 radio의 값을 찾아서 리턴
	 * 
	 * @param radioObj
	 *            radio오브젝트
	 * @returns 선택된 값
	 */
	self.radioVal = function radioVal(radioObj) {
		if (radioObj != undefined) {
			ic = radioObj.length;
			if (ic != undefined) {
				for ( var i = 0; i < ic; i++) {
					if (radioObj[i].checked)
						return radioObj[i].value;
				}
			} else {
				if (radioObj.checked) {
					return radioObj.value;
				}
			}
		}
	};

	/**
	 * 선택한 radio의 오브젝트를 찾아서 리턴
	 * 
	 * @param radioObj
	 *            radio오브젝트
	 * @returns 선택된 Obj
	 */
	self.radioObj = function radioVal(radioObj) {
		if (radioObj != undefined) {
			ic = radioObj.length;
			if (ic != undefined) {
				for ( var i = 0; i < ic; i++) {
					if (radioObj[i].checked)
						return radioObj[i];
				}
			} else {
				if (radioObj.checked) {
					return radioObj;
				}
			}
		}
	};
	
	/**
	 * 선택한 radio의 인덱스를 찾아서 리턴
	 * 
	 * @param radioObj
	 *            radio오브젝트
	 * @returns 선택된 Obj
	 */
	self.radioIdx = function radioVal(radioObj) {
		if (radioObj != undefined) {
			ic = radioObj.length;
			if (ic != undefined) {
				for ( var i = 0; i < ic; i++) {
					if (radioObj[i].checked)
						return i;
				}
			} else {
				if (radioObj.checked) {
					return 0;
				}
			}
		}
	};

	/**
	 * 공백문자 제거 (java trim과 같은 기능)
	 * 
	 * @param sString
	 *            대상문자열
	 * @returns 공백 제거된 문자열
	 */
	self.trim = function trim(sString) {
		if (sString != undefined) {
			return sString.replace(/^\s*|\s*$/g, "");
		}
	};

	/**
	 * 숫자만 출력한다
	 * 
	 * @param str
	 * @returns
	 */
	self.onlyNum = function onlyNum(str) {
		return Number(str.replace(/[^0-9.-]/g, ""));
	};

	/**
	 * 숫자 포맷팅
	 * 
	 * @param str
	 *            입력값
	 * @returns
	 */
	self.numberFormatter = function numberFormatter(str) {
		var reg = /(^[+-]?\d+)(\d{3})/;
		str += '';
		while (reg.test(str))
			str = str.replace(reg, '$1' + ',' + '$2');
		return str;
	};
	
	/**
	 * 백분율 포맷팅
	 * 
	 * @param str 입력값 분자
	 * @param str 입력값 분모
	 * @param cnt 소수점이하 자릿수
	 */
	self.rateFormatter = function rateFormatter(input1, input2, cnt){
		
		str = parseFloat(input1/input2 * 100).toFixed(cnt);
		return str + '%';
		
	};
	

	/**
	 * 날짜형식의 데이터를 받아올 경우 포멧팅한다
	 * 
	 * @param str
	 *            날짜데이터(8글자)
	 * @param gubun
	 *            구분값(디폴트:'.')
	 * @returns
	 */
	self.dateFormatter = function dateFormatter(str, gubun) {
		if (gubun == undefined) {
			gubun = ".";
		}
		var dateStr = $.trim(str);
		if (dateStr.length == 8) {
			return dateStr.substring(0, 4) + gubun + dateStr.substring(4, 6) + gubun + dateStr.substring(6, 8);
		} else {
			return str;
		}
	};
	
	/**
	 * 기준 날짜에 이전, 이후 날짜 계산
	 * 
	 * @param date
	 *            날짜데이터(8글자) or selector
	 * @param date
	 *            년도(0 or 1 or 2 or -1 or -1.....)
	 * @param date
	 *            월(0 or 1 or 2 or -1 or -1.....)
	 * @param date
	 *            일자(0 or 1 or 2 or -1 or -1.....)
	 * @param delim
	 *            구분값(디폴트:'')
	 * @returns
	 * 
	 * */
	self.getDateCalc = function(obj,yearOffSet,monthOffSet,dayOffSet,delim){
		var date = "";

		if (typeof obj == 'string') {
			date = obj;
		}else{
			obj = self.checkJquery(obj);
			date = obj.val();
		}

		date = date.replace(/\D+/g,"");
		if(delim === undefined || delim == null){
			delim = "";
		}
		var year 	= "";
		var month 	= "";
		var day 	= "";
		
		var dateObj = new Date();
		if(date.length==8){
			year 	= date.substring(0,4);
			month 	= date.substring(4,6);
			day 	= date.substring(6,8);
		}else if(date.length==6){
			year 	= date.substring(0,4);
			month 	= date.substring(4,6);
			day 	= dateObj.getDate();
		}else if(date.length==0){
			year 	= dateObj.getFullYear();
			month 	= dateObj.getMonth()+1;
			day		= dateObj.getDate();
		}
		
		if(!yearOffSet){yearOffSet=0;}
		if(!monthOffSet){monthOffSet=0;}
		if(!dayOffSet){dayOffSet=0;}
		
		var newDate = new Date(year,Number(month)-1,day);
		newDate.setFullYear(newDate.getFullYear()+Number(yearOffSet));
		newDate.setMonth(newDate.getMonth()+Number(monthOffSet));
		newDate.setDate(newDate.getDate()+Number(dayOffSet));

		if (typeof obj == 'string') {
			return newDate.getFullYear()+delim+padZero(newDate.getMonth()+1)+delim+padZero(newDate.getDate());	
		}else{
			obj.val(newDate.getFullYear()+delim+padZero(newDate.getMonth()+1)+delim+padZero(newDate.getDate()));
		}

		
	};
	
	function padZero(num) {
		return (num.toString().length==1)? '0' + num : num;
	}


	/*
	 * byte를 panel에 보여주고 maxByte 초과를 체크한다. userOption = { maxByte : 700, //
	 * Number [default : 1500] panel : $('.j-bytes') // Object [default :
	 * $('.j-curBytes')] } usage :: ci.util.printBytes($('textarea')); cf ::
	 * /main/customer/qna/CS_080501_S2.jsp
	 */
	self.printBytes = function(obj, userOption) {
		obj.bind('input paste change', function() {
			var sString = obj.val(), curBytes = ci.util.getBytes(sString), option = {
				maxByte : 1500,
				panel : $('.j-curBytes')
			};

			$.extend(option, userOption);

			var panel = option.panel;
			option.maxByte < curBytes ? ci.util.cutOverText(obj, option.maxByte) : panel.text(curBytes);
		});
	};

	//form field 정보를 DataSet 형태로 변환 
	self.transFormToDs = function(formObj){
		var ds = new DataSet();
		formObj = self.checkJquery(formObj);

		var params = formObj.serializeArray();
		$.each(params, function(index, obj){			
			ds.add(obj.name,obj.value);
		});				
		return ds;
	};

	//DataSet 에서 특정 field delimiter 삭제
	self.removeDelim = function(ds, delim, fieldNm){		
		if(delim == '*'
			|| delim == '+'
			|| delim == '$'
			|| delim == '|'
			|| delim == '?'){

				delim = "["+delim+"]";		
		}else{
			delim = "\\"+delim;
		}
		
		var delimiter = eval("/"+delim+"/g");

		if(ds instanceof DataSet){
			if(typeof fieldNm == 'string'){
				var val = decodeURIComponent(ds.get(fieldNm)).replace(delimiter, '');
				ds.put(fieldNm,val);
			}else{
				for(var i=0; i<fieldNm.length; i++){				
					var val = decodeURIComponent(ds.get(fieldNm[i])).replace(delimiter, '');				
					ds.put(fieldNm[i],val);	
				}
			}

			return ds;

		}else if(ds instanceof jQuery){
			var val = decodeURIComponent(ds.val()).replace(delimiter, '');			
			ds.val(val);
		}else{
			if(typeof ds === 'string'){				
				var val = ds.replace(delimiter, '');
				return val;	
			}else{
				return ds;
			}
			
		}
		
	}
	
	
	/**
	@functionName    : validate
	@param    : form element, (boolean) noti
	@Return : boolean 
	 - form 안에 input, select element에 data-valid attribute에
	 따른 validate 실행
	- disabled field는 체크 제외	
	- 필수 입력 [require] input, select, radio, checkboxk, textarea
	- 입력 길이 제한 [maxLength_xxx] input, textarea
	- 숫자만 입력[isNumber] input
	- 소수점 포함 숫자만 입력 [isNumberF] input
	- 숫자 value 제한 [numberMax_xxxx]
	- 영문만 입력[engText] input
	- e-mail [email] input - 한필드에 xxxx@gmail.com 식으로 사용시.
	- e-mail domain [emailDomain] gmail.com 형식 체크
	- 전화번호 [telNumber] 숫자(max4자리)와 '-' 허용.(max3개까지)
	- ex)data-valid="require|isNumber" => 필수로 값이 있어야 하며, 값은 숫자로만 구성.
	**/
	
	self.validate = function(formObj,noti,formBean){	

		var formBeanResult = true;
		if(formBean !== undefined && formBean != '' && formBean != null){
			//formBean 공통 처리
			formBeanResult = formBeanCheck(formObj, formBean);

		}

		if(!formBeanResult){
			return false;
		}

		formObj = self.checkJquery(formObj);
		var validate_result = true;
		formObj.find("*[data-valid]").each(function() {
			var check = true;
			var dataValid = $(this).attr('data-valid');
			var checkFuncs = dataValid.split('|');
			//필수 체크 여부 확인			
			if(dataValid.indexOf('require') > -1){
				//필수 체크
				check = curex.util.require($(this),noti,formObj);				
			}			
			//필수 체크 여부 확인 후 추가 validate			
			if(check){
				//data-valid 값에 따른 추가 체크 로직.
				for(var i=0;i < checkFuncs.length; i++){
					//필수값 체크는 제일 처음에만.
					if(checkFuncs[i] != 'require' && checkFuncs[i] != null && checkFuncs[i] != ''){
						if(checkFuncs[i].indexOf('_') > -1){//입력 길이, value 값 제한경우
							var func = checkFuncs[i].split('_');
							var method = eval('(curex.util.'+func[0]+')');
							if(!method($(this), noti, func[1])){
								validate_result = false;
								return false;
							}
						}else{							
							var method = eval('(curex.util.'+checkFuncs[i]+')');							
							if(!method($(this), noti)){
								validate_result = false;
								return false;
							}
						}
					}
				}
			}else{
				validate_result = false;
				return false;
			}
		});		
				
		return validate_result;
	};
	
	/**
	@functionName    : require
	@param    : element object, (boolean) noti
	@Return : boolean 
	 - 해당 element의 값이 있는지 체크
	 - noti param이 true 이면 alert 실행
	**/
	self.require = function(obj,noti,formObj){		
		obj = self.checkJquery(obj);		
		var result = true;
		var notiCont = '';
		if(obj.prop('type') == 'text'){
			if(obj.val() == ''){
				result = false;
			}else{
				result = true;	
			}
			notiCont = '입력';
		}else if(obj.prop('type') == 'hidden'){
			if(obj.val() == ''){
				result = false;
			}else{
				result = true;	
			}
			notiCont = '검색';
		}else if(obj.prop('type') == 'password'){
			if(obj.val() == ''){
				result = false;
			}else{
				result = true;	
			}
			notiCont = '입력';
		}else if(obj.prop('type') == 'select-one'){			
			if(obj.val() == ''){
				result = false;
			}else{
				result =  true;	
			}			
			notiCont = '선택';
		}else if(obj.prop('type') == 'radio'){
			var radio = $('input:radio[name='+obj.attr('name')+']',formObj);
			if(radio.is(':checked')){				
				result = true;
			}else{				
				result = false;
			}
			notiCont = '선택';
		}else if(obj.prop('type') == 'checkbox'){			
			var checkBox = $('input:checkbox[name='+obj.attr('name')+']',formObj);			
			if(checkBox.is(':checked')){				
				result = true;
			}else{				
				result = false;
			}
			notiCont = '선택';
		}
		//alert 메세지 세팅
		if(noti){
			if(!result){
				var label = obj.attr("title");	
				
				if(typeof(label) == "undefined"){				
					label = $('label[for="'+obj.attr('id')+'"]',formObj).text();				
				}
				alert(label+"을(를) "+notiCont+"해 주십시요.");				
				obj.focus();
			}
		}
		return result;
	};				
	
	/**
	@functionName    : isNumber
	@param    : element object, (boolean) noti, (String) msg
	@Return : boolean 
	 - 해당 element의 값에 숫자만 있는지 체크
	 - noti param이 true 이면 alert 실행
	 - 필요에 따라 msg 직접 지정해서 넣어줌.
	**/
	self.isNumber = function(obj,noti,msg){		
		obj = self.checkJquery(obj);
		var value = obj.val();
		var regexp = /[^0-9]/g;

		if (regexp.test(value)) {
			if(noti){
				var label = obj.attr("title");					
				if(typeof(label) == "undefined"){				
					label = $('label[for="'+obj.attr('id')+'"]').text();				
				}
				alert(label+"은(는) 숫자만 입력 가능합니다.");
			}else{
				if(msg != "" && msg != null && msg != undefined){
					alert(msg);
				}	
			}			
			obj.val('');
			obj.focus();
			return false;					
		}else{
			return true;
		}

	};

	/**
	@functionName    : isNumberF
	@param    : element object, (number)decimal, (boolean) noti, (String) msg
	@Return : boolean 
	 - 해당 element의 값에 숫자만(소수점포함) 있는지 체크
	 - noti param이 true 이면 alert 실행
	 - 필요에 따라 msg 직접 지정해서 넣어줌.
	**/
	self.isNumberF = function(obj,noti,decimal,msg){		
		obj = self.checkJquery(obj);
		var value = obj.val();
		var regexp = /[^0-9|^\.]/g;
		var result = true;
		var noti_case = 0;
		if (regexp.test(value)) {
			result = false;
			noti_case = 0;			
		}else{
			if (value.split(".").length == 2) {				
				if (value.indexOf(".") == 0) {//.이 제일 앞일 경우.
					result = false;
					noti_case = 0;
				} else {
					if(!isNaN(decimal)){
						if (value.substring(value.indexOf(".")).length - 1 > decimal) {//소수점 자리수 제한 있을 경우
							result = false;
							noti_case = 1;
						}
					}
				}
			} else if(value.split(".").length > 2){// 소수점 2개 이상인경우
				result = false;
				noti_case = 0;
			}
		}
		if(!result){
			if(noti){
				var label = obj.attr("title");					
				if(typeof(label) == "undefined"){				
					label = $('label[for="'+obj.attr('id')+'"]').text();				
				}
				if(noti_case == 1){
					alert(label+"은(는) 소수점 "+decimal+" 자리 까지 입력 가능합니다.");
				}else{
					alert(label+"은(는) 소수점 포함 숫자만 입력 가능합니다.");
				}
			}else{
				if(msg != "" && msg != null && msg != undefined){
					alert(msg);
				}	
			}
			obj.val('');
			obj.focus();
		}
		return result;

	};
	
	/**
	@functionName    : maxLength
	@param    : element object, (boolean) noti,(number) max
	@Return : boolean 
	 - 해당 element의 값의 길이 체크
	 - noti param이 true 이면 alert 실행
	**/
	self.maxLength = function(obj,noti,max,msg){
		obj = self.checkJquery(obj);
		var value = obj.val();		
		if(value.length > max){
			if(noti){
				var label = obj.attr("title");					
				if(typeof(label) == "undefined"){				
					label = $('label[for="'+obj.attr('id')+'"]').text();				
				}
				alert(label+"은(는) 최대 "+max+" 자리까지  입력 가능합니다.");
			}else{
				if(msg != "" && msg != null && msg != undefined){
					alert(msg);
				}	
			}			
			obj.val('');
			obj.focus();
			return false;
		}
		return true;
	};	
	
	/**
	@functionName    : maxLength
	@param    : element object, (boolean) noti,(number) max
	@Return : boolean 
	 - 해당 element의 값의 길이 체크
	 - noti param이 true 이면 alert 실행
	**/
	self.maxLengthByte = function(obj,noti,max,msg,clear){
		obj = self.checkJquery(obj);
		var value = obj.val();	
		var length = value.length;
		var lengthByte = 0;
		for(var i=0; i< length; i++){
			var byteStr = value.charAt(i);
			if(escape(byteStr).length > 4){
				lengthByte+=2;
			}else{
				lengthByte+=1;
			}
		}
		if(lengthByte > max){
			if(noti){
				var label = obj.attr("title");					
				if(typeof(label) == "undefined"){				
					label = $('label[for="'+obj.attr('id')+'"]').text();				
				}
				alert(label+"은(는) 최대 한글("+(max/2)+"), 영문/숫자("+max+") 자리까지  입력 가능합니다.");
			}else{
				if(msg != "" && msg != null && msg != undefined){
					alert(msg);
				}	
			}	
			if(clear){
				obj.val('');
			}
			obj.focus();
			return false;
		}
		return true;
	};	
	
	/**
	@functionName    : maxLength
	@param    : element object, (boolean) noti,(number) max
	@Return : boolean 
	 - 해당 element의 값의 길이 체크
	 - noti param이 true 이면 alert 실행
	**/
	self.maxNumber = function(obj,noti,max,msg){
		obj = self.checkJquery(obj);
		var value = Number(obj.val());
		if(value > max){
			if(noti){
				var label = obj.attr("title");					
				if(typeof(label) == "undefined"){				
					label = $('label[for="'+obj.attr('id')+'"]').text();				
				}
				alert(label+"은(는) "+max+" 보다 작아야 합니다.");
			}else{
				if(msg != "" && msg != null && msg != undefined){
					alert(msg);
				}	
			}			
			obj.val('');
			obj.focus();
			return false;
		}
		return true;
	};	


	/**
	@functionName    : isLanguage
	@param    : element object, (boolean) noti, (String) lang,(String) msg
	@Return : boolean 
	 - 해당 element의 값에 lang에 따라 kor/eng/korEng 구분해서 입력 체크
	 - noti param이 true 이면 alert 실행
	 - 필요에 따라 msg 직접 지정해서 넣어줌.
	**/
	self.isLanguage = function(obj,noti,lang,msg){
		obj = self.checkJquery(obj);
		var value = obj.val();
		var regexp;
		var notiCont = "";
		if(lang == 'kor'){
			regexp = /[^가-힣\s]/g;
			notiCont = "한글";
		}else if(lang == 'Eng'){
			regexp = /[^a-zA-Z\s]/g;
			notiCont = "영문";
		}else if(lang == 'korEng'){
			regexp = /[^가-힣a-zA-Z\s]/g;
			notiCont = "한글/영문";
		}else{
			return;
		}

		if (regexp.test(value)) {
			if(noti){
				var label = obj.attr("title");					
				if(typeof(label) == "undefined"){				
					label = $('label[for="'+obj.attr('id')+'"]').text();				
				}
				alert(label+"은(는) "+notiCont+"만 입력 가능합니다.");
			}else{
				if(msg != "" && msg != null && msg != undefined){
					alert(msg);
				}	
			}			
			obj.val('');
			obj.focus();
			return false;
		}else{
			return true;
		}
	};


	//e-mail [email] input - 한필드에 xxxx@gmail.com 식으로 사용시.
	//e-mail domain [emailDomain] gmail.com 형식 체크	

	/**
	@functionName    : isTelNumber
	@param    : element object, (boolean) noti, (String) msg
	@Return : boolean 
	 - 해당 element의 값이 전화번호 형식에 맞는지 체크 xxxx-xxxx-xxxx
	 - noti param이 true 이면 alert 실행
	 - 필요에 따라 msg 직접 지정해서 넣어줌.
	**/
	self.isTelNumber = function(obj,noti,msg){
		obj = self.checkJquery(obj);
		var value = obj.val();
		var regexp = /^[0-9]{2,4}-[0-9]{3,4}-[0-9]{4}$/;		

		if (!regexp.test(value)) {
			if(noti){
				var label = obj.attr("title");					
				if(typeof(label) == "undefined"){				
					label = $('label[for="'+obj.attr('id')+'"]').text();				
				}
				alert(label+"을(를) 올바른 형식으로 입력해 주세요.");
			}else{
				if(msg != "" && msg != null && msg != undefined){
					alert(msg);
				}	
			}			
			obj.val('');
			obj.focus();
			return false;
		}else{			
			return true;
		}
	};

	/**
	@functionName    : isEmail
	@param    : element object, (boolean) noti, (String) msg
	@Return : boolean 
	 - 해당 element의 값이 email 형식에 맞는지 체크 test@gmail.com
	 - noti param이 true 이면 alert 실행
	 - 필요에 따라 msg 직접 지정해서 넣어줌.
	**/
	self.isEmail = function(obj,noti,msg){
		obj = self.checkJquery(obj);
		var value = obj.val();
		var regexp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;


		if (!regexp.test(value)) {
			if(noti){
				var label = obj.attr("title");					
				if(typeof(label) == "undefined"){				
					label = $('label[for="'+obj.attr('id')+'"]').text();				
				}
				alert(label+"을(를) 올바른 형식으로 입력해 주세요.");
			}else{
				if(msg != "" && msg != null && msg != undefined){
					alert(msg);
				}	
			}			
			obj.val('');
			obj.focus();
			return false;
		}else{			
			return true;
		}
	};
	/**
	@functionName    : isEmailDomain
	@param    : element object, (boolean) noti, (String) msg
	@Return : boolean 
	 - 해당 element의 값이 email 형식에 맞는지 체크 gmail.com
	 - noti param이 true 이면 alert 실행
	 - 필요에 따라 msg 직접 지정해서 넣어줌.
	**/
	self.isEmailDomain = function(obj,noti,msg){
		obj = self.checkJquery(obj);
		var value = obj.val();
		var regexp = /^([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;


		if (!regexp.test(value)) {
			if(noti){
				var label = obj.attr("title");					
				if(typeof(label) == "undefined"){				
					label = $('label[for="'+obj.attr('id')+'"]').text();				
				}
				alert(label+"을(를) 올바른 형식으로 입력해 주세요.");
			}else{
				if(msg != "" && msg != null && msg != undefined){
					alert(msg);
				}	
			}			
			obj.val('');
			obj.focus();
			return false;
		}else{			
			return true;
		}
	};





	/**
	var input = new DataSet();
	input.put('field',value);

	curex.submitAjax(null,{
		url : "xxxx.cmd",
		data : input.getParam(),
		async : false,
		success : function(data){
			var output = new DomDataSet(data);//dataSet 형태
		}
	});
	*/	

	self.submitAjax = function (formObj,settings) {
		var defaultOption = {
			cache : false,
			type : 'POST',
			contentType : "application/x-www-form-urlencoded; charset=UTF-8",						
			success : function(data,textStatus,jqXHR) {
				
				if(settings!==undefined && settings.success){
					settings.success(data);
				}
			},
			error:function(data){

			}
		};
		
		var ajaxOption;				
		
		if(formObj !== null && formObj !== undefined){
			if(formObj instanceof jQuery){ //jquery selector
			}else{
				formObj = $(formObj);	
			}

			ajaxOption = {
				url : settings.url ?  settings.url : formObj.attr("action"),
			 	data: settings.param ? settings.param : formObj.serialize()			 	
			};			
			if (settings){$.extend(ajaxOption, settings);}
			$.extend(ajaxOption, defaultOption);
		}else{
			ajaxOption = {
				url:settings.dataSource,
				data:settings.param
			};
			if (settings){$.extend(ajaxOption, settings);}
			$.extend(ajaxOption, defaultOption);
		}
		$.ajax(ajaxOption);

		return false;
	}


	self.checkJquery = function(obj){
		if(obj instanceof jQuery){ //jquery selector
			return obj;
		}else{
			return $(obj);
		}
	};
	//file upload
	self.upload = function(formObj, funcNm){
		var iframe = $('<iframe id="uploadFrame" name="uploadFrame" class="uploadFrame" src="" width="1%" height="1%" scrolling="no" style="postion:absolute; top:-100px;"></iframe>');
		$('body').append(iframe);
		var callback = '';
		if(funcNm){
			callback = '?funcNm='+funcNm;
		}		
		console.log(formObj);
		formObj.attr('action','/main/common/common/fileUploadProcess.cmd'+callback);
		formObj.attr('enctype','multipart/form-data');
		formObj.attr('target','uploadFrame');
		formObj.attr('method','POST');
		formObj.submit();
	};
	//동적으로 생성된 iframe 삭제
	self.uploadComplete = function(){
		$('.uploadFrame').remove();
	};


	function cm_escapeParam(paramQuery){
		if(paramQuery===undefined||paramQuery===null){
			return "";
		}
		
		var query = paramQuery.split("&");
		var result = "";
		for(var i =0 , ic = query.length; i < ic; i++ ){
			var keyName = query[i].split("=");
			if(keyName.length>0){
				result+= "&"+keyName[0]+"="+escape_url(keyName[1]);
			}
		}
		return result;
	}

	function escape_url(url){
		var i;
		var ch;
		var out = '';
		var url_string = '';

		url_string = String(url);

		for (i = 0; i < url_string.length; i++) {
			ch = url_string.charAt(i);
			if (ch == ' ')		out += '%20';
			else if (ch == '%')	out += '%25';
			else if (ch == '&')	out += '%26';
			else if (ch == '+')	out += '%2B';
			else if (ch == '=')	out += '%3D';
			else if (ch == '?') out += '%3F';
			else				out += ch;
		}
		return out;
	}

	

	/*
	formBean check 
	*/
	function formBeanCheck(formObj,formBean) {        
        formObj = self.checkJquery(formObj);
        var validateMeta = validationFormJSON[formBean];
        for ( var i = 0; i < validateMeta.length; i++) {
            var m = validateMeta[i];            
            var e = $('*[name=' + m.name + ']', formObj);
            if( e.size() > 0){
				var v = e.val();
	            var result = false;	            
	            try {
	                eval('result=' + m.fn + '(v,m.msg, m.vars);');
	            } catch (e) {
	            }
	            if (!result) {	            	
	                alert(m.msg);
	                e.focus();
	                return false;
	            }
            }            
        }
        formObj.find('[name="validateFormNm"]').remove();
        
		var hiddenInput = $('<input type="hidden" name="validateFormNm">');
		hiddenInput.val(formBean);
		formObj.append(hiddenInput);
		
        return true;
    }    
	
	//email domain select box
	self.setEmailDomain = function(obj){
		if(obj === undefined || obj == null || obj == ''){
			return;
		}

		obj.empty();
		var input = new DataSet();		
		input.put("LOOKUP_TYPE","MAIL_DOMAIN");

		curex.util.submitAjax(null,{
			url : "/main/common/common/getEmailDomain.cmd",
			param : input.getParam(),
			dataType : "text",
			success : function(data){
				obj.append(data);
			}
		});
	};

	
	/* 주민번호 관련 함수 시작 */
	var aDaysInMonth=new Array(31,28,31,30,31,30,31,31,30,31,30,31);
	var aDaysInMonthYoon=new Array(31,29,31,30,31,30,31,31,30,31,30,31);
	var aDaysInMonthSolar=new Array(31,31,31,31,31,31,31,31,31,31,31,31);
	
	//성별 구하기
	self.genderReturn = function(data) {
				 
		var year = data.substring(0,2);
		var sexFlag = data.substring(6,7);
		var returnValue;

		if(year.length < 2 || sexFlag.length < 1) return;
		
		var tmpRsdn = Number(data.substring(0,2));


		// 성별체크			
		if( sexFlag == 1 || sexFlag == 3 || sexFlag == 5 || sexFlag == 7)
		{
			returnValue = "M";
		} 
		else if( sexFlag == 2 || sexFlag == 4 || sexFlag == 6 || sexFlag == 8)
		{
			returnValue = "F";
		}
		
		return returnValue;
	};
	
	//생년월일 구하기
	self.birthDateReturn = function(data) {
		 
		 
		var year = data.substring(0,2);
		var sexFlag = data.substring(6,7);

		if(year.length < 2 || sexFlag.length < 1) return;
		
		var tmpRsdn = Number(data.substring(0,2));

		 
		// 생년월일 년도 구해오기
		if(sexFlag == 1 || sexFlag == 2 || sexFlag == 5 || sexFlag == 6)
		{
			pre = "19";
			pre = Number(pre.concat(year));
		}
		else if(sexFlag == 3 || sexFlag == 4 || sexFlag == 7 || sexFlag == 8)
		{
			pre = "20";
			pre = Number(pre.concat(year));
		}
		else
		{
			pre = "19";
			pre = Number(pre.concat(year));
			//isCorrect  = false;
		}

		var birthYear  = data.substring(0,2);
		var birthMonth = data.substring(2,4);
		var birthDay   = data.substring(4,6);
		
		var d = new Date();
		var curr_date = d.getDate();
		var curr_month = d.getMonth()+1;
		var curr_year = d.getFullYear();
		curr_month = curr_month.toString().length ==1 ? "0"+curr_month:curr_month;
		curr_date = curr_date.toString().length ==1 ? "0"+curr_date : curr_date;
		
		var currentDate = curr_year+curr_month+curr_date;
		 
		
		// 윤달인 경우 체크
		var isYoon = true;
		
		var birthDate = pre + "-" + birthMonth + "-" + birthDay;
		
		return birthDate;
	};
	
	//보험 나이 구하기
	self.insuranceAgeReturn = function(data) {
		 
		
		var isCorrect = true;
		 
		var year = data.substring(0,2);
		var sexFlag = data.substring(6,7);

		if(year.length < 2 || sexFlag.length < 1) return;
		
		var tmpRsdn = Number(data.substring(0,2));

		
		// 생년월일 년도 구해오기
		if(sexFlag == 1 || sexFlag == 2 || sexFlag == 5 || sexFlag == 6)
		{
			pre = "19";
			pre = Number(pre.concat(year));
		}
		else if(sexFlag == 3 || sexFlag == 4 || sexFlag == 7 || sexFlag == 8)
		{
			pre = "20";
			pre = Number(pre.concat(year));
		}
		else
		{
			pre = "19";
			pre = Number(pre.concat(year));
			//isCorrect  = false;
		}

		var birthYear  = data.substring(0,2);
		var birthMonth = data.substring(2,4);
		var birthDay   = data.substring(4,6);
		
		var d = new Date();
		var curr_date = d.getDate();
		var curr_month = d.getMonth()+1;
		var curr_year = d.getFullYear();
		curr_month = curr_month.toString().length ==1 ? "0"+curr_month:curr_month;
		curr_date = curr_date.toString().length ==1 ? "0"+curr_date : curr_date;
		
		var currentDate = curr_year+curr_month+curr_date;
		 
		
		// 윤달인 경우 체크
		var isYoon = true;
		
		if(((Number(currentDate.substring(0,4)) % 4 == 0) && (Number(currentDate.substring(0,4)) % 100 != 0) ) || (Number(currentDate.substring(0,4)) % 400 == 0)) 
		{
			isYoon = false;
		}

		if( birthMonth > 12 || birthMonth <= 0)
		{
			isCorrect = false;
		}
		
		if(!isYoon)
		{
			if (birthDay > aDaysInMonthYoon[birthMonth-1] || birthDay <= 0)
			{
				isCorrect = false;
			}
		}
		else
		{
			if (birthDay > aDaysInMonth[birthMonth-1] || birthDay <= 0)
			{
				isCorrect = false;
			}
		}
		if(!isCorrect)
		{
			 
		}
		else
		{
		 
			// 나이 계산
			var specialDate  = pre + "" + data.substring(2,4) + "" + data.substring(4,6);
			var baseDate = currentDate;
			var calDate1 = "";
			var calDate2 = "";
			
			if(specialDate >= baseDate)
			{
				calDate1 = baseDate;
				calDate2 = specialDate;
			}
			else
			{
				calDate1 = specialDate;
				calDate2 = baseDate;
			}
			
			inYear = Number(calDate1.substring(0,4));
			inMonth =  Number(calDate1.substring(4, 6));
			inDay =  Number(calDate1.substring(6, 8));
		
			baseYear = Number(calDate2.substring(0, 4));
			baseMonth = Number(calDate2.substring(4, 6));
			baseDay = Number(calDate2.substring(6, 8));
			
			rateYear = baseYear - inYear;
			rateMonth = baseMonth - inMonth;
			rateDay = baseDay - inDay;
		
			if(rateDay < 0)
			{
				rateMonth = rateMonth - 1;
				rateDay = rateDay + 30;
			}		
		
			if(rateMonth < 0)
			{
				rateYear = rateYear - 1;
				rateMonth = rateMonth + 12;
			}
		
			if(rateYear < 0)
			{
				return 0;
			}
		
			if(rateMonth >= 6)
			{
				rateYear = rateYear + 1;
			}
			
			if(specialDate > baseDate) rateYear = -rateYear;

			  
		}
		 
		
		return rateYear;
			 
	};
	
	//만나이 계산
	self.realAgeReturn = function(data) {
		 
		
		//만나이 계산
		var birthday = curex.util.birthDateReturn(data);
		
		var bday=parseInt(birthday.substring(6,8)); 
		var bmo=(parseInt(birthday.substring(4,6))-1); 
		var byr=parseInt(birthday.substring(0,4)); 
		 
		var byr; 
		var age; 
		var now = new Date(); 
		var tday=now.getDate(); 
		var tmo=(now.getMonth()); 
		var tyr=(now.getFullYear()); 


		if((tmo > bmo)||(tmo==bmo & tday>=bday)) { 
		age=byr 
		} else{ 
		age=byr+1; 
		} 

		var realYear =  tyr-age;
		
		return realYear;
	};
	
	
	/* 주민번호 관련 함수  END */
	
	
	
	/**
	 * 현재 날짜 8자리 문자로 리턴	
	 * @author ot020
	 * @since 2014. 3. 26.
	 * @return {string} YYYYMMDD
	 */
	self.getCurrentDateString = function(){

/*        var input = new DataSet();
        var ajaxUrl = "/main/lips/planning/group_planning/getCurrentDate.cmd";
        
        // /main/lips/planning/group_planning.jspx?cmd=getCurrentDate
        
        curex.util.submitAjax(null,{
          url : ajaxUrl , 
          param : input.getParam(),
          success : function(data){
        	  
        	 var jsonResult = JSON.parse(data);
        	  
          	console.log(data);                	
          	alert(jsonResult.currentDate );
          	return jsonResult.currentDate;         	
		
          }
         });
*/        
		
		// 서버에서 부르는것으로 수정 예정 
		var today = new Date();
		var year = today.getFullYear();
		var month = today.getMonth();
		var day = today.getDate();
		var resultDate = new Date();			

		year = resultDate.getFullYear();
		month = resultDate.getMonth() + 1;
		day = resultDate.getDate();

		if (month < 10)			    month = "0" + month;
		if (day < 10)			    day = "0" + day;

		return year + "" + month + "" + day;

	};	
	
	
	
	
	
	/**
	 * //'YYYYMMDD" 형식의 날자가 옳바른지 검증(LiPSUtil.verifyDate 메소드와 동일하게 구현)
	 * @author ot020
	 * @since 2014. 3. 26.
	 * @param  {int} year 
	 * @param  {int} month 
	 * @param  {int} day 		  
	 * @return {boolean}
	 */		
	self.verifyDate =  function(year, month, day){
		if( (month < 1) || (month > 12) ) return false;

		switch(month)
		{
			case 1:
			case 3:
			case 5:
			case 7:
			case 8:
			case 10:
			case 12:
				if( (day < 1) || (day > 31)) return false;
				else
					return true;
			case 4:
			case 6:
			case 9:
			case 11:
				if( (day < 1) || (day > 30)) return false;
				else
					return true;
			case 2:
				if( (day < 1) || (day >30)) return false;
				else
					return true;
		}
		return true;	
	} ;

	
	/**
	 * 상령일을 구하는 함수  (/CuREX_LiPS/src/main/webapp/planning/PlanningFormForAll.jsp) 
	 * @author ot020
	 * @since 2014. 4. 1.
	 * @param  {string} birthday(YYYYMMDD) : 생일 
	 * @return {string} YYYYMMDD 형식 
	 */		
	self.getChangeInsAgeDate  = function(birthday)
	{

	    var strRtnVal = "";
	    if(birthday.length != 8){ 
	        return strRtnVal;
	    }
	        
	    var birthMonth  = birthday.substring(4,6);
	    var birthDay    = birthday.substring(6);
	    
	    var changeMonth = (String)(Number(birthMonth) + 6);
	    var changeDate  = "";
	    
	    var currentDateString  = curex.util.getCurrentDateString();
	    
	   // console.log( " currentDateString "+ currentDateString );
	    
	    var curYear  = currentDateString.substr(0,4) ;
	    var curMonth = currentDateString.substr(4,2) ;
	    var curDay   = currentDateString.substr(6,2) ;
	    
	    
	    if(Number(changeMonth) > 12)
	    {
	        changeMonth = (String)(Number(changeMonth) - 12);
	    }
	    
	    if(Number(changeMonth) < 10)
	    {
	        changeMonth = "0" + changeMonth;
	    }
	    
	    if(Number(curMonth) < Number(changeMonth))
	    {
	        changeDate = (String)(curYear + "" + changeMonth + "" + birthDay); 
	    }
	    else if((Number(curMonth) == Number(changeMonth)) && (Number(curDay) < Number(birthDay)))
	    {
	        changeDate = (String)(curYear + "" + changeMonth + "" + birthDay);  
	    }
	    else
	    {
	        changeDate = (String)((Number(curYear)+1) + "" + changeMonth + "" + birthDay); 
	    }
	    
	    //strRtnVal = changeDate.substring(0,4) + "년 " + Number(changeDate.substring(4,6)) + "월 " + Number(changeDate.substring(6)) + "일";
	    strRtnVal = changeDate;
	     
	    return strRtnVal;
	    
	};
	
	
	

	
	/**
	 * 기준날짜, 주민번호로 나이 구하기
	 * @author ot020
	 * @since 2014. 3. 26.
	 * @param  {string} appDate : 기준날짜 (YYYYMMDD 형식)
	 * @param  {string} birthDate : 생일날짜 (YYYYMMDD 형식) 
	 * @return {void}
	 */		
	self.calcInsuredAgeByRsdn = function(appDate, residentNo){
		try{
			var rsdn = residentNo.replace(/[^0-9]/g ,"");
			if((rsdn == null) || (rsdn.length < 7) ) return -1;
			
			// rsdn로부터 년,월,일 획득.
			var birthday 	= curex.util.removeDelim( curex.util.birthDateReturn( rsdn ) , "-" ); 
			var inYear 		= Number(birthday.substring(0,4));
			var inMonth 	= Number(birthday.substring(4, 6));
			var inDay 		= Number(birthday.substring(6, 8));

			if(curex.util.verifyDate(inYear, inMonth, inDay) == false) return -1;
	
			// appDate로부터 년,월,일 획득.
			var appYear 	= Number(appDate.substring(0,4));
			var appMonth 	= Number(appDate.substring(4, 6));
			var appDay 		= Number(appDate.substring(6, 8));		

			if(curex.util.verifyDate(appYear, appMonth, appDay) == false) return -1;
			
			var rateYear 	= appYear - inYear;
			var rateMonth 	= appMonth - inMonth;
			var rateDay 	= appDay - inDay;		
			
			if(rateDay < 0){
				rateMonth--;
				rateDay += 30;
			}
			if(rateMonth < 0){
				rateYear--;
				rateMonth += 12;
			}

			if(rateYear < 0) return -1;
			
			var rateAge = 0;
			// 14년 12개월 이상일경우에 6개월 연산들어간다.
			if( (rateYear > 14) &&  (rateMonth >= 6) ) rateAge = rateYear + 1;
			else rateAge = rateYear;
			return rateYear;	
		}
		catch(e){
			return 0;
		}
	};
	

	
	/**
	 * 기준날짜 , 생일 날짜로 나이 구하기
	 * @author ot020
	 * @since 2014. 3. 26.
	 * @param  {string} appDate : 기준날짜 (YYYYMMDD 형식)
	 * @param  {string} birthDate : 생일날짜 (YYYYMMDD 형식) 
	 * @return {void}
	 */
	self.calcInsuredAgeByBirthDate = function(appDate, birthDate)
	{
		try{
			var checkBirthDate = birthDate.replace(/[^0-9]/g ,"");
			if((checkBirthDate == null) || (checkBirthDate.length < 8) ) return -1;
			
			// rsdn로부터 년,월,일 획득.
			var birthday 	= birthDate ;
			var inYear 		= Number(birthday.substring(0,4));
			var inMonth 	= Number(birthday.substring(4, 6));
			var inDay 		= Number(birthday.substring(6, 8));

			if(curex.util.verifyDate(inYear, inMonth, inDay) == false) return -1;
	
			// appDate로부터 년,월,일 획득.
			var appYear 	= Number(appDate.substring(0,4));
			var appMonth 	= Number(appDate.substring(4, 6));
			var appDay 		= Number(appDate.substring(6, 8));		

			if(curex.util.verifyDate(appYear, appMonth, appDay) == false) return -1;
			
			var rateYear 	= appYear - inYear;
			var rateMonth 	= appMonth - inMonth;
			var rateDay 	= appDay - inDay;		
			
			if(rateDay < 0){
				rateMonth--;
				rateDay += 30;
			}
			if(rateMonth < 0){
				rateYear--;
				rateMonth += 12;
			}

			if(rateYear < 0) return -1;
			
			var rateAge = 0;
			// 14년 12개월 이상일경우에 6개월 연산들어간다.
			if( (rateYear > 14) &&  (rateMonth >= 6) ) rateAge = rateYear + 1;
			else rateAge = rateYear;
			return rateYear;	
		}
		catch(e){
			return 0;
		}
	}; 
		
	/**
	 * YYYYMMDD  타입 날짜 형식에 type 문자열로 구분하여 반환
	 * @author ot020
	 * @since 2014. 4. 7.
	 * @param  {string} date  : YYYYMMDD  형식
	 * @param  {string} type  : 구분자  
	 * @return {string} YYYYMMDD => 구분자가 '-' 라면 YYYY-MM-DD 로 반환
	 */
	self.displayDateToFormatDate = function( inputDate  , type )
	{
		
	    var myYear  	= inputDate.substr(0,4) ;
	    var myMonth	= inputDate.substr(4,2) ;
	    var myDay   	= inputDate.substr(6,2) ;

	    return myYear + type + myMonth + type + myDay;
	    
	};	
	

	/**
	 * yymmddXXXXXXX 타입 주민번호 형식에 type 문자열로 구분하여 반환
	 * @author ot020
	 * @since 2014. 4. 7.
	 * @param  {string} date  : yymmddXXXXXXX  형식
	 * @param  {string} type  : 구분자  
	 * @return {string} yymmddXXXXXXX => 구분자가 '-' 라면 yymmdd-XXXXXXX 로 반환
	 */
	self.displayRegNoToFormatDate = function( inputData  , type )
	{
		
	    var myBirth  	= inputData.substr(0,6) ;
	    var myEtc		= inputData.substr(6,  inputData.length - 1  ) ;
	    
	    if( myEtc.length < 7 )
	    {
	    	// 일단 보류
	    }
	    
	    
	    return myBirth + type + myEtc ;
	    
	};	
	

	/**
	 * M/F 성별을 type별로 구분해서 리턴 
	 * @author ot020
	 * @since 2014. 4. 7.
	 * @param  {string} date  : M/F
	 * @param  {string} type  :   
	 * @return {string} 
	 */
	self.displayGenderToFormatDate = function( inputData  , type )
	{

		var returnData = "";

		// case
		if( type=="k1" )	returnData = (  inputData == "M" ? "남" : "여" );  
		if( type=="k2" )	returnData = (  inputData == "M" ? "남자" : "여자" );
		
	    return returnData;
	    
	};	


	/**
	 *  byte 단위로 글자 자르기 
	 * @author ot020
	 * @since 2014. 4. 7.
	 * @param  {string} str  : 대상문자열
	 * @param  {string} maxByte  :   자를 byte 
	 * @return {string} 
	 */
	self.cutStringByByte = function( inputString  , maxByte )
	{

		
		  if (inputString == null || inputString.length == 0) {
	          return "";
	      }
	      
		var returnData = "";

		var sString = inputString;
		var c = 0;
		for ( var i = 0; i < sString.length; i++) {
			
			returnData = sString.substr(0, i+1);
			
			c += parseInt(ci.util.getBytes(sString.charAt(i)));
			
			if (c > maxByte) {
				returnData = sString.substring(0, i);
				break;
			}
		}
		
		if( returnData.length == 0 ) returnData = returnData;
		
		return returnData;
		
	};	


	/**
	 *  생일날짜와 성별로 주민번호 만들기 
	 * @author ot020
	 * @since 2014. 4. 10.
	 * @param  {string} birthday  : YYYYMMDD
	 * @param  {string} gender  :  M or F   
	 * @return {string} yymmdd1 / yymmdd2 / yymmdd3 / yymmdd4  
	 */
	self.getRegNoByBirthDayAndGender = function( birthday  , gender )
	{

		var returnData = "";


		var birthYear1  = birthday.substring(0,2);
		var birthYear2  = birthday.substring(2,4);
		var birthMonth = birthday.substring(4,6);
		var birthDay   = birthday.substring(6,8);

		var regGender  = ( gender == "M" ? 1 : 2 );
		
		if( birthYear1 == "20" )
		{
			regGender = regGender + 2 ;		
		}

		returnData =   birthYear2 + birthMonth + birthDay + regGender ;
		
		return returnData;
		
	};	


	

	/**
	 * jsonArray 에서 value 에 해당하는 아이템 삭제하기 
	 * @author ot020
	 * @since 2014. 3. 27.
	 * @param  {json} array jsonArray
	 * @param  {string} property
	 * @param  {string} value 
	 * @return   {void}
	 */
	self.findAndRemoveFromJsonArray = function(array, property, value) 
	{
		
		// console.log( array  );
		
		var returnArray = [];
		
	   $.each(array, function(index, result) {
		   
	/*      if(result[property] == value) {
	          // Remove from array
	          array.splice(index, 1);    	  					// ie 에서 작동 안함. ㅠㅠ 
	    	  // console.log(  result[property]  );    	  
	      }
	*/
	      
	      if(result[property] != value) {
	    	  returnArray.push( result ); 
	      }
	      
	   });
	   
	   return returnArray;
	   
	};	
	

	// 숫자에 콤마, 표시  
	self.numberComma = function(data) {
		var nocomma = data.value.replace(/,/gi,''); // 불러온 값중에서 컴마를 제거
		var b = ''; // 값을 넣기위해서 미리 선언    
		var i = 0; // 뒤에서 부터 몇번째인지를 체크하기 위한 변수 선언        
		// 숫자를 뒤에서 부터 루프를 이용하여 불러오기    
		for (var k=(nocomma.length-1); k>=0; k--) {        
		var a = nocomma.charAt(k);         
			if (k == 0 && a == 0) {  // 첫자리의 숫자가 0인경우 입력값을 취소 시킴            
				o.value = '';            
				return;        
			}else {            
			// 뒤에서 3으로 나누었을때 나머지가 0인경우에 컴마 찍기            
			//i가 0인 경우는 제일 뒤에 있다는 것이므로 컴마를 찍으면 안됨            
			if (i != 0 && i % 3 == 0) {                
				b = a + "," + b ;            
			}else { 
			// 나머지가 0인 아닌경우 컴마없이 숫자 붙이기                
				b = a + b;            
			}             
			
			i++;        
			}    
		}     

		data.value= b; // 최종값을 input값에 입력하기
    };
	
    //숫자와 콤마만 입력 가능
    self.isNumberComma=function(data) {
    	var reg = RegExp(/^(\d|-)?(\d|,)*\.?\d*$/);
 
      	if (!reg.test(data.value))
    	{
      		alert("숫자만 입력가능합니다.");
      		data.value="";
    	    data.focus();
    	}
 
    };
	
    //천자리 "," 콤마 삭제
    self.delComma = function(str){
    	
    	if(str == null || str =="")
    	{
    		return;
    	}else{
		     // receive string that contains commas
		     stra = str.split(/,/g);  // 컴마를 기준으로 분리 , 그럼 배열로 저장되죠
		     str="";
		     for (var i=0;i<stra.length ;i++ ){
		      str += stra[i];  // 그냥 순서대로 다시 붙입니다. 
		     }
		     // return string that commas are removed
		     return str;
    	}
    };
	
    
   // 숫자에 콤마, 표시  return
	self.numberCommaRetrun = function(data) {
		
		if(data == "" || data == null)
		{
			return;
		} else {
		var nocomma = data.replace(/,/gi,''); // 불러온 값중에서 컴마를 제거
		var b = ''; // 값을 넣기위해서 미리 선언    
		var i = 0; // 뒤에서 부터 몇번째인지를 체크하기 위한 변수 선언        
		// 숫자를 뒤에서 부터 루프를 이용하여 불러오기    
		for (var k=(nocomma.length-1); k>=0; k--) {        
		var a = nocomma.charAt(k);         
			if (k == 0 && a == 0) {  // 첫자리의 숫자가 0인경우 입력값을 취소 시킴            
				o.value = '';            
				return;        
			}else {            
			// 뒤에서 3으로 나누었을때 나머지가 0인경우에 컴마 찍기            
			//i가 0인 경우는 제일 뒤에 있다는 것이므로 컴마를 찍으면 안됨            
			if (i != 0 && i % 3 == 0) {                
				b = a + "," + b ;            
			}else { 
			// 나머지가 0인 아닌경우 컴마없이 숫자 붙이기                
				b = a + b;            
			}             
			
			i++;        
			}    
		}     

		return b; // 최종값을 input값에 입력하기
		}
    };
    
    //우편번호 팝업 호출 
    self.openZipCode = function(callback) {    	
		if ( $('#iframeLayer', wrap).attr("id") == null ) {
			$("<div id='iframeLayer' class='ci-dialog-content'></div>").appendTo(wrap);
		}
		
    	var dia2 = curex.dialog.open({
            id : 'dialogZipCode',
            width : 845,
            height: 800,
            title : '우편번호검색',
            dom : $('#iframeLayer',wrap),
            iframeUrl : '/main/customer/zipcode/index.cmd',
             
            callFunction : callback,
            focus : $(this)                  

        });
    };
    
    // 직업코드 찾기 팝업
    // curex.util.openOccupation($('#iframeLayer', wrap), null, function(rslt) { ... } );
    self.openOccupation = function(dom, options, callback) {
    	if (options == null) options = {};
    	if (callback == null) callback = function(rslt) {};
		curex.dialog.open({
	        id : 'dialogOccupation',
	        width : 600,
	        height: 600,
	        title : '직업찾기',
	        dom : dom,
	        iframeUrl : '/main/customer/common/occupation.cmd', 
	        // ajaxOption : options,
	        callFunction : callback,
	        focus : $(this)	                 
	    });
    };    
    
    // 운전코드 찾기 팝업
    // curex.util.openDrive($('#iframeLayer', wrap), null, function(rslt) { ... });
    self.openDrive = function(dom, options, callback) {
    	if (options == null) options = {};
    	if (callback == null) callback = function(rslt) {};
		curex.dialog.open({
	        id : 'dialogDrive',
	        width : 600,
	        height: 600,
	        title : '운전찾기',
	        dom : dom,
	        iframeUrl : '/main/customer/common/drive.cmd',
	        // ajaxOption : options,
	        callFunction : callback,
	        focus : $(this)	                 
	    });
    };
    
    // 고객 관계명 변환
    // relCode : 관계코드, gender1 : 기준고객성별(M,F), gender2 : 대상고객성별(M,F)
    // curex.util.getRelationName('S');
    // curex.util.getRelationName('S', 'M', 'F');
	self.getRelationName = function(relCode, gender1, gender2) {
		if (gender1 == null || gender2 == null) {
			if (relCode == 'S') return "배우자";
			else if (relCode == 'C') return "자녀";
			else if (relCode == 'P') return "부모";
			else if (relCode == 'B') return "형제";
			else if (relCode == 'SP') return "배우자의부모";
			else if (relCode == 'SB') return "배우자의형제";
			else if (relCode == 'PP') return "조부모";
			else if (relCode == 'PB') return "부모의형제";
			else if (relCode == 'CS') return "자녀의배우자";
			else if (relCode == 'CC') return "손주";
			else if (relCode == 'O') return "직원";
			else if (relCode == 'E') return "기타";
			else return relCode;
		
		} else {
		
			// as-is 관계
			// 본인, 배우자, 예상배우자, 자녀, 자녀(성인), 예상자녀, 부, 모, 형제, 자매, 남매, 장인, 장모, 시아버지, 시어머니, 기타
			
			var male1 = gender1 == 'M' ? true : false;
			var male2 = gender2 == 'M' ? true : false;
			
			if (relCode == 'S') { // 배우자
				if (male2) return "남편";
				else return "아내";
	
			} else if (relCode == 'C') { // 자녀
				return "자녀";
			
			} else if (relCode == 'P') { // 부모
				if (male2) return "부";
				else return "모";			
	
			} else if (relCode == 'B') { // 형제
				if (male1 != male2) return "남매";
				else {
					if (male2) return "형제";
					else return "자매";
				}	
				
			} else if (relCode == 'SP') { // 배우자의부모
				if (male1) {
					if (male2) return "장인";
					else return "장모";
					
				} else {
					if (male2) return "시아버지";
					else return "시어머니";
				}
			
			} else if (relCode == 'SB') { // 배우자의형제
				return "형제(배)";
				
			} else if (relCode == 'PP') { // 조부모
				if (male2) return "조부";
				else return "조모";			
				
			} else if (relCode == 'PB') { // 부모의형제
				return "친척";
				
			} else if (relCode == 'CS') { // 자녀의배우자
				if (male2) return "사위";
				else return "며느리";
				
			} else if (relCode == 'CC') { // 손주
				return "손주";
	
			} else if (relCode == 'O') { // 직원
				return "직원";
				
			} else if (relCode == 'E') { // 기타
				return "기타";

			} else return relCode;
		}
	};
	
	self.setIframeHeight = function(obj){
		var iframe = $(obj);				
		if(ci.agent.isIe){
			iframe.height(obj.contentWindow.document.body.clientHeight);
		}else{
			iframe.height(iframe.contents().find("html").height());
		}	
	};


	/**
	 * product workbench 에서 출력하는 엑셀
	 */
	self.pwbExcelRpt = function(options){
		var iframe = '<iframe id="downloadFrame" name="downloadFrame" style="display:none" title="downloadFrame"></iframe>';
		var frm = '<form id="excelDownFrm" name="excelDownFrm" method="post" target="downloadFrame" action="/pwb/phraseBlockManager/control/ExcelReport.cmd" >';
		
		if (options.formData != undefined && options.formDate != '') {
			for ( var i = 0, ic = options.formData.length; i < ic; i++) {
				var _name = options.formData[i].name;
				var _value = options.formData[i].value;
				frm += '<input type="hidden" name="' + _name + '" value="' + _value + '" />';
			}
		}
		
		var headerCnt = 0;
		if (options.header != undefined && options.header != '') {
			for ( var i = 0, ic = options.header.length; i < ic; i++) {
				for ( var j = 0, jc = options.header[i].length; j < jc; j++) {
					frm += '<input type="hidden" name="header' + i + '" value="' + options.header[i][j] + '" />';
				}
			}
			headerCnt = options.header.length;
		}
		
		for ( var i = 0, ic = options.rows.length; i < ic; i++) {
			for ( var j = 0, jc = options.rows[i].length; j < jc; j++) {
				frm += '<input type="hidden" name="row' + i + '" value="' + options.rows[i][j] + '" />';
			}
		}
		
		var infoVal = 'RowCnt=' + options.rows.length + "|HeaderCnt=" + headerCnt;
		
		for ( var i = 0, ic = options.data.keyArry.length; i < ic; i++) {
			var keyName = options.data.keyArry[i];
			for ( var j = 0, jc = options.data.getCount(keyName); j < jc; j++) {
				frm += '<input type="hidden" name="' + keyName + '" value="' + options.data.get(keyName,j) + '" />';
			}
		}
		
		
		if (options.info.title !== undefined && options.info.title != '') {
			infoVal += '|title=' + options.info.title;
		}
		
		if (options.info.desc1 !== undefined && options.info.desc1 != '') {
			infoVal += '|desc1=' + options.info.desc1;
		}
		
		if (options.info.desc2 !== undefined && options.info.desc2 != '') {
			infoVal += '|desc2=' + options.info.desc2;
		}
		
		frm += '<input type="hidden" name="info" value="' + infoVal + '" />';
		frm += '</form>';
		
		iframe = $(iframe);
		frm = $(frm);
		
		$('body').append(iframe).append(frm);
		frm.submit();
	}

	//로딩바 open
	self.openLodingBar = function(){
		var iWidth = (($(window).width() - 36) / 2);		
		$.blockUI({ message: "<div class='loadingBar'>&nbsp;</div>" ,css : { width:'0px',height:'0px',border : '0px solid #fffff',top:'50%', left:iWidth}});
	};

	//로딩바 close
	self.closeLodingBar = function(){		
	  	setTimeout(function(){		  			 
			  $('.loadingBar').remove();
			  $.unblockUI();
		},1000);
	  
	};
	
	
	if (!curex) {
		window.curex = curex = {};
	}
	curex.util = self;
	

	
})(window.curex);