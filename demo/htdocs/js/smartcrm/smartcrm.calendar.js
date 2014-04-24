	(function(smartcrm) {
	var self = {};
	var wrap = null;
		
		self.getWrap = function(){
			return wrap;
		};
		
		self.setWrap = function(obj){
			wrap = obj;
		};
		/*
		 * 활동계획 세팅
		 */
		self.setActivityPlan = function(events, calendarType) {
			// 활동계획 데이터 삭제
			$(".worklist").find("li").remove();
		  if(events.sectionType == undefined)
			  {
			//활동 통계 세팅 -- 데이터가 없으므로 0으로 세팅됨.
			  smartcrm.calendar.activityStatistic(calendarType);
			return;
			  }
			var len = events.sectionType.length;
			var sectionType = "";
			//var customerId = "";
			var customerName = "";
			var startDate = "";
			var planType = "";
			var planTypeCht = "";
			var planTypeStr = "";
			var seqNo = "";
			var acdDiv = "";
			var csFlag = "";
			
			// 참고사항 : 데이터들은 시작일자로 정렬되어 들어 옴
			if(len >1){ // 다건
				for ( var i = 0; i < len; ++i) {

					sectionType = events.sectionType[i];
					
					if(sectionType == 'A')
					{
						//customerId = events.customerId[i];	
						customerName = events.customerName[i];	
						startDate = events.startDate[i].substring(4, 6)+ '-' + events.startDate[i].substring(6, 8);
						acdIsPlanStr = events.acdIsPlan[i] == "R" ? "완료" : "미완료";
						seqNo = events.seqNo[i];
						planType = events.planType[i];
						planTypeCht = events.planTypeCht[i];
						acdDiv =  events.acdDiv[i].substring(1,events.acdDiv[i].length-1);
						csFlag =  events.csFlag[i];
						//alert(acdDiv);
						planTypeStr = planType.substring(1,planType.length-1);
						
						var trClass = events.acdIsPlan[i] == "R" ? "suc" : "";
						var delTagSt = events.acdIsPlan[i] == "R" ? "<del>" : "";
						var delTagEd = events.acdIsPlan[i] == "R" ? "</del>" : "";
						
						if($(".worklist").find("#li"+startDate).html() == undefined)
						{
							var liObj = $("<li/>").attr("id","li"+startDate);
							$(".worklist").append(liObj);
							$("#li"+startDate).append("<strong>" + startDate+ "</strong>");
							
							var tableObj = $("<table  summary='고객명, 계획유형,상태등 활동계획정보제공' width='100%'></table>");
							
							tableObj.append("<caption>활동계획</caption>");
							tableObj.append("<colgroup></colgroup>");
							tableObj.find("colgroup").append("<col width='12%' />").append("<col width='20%' />").append("<col width='*' />").append("<col width='20%' />");
							tableObj.append($("<thead/>").append("<tr></tr>"));
							var theadTrObj = tableObj.find("thead tr");
							theadTrObj.append("<th scope='col' id='test'>선택</th>").append("<th scope='col'>고객명</th>").append("<th scope='col'>계획유형</th>").append("<th scope='col'>상태</th>");
							tableObj.append($("<tbody/>").append("<tr class='" + trClass + "'/>"));
							var tbodyTrObj = tableObj.find("tbody tr");
							tbodyTrObj.append("<td><input type='checkbox' name='chkPlan' title='현재행선택' /> <input type='hidden' name='keyValue' value='" + seqNo + ";"+ acdDiv + ";"+ csFlag + "'/></td>")
									.append("<td><a  href='#none' onclick=\"smartcrm.calendar.detailSchedule('" + seqNo +"','"+ csFlag+ "','"+ sectionType + "')\">" + delTagSt + "" + customerName + "" + delTagEd + "</a></td>")
									.append("<td title='"+ planTypeStr +"'><a  href='#none' onclick=\"smartcrm.calendar.detailSchedule('" + seqNo +"','"+ csFlag+ "','"+ sectionType + "')\">" + delTagSt + "" + planTypeCht + "" + delTagEd + "</a></td>")
									.append("<td id='tdAcdPlan'>" + delTagSt + "" + acdIsPlanStr + "" + delTagEd + "</td>");
							$("#li"+startDate).append(tableObj);
							
						}
						else{ 
							var trObj = $("<tr class='" + trClass + "'/>");
							$(".worklist").find('#li'+startDate).find("table > tbody:last").append(trObj);
							trObj.append("<td><input type='checkbox' name='chkPlan' title='현재행선택' /> <input type='hidden' name='keyValue' value='" + seqNo + ";"+ acdDiv + ";"+ csFlag + "'/></td>")
							.append("<td><a href='#none' onclick=\"smartcrm.calendar.detailSchedule('" + seqNo +"','"+ csFlag+ "','"+ sectionType + "')\">" + delTagSt + "" + customerName + "" + delTagEd + "</a></td>")
							.append("<td title='"+ planTypeStr +"'><a href='#none' onclick=\"smartcrm.calendar.detailSchedule('" + seqNo +"','"+ csFlag+ "','"+ sectionType + "')\">" + delTagSt + "" + planTypeCht + "" + delTagEd + "</a></td>")
							.append("<td id='tdAcdPlan'>" + delTagSt + "" + acdIsPlanStr + "" + delTagEd + "</td>");
					
						}
					//	alert($(".worklist").find("#li"+startDate).html() );
						
					}
				}
			} else{ //단건
				sectionType = events.sectionType;
				if(sectionType == 'A')
				{
					//customerId = events.customerId;	
					customerName = events.customerName;			
					startDate = events.startDate.substring(4, 6)+ '-' + events.startDate.substring(6, 8);
					acdIsPlanStr = events.acdIsPlan == "R" ? "완료" : "미완료";
					seqNo = events.seqNo;
					acdDiv =  events.acdDiv.substring(1,events.acdDiv.length-1);
					csFlag =  events.csFlag;
				
					planType = events.planType;
					planTypeCht = events.planTypeCht;
					planTypeStr = "";
					
					planTypeStr = planType.substring(1,planType.length-1);
					
					var trClass = events.acdIsPlan == "R" ? "suc" : "미완료" ;
					var delTagSt = events.acdIsPlan == "R" ? "<del>" : "" ;
					var delTagEd = events.acdIsPlan == "R" ? "</del>" : "" ;
					
					if($(".worklist").find("#li"+startDate).html() == undefined)
					{
						var liObj = $("<li/>").attr("id","li"+startDate);
						$(".worklist").append(liObj);
						$("#li"+startDate).append("<strong>" + startDate+ "</strong>");
						
						var tableObj = $("<table  summary='고객명, 계획유형,상태등 활동계획정보제공' width='100%'></table>");
						
						tableObj.append("<caption>활동계획</caption>");
						tableObj.append("<colgroup></colgroup>");
						tableObj.find("colgroup").append("<col width='12%' />").append("<col width='20%' />").append("<col width='*' />").append("<col width='20%' />");
						tableObj.append($("<thead/>").append("<tr></tr>"));
						var theadTrObj = tableObj.find("thead tr");
						theadTrObj.append("<th scope='col' id='test'>선택</th>").append("<th scope='col'>고객명</th>").append("<th scope='col'>계획유형</th>").append("<th scope='col'>상태</th>");
						tableObj.append($("<tbody/>").append("<tr class='" + trClass + "'></tr>"));
						var tbodyTrObj = tableObj.find("tbody tr");
						tbodyTrObj.append("<td><input type='checkbox' name='chkPlan' title='현재행선택' /> <input type='hidden' name='keyValue' value='" + seqNo + ";"+ acdDiv + ";"+ csFlag + "'/></td>")
						.append("<td><a  href='#none' onclick=\"smartcrm.calendar.detailSchedule('" + seqNo +"','"+ csFlag+ "','"+ sectionType + "')\">" + delTagSt + "" + customerName + "" + delTagEd + "</a></td>")
						.append("<td title='"+ planTypeStr +"'><a  href='#none' onclick=\"smartcrm.calendar.detailSchedule('" + seqNo +"','"+ csFlag+ "','"+ sectionType + "')\">" + delTagSt + "" + planTypeCht + "" + delTagEd + "</a></td>")
						.append("<td id='tdAcdPlan'>" + delTagSt + "" + acdIsPlanStr + "" + delTagEd + "</td>");
				$("#li"+startDate).append(tableObj);
				
			}
			else{ 
				var trObj = $("<tr class='" + trClass + "'/>");
				$(".worklist").find('#li'+startDate).find("table > tbody:last").append(trObj);
				trObj.append("<td><input type='checkbox' name='chkPlan' title='현재행선택' /> <input type='hidden' name='keyValue' value='" + seqNo + ";"+ acdDiv + ";"+ csFlag + "'/></td>")
				.append("<td><a href='#none' onclick=\"smartcrm.calendar.detailSchedule('" + seqNo +"','"+ csFlag+ "','"+ sectionType + "')\">" + delTagSt + "" + customerName + "" + delTagEd + "</a></td>")
				.append("<td title='"+ planTypeStr +"'><a href='#none' onclick=\"smartcrm.calendar.detailSchedule('" + seqNo +"','"+ csFlag+ "','"+ sectionType + "')\">" + delTagSt + "" + planTypeCht + "" + delTagEd + "</a></td>")
				.append("<td id='tdAcdPlan'>" + delTagSt + "" + acdIsPlanStr + "" + delTagEd + "</td>");
						$(".worklist").find('#li'+startDate).find("table tbody").append(trObj);
					}
				}
			}
				
			//활동 통계 세팅
			smartcrm.calendar.activityStatistic(calendarType);
		};

		/*
		 * 활동통계 data get   
		 */
		 self.activityStatistic = function(calendarType) {
		//	var calendarType = "1";
		  	var pars = "calendarType=" + calendarType + "&curYear=" + curDate.getFullYear() + "&curMonth=" + smartcrm.calendar.makeDay(curDate.getMonth()+1)+ "&curDate=" + smartcrm.calendar.makeDay(curDate.getDate()); 

					
			//데이터 바인딩
			ci.databind.bind("calendar", {
				dataSource : "/main/smartcrm/calendar/listActivityStatistic.cmd?"+pars,
				
				success : function(data, elemId, jqXHR) {
					
					smartcrm.calendar.setActivityStatistic(data.activityPlan);
				}
			});
			
		};
		 
		/*
		 * 활동통계 data set
		 * acd_is_plan : P(예정), R(결과) 
		 */
		self.setActivityStatistic = function(activityPlan) {
			$('#statisTbody').find('th').html('');
			$('#statisTbody').find('td').html('');
			for(var i = 0; i < activityPlan.o.length; i++) {
				$('#acdDiv'+i+'-Th').append(activityPlan.o[i].acd_is_plan);
				$('#acdDiv'+i+'-15').append('-'); //소개
				$('#acdDiv'+i+'-14').append(activityPlan.o[i].col_14);
				$('#acdDiv'+i+'-1-1').append(activityPlan.o[i].col_1_1);
				$('#acdDiv'+i+'-1-0').append(activityPlan.o[i].col_1_0);
				$('#acdDiv'+i+'-2').append(activityPlan.o[i].col_2);
				$('#acdDiv'+i+'-3').append(activityPlan.o[i].col_3);
				$('#acdDiv'+i+'-4').append(activityPlan.o[i].col_4);
				$('#acdDiv'+i+'-5').append(activityPlan.o[i].col_5);
				$('#acdDiv'+i+'-Tot1').append(activityPlan.o[i].col_tot1);
				$('#acdDiv'+i+'-7').append(activityPlan.o[i].col_7);
				$('#acdDiv'+i+'-6').append(activityPlan.o[i].col_6);
				$('#acdDiv'+i+'-9').append(activityPlan.o[i].col_9);
				$('#acdDiv'+i+'-10').append(activityPlan.o[i].col_10);
				$('#acdDiv'+i+'-11').append(activityPlan.o[i].col_11);
				$('#acdDiv'+i+'-12').append(activityPlan.o[i].col_12);
				$('#acdDiv'+i+'-13').append(activityPlan.o[i].col_13);
				$('#acdDiv'+i+'-8').append(activityPlan.o[i].col_8);
				$('#acdDiv'+i+'-Tot2').append(activityPlan.o[i].col_tot2);
			}
		};
		
		/*
		* 활동 완료처리하기
		*/
		self.toComplete = function(wrapId)
		{
			var wrap = $("#"+wrapId);
			var arrKeyValue = "";
			if($("input[name=chkPlan]:checked").length<1)
				{
				alert("활동계획을 선택해 주세요.");
				return;
				}
			$("input[name=chkPlan]:checked").each(function(i){
				if($(this).parent().parent().find('#tdAcdPlan').text() != "완료")
				{
					arrKeyValue += $(this).parent().find('input[name=keyValue]').val() + "@";
				}
			});
			arrKeyValue = arrKeyValue.substring(0,arrKeyValue.length-1);
			if(arrKeyValue == "")
				{
				alert("선택한 활동계획은 완료상태입니다.");
				return;
				}
			
			$('#arrKeyValue').val(arrKeyValue);
			$('#activityDiv').val("R");
			if(confirm('선택한 활동계획을 완료처리하시겠습까?'))
			{
				var form = $('#ACTIVITYPLAN_FORM', wrap);
				//데이터 바인딩
				ci.databind.bind("calendar", {
					dataSource : "/main/smartcrm/calendar/updateActivityDiv.cmd",
					param : form,
					success : function(data, elemId, jqXHR) {
						if(data.result == "success")
							{
							alert("성공적으로 완료처리되었습니다.");
							smartcrm.calendar.clearSchedule();
							//getCalendarInfo();
							}
						else{
							alert("처리중 오류가 발생하였습니다.");
						}
					}
				});
			}
		};
		
		/*
		* 활동 미완료처리하기
		*/
		self.toIncomplete = function(wrapId)
		{
			var wrap = $("#"+wrapId);
			var arrKeyValue = "";
			if($("input[name=chkPlan]:checked").length<1)
				{
				alert("활동계획을 선택해 주세요.");
				return;
				}
			$("input[name=chkPlan]:checked").each(function(i){
				if($(this).parent().parent().find('#tdAcdPlan').text() != "미완료")
				{
					arrKeyValue += $(this).parent().find('input[name=keyValue]').val() + "@";
				}
			});
			arrKeyValue = arrKeyValue.substring(0,arrKeyValue.length-1);
			if(arrKeyValue == "")
			{
				alert("선택한 활동계획은 미완료상태입니다.");
				return;
			}
			$('#arrKeyValue').val(arrKeyValue);
			$('#activityDiv').val("P");
			if(confirm('선택한 활동계획을 미완료처리하시겠습까?'))
			{
				var form = $('#ACTIVITYPLAN_FORM', wrap);
				//데이터 바인딩
				ci.databind.bind("calendar", {
					dataSource : "/main/smartcrm/calendar/updateActivityDiv.cmd",
					param : form,
					success : function(data, elemId, jqXHR) {
						if(data.result == "success")
							{
							alert("성공적으로 미완료처리되었습니다.");
							smartcrm.calendar.clearSchedule();
							//getCalendarInfo();
							}
						else{
							alert("처리중 오류가 발생하였습니다.");
						}
					}
				});
			}
		};
		
		/*
		* 활동 삭제하기
		*/
		self.deleteActivity = function(wrapId)
		{
			var wrap = $("#"+wrapId);
			var arrKeyValue = "";
			if($("input[name=chkPlan]:checked").length<1)
				{
				alert("활동계획을 선택해 주세요.");
				return;
				}
			$("input[name=chkPlan]:checked").each(function(i){
				arrKeyValue += $(this).parent().find('input[name=keyValue]').val() + "@";
			});
			arrKeyValue = arrKeyValue.substring(0,arrKeyValue.length-1);
			$('#arrKeyValue').val(arrKeyValue);
			if(confirm('선택한 활동계획을 삭제하시겠습까?'))
			{
				var form = $('#ACTIVITYPLAN_FORM', wrap);
				//데이터 바인딩
				ci.databind.bind("calendar", {
					dataSource : "/main/smartcrm/calendar/deleteActivity.cmd",
					param : form,
					success : function(data, elemId, jqXHR) {
						if(data.result == "success")
							{
							alert("성공적으로 삭제 되었습니다.");
							smartcrm.calendar.clearSchedule();
							//getCalendarInfo();
							}
						else{
							alert("삭제중 오류가 발생하였습니다.");
						}
					}
				});
			}
		};	
		
		/*
		 * 날짜 형식 만들어 주기
		 */
		self.makeDay = function(i){
		// alert(i);
			if(parseInt(i,10) < 10){
				i = "0" + parseInt(i,10);
				return i; 
			}else{
				return parseInt(i,10);
			}	
		};
		

		/*
		* 일정표 & 활동계획 & 활동통계 초기화
		*/
		self.clearSchedule = function()
		{
			getCalendarInfo();
			$("#layerPop1").hide();
		};			
	
		/*
		 *  초기세팅::일정표 보기 옵션 가져오기
		 */
		self.setViewOption = function(wrap, calendarType)
		{
			//데이터 바인딩
			ci.databind.bind("calendar", {
				dataSource : "/main/smartcrm/calendar/inqueryCalendarViewOptions.cmd",
				
				success : function(data, elemId, jqXHR) {
					
					 $('#optPolicyClient').attr("checked",data.output.o[0].policy_client == 'Y' ? true:false);
					 $('#optAgentClient').attr("checked",data.output.o[0].agent_client == 'Y' ? true:false);
					 
					 $('#optSchCustomer').attr("checked",data.output.o[0].customer == 'Y' ? true:false);
					 $('#optSchPersonal').attr("checked",data.output.o[0].personal == 'Y' ? true:false);
					 
					 $('#optAnnBIRTH').attr("checked",data.output.o[0].birth == 'Y' ? true:false);
					 $('#optAnnFAMILY').attr("checked",data.output.o[0].family == 'Y' ? true:false);
					 $('#optAnnISSDT').attr("checked",data.output.o[0].issdt == 'Y' ? true:false);
					 $('#optAnnWEDDING').attr("checked",data.output.o[0].wedding == 'Y' ? true:false);
					 
					 smartcrm.calendar.onCheckOption('optPolicyClient');
					 smartcrm.calendar.onCheckOption('optAgentClient');
					 
					 smartcrm.calendar.onCheckOption('optSchCustomer');
					 smartcrm.calendar.onCheckOption('optSchPersonal');
					 
					 smartcrm.calendar.onCheckOption('optAnnBIRTH');
					 smartcrm.calendar.onCheckOption('optAnnFAMILY');
					 smartcrm.calendar.onCheckOption('optAnnISSDT');
					 smartcrm.calendar.onCheckOption('optAnnWEDDING');
					 
					 smartcrm.calendar.setMiniCalendar(wrap, calendarType);
				}
			});
			
		};
		
		/*
		 * 초기세팅:: 보기 옵션 세팅 후 미니달력 콜백 함수에서 일정을 가져온다. 그래야 옵션에 맞는 데이터만 가지고 온다.
		 */
		self.setMiniCalendar = function(wrap, calendarType){
			
			 var $start_btn        = $("#start_btn",wrap );       
			 if(calendarType == '1'){
				$.calendar($start_btn, {
				            type : "month"
				             ,hasdefaultToday : true
				             ,weekend : true
				             ,defaultDay:[0,0,0] //년도, 월, 일 (오늘 기준 전 후 계산)
				             ,delim:""
				             ,changeTarget:$('#titleDate', wrap)
				             ,changeCallBack : function(date){
				                //달력 선택 된 날짜가 넘어옴.
				                //넘어온 날짜로 화면처리.
				                
				                var year = date.substring(0,4);
				                var month = date.substring(4.6);
				                moveToSelectDay(year,month,1);
				                //달력 선택 된 값을 submit으로 넘길경우                
				            //    alert($(start_btn).val());

				             }
				            });  
			 } else{
				 $.calendar($start_btn, {
			            type : "day"
			             ,hasdefaultToday : true
			             ,weekend : true
			             ,defaultDay:[0,0,0] //년도, 월, 일 (오늘 기준 전 후 계산)
			             ,delim:""
			             ,changeTarget:$('#titleDate', wrap)
			             ,changeCallBack : function(date){
			                //달력 선택 된 날짜가 넘어옴.
			                //넘어온 날짜로 화면처리.
			                
			                var year = date.substring(0,4);
			                var month = date.substring(4,6);
			                var date = date.substring(6,8);
			                moveToSelectDay(year,month,date);
			                //달력 선택 된 값을 submit으로 넘길경우                
			            //    alert($(start_btn).val());

			             }
			            });    
			 }
		};
		/*
		 *  일정표 보기 옵션 값 세팅
		 */
		self.onCheckOption = function(objId)
		{
			obj = $('#'+objId);
				obj.val(obj.attr("checked") == "checked" ? true : false);
		};
		
		/*
		 *  일정표 보기 옵션 저장
		 */
		self.saveViewOption = function()
		{
			var optPolicyClient  = smartcrm.calendar.changeOptionValue($('#optPolicyClient').val());
			var optAgentClient  = smartcrm.calendar.changeOptionValue($('#optAgentClient').val());
	
			var optSchCustomer  = smartcrm.calendar.changeOptionValue($('#optSchCustomer').val());						
			var optSchPersonal  = smartcrm.calendar.changeOptionValue($('#optSchPersonal').val());

			var optAnnBIRTH  = smartcrm.calendar.changeOptionValue($('#optAnnBIRTH').val());
			var optAnnFAMILY  = smartcrm.calendar.changeOptionValue($('#optAnnFAMILY').val());
			var optAnnISSDT  = smartcrm.calendar.changeOptionValue($('#optAnnISSDT').val());
			var optAnnWEDDING  = smartcrm.calendar.changeOptionValue($('#optAnnWEDDING').val());
		
			
			var optPars = "&optPolicyClient=" + optPolicyClient + "&optAgentClient=" + optAgentClient +"&optSchCustomer=" + optSchCustomer +"&optSchPersonal=" + optSchPersonal
			+ "&optAnnBIRTH=" + optAnnBIRTH +"&optAnnFAMILY=" + optAnnFAMILY +"&optAnnISSDT=" + optAnnISSDT +"&optAnnWEDDING=" + optAnnWEDDING;

//	 alert(optPars); 

			//데이터 바인딩
			ci.databind.bind("calendar", {
				dataSource : "/main/smartcrm/calendar/updateCalendarViewOptions.cmd?"+optPars,
				
				success : function(data, elemId, jqXHR) {
				if(data.result == "success")
					{
					alert("성공적으로 적용 되었습니다.");
					smartcrm.calendar.clearSchedule();
					//getCalendarInfo();
					}
				else{
					alert("적용중 오류가 발생하였습니다.");
					}
				}
			});
		};
		
		/*
		 * 일정표 보기 옵션 변환 ( true|false -> Y|N )
		 */
		self.changeOptionValue = function(value)
		{
			if(value == null || value == "false")
				return 'N';
			else
				return 'Y';
		};
	
		
		// 기념일 종류에 따라 구분하여 이름
		self.checkAnniversaryType = function(anniversaryType){

			if(anniversaryType == "BIRTH") { 
				anniversaryTypeStr = "생일";
			}else if(anniversaryType == "FAMILY") {
				anniversaryTypeStr = "가족";		
			} else if(anniversaryType == "ISSDT") {
				anniversaryTypeStr = "청약";		
			} else if(anniversaryType == "WEDDING") {
				anniversaryTypeStr = "결혼";		
			}
			return anniversaryTypeStr;
		};
		
		// 기념일 종류에 따라 구분하여 이름(일간 일정표)
		self.checkAnniversaryType2 = function(anniversaryType){

			if(anniversaryType == "BIRTH") { 
				anniversaryTypeStr = "생일";
			}else if(anniversaryType == "FAMILY") {
				anniversaryTypeStr = "가족기념일";		
			} else if(anniversaryType == "ISSDT") {
				anniversaryTypeStr = "청약기념일";		
			} else if(anniversaryType == "WEDDING") {
				anniversaryTypeStr = "결혼기념일";		
			}
			return anniversaryTypeStr;
		};
		
		/*
		 * 문자열 길이 체크해서 자르기(Byte 단위로 자르기)
		 */ 
		self.checkStringLenth = function(str,maxLength)
		{
			/*
			if(str.length > length)
				{
				str = str.substring(0,length)+"...";
				}
			return str;
			*/
			
			var value = str;	
			var newStr = "";
			var length = value.length;
			var lengthByte = 0;
			for(var i=0; i< length; i++){
				var byteStr = value.charAt(i);
				if(escape(byteStr).length > 4){
					lengthByte+=2;
				}else{
					lengthByte+=1;
				}
				if(lengthByte > maxLength){
					newStr = newStr+'..';
					break;
				}
				newStr += byteStr;
			}
			
			return newStr;
		};
		

		// 요일 이름 변경
		self.checkDay = function(Day){
			var DayStr = "일";
			if(Day == "1") { 
				DayStr = "월";
			}else if(Day == "2") {
				DayStr = "화";	
			} else if(Day == "3") {
				DayStr = "수";		
			} else if(Day == "4") {
				DayStr = "목";		
			} else if(Day == "5") {
				DayStr = "금";		
			} else if(Day == "6") {
				DayStr = "토";		
			}
			return DayStr;
		};
		
		/*
		 * 고객기념일 팝업 오픈
		 */
		self.openAnniversaryDialog = function(seqNo, customerName, customerId, anniversaryTypeStr, realAnniversaryDate, cellPhoneNo, email){
			realAnniversaryDate = realAnniversaryDate.substring(2,4)+'.'+realAnniversaryDate.substring(4,6)+'.'+realAnniversaryDate.substring(6,8)+realAnniversaryDate.substring(8);
			 curex.dialog.open({
	                id : 'dialog_annyversary',
	                width : 478,
	                height : 280,
	                title : '기념일',
	                iframeUrl : '/main/smartcrm/popCalendar/popAnniversary.cmd',
	                dom : $('#iframeLayer',wrap),
	                appendIframe: true,
	                ajaxOption : { //일반적인 ajax 옵션들을 여기서 정의할수 있음
	                	 data : { seqNo : seqNo,
	                		 customerName : customerName,
	                		 customerId : customerId,
	                		 anniversaryTypeStr : anniversaryTypeStr,
	                		 realAnniversaryDate : realAnniversaryDate,
	                		 cellPhoneNo : cellPhoneNo,
	                		 email : email }
	                },
	                focus : $(this)

	            });
		};
		
		/*
		 * 고객검색 팝업 오픈
		 */
		self.openSearchDialog = function(){
			 curex.dialog.open({
	                id : 'dialog_searsh',
	                width : 480, //477
	                height : 480,
	                title : '고객검색',
	                iframeUrl : '/main/smartcrm/popCalendar/popSearch.cmd',
	                dom : $('#iframeLayer2',wrap),
	                appendIframe: true,
	                ajaxOption : { //일반적인 ajax 옵션들을 여기서 정의할수 있음
	                	
	                },
	                focus : $(this)

	            });
		};;
		
		/*
		 * 일정 저장/수정 후 팝업 새로고침(등록팝업으로 호출)
		 */
		self.refreshScheduleDialog = function(){
			curex.dialog.close('dialog_schedule') ;
			curex.dialog.open({
                id : 'dialog_schedule',
                width : 597,
                height : 465,
                title : '일정등록',
                iframeUrl : '/main/smartcrm/popCalendar/popSchedule.cmd',
                dom : $('#iframeLayer',wrap),
                ajaxOption : { //일반적인 ajax 옵션들을 여기서 정의할수 있음
                //    data : 'name=sangwon&age=28'
                },
                focus : $(this)

            });
		};
		
		/*
		 * 일정 수정 팝업 오픈
		 */
		self.detailSchedule = function(seqNo, csFlag, sectionType){
		//	alert(seqNo);
		//	alert(csFlag);
		//	alert(sectionType);
		//	curex.dialog.close('dialog_schedule') ;
			var title = sectionType == 'A' ? '활동관리 수정' : '개인일정 수정';
			var height =  sectionType == 'A' ? 430: 385;
			curex.dialog.open({
	                id : 'dialog_schedule',
	                width : 597,
	                height : height,
	                title : title,
	                iframeUrl : '/main/smartcrm/popCalendar/popDetailSchedule.cmd',
	                dom : $('#iframeLayer',wrap),
	                ajaxOption : { //일반적인 ajax 옵션들을 여기서 정의할수 있음
	                    data : { seqNo : seqNo,
	                    		csFlag : csFlag,
	                    		sectionType : sectionType }
	                },
	                focus : $(this)

	            });
		};
	if (!smartcrm) {
		window.smartcrm = smartcrm = {};
	}
	smartcrm.calendar = self;
	
})(window.smartcrm);
			
	/*
	 * 다음(달|주|일)로 이동   
	 */
	moveNext = function(calendarType) {
		if(calendarType == 1){
			this.curDate.setMonth(curDate.getMonth() + 1);
		}else if(calendarType == 2){
			this.curDate.setDate(curDate.getDate() + 7);
		}else if(calendarType == 3){
			this.curDate.setDate(curDate.getDate() + 1);		
		}	
	//	alert(curDate.getFullYear());
	//	alert(( curDate.getMonth() + 1));
	//	alert(curDate.getDate());
		$("#curYear").val(curDate.getFullYear());
		$("#curMonth").val(curDate.getMonth()+1);
		$("#curDate").val(curDate.getDate());
		$(start_btn).val($("#curYear").val()+smartcrm.calendar.makeDay($("#curMonth").val())+smartcrm.calendar.makeDay($("#curDate").val()));
		
		smartcrm.calendar.clearSchedule();
		
	};

	/*
	 * 이전(달|주|일)로 이동   
	 */
	movePre = function(calendarType) {
		if(calendarType == 1){
			this.curDate.setMonth(curDate.getMonth() - 1);
		}else if(calendarType == 2){
			this.curDate.setDate(curDate.getDate() - 7);
		}else if(calendarType == 3){
			this.curDate.setDate(curDate.getDate() - 1);		
		}
	//	alert(curDate.getFullYear());
	//	alert(( curDate.getMonth() + 1));
	//	alert(curDate.getDate());
		$("#curYear").val(curDate.getFullYear());
		$("#curMonth").val(curDate.getMonth()+1);
		$("#curDate").val(curDate.getDate());
		$(start_btn).val($("#curYear").val()+smartcrm.calendar.makeDay($("#curMonth").val())+smartcrm.calendar.makeDay($("#curDate").val()));
		
		smartcrm.calendar.clearSchedule();
		//getCalendarInfo();
	};
	
	/*
	 * 오늘로 이동 
	 */
	moveToday = function(){
		var toDate = new Date();

		$("#curYear").val(toDate.getFullYear());
		$("#curMonth").val((toDate.getMonth()+1));
		$("#curDate").val(toDate.getDate());
		$(start_btn).val($("#curYear").val()+smartcrm.calendar.makeDay($("#curMonth").val())+smartcrm.calendar.makeDay($("#curDate").val()));
		
		curDate = toDate;
		smartcrm.calendar.clearSchedule();
		//getCalendarInfo();
	};
	/*
	 * 미니달력에서 선택한 날짜로 이동 
	 */
	moveToSelectDay = function(year,month,date){
		var toDate = new Date();

		$("#curYear").val(year);
		$("#curMonth").val(month);
		$("#curDate").val(date);
		year = parseInt(year);
		month = parseInt(month,10);
		date = parseInt(date,10);
		if(date == 31){
			date = 30;
			toDate.setFullYear(year, month, date);
			toDate.setMonth(toDate.getMonth()-1);
			toDate.setDate(toDate.getDate() + 1);		
		}else{
			toDate.setFullYear(year, month, date);
			toDate.setMonth(toDate.getMonth()-1);
		}
		
		//alert(toDate.getDate());
		curDate = toDate;
		smartcrm.calendar.clearSchedule();
		//getCalendarInfo();
	};
		