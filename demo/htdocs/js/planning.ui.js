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
	addSProductRow : function(tarTableObj ){

		var parentDiv = tarTableObj.parent().eq(0);
		var lastTr = tarTableObj.find('tr').last();
		var trHtml = '';
		
	//	alert(rowcnt);
		
		lastTr.find('td').last().html('<a href="#none" class="cellDel"><img src="/img/common/icon4.gif" alt="삭제" /></a>');

		trHtml += '<tr>' ;
		trHtml += '	<input type="hidden" name="clientId" value=""/>' ;
		trHtml += '	<input type="hidden" name="age" value=""/>' ;
		trHtml += '	<input type="hidden" name="sex" value=""/>' ;
		trHtml += '	<td class="turn">';
		trHtml += '		<input type="hidden" name="capsilCode">';
		trHtml += '		<input id="idProductCode" type="hidden" name="productCodeViewer" >';
		trHtml += '		<input type="hidden" name="ForecastId" value="">';
		trHtml += 	'</td>' ;
		trHtml += '	<td name="subCodeViewer">';
		trHtml += '	</td>' ;
		trHtml += '	<td>' ;
		trHtml += '		<span class="selectFull">' ;
		trHtml += '			<select name="iType"></selet>' ;
		trHtml += '			<span class="bubble">' ;
		trHtml += '				<span class="bb">' ;
		trHtml += '					<span class="arr">&nbsp;</span>' ;
		trHtml += '				</span>' ;
		trHtml += '			</span>' ;
		trHtml += '		</span>' ;
		trHtml += '	</td>' ;
		trHtml += '	<td>' ;
		trHtml += '		<span class="selectFull">' ;
		trHtml += '			<select name="iGPeriod"></select>' ;
		trHtml += '		</span>' ;
		trHtml += '	</td>' ;
		trHtml += '	<td>' ;
		trHtml += '		<span class="selectFull">' ;
		trHtml += '			<select name="iPPeriod"></select>' ;
		trHtml += '		</span>' ;
		trHtml += '	</td>' ;
		trHtml += '	<td class="textR">' ;
		trHtml += '		<span class="widthFull"><input type="text"   name="iAmount"  /></span>' ;
		trHtml += '	</td>' ;
		trHtml += '	<td class="textR"><span class="widthFull"><input type="text" class="bderN" style="width100%" name="eachPremiumViewer"  ReadOnly value="" /></span></td>' ;
		trHtml += '	<td></td>' ;
		trHtml += '</tr>' ;
		
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

	   hideCalculateResultButton();
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
	curex.floatingBar.setActive([{btnId:'btnPrintPlan' , active: false}]);
//		curex.floatingBar.setActive([{btnId:'btnPrint' , active: false}]);

}
function showCalculateResultButton(){

	curex.floatingBar.setActive([{btnId:'btnPrintPlan' , active: true}]);
//		curex.floatingBar.setActive([{btnId:'btnPrint' , active: true}]);

}


