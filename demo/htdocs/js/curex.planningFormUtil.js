/***
 * 이 파일은 계획수립 화면상에 여러상품에서 공통적으로 사용하는 js 함수를 추출한 것이다.
 * - 내용  : 저장, 새계획, 마이플랜으로 저장, 삭제, 보험료 계산 등
 * - 수정이력
 *   : 2009.07.15 김대희 최초 작성
 *   : 2010.06.15 김대희 헬스케어(자녀형) 관련 함수 추가
 ***/

/****** 스크립트 실행 영역********************/
var _area = null;
var _planTab = null;

/********* 전역변수 객체 선언 ***************/

//인코딩 해야 하는 값들 모음
var	GLOBAL_FUND_TYPE_NAME = ""; 
var	GLOBAL_FUND_TYPE_NAME1 = "";
var	GLOBAL_FUND_TYPE_NAME2 = "";
var	GLOBAL_JOINT_INSURED_NAME = "";
var	GLOBAL_PLAN_NAME = "";
var	GLOBAL_YOU_AND_I_FACEAMOUNT = "";


var toggle = false;

var CommUI = {
		
	makeSelectBox : function(targetSel,optData,defaultValue,fixOption,parentDiv){
		
		targetSel.html('');
		
		if(fixOption!=null)
			$(document.createElement('option')).val(fixOption[0]).text(fixOption[1]).appendTo(targetSel);
		
		var options = optData ;
		
		for(i=0 ; i<options.length;i++){
			
			var data = options[i];						
			$(document.createElement('option')).val(data.code).text(data.name).appendTo(targetSel); 
		}
		
		if(defaultValue!=null)
			targetSel.val(defaultValue);							
	},
	addSProductRow : function(tarTableObj,targetObj , position ){

		var parentDiv = tarTableObj.parent().eq(0);
		var lastTr = tarTableObj.find('tr').last();
		var trHtml = '';
		
	//	alert(rowcnt);
		
		lastTr.find('td').last().html('<a href="#none" class="cellDel"><img src="/img/common/icon4.gif" alt="삭제" /></a>');

		trHtml += '<tr>' ;
		trHtml += '	<input type="hidden" name="clientId" value=""/>' ;
		trHtml += '	<input type="hidden" name="age" value=""/>' ;
		trHtml += '	<input type="hidden" name="sex" value=""/>' ;
		trHtml += '	<input type="hidden" name="residentNo" value=""/>' ;				// OT020  추가 
		trHtml += '	<input type="hidden" name="jobCode" value=""/>' ;				// OT020  추가
		trHtml += '	<input type="hidden" name="jobIstCode" value=""/>' ;				// OT020  추가		: 4자리
		trHtml += '	<input type="hidden" name="jobOccCode" value=""/>' ;				// OT020  추가	: 2자리
		
		trHtml += '	<td class="turn">';
		trHtml += '		<input type="hidden" name="capsilCode">';
		trHtml += '		<input id="idProductCode" type="hidden" name="productCodeViewer" >';
		trHtml += '		<input type="hidden" name="ForecastId" value="">';
		trHtml += 	'</td>' ;
		trHtml += '	<td name="subCodeViewer">';
		trHtml += '	</td>' ;
		trHtml += '	<td>' ;
		trHtml += '		<span class="selectFull">' ;
		trHtml += '			<select name="iType"></select>' ;
		trHtml += '			<span class="bubble">' ;
		trHtml += '				<span class="bb">' ;
		trHtml += '					<span id="planCode"></span>' ;
		trHtml += '					<span class="arr">&nbsp;</span>' ;
		trHtml += '				</span>' ;
		trHtml += '			</span>' ;
		trHtml += '		</span>' ;
		trHtml += '	</td>' ;
		trHtml += '	<td>' ;
		trHtml += '		<span class="selectFull">' ;
		trHtml += '			<select name="iGPeriod"><option value=""></option></select>' ;
		trHtml += '		</span>' ;
		trHtml += '	</td>' ;
		trHtml += '	<td>' ;
		trHtml += '		<span class="selectFull">' ;
		trHtml += '			<select name="iPPeriod"><option value=""></option></select>' ;
		trHtml += '		</span>' ;
		trHtml += '	</td>' ;
		trHtml += '	<td class="textR">' ;
		trHtml += '		<span class="widthFull"><input type="text"   name="iAmount"  /></span>' ;
		trHtml += '	</td>' ;
		trHtml += '	<td class="textR"><span class="widthFull"><input type="text" class="bderN pR2 disebled" style="width100%" name="eachPremiumViewer" ReadOnly value="" /></span></td>' ;
		trHtml += '	<td></td>' ;
		trHtml += '</tr>' ;
		
		if(targetObj){
		
			if(position=="prev")
				targetObj.before(trHtml) ;
			else
				targetObj.after(trHtml) ;
		}			
		else
			tarTableObj.append(trHtml);

		//parentDiv.dndInit(parent);

		
	},
	deleteSProductRow : function(){
		
	},
	setIdentityInsertDash : function(src) {
		
		if(src.length < 7) return src;
		
		return src.substring(0,6) + "-" + src.substring(6,src.length-6);

	},
	checkNumber : function (obj, data)
	{

	   if(event.keyCode == 9)
	   {
	   	obj.focus();
	   	return;
	   }

	  
		data=data.replace(/[^0-9]/g ,"");
		//obj.value = data;
		var moneychar = "";
		for(index=data.length-1;index>=0;index--)
		{
	   		splitchar=data.charAt(index);
	   		moneychar=splitchar+moneychar;
	   		if(index%3==data.length%3&&index!=0){ moneychar=','+moneychar; }
		}
		obj.value = moneychar;
	},

	doCompletion : function (target, start, end) {
 
	   if(event.keyCode == 229 && event.button == 0 && event.type=='keyup') { return;} //완전 익스플로러 버그 - 말도안되는 상황에서 이상한 이벤트가 발생함.
	   if(CommUI.moveFocus() == true) return;

	   var names = document.getElementById("names");
	   clearTable();

	   if(event.keyCode == 38 || event.keyCode == 37 || event.keyCode == 39  || event.keyCode == 9 ||  event.keyCode == 116 ||  event.keyCode == 27 || event.keyCode == 13 )
	   {
	      return;
	   }

	   curSelectField = target;
	   names.innerHTML = CommUI.makeSelectHtml(target, start, end);

	   var autorow = document.getElementById("menu-popup");
	   autorow.style.top = eval(CommUI.getElementY(target) + target.offsetHeight) + "px";
	   autorow.style.left = CommUI.getElementX(target) + "px";
	   autorow.style.display = "block";

	   CommUI.moveFocus();
	   return true;

	},
	moveFocus : function()
	{
	  if(event.keyCode == 40)
	   {
	     var am = document.getElementById("ar");
	     if(am != null && am.options[0] != null)
	     {
		   am.options[0].selected = true;
		   am.focus();
		   return true;
	     }
	   }

	   return false;
	},	
	clearTable : function() {

		  var names = document.getElementById("names");
		  if(names == null) return;
	      var autorow = document.getElementById("menu-popup");
	      autorow.style.display = "none";

	      names.innerHTML="";
	},
	makeSelectHtml : function(target, start, end)
	{
	    if(target.value.length == 0 || target.value.substring(0,1) == '0' || target.value.substring(0,1) == ',')
	    {
	    	return CommUI.makeFullSelectHtml(target, start, end);
	    }

	    var count = 0;

	    var tempValue=target.value.replace(/[^0-9]/g ,"");
	    var startValue = eval(tempValue.substring(0,2));

	    var removeCount = ("" + startValue).length;

	    var startLen = start.length - removeCount;

	    for(i = 0; i < startLen; i++)
	    {
	    	startValue *= 10;
	    }

	    var html = "";
	    for(j = startValue; j < eval(end) ; j*=10, count++)
	    {    	
	    	html += "<option value=\""+ CommUI.formatCurrency(j)+"\">"+ CommUI.formatCurrency(j)+"</option>";
	    }
	    html += "</select></td></tr></table>";

	    // if(count == 1) count++;
	    var header = "";
	    header += "<table   border=\"1\" bordercolor=\"#000000\" cellspacing=\"0\" cellpadding=\"0\"><tr><td>";
	    header += "<select name='ar' id='ar' style='width:95px' onClick ='javascript:selectValueBefore(this)' onkeyup='javascript:selectValueBefore(this)' onblur='clearTable()' size="+count+">";

	    return header + html;
	},
	makeFullSelectHtml : function(target, start, end)
	{

	    var html = "";

	    var count = 0;
	    var startLen = start.length;
	    var endLen = end.length;
	    var beforeValue = 0;
	    
	    for(kk = startLen; kk <= endLen; kk++)
	    {
		    var firstIncreaseValue = 1;
		    for(ii = 0; ii < kk-1; ii++)
		    {
		    	firstIncreaseValue *= 10;
		    }

		    var minValue = Math.max(firstIncreaseValue, eval(start));
		    var maxVallue = Math.min(firstIncreaseValue * 10, eval(end));
		    //console.log("----------------------------------------");
		    for(jj = minValue; jj <= maxVallue ; jj+=firstIncreaseValue, count++)
		    {	 
				if(beforeValue == jj) { count--; continue; }
				//console.log("count : " + count +  " beforeValue : " + beforeValue + " jj : " + jj);
		    	html += "<option value=\""+ CommUI.formatCurrency(jj)+"\">"+ CommUI.formatCurrency(jj)+"</option>";
				beforeValue = jj;
		    }
	    }


	    html += "</select></td></tr></table>";
	    //console.log("html : " + html);

	    if(count > 15) count = 15;
	    if(count <= 1) count = 2;
	    

	    var header ="";
	    header += "<table bgcolor=\"#939AB4\"  border=\"1\" bordercolor=\"#B0B6CB\" cellspacing=\"0\" cellpadding=\"0\"><tr><td>"
	    header += "<select name='ar' id='ar' style='width:106px' class='sel02' onClick ='javascript:selectValueBefore(this)' onkeyup='javascript:selectValueBefore(this)' onblur='clearTable()' size="+count+">";
	    return header + html;

	},
	formatCurrency : function(i)
	{
		var data = ""+i;
		var moneychar = "";
		for(index=data.length-1;index>=0;index--)
		{
	   		splitchar=data.charAt(index);
	   		moneychar=splitchar+moneychar;
	   		if(index%3==data.length%3&&index!=0){ moneychar=','+moneychar; }

		}


		return moneychar;
	},
	removeCurrencyFormat : function(i){
		
		var data = i.split(",");
		
		var amount = "";
		for(index=0 ; index < data.length;index++)
		{
			amount = amount + data[index];

		}
		return amount;		
	},
	selectValueBefore : function (obj){
		if(obj.selectedIndex == "-1"){
			return false;
		}
	},
	getElementY : function(element){
		var targetTop = 0;
		if (element.offsetParent) {
			while (element.offsetParent) {
				targetTop += element.offsetTop;
	            element = element.offsetParent;
			}
		} else if (element.y) {
			targetTop += element.y;
	    }
		return targetTop;
	},
	getElementX : function (element){
		var targetTop = 0;
		if (element.offsetParent) {
			while (element.offsetParent) {
				targetTop += element.offsetLeft;
	            element = element.offsetParent;
			}
		} else if (element.x) {
			targetTop += element.x;
	    }
		return targetTop;
	},
	/**
	 * 단체 / 단체가상 설계 화면인지 여부  
	 * @author ot020
	 * @since 2014. 4. 16.
	 * @return   {void}
	 */
	isPlanningGroup : function() 
	{

	   var bResult = false;	   
	   if( $(window['LI_010203_T1']).length  > 0   )  bResult = true ;	   
	   return bResult;
	}
	
};

//선택한 row가 -1인경우 스크립트 에러발생하여 전환
function selectValueBefore(obj){
	if(obj.selectedIndex == "-1"){
		return false;
	}
	
	selectValue(obj.options[obj.selectedIndex].value);
}


function clearTable() {

	  var names = document.getElementById("names");
	  if(names == null) return;
      var autorow = document.getElementById("menu-popup");
      autorow.style.display = "none";

      names.innerHTML="";
}


function selectValue(value,target)
{

  if(event.keyCode == '27')
  {
  	 clearTable();
  	 curSelectField.focus();
  }
  if(event.keyCode != '0'  && event.keyCode != '13') return;

   curSelectField.value = value;
   curSelectField.focus();
   clearTable();

}

function hideCalculateResultButton(){
	
 	//closeChildWindow();
//	curex.floatingBar.setActive([{btnId:'btnCalculate' , active: false}]);
// 	window["LI_010201_T2"].setFloatingActive([{btnId:'btnPlanPrint' , active: false}]);
// 	window["LI_010201_T2"].setFloatingActive([{btnId:'btnApply' , active: false}]);
//		curex.floatingBar.setActive([{btnId:'btnPrint' , active: false}]);

}
function showCalculateResultButton(){

//	curex.floatingBar.setActive([{btnId:'btnCalculate' , active: true}]);
//	window["LI_010201_T2"].setFloatingActive([{btnId:'btnPlanPrint' , active: true}]);
//	window["LI_010201_T2"].setFloatingActive([{btnId:'btnApply' , active: true}]);
//		curex.floatingBar.setActive([{btnId:'btnPrint' , active: true}]);

}


/*********** StringBuffer 정의 *************/
var StringBuffer = function(){
   this.buffer = new Array(); 
}
//순서대로 문자열을 추가한다.
StringBuffer.prototype.append = function(str) {
    this.buffer[this.buffer.length] = str ;
     return this;
}

//해당하는 위치에 문자열을 추가한다. (문자위치가 아님);
StringBuffer.prototype.insert = function(idx, str) {
    this.buffer.splice(idx, 0, str);     //IE5.5 NS4
    return this;
}
// 해당문자열을 새로운 문자열로 바꾼다.
// (배열방 단위로 바꾸므로 배열방 사이에 낀 문자열은 바꾸지 않음)
StringBuffer.prototype.replace = function( from, to) {
    for( var i=this.buffer.length-1; i>=0; i--) {
        this.buffer[i] = this.buffer[i].replace(new RegExp(from, "g"), to); //IE4  NS3
    }
    return this;
}
// 문자열로 반환한다.
StringBuffer.prototype.toString = function() {
    return this.buffer.join("");   //IE4 NS3
}
/*********** StringBuffer 정의 *************/

function checkNumberForGeneral(obj, data)
{

   if(event.keyCode == 9)
   {
   	obj.focus();
   	return;
   }

	data=data.replace(/[^0-9]/g ,"");

	var moneychar = "";
	for(index=data.length-1;index>=0;index--)
	{
   		splitchar=data.charAt(index);
   		moneychar=splitchar+moneychar;
   		if(index%3==data.length%3&&index!=0){ moneychar=','+moneychar; }
	}
	obj.value = moneychar;
}

function checkNumber(obj, data)
{

   if(event.keyCode == 9)
   {
   	obj.focus();
   	return;
   }

//   	hideCalculateResultButton();
	data=data.replace(/[^0-9]/g ,"");
	//obj.value = data;
	var moneychar = "";
	for(index=data.length-1;index>=0;index--)
	{
   		splitchar=data.charAt(index);
   		moneychar=splitchar+moneychar;
   		if(index%3==data.length%3&&index!=0){ moneychar=','+moneychar; }
	}
	obj.value = moneychar;
}

function setToday(){

	var d = new Date();
	var thisYear = d.getFullYear();
	var month = (d.getMonth() + 1);
	var toDay = d.getDate();

	if (month < 10)
	{
		thisMonth = "0" + (month);
	}
	else
	{
		thisMonth = "" + (month);
	}

	if (toDay < 10)
	{
		toDay = "0" + (toDay);
	}
	else
	{
		toDay = "" + (toDay);
	}

	document.PlanForm.calculateDateView.value = thisYear + "." + thisMonth + "." + toDay;

	if(this.updateDate != null) //부모윈도우에서 날짜 변경 후 화면 업데이트가 필요할 경우를 대비한 일종의 인터페이스로 추출함.2005.10.04..yjkim
	{
		this.updateDate();
	}
}




/**
 * myplan 여부 확인
 */
function isMyPlan(_area){
	var seqNo = getSeqNo(_area);

	if(parseInt(seqNo) >= 1000000){
		return true;
	} else {
		return false;
	}
}

/**
 * 계획수립 의 번호 가져오기
 * @return
 */
function getSeqNo(_area){

	var result = "0";
	if ($('input[name=sequentialNo]',_area).val() != null && $('input[name=sequentialNo]',_area).val()=='' ){
		result = $('input[name=sequentialNo]',_area).val() ;
		result = result.replace(/-0/g,"");
	}
	return result;
}


/**
 * 저장된 계획수립 삭제
 */
function deletePlan(seqNo,planType,obj,areaName)
{
	
	var frm = window[areaName].form;
	var needsType = $('input[name=needsType]',frm).val();

	$.post("/main/lips/planning/planningcrud/deletePlan.json",
			{sequentialNo: seqNo,needsType : needsType}, // param
			function(data){ // when it success
			
				if(data.result=="success"){
					alert("삭제 완료 되었습니다.");
					// 새계획으로 시작하기
					$(obj).parent('a').parent('span').parent('li').remove();
					
				}
			
	});

}


/**
 * 계획수립 저장
 * 
 * 일반저장 버튼을 누르면    
 * MyPlan 계획일경우 일반플랜으로 같은내용 추가 생성    
 * 일반계획은 그대로 저장 됨 
 */ 
function savePlan(areaID)
{

	_area = window[areaID];
	
	if(!isValid(_area)) return false;

	// My plan 여부 체크 후 일반플랜으로 복사생성 기능
	if(isMyPlan(_area)){
		$("input[name=isPlanConvert]",_area).val("true");
		convertPlan(_area);
		return false;
	}

	var name = $('#planName').val() ;
	$("input[name=name]").val(name);
	
	// 한글깨짐 문제로 인코딩 수행 ,  "," 제거 !
// 	encodeParam(); 	
//	openProgress();
	$.post("/main/lips/planning/planningcrud/createPlan.json",
		_area.planForm.serialize(), // param
		function(data){ // when it success			
			$('input[name=sequentialNo]',_area).val(data.sequentialNo);
			alert("저장 완료 되었습니다.");
	});
	
	// document.PlanForm.name.value = name;
	// 한글깨짐 문제로 인코딩 원복  , "," 재삽입 	 
 //	decodeParam();
 	
 	return false;
}

/**
 * MyPlan 저장
 * @return
 */
function saveMyPlan(areaID)
{
	_area = window[areaID];

	if(!isValid(_area)) return false;
	_area = window[areaID];

	$("input[name=name]").val($('#planName').val());

	len = $('input[name=iType]',_area).length;
	for(i = 0; i < len ; i++)
	{
		value = $('input[name=iAmount]',_area).val();
		$('input[name=iAmount]',_area).val(value.replace(/[^0-9]/g ,""));
	}

	// 헬스케어(자녀형) or 종피보험자(KVUL)등 이 있을겨우 myPlan 저장 불가	,,, 종피가 가족이 아닐수도..ㅡㅡ
	if(($('input[id=riderInsuredClientId]',_area).not('[value=""]').length > 0 ) || ($('#tblJointInsuredInfo:visible').length > 0)){	
		alert("종피보험자가 존재할 경우 MyPlan 저장은 불가 합니다.");
		return false;
	}

//	openProgress();
	// My plan 여부 체크 후 일반플랜으로 복사생성 기능
	if(!isMyPlan(_area) && getSeqNo(_area) != "0"){
		$("input[name=isPlanConvert]",_area).val("true");
		convertPlan(_area);
		return false;
	}

	$('input[name=isMyPlan]',_area).val("true");
	
	// 한글깨짐 문제로 인코딩 수행 ,  "," 제거 !
 	encodeParam();

	$.post("/main/lips/planning/planningcrud/createPlan.json",
			_area.planForm.serialize(), // param
			function(data){ // when it success
//				alert(data.sequentialNo);
				$('input[name=sequentialNo]',_area).val(data.sequentialNo);
				alert("MyPlan으로 저장했습니다.");
	}); 
	// 한글깨짐 문제로 인코딩 원복  , "," 재삽입 	 
 	decodeParam();

 	return false;

}

function isValid(_area)
{
	// document.PlanForm.target="daemon";
	// document.PlanForm.action = "/LP_CreatePlanAction.do";

	var frm = _area.form;
	
    $('#planName').val($('#planName').val().replace(/\'/g, ''));
	name = $('#planName').val();

	if(name == ''|| name == '계획명을 입력하세요.')
	{
		alert("계획명을 입력하십시요!");
		return false;
	}

	mainPlanCode = $('input[name=iType]',_area).val();
	if(mainPlanCode == -1)
	{
		alert("주계약을 선택해야 합니다.");
		return false;
	}

	var billingLength = $('input[name=billingFrequency]',_area).length;
	var uncheck = 0;
	for(i = 0; i < billingLength; ++i)
	{
		if(!$('input[name=billingFrequency]',_area).eq(i).attr('checked')) uncheck++;
	}

	if(uncheck == billingLength)
	{
		alert("납입주기를 선택하십시요!");
		return false;
	}
 
 	var isVariableProduct = _area.planUI.getRiderUIInfo(mainPlanCode).isVariableProduct;
 	//////////////// 펀드관련 체크
 	if(isVariableProduct){
 	 	if(!_area.validCheck.checkFundRule()){
 	 		return false;
 	 	}
 	}
 	
 	// 가입금액 or 보험료 입금여부 확인,입력된 케이스로 ! (each문은 도중에 빠져나갈수가 없어서, for문 사용)
 	var selectedPlanObj = $('[name=iType]',_area.planForm);
 	
 	for(var i=0; i < selectedPlanObj.length; i++){
 		
 		var selectedPlanCode = selectedPlanObj.eq(i).val();

 		if(selectedPlanCode != '-1'){
 			var riderUIInfo = _area.planUI.getRiderUIInfo(selectedPlanCode);
 	 		//var tdList = selectedPlanObj.parent('td').siblings(); // 계획수립을 하는 한 row의 TD들 모음(보종코드, 부코드, 보장기간 등,,), 그아래 select박스등이 존재
 	 		
 	 		// 입력값 type 가입금액 : 0 , 보험료 : 1 -- 주계약의 타입으로 우선 세팅 // 'inputLn03' 입력가능한 모양 class
 	 		if(riderUIInfo.inputAmountType == 0){ 
				if($('input[name=iAmount]',_area.planForm).eq(i).val() == '' && !_area.validCheck.isIllnessWaiver(selectedPlanCode))
				{			
	 				alert("가입금액을 입력하십시요!"); 	
	 	 			return false;
				}
 			} else {
				if($('input[name=eachPremiumViewer]',_area.planForm).eq(i).val() == '')	
				{	
 	 				alert("보험료를 입력하십시요!");
 	 	 			return false; 					
 				}

 			} 			
 		} 		
 	}
 	
	return true;

}

/**
 * 계획수립 불러오기 함수
 */
function readPlan(seqNo,areaID)
{
	//closeChildWindow();
	_area = window[areaID];
	if(seqNo == 0) return;
	
//	openProgress();
	
	// 전체 계획수립 row 초기화
	window[areaID].planUI.resetAllPlanningInfo();
	
	// 저장된 계획수립 정보 가져오기
	$.post("/main/lips/planning/planningcrud/readPlan.json",
		{sequentialNo: seqNo}, // param
		function(data){ // when it success			
			$('#planName').val(data.readData.planName); // // 계획명명 세팅
			window[areaID].planUI.setReadPlanInfo(data.readData);
	}); 
	//openProgress();
}


/**
 * 부가되는 특약체크를 위한 함수
 * - 이력
 *  2010.01.01 / 적용 특약 : 기부보험 / 주계약외의 특약부가시 계획수립 안됨
 */
function checkISubType(data)
{	
	if(data){
		var productCodes = $('input[id*="idProductCode"]');
		var riderCnt = 0; // 특약이 부가된 숫자
	
		for(var i = 0; i < productCodes.length; i++){			
			if(productCodes[i].value != ""){
				// alert(productCodes[i].value);
				riderCnt++;
			}
		} 
		
		if(riderCnt > 1){
			alert("주계약외의 특약상품 부가시 기부 특약을 추가할 수 없습니다.");
			document.PlanForm.isContribution.checked = false;
			return;
		}	
	}
}

//자녀승계특약 체크 - SVUL
function checkIsChildrenChType()
{
	var data =document.PlanForm.isChildren.checked;
	if(data == true){
		for( i =1 ; i < 10 ; i++){
			itype = document.PlanForm.iType[i].options[document.PlanForm.iType[i].selectedIndex].value;
			if(itype != -1){
				alert("자녀승계 특약은 제도성 특약을 제외한 다른 특약과 동시에 부가가 불가 합니다. ");
				document.PlanForm.isChildren.checked = false;
				return;
			}
		}
	}
}


function changeNumberToDateWrapper(cotrol, controlValue)
{
   var backupDate = document.PlanForm.calculateDateView.value;

   if(changeNumberToDate(cotrol, controlValue) == 0)
   {
      document.PlanForm.calculateDateView.value = backupDate.substring(0, backupDate.length-1);
   }

   var dataOfview = document.PlanForm.calculateDateView.value;
   if(dataOfview.substring(dataOfview.length-2, dataOfview.length) == "00" && dataOfview.length > 5)
   {
      document.PlanForm.calculateDateView.value = dataOfview.substring(0, dataOfview.length-1);
      return;
   }
   else if(dataOfview.substring(dataOfview.length-3, dataOfview.length) == "00." && dataOfview.length > 5)
   {
      document.PlanForm.calculateDateView.value = dataOfview.substring(0, dataOfview.length-2);
      return;
   }

   if(dataOfview.length == 10)
   {
   	updateDate();
   }
}

/**
 * 현재 선택한 종피보험자 수
 * 
 * @return
 */
function getCntSubCoveredPerson(){
	
	var subCoveredPersons = $$('tr[id *= "trSubCoveredPerson"]');
	var cntCntSubCoveredPerson = 0;
	
	for(var i =0; i < subCoveredPersons.length; i++){
		if(subCoveredPersons[i].visible()) cntCntSubCoveredPerson++;
	}	
	return cntCntSubCoveredPerson;
}


/**
 * yyyyMMdd -> yyyy.MM.dd 으로 변환
 * 20111225 -> 2011.12.25
 * 
 * @param data
 * @returns
 */
function formatDate(data){
	
	var result = "";
	if(data.length < 8){
		return data;
	} else {
		var year = data.substring(0,4);
		var month = data.substring(4,6);
		var day = data.substring(6,8);
		
		result = year + '.' + month + '.' + day; 
	}	
	return result;
}


/**
 * 두 날짜의 차이를 일자로 구한다.(조회 종료일 - 조회 시작일)
 *
 * @param val1 - 조회 시작일(날짜 ex.2002-01-01)
 * @param val2 - 조회 종료일(날짜 ex.2002-01-01)
 * @return 기간에 해당하는 일자
 */
function calDateRange(val1, val2)
{
    var FORMAT = "-";

    // FORMAT을 포함한 길이 체크
    if (val1.length != 10 || val2.length != 10)
        return null;

    // FORMAT이 있는지 체크
    if (val1.indexOf(FORMAT) < 0 || val2.indexOf(FORMAT) < 0)
        return null;

    // 년도, 월, 일로 분리
    var start_dt = val1.split(FORMAT);
    var end_dt = val2.split(FORMAT);

    // 월 - 1(자바스크립트는 월이 0부터 시작하기 때문에...)
    // Number()를 이용하여 08, 09월을 10진수로 인식하게 함.
    start_dt[1] = (Number(start_dt[1]) - 1) + "";
    end_dt[1] = (Number(end_dt[1]) - 1) + "";

    var from_dt = new Date(start_dt[0], start_dt[1], start_dt[2]);
    var to_dt = new Date(end_dt[0], end_dt[1], end_dt[2]);

    return (to_dt.getTime() - from_dt.getTime()) / 1000 / 60 / 60 / 24;
}

/**
 * 날짜 더하기 함수
 */
function addDay(ymd, v_day){


 var yyyy = ymd.substr(0,4);
 var mm = eval(ymd.substr(4,2) + "- 1") ;
 var dd = ymd.substr(6,2);

 var dt3 = new Date(yyyy, mm, eval(dd + '+' + v_day));

 yyyy = dt3.getFullYear();
 mm = (dt3.getMonth()+1)<10? "0" + (dt3.getMonth()+1) : (dt3.getMonth()+1) ;
 dd = dt3.getDate()<10 ? "0" + dt3.getDate() : dt3.getDate();

 return  "" + yyyy + "" + mm + "" + dd ;

}

/*
 * 날짜 형식 만들어 주기
 */
function makeDay(i){
// alert(i);
	if(parseInt(i) < 10){
		i = "0" + parseInt(i);
		return i; 
	}else{
		return parseInt(i);
	}	
}

/**
 * 계획수립 화면 달력에서 날짜선택시 세팅해주는 함수
 */
function updateDate()
{
	// openProgress();
	

   // 날짜변경시 특약피보험자 정보 리셋   
   // 특약피보험자는 reset <--- 날짜변경시 특약피보험자 리셋
   if($('input[id="riderInsuredClientId"]').not('[value=""]').length > 0){
	   // alert("산출기준일을 변경하는 경우 헬스케어특약(자녀형) 정보는 초기화 됩니다.");
	   // resetAllRiderInsured(); 
   }
   
   document.PlanForm.originCalculateDate.value = document.PlanForm.calculateDate.value;
   var dataOfview = document.PlanForm.calculateDateView.value;

   if(dataOfview.length == 10)
   {

		dataOfview = dataOfview.replace(/[^0-9]/g ,"");
	    // 산출기준일을 현재시점보다 61일 초과하여 과거일로 설정할 경우 상품설명서 및 청약서 발행이 불가합니다. 더불어, 가입한도제한이나 특약제한 등의 설계제약조건룰이 적용되지 않습니다.
	    checkElapsed61DaysFormToday(dataOfview);   
	
	   	document.PlanForm.calculateDate.value = dataOfview;
	   	PlanUI.hideCalculateResultButton();
	
		// 한글깨짐 문제로 인코딩 수행 ,  "," 제거 !
	 	encodeParam();		
//		openProgress();
		$.post("/PrepareCalculateDate.do?method=prepareCalculateDate",
			$("#PlanForm").serialize(), // param
			function(data){ // when success			
				PlanUI.setReadPlanInfo(data);
			}
		);
		
		// 한글깨짐 문제로 인코딩 원복  , "," 재삽입 	 
	 	decodeParam();
	}
}


/**
 * 현재를 기준으로 특정일자가 지난 혹은 과거의 날짜를 가져 옴 2011.12.09 dhkim
 * - baseDate : 기준일자 ex) 20111208   // "-"는 제거함
 * - days : 날짜 범위 ex) -61
 */
function checkElapsedDaysFormToday(baseDate, days){
	
   var toDate = new Date();
   thisYear = toDate.getFullYear();
   thisMonth = makeDay((toDate.getMonth() + 1));
   toDay = makeDay(toDate.getDate());

   var toDateString = thisYear + "" + thisMonth + "" + toDay + "";  
   var before61Days = addDay(toDateString, days);
   
   if(baseDate != null){
	   baseDate = baseDate.replace(/[^0-9]/g ,"");   
   } else {
	   return false;
   }

   if(baseDate.length == 8)
   {	  
      if(parseInt(before61Days) >= parseInt(baseDate)){
    	alert("산출기준일을 현재시점보다 61일 초과하여 과거일로 설정할 경우 상품설명서 및 청약서 발행이 불가합니다. 더불어, 가입한도제한이나 특약제한 등의 설계제약조건룰이 적용되지 않습니다.");
	  }
      
      // 2012.07.01 임시적으로 적용 버전
      /* 날짜만 바꿔서 쓰면 됨
      if(parseInt(baseDate) >= parseInt('20120701')){
      	alert("2012년 7월 1일 이후 청약건에 대해서는 시스템 변경 후의 청약서 및 상품설명서를 사용하셔야 합니다.\n청약서 및 상품설명서 출력은 산출기준일을 2012년 6월 30일까지 설정하실 경우 가능하며,\n시스템 변경일정은 추후 공지드리겠습니다.");
  	  }      
  	  */
   }	
   
   
}

/**
 * 현재를 기준으로 61일 과거의 날짜를 가져 옴 2011.12.09 dhkim
 * - baseDate
 */
function checkElapsed61DaysFormToday(baseDate){
	checkElapsedDaysFormToday(baseDate, -61);
}

function closeChildWindow()
{
	if(PlanUI.popPlanResultWindow != null)
		PlanUI.popPlanResultWindow.close();
}


// 입력한 키값 리턴
function getKeyCode(e) {

	var result;
	// IE
	if (window.event) {
		result = window.event.keyCode;
	// Firefox
	} else if (e) {
		result = e.which;
	}
	return result;
}

// enter key를 입력하면 "확인" 버튼 누른것과 동일한 수행
function checkEnter(e) {
	if (getKeyCode(e) == 13) {
		setSubCoveredPersonInfo();
		return false;
	}
}

//enter key를 입력하면 "확인" 버튼 누른것과 동일한 수행
function checkEnter(e) {
	if (getKeyCode(e) == 13) {
		setSubCoveredPersonInfo();
		return false;
	}
}

//enter key를 입력하면 입력받은 function을 수행
function checkEnterWithFunction(e, functionName) {
	
	if (getKeyCode(e) == 13) {
		functionName.call();
		return false;
	}
}

/**
 * @param rsdn
 * @return String 
 */
function getBirthdayFromRSDN(rsdn){
	var birthday = null;
	var code = 0;

	//주민번호 뒷자리가 정확하게 입력되지 않은 고객은 default setting
	if(rsdn.length < 7){
	    code = 0;
	}else{
		code = parseInt(rsdn.substring(6, 7));
	}
	switch (code)
	{
		case 3 :
		case 4 :
		case 7 :
		case 8 :
			birthday = "20" +rsdn.substring(0, 6);
			break;
		case 1 :
		case 2 :
		case 5 :
		case 6 :
			birthday = "19" + rsdn.substring(0, 6);
			break;
		default:
			birthday = "19" + rsdn.substring(0, 6);
	}

	return birthday;
}

function convertPlan(_area){

	// 한글깨짐 문제로 인코딩 수행 ,  "," 제거 !
 	encodeParam();
//	openProgress();
	$.post("/main/lips/planning/planningcrud/copyPlan.json",
			_area.planForm.serialize(), // param
			function(data){ // when it success				
				$('input[name=sequentialNo]',_area).val(data.sequentialNo);
				alert("복사 완료 되었습니다.");
	});
	
	// 한글깨짐 문제로 인코딩 원복  , "," 재삽입 	 
 	decodeParam();
}


/**
 *  한글깨짐 문제로 인코딩 수행 ,  "," 제거 !  
 */
function encodeParam(){ 	
	// 정보 백업
//	GLOBAL_FUND_TYPE_NAME = $('input[name=fundTypeNm]').val(); // 펀드이름 1
//	GLOBAL_FUND_TYPE_NAME1 = $('input[name=fundTypeNm1]').val(); // 펀드이름 2
//	GLOBAL_FUND_TYPE_NAME2 = $('input[name=fundTypeNm2]').val();  // 펀드이름 3
//	GLOBAL_JOINT_INSURED_NAME = $('input[name=jointInsuredName]').val(); // 종피보험자 이름
//	GLOBAL_PLAN_NAME = $('input[name=name]').val(); // 계획수립 명
//	GLOBAL_YOU_AND_I_FACEAMOUNT =$('input[name=youAndIFaceamountAfterConvert]').val() ; // you And I가입금액
//	
//	////////////////// 인코딩
//	$('input[name=fundTypeNm]').val(encodeURIComponent($('input[name=fundTypeNm]').val())); // 펀드이름 1
//	$('input[name=fundTypeNm1]').val(encodeURIComponent($('input[name=fundTypeNm1]').val())); // 펀드이름 2
//	$('input[name=fundTypeNm2]').val(encodeURIComponent($('input[name=fundTypeNm2]').val()));  // 펀드이름 3 
//	$('input[name=jointInsuredName]').val(encodeURIComponent($('input[name=jointInsuredName]').val())); // 종피보험자 이름
//	$('input[name=name]').val(encodeURIComponent($('input[name=name]').val())); // 계획수립 명
//	
//	/////////////////  "," 제거
//	$('input[name=youAndIFaceamountAfterConvert]').val( ($('input[name=youAndIFaceamountAfterConvert]').val()).replace(/[^0-9]/g ,"")); // you And I가입금액
}

/**
 * 한글깨짐 문제로 인코딩 원복  , "," 재삽입
 */
function decodeParam(){
// 	
//	$('input[name=fundTypeNm]').val(GLOBAL_FUND_TYPE_NAME);
//	$('input[name=fundTypeNm1]').val( GLOBAL_FUND_TYPE_NAME1);
//	$('input[name=fundTypeNm2]').val(GLOBAL_FUND_TYPE_NAME2);
//	$('input[name=jointInsuredName]').val(GLOBAL_JOINT_INSURED_NAME);
// 	$('input[name=name]').val( GLOBAL_PLAN_NAME); 	
// 	$('input[name=youAndIFaceamountAfterConvert]').val(GLOBAL_YOU_AND_I_FACEAMOUNT);
}


function initMoving(target, position, topLimit, btmLimit) {
    if (!target)
        return false;

    var obj = target;
    obj.initTop = position;
    obj.topLimit = topLimit;
    obj.bottomLimit = document.body.scrollHeight - btmLimit;

    obj.style.position = "absolute";
    obj.top = obj.initTop;
    obj.left = obj.initLeft;

    if (typeof(window.pageYOffset) == "number") {
        obj.getTop = function() {
            return window.pageYOffset;
        }
    } else if (typeof(document.body.scrollTop) == "number") {
        obj.getTop = function() {
            return document.body.scrollTop;
        }
    } else {
        obj.getTop = function() {
            return 0;
        }
    }

    if (self.innerHeight) {
        obj.getHeight = function() {
            return self.innerHeight;
        }
    } else if(document.documentElement.clientHeight) {
        obj.getHeight = function() {
            return document.documentElement.clientHeight;
        }
    } else {
        obj.getHeight = function() {
            return 500;
        }
    }

    obj.move = setInterval(function() {
        if (obj.initTop > 0) {
            pos = obj.getTop() + obj.initTop;
        } else {
            pos = obj.getTop() + obj.getHeight() + obj.initTop;
            //pos = obj.getTop() + obj.getHeight() / 2 - 15;
        }

        if (pos > obj.bottomLimit)
            pos = obj.bottomLimit;
        if (pos < obj.topLimit)
            pos = obj.topLimit;

        interval = obj.top - pos;
        obj.top = obj.top - interval / 3;
        obj.style.top = obj.top + "px";
    }, 30);
}


function addSpecialCharacter(){
	jQuery(document).ready(function(){
		$("#titSharedLP").text("공동청약 Life Planner® 지정");
	});
}

function formatCurrency(i)
{
	var data = ""+i;
	var moneychar = "";
	for(index=data.length-1;index>=0;index--)
	{
   		splitchar=data.charAt(index);
   		moneychar=splitchar+moneychar;
   		if(index%3==data.length%3&&index!=0){ moneychar=','+moneychar; }

	}


	return moneychar;
}

/**
 * 계약자 선택여부 확인
*/
function isOwnerSelected(){
   var tId = $('#ownerId').val();
   if(tId == "") {
         alert('계약자를 서해 주세요');
         return false;
    }
    return true;
}

function changeNumberToDate(obj, data,seperator)
{
	data=data.replace(/[^0-9]/g ,"");

	var dYear  = data.substring(0,4);
	var dMonth = data.substring(4,6);
	var dDay   = data.substring(6,8);

	if( data.length < 4){
		data = dYear;
	} else if( data.length == 4){

		//백스페이스 처리
		if(event.keyCode == 8){
			data = dYear;
		} else{
			data = dYear + seperator;
		}
	} else if( data.length > 4 && data.length < 6){
		if(data.substring(4,5)>1){
			data = dYear + seperator + "0" + data.substring(4,5);
		} else{
			data = dYear + seperator + dMonth;
		}
	} else if( data.length == 6){

		//백스페이스 처리
		if(event.keyCode == 8){
			data = dYear + seperator + dMonth;
		} else{
			data = dYear + seperator + dMonth + seperator;
		}

		if( data.substring(5,7) > 12 || data.substring(5,7) < 0){
			alert("'월'에는 1부터 12까지의 숫자를 넣어 주세요.");
			data = dYear + seperator;
			obj.focus();
			return 0;
		}
	} else if( data.length > 6 && data.length <= 8){

		data = dYear + seperator + dMonth + seperator + dDay;
		
		// 생년에 따른 월과 일이 범위안에 있는가 체크한다.(윤년 확인)
		if((dMonth== 1 || dMonth==3 || dMonth==5 || dMonth==7 || dMonth==8 || dMonth==10 || dMonth==12) && dDay>31){
			alert("잘못된 날짜입력입니다.");
			data = dYear + seperator + data.substring(5,7) + seperator;
			obj.focus();
			return 0;
		} else if ((dMonth==4 || dMonth==6 || dMonth==9 || dMonth==11) && dDay>30){
			alert("잘못된 날짜입력입니다.");
			data = dYear + seperator + data.substring(5,7) + seperator;
			obj.focus();
			return 0;
		} else if (dMonth==2){
			if((((dYear % 4)==0) && ((dYear % 100)!=0) || (dYear==0)) && dDay>29){
				alert("잘못된 날짜입력입니다.");
				data = dYear + seperator + data.substring(5,7) + seperator;
				obj.focus();
				return 0;
			} else if(!(((dYear % 4)==0) || (dYear==0)) && dDay>28){
				alert("잘못된 날짜입력입니다.");
				data = dYear + seperator + data.substring(5,7) + seperator;
				obj.focus();
				return 0;
			}
		}
	} 
	obj.val(data);
	return 1;
}

/*=============================================================================
주민번호 앞자리에서 포커스가 아웃될 때, 주민번호 뒷자리가 있는 경우 
alert창 띄우고, 뒷자리 삭제
=============================================================================*/	
function checkRsdn1(residentNo, residentNo1, residentNo2, birthday, age)
{
	  
	residentNo.value = residentNo1.value + residentNo2.value; 
	
	if(residentNo2.value.length != 0 && residentNo1.value.length < 6)
	{
		 
		alert("주민번호 앞자리가 6자리가 아닐 경우 뒷자리를 입력할 수 없습니다.");
		residentNo2.value = "";
		residentNo1.focus();
		return;
	}
}

/**
 * 오늘일자와 비교해서 특정일자가 지났는지 확인
 */
function isExpireOnToday(day){
	   day = day.split(".").join("");

	   var d = new Date();        	           	   
	                   
	   var cur_year = d.getFullYear();  
	   var cur_month = addZero(d.getMonth()+1);  
	   var cur_date = addZero(d.getDate());
	                     
	   var date1 = new Date(cur_year,cur_month,cur_date).valueOf();
	   if(day != null && day.length >= 8){        		   
 	  var date2 = new Date(day.substring(0,4), day.substring(4,6), day.substring(6,8)).valueOf();
		 
	   	 if((date2 - date1) < 0 ){
	   		return true;
	   	 }              	   
	   }
	   
	   return false;        	   
}

/********** 재정안정계획서 팝업 호출
 ******************
 */
function openPopupOfferinfo(){
	
    var dia = curex.dialog.open({
        id : 'label_dialog',
        width : 960,
        height : 700,
        title : '재정안정계획서',
        modal:true,
        iframeUrl : "/main/lips/planning/planning/financial_stability_plan.cmd",
        dom : $('#stability_Layer', wrap),
        ajaxOption : { 
        	
        },
        focus : $(this)
    });

}



/**
 * authur : 기웅정보통신 장치암
 * since  : 2009.08.26
 * comment: 특수문자(", %, ', <, >, \) 입력을 못하게 한다.
**/
function chkSpclChar(obj){
	/**
	var nStrLen = obj.value.length;	//인풋 값 길이
	var valueFlag = false;
	
	for(var nPos = 0; nPos < nStrLen; nPos++){
		var nASCII = obj.value.charCodeAt(nPos);
		
		if(nASCII == 34 || nASCII == 37 || nASCII == 39 || nASCII == 60 || nASCII == 62 || nASCII == 92){
			//alert("특수문자는 입력이 불가능합니다.");
			var temp = obj.value.substring(0, nPos) + obj.value.substring(nPos+1, nStrLen);
			obj.value = temp;
			break;
		}
	}
	**/
	
	var keyCode = window.event.keyCode;
	
	if(keyCode == 37 || keyCode == 92 || keyCode == 34 || keyCode == 39 || keyCode == 60 || keyCode == 62){
		window.event.returnValue = false;
	}
}

/**
 * 전화번호 포멧형식 변환
 */
 function changeNumberToPhone(obj, data)
 {
     var phoneNum = data.replace(/\-/g, '');
     phoneNum = phoneNum.replace(/\)/g, '');
     phoneNum = phoneNum.replace(/\ /g, '');
     
     var firstNum = Number(phoneNum.substring(1,2));
     
     if( phoneNum.length == 2)
     {
         if((event != null) && (event.keyCode == 8))
         {
             if(firstNum == 2)
             {
                 phoneNum = phoneNum;
             }
         }
         else if(firstNum == 2)
         {
             phoneNum = phoneNum + ") ";
         }
     }
     else if( phoneNum.length == 3)
     {
         if((event != null) && (event.keyCode == 8))
         {
             if(firstNum == 2)
             {
                 phoneNum = phoneNum.substring(0,2) + ") " + phoneNum.substring(2);
             }
             else if(firstNum > 2)
             {
                 phoneNum = phoneNum;
             }
             else
             {
                 phoneNum = phoneNum;
             }
         }
         else if(firstNum == 2)
         {
             phoneNum = phoneNum.substring(0,2) + ") " + phoneNum.substring(2);
         }
         else if(firstNum > 2)
         {
             phoneNum = phoneNum + ") ";
         }
         else
         {
             phoneNum = phoneNum + "-";
         }
     }
     else if(( phoneNum.length > 3) && ( phoneNum.length < 8))
     {
         if(firstNum == 2 && phoneNum.substring(0,1) == "0")
         {
             phoneNum = phoneNum.substring(0,2) + ") " + phoneNum.substring(2);
         }
         else if(firstNum > 2 && phoneNum.substring(0,1) == "0")
         {
             phoneNum = phoneNum.substring(0,3) + ") " + phoneNum.substring(3);
         }
         else
         {
             phoneNum = phoneNum.substring(0,3) + "-" + phoneNum.substring(3);
         }
     }
     else if(phoneNum.length == 8)
     {
         if(firstNum == 2 && phoneNum.substring(0,1) == "0")
         {
             phoneNum = phoneNum.substring(0,2) + ") " + phoneNum.substring(2);
         }
         else if(firstNum > 2 && phoneNum.substring(0,1) == "0")
         {
             phoneNum = phoneNum.substring(0,3) + ") " + phoneNum.substring(3);
         }
         else
         {
             phoneNum = phoneNum.substring(0,4) + "-" + phoneNum.substring(4);
         }
     }
     else if(phoneNum.length > 8)
     {
         if(firstNum == 2)
         {
             phoneNum = phoneNum.substring(0,2) + ") " +
             phoneNum.substring(2,phoneNum.length-4) + "-" + phoneNum.substring(phoneNum.length-4);
         }
         else if(firstNum > 2)
         {
             phoneNum = phoneNum.substring(0,3) + ") " +
             phoneNum.substring(3,phoneNum.length-4) + "-" + phoneNum.substring(phoneNum.length-4);
         }
         else
         {
             phoneNum = phoneNum.substring(0,3) + "-" +
             phoneNum.substring(3,phoneNum.length-4) + "-" + phoneNum.substring(phoneNum.length-4);
         }
     }
 
     obj.value = phoneNum;
 }
 
 /**
  * 이메일 체크
  */
  function validEmail(val1, val2, mailid, mailservername)
  {
      if((val1 == null || val1 == '' || val1.length < 1) && (val2 == null || val2 == '' || val2.length < 1))
      {
          return 3;
      }
      
      if(val1 != null && val1 != '' && val1.length > 0)
      {
          if(val2 == null || val2 == '' || val2.length < 1)
          {
              //id있고 메일서버가 없으면 에러
              alert("이메일의 형식이 잘못되었습니다. 다시 입력해 주세요!");
              mailservername.focus();
              return 0;
          }
          if (val1.indexOf("@") != -1)
          {
              //id에 @가 있다
              alert("이메일의 형식이 잘못되었습니다. 다시 입력해 주세요!");
              mailid.focus();
              return 0;
          }
          if (val2.indexOf("@") != -1)
          {
              //메일서버에 @가 있다
              alert("이메일의 형식이 잘못되었습니다. 다시 입력해 주세요!");
              mailservername.focus();
              return 0;
          }
          if (val2.indexOf(".") == -1)
          {
              //메일서버에 .가 없다
              alert("이메일의 형식이 잘못되었습니다. 다시 입력해 주세요!");
              mailservername.focus();
              return 0;
          }
          
          return 1;
      }
      
      if(val2 != null && val2 != '' && val2.length > 0)
      {
          if(val1 == null || val1 == '' || val1.length < 1)
          {
              alert("이메일의 형식이 잘못되었습니다. 다시 입력해 주세요!");
              mailid.focus();
              return 0;
          }
      }
      return 2;
  }
  
  /*=============================================================================
  숫자만 입력 가능하게 한다.
=============================================================================*/
function onlyNumber(){ 
    var keyCode = window.event.keyCode;
	if( (keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105)) {		
    } else {
        // tab, Delete, Home, Backspace, <-, -> 키는 동작되도록 한다.
        if(keyCode != 13 && keyCode != 9 && keyCode != 46 && keyCode != 8 && keyCode != 35 && keyCode != 36 && keyCode != 37 && keyCode != 39) {
            if(event.ctrlKey && (keyCode == 67 || keyCode == 86 || keyCode == 88)) {
            } else {
                window.event.returnValue = false;
            }
        }
    }
}