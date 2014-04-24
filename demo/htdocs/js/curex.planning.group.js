/**
 * 단체 계획수립 
 */

// var tempObject = null;


//alert( "group_planning.ui.js" );
//var testtst = "group_planning.ui.js"; 


/**
 * jsonArray 에서 value 에 해당하는 아이템 삭제하기 
 * @author ot020
 * @since 2014. 3. 27.
 * @param  {json} array jsonArray
 * @param  {string} property
 * @param  {string} value 
 * @return   {void}
 */
function delayTime(gap){ /* gap is in millisecs */
	var then,now;
	then=new Date().getTime();
	now=then;
	while((now-then)<gap)
	{
		now=new Date().getTime();
	}
}	


//==========================================================================================
// 단체 계획 수립 - 데이터 관련 
var PlanningGroupData = {

		
		customerListTableLastIndex : 0 ,		//	피보험자 최종 trIndex 번호 
		customerList : [], 			// 피보험자 리스트
		memberList : [], 				// 계약자의 구성원 목록

		
		/**
		 * 데이터값 리셋 
		 * @author ot020
		 * @since 2014. 3. 31.
		 * @return {void}
		 */
		resetData : function()
		{
			PlanningGroupData.customerListTableLastIndex = 0; 
			PlanningGroupData.customerList = [];
			PlanningGroupData.memberList = [];			
		},
		
		

		/**
		 * 계약자의 구성원 목록 가져오기
		 * @author ot020
		 * @since 2014. 3. 27.
		 * @param  {void}
		 * @return   {void}
		 */
		getMemberList : function( customerId  )
		{
			
			/*
			//var data = '{"excelUploadList":[{"birthday":"1980-01-22","customerName":"이름1","drvCode":"87315","jobCode":"25411","gender":"M"},{"birthday":"2001-01-01","customerName":"이름2","drvCode":"87311","jobCode":"26153","gender":"F"},{"birthday":"2010-11-01","customerName":"이름3","drvCode":"87340","jobCode":"26153","gender":"M"},{"birthday":"1997-05-30","customerName":"이름4","drvCode":"87401","jobCode":"27253","gender":"M"},{"birthday":"1960-02-08","customerName":"이름5","drvCode":"87560","jobCode":"28658","gender":"F"},{"birthday":"1990-08-31","customerName":"이름6","drvCode":"88250","jobCode":"29485","gender":"F"},{"birthday":"1976-09-15","customerName":"이름7","drvCode":"87981","jobCode":"24583","gender":"F"}],"reservationNo":"2222","resultCode":"success"}';
			var data = {"excelUploadList":[],"reservationNo":"2222","resultCode":"success"};
			
			data.excelUploadList.push({"customerId":"1234","birthday":"1980-01-22","customerName":"이름1234","drvCode":"87315","jobCode":"25411","gender":"M","customerRegNo":"8012121XXXXXX","type":"1"}); 
			data.excelUploadList.push({"customerId":"5896","birthday":"2005-02-23","customerName":"이름5896","drvCode":"86315","jobCode":"25419","gender":"M","customerRegNo":"0502123XXXXXX","type":"1"});
			data.excelUploadList.push({"customerId":"7777","birthday":"1985-09-25","customerName":"이름7777","drvCode":"87515","jobCode":"25451","gender":"M","customerRegNo":"8509251XXXXXX","type":"1"});
			data.excelUploadList.push({"customerId":"9856","birthday":"1958-05-17","customerName":"이름9856","drvCode":"87345","jobCode":"25465","gender":"M","customerRegNo":"5805172XXXXXX","type":"1"});
			data.excelUploadList.push({"customerId":"2222","birthday":"1990-05-18","customerName":"이름2222","drvCode":"87335","jobCode":"25458","gender":"M","customerRegNo":"9005181XXXXXX","type":"1"});
			data.excelUploadList.push({"customerId":"3333","birthday":"1980-12-12","customerName":"이름3333","drvCode":"82315","jobCode":"25251","gender":"M","customerRegNo":"8012121XXXXXX","type":"1"});
			
			//			console.log( data );
//			console.log( data.excelUploadList );
			
			data.excelUploadList  = PlanningGroupData.reArrangeMemberList( data.excelUploadList );
			
//			console.log( data.excelUploadList  );
			
			
			// 계약자의 구성원 목록 리셋
			PlanningGroupData.memberList = [];
			
			// 테이블에 추가하기 
			PlanningGroupUI.addMemberToListTable(  data.excelUploadList );			

			
			*/
				
			
            //ajax 통해서 데이터를 가져온 후 화면에서 데이터 조작이 필요한 경우.
            // submit을 ajax로 해야 할 경우.
            var input = new DataSet();
//            input.put('startDate','20130101');
//            input.put('endDate','20140325');            
            input.put('customerId', customerId );
            

            // var ajaxUrl = "/main/customer/management/totalInfo.cmd";
            var ajaxUrl = "/main/lips/planning/group_planningajax/getCustomerRelationListToJson.cmd";
            
            curex.util.submitAjax(null,{
              url : ajaxUrl , 
              param : input.getParam(),
              success : function(data){
              	//console.log(data);                	
              	// console.log(data.list.customer );

    			// 계약자의 구성원 목록 리셋
    			PlanningGroupData.memberList = [];

    			var  relationList  =[];
              	if( data.memberList_TOTAL_CNT  > 0  )
              	{
                 	 relationList =   PlanningGroupData.reArrangeMemberList( data.memberList.customer  );
              	}
              		
    			// 테이블에 추가하기 
    			PlanningGroupUI.addMemberToListTable( relationList  );			
              	
    			// 선택한 단체명
    			// console.log( data.customerC.customer[0].customerName  );
    			
              }
             });

		}, 		
		
		
		/**
		 * 계약자의 구성원 목록 가져오기
		 * @author ot020
		 * @since 2014. 3. 27.
		 * @param  {void}
		 * @return   {void}
		 */
		getPlanListByOwnerId : function( customerId , userId   )
		{
			
			
			//customerId = 17143338;
			userId = "SL194";
			
            //ajax 통해서 데이터를 가져온 후 화면에서 데이터 조작이 필요한 경우.
            // submit을 ajax로 해야 할 경우.
            var input = new DataSet();
            input.put('customerId', customerId );
            input.put('userId', userId );
            

            // var ajaxUrl = "/main/customer/management/totalInfo.cmd";
            var ajaxUrl = "/main/lips/planning/group_planningajax/getPlanListToJson.cmd";
                        	
            curex.util.submitAjax(null,{
              url : ajaxUrl , 
              param : input.getParam(),
              success : function(data){
              	//console.log(data);         
              	
              	PlanningGroupUI.setPlanListByOwnerId( data.planList );              	
              	
              }
             });

		}, 		
		
		
		/**
		 * 가져온값 맞게 다시 세팅 
		 * @author ot020
		 * @since 2014. 3. 27.
		 * @param  {json}
		 * @return   {json}
		 */
		reArrangeMemberList : function( data )
		{
			
			/*
			  
	  		{"customerId":"3333","birthday":"1980-12-12","customerName":"이름3333","drvCode":"82315","jobCode":"25251","gender":"M","customerRegNo":"8012121XXXXXX","type":"1"}
			  
			  
			{"age":"51","cohabitYn":"Y","customerId":"17628276","customerName":"김#환"
			,"customerRegNo":"6306041","drvCode":"","drvIstCode":"","drvStartdate":"","expectationYn":"N","gender":"M"
				,"genderName":"남자","jobCode":"0202S","jobIstCode":"0202","jobStartdate":"20111101","relationCode":"E","relationName":"기타"}
				
			*/
			
			
			var returnList = [];
			for( var i = 0 ; i <  data.length ; i++ )
			{
				var oneItem = data[i];
				// oneItem.customerRegNo =  oneItem.customerRegNo.substring(0, 6);
				oneItem.itemSelected =  false;
				oneItem.type =  "1";
				oneItem.birthday =   curex.util.removeDelim( curex.util.birthDateReturn( oneItem.customerRegNo ) , "-" )  ;
				returnList.push( oneItem );
			}
			
			// returnList =  data;
			return returnList;
			
		}, 			
		

		
		/**
		 * customerId 에 해당하는 정보 가져오기  - 계약자
		 * @author ot020
		 * @since 2014. 3. 27.
		 * @param  {void}
		 * @return   {void}
		 */
		getCustomerInfoByCustomerId : function( customerId , userId   )
		{
			
			// customerId = 17143338;
			userId = "SL194";
			
            //ajax 통해서 데이터를 가져온 후 화면에서 데이터 조작이 필요한 경우.
            // submit을 ajax로 해야 할 경우.
            var input = new DataSet();
            input.put('customerId', customerId );
            input.put('userId', userId );
            
            
            // http://localhost.:8080/main/lips/planning/group_planningajax/getCustomerInfoToJson.cmd?customerId=17628274            	
            	
            // var ajaxUrl = "/main/customer/management/totalInfo.cmd";
            var ajaxUrl = "/main/lips/planning/group_planningajax/getCustomerInfoToJson.cmd";
                        	
            curex.util.submitAjax(null,{
              url : ajaxUrl , 
              param : input.getParam(),
              success : function(data){
              	//console.log(data);                       	
              	// console.log( data.customerC.customer[0] );              	
              	// PlanningGroupUI.setPlanListByOwnerId( data.planList );              	
            	  
              	if(  data.customerC.customer.length  > 0   )
              	{
              		var regNo = data.customerC.customer[0].customerRegNo;
              		
              		if( data.customerC.customer[0].customerType == "P" )
              			regNo = curex.util.displayRegNoToFormatDate( regNo ,  "-" );
              		
              		$("#spOwnerRsdn").html( regNo );            	
              		
              		
              	}
              	 
              	
              }
             });

		}, 		
		
		/**
		 * 가입 설계 화면에서  피보험자에 선택된 고객의 데이터 
		 * @author ot020
		 * @since 2014. 4. 14.
		 * @param  {int} trIndex : trIndex
		 * @return {json}
		 */		
		getInsuredPersonDataByTrIndex : function( trIndex  )
		{
				var returnData = null;
				
				var listIndex =  PlanningGroupUI.findIndexFromListBySearchValue( PlanningGroupData.customerList  , trIndex  , "trIndex" );
				if(  listIndex  >=  0 )	returnData = PlanningGroupData.customerList[ listIndex ] ;

				return returnData;				
		},
		
		
		/**
		 * 함수 설명
		 * @author ot020
		 * @since 2014. 3. 27.
		 * @param  {JSON} dataset   새로 그려질 차트의 데이터 셋 (비율 변경 시에만 사용)
		 * @return {void}
		 */
		isEnd : function()
		{
			// 마지막 함수,  아무 기능 안함..  	표시용임 
		}
	
};



//==========================================================================================
var PlanningSimpleUI = {
		
};

//==========================================================================================
// 단체 계획 수립 - ui
var PlanningGroupUI = {
		

		menuNowId : "LI_010203",
		tabNowID : "" ,
		
		tab1ID : "LI_010204_T1" , 
		tab2ID : "LI_010204_T2" ,
		tab3ID : "LI_010204_T3" ,
		ta4bID : "LI_010204_T4" ,
		
		
		/**
		 * 계약자 구성원 목록 데이터로 세팅하기 
		 * @author ot020
		 * @since 2014. 3. 27.
		 * @param  {JSON} dataset   새로 그려질 차트의 데이터 셋 (비율 변경 시에만 사용)
		 * @return {void}
		 */
		addMemberToListTable : function( data  )
		{
			// 셀렉트 박스
			// console.log( data  );
			
			// 셀렉트 박스 항목 삭제
			var $selMemberList = $("#" + PlanningGroupUI.tabNowID + " #selMemberList");
			
			// 0번째는 단체명 
			var opt0val = $("#" + PlanningGroupUI.tabNowID + " #selMemberList").attr("opt0val");  
			var opt0text = $("#" + PlanningGroupUI.tabNowID + " #selMemberList").attr("opt0text");
			
			$selMemberList.children().remove();
			$selMemberList.append('<option value="' + opt0val + '">' + opt0text + '</option>');			
		
			
			// 테이블 상목도 삭제 
			$("#" + PlanningGroupUI.tabNowID + " #tbMemberList tbody").children().remove();
			
			// 테이블에 세팅 
			for( var i = 0  ; i  < data.length ; i++ )
			{
				var oneMember =  data[i];
				PlanningGroupUI.addOneMemberToListTable( oneMember );
				
				// 계약지 리스트에 있는 셀렉스박스에 추가
				$selMemberList.append('<option value="' + oneMember.customerId + '">' + oneMember.customerName + '</option>');
				
			}			
			
			PlanningGroupUI.setNoRowDisplay( PlanningGroupUI.tabNowID ,   "tbMemberList"  );
			
		},
		
		/**
		 * 계약자 구성원 목록에 추가 (한건) 
		 * @author 
		 * @since 
		 * @param  {JSON} dataset   
		 * @return {void}
		 */ 
		addOneMemberToListTable : function(  oneMember  )
		{
			
			// 대상이 없습니다 가 있을 경우
			if( $("#" + PlanningGroupUI.tabNowID + " #tbMemberList tbody").children().length == 1  )
			{
				var trIndex = $("#" + PlanningGroupUI.tabNowID + " #tbMemberList tbody tr").eq(0).attr("trIndex");
				if( trIndex == 0  )
					$("#" + PlanningGroupUI.tabNowID + " #tbMemberList tbody").children().remove();					
			}
			
			var nextIndex = $("#" + PlanningGroupUI.tabNowID + " #tbMemberList tbody tr").length + 1 ;		
			
			var memberName =  ( (  PlanningGroupUI.tabNowID == "LI_010203_T2"  ||  oneMember.customerId != undefined   ) ? oneMember.customerName  : "고객" + nextIndex  ) ;			
			var customerId = oneMember.customerId;
			var customerRegNo = oneMember.customerRegNo;
			
			// yymmddX
			customerRegNo = customerRegNo.substring(0,6) + "-" + customerRegNo.substring(6, customerRegNo.length );
		 

			// 구분
			var type = oneMember.type;			
			
			var strHTML = '';
			strHTML += '<tr>';
			strHTML += '	<td>';
			strHTML += '		<input type="checkbox"  class="checkboxOne"/>';
			strHTML += '		<input type="hidden" id="customerId" value="' + customerId + '" />';			
			strHTML += '	</td>';
			// strHTML += '	<td><span class="codeNum">' + memberName + '</span></td>';
			//strHTML += '	<td  class="codeNum"><a href="#none"><span>' + memberName + '</span></a></td>';
			//strHTML += '	<td  class="codeNum"><span id=codeNum>' + memberName + '</span></td>';
			//strHTML += '	<td  class="codeNum"><span onclick="alert(\'ddddd\');">' + memberName + '</span></td>';			
			strHTML += '	<td  class="codeNum"><a href="javascript:return false;"><span onclick="PlanningGroupUI.addCustomersToListTableFromCustomerId(\'' +  customerId + '\');">' + memberName + '</span></a></td>';
			strHTML += '	<td>' + customerRegNo + '</td>';
			strHTML += '	<td>' + type + '</td>';
			strHTML += '</tr>';
			
			
			
			// console.log( strHTML );
			
			// 피보험자 목록에 추가 
			$("#" + PlanningGroupUI.tabNowID + " #tbMemberList tbody").append( strHTML );		

			// memberList 에 넣기			
			var memberListIndex =  PlanningGroupUI.findIndexFromListBySearchValue(  PlanningGroupData.memberList ,   customerId  , "customerId" ) ;
			if(  memberListIndex >= 0  )  // 이미 있다면				
				PlanningGroupData.memberList[memberListIndex].itemSelected = false;
			else
				PlanningGroupData.memberList.push(  oneMember  );
			
			
			// 계약자의 구성원 목록 변경시 숫자 관련 셋팅
			PlanningGroupUI.setMemberListCnt();
			
		},
		
		/**
		 * 계약자의 구성원 목록 변경시 숫자 관련 셋팅
		 * @author ot020
		 * @since 2014. 3. 27.
		 * @return {void}
		 */
		setMemberListCnt : function()
		{
			
			// 소속인원
			$("#" + PlanningGroupUI.tabNowID + " #spMemberListTotalCnt").text( PlanningGroupData.memberList.length  );
			
			// 잔여인원
			$("#" + PlanningGroupUI.tabNowID + " #spMemberListRemainCnt").text( $("#" + PlanningGroupUI.tabNowID + " #tbMemberList tbody").children().length  );

		},
			
		
		
		
		/**
		 *  피보험자 목록에 추가 (여러건) - 왼쪽 계약자 구성원 목록 체크박스 된 항목 추가  
		 * @author 
		 * @since 
		 * @param  {JSON} dataset   
		 * @return {void}
		 */
		addCustomersToListTableFromTbMemberListByCheckbox : function(  )
		{			
			
			// console.log(  "#" + PlanningGroupUI.tab1ID + " #tbCustomerList tbody input[class='checkboxOne']" );
			var displayListLength = $("#" + PlanningGroupUI.tabNowID + " #tbMemberList tbody input[class='checkboxOne']").length;
			
			var indexArray = Array();			
			
			for( var displayIndex = 0 ; displayIndex  < displayListLength ; displayIndex++ )
			{
				if( $($("#" + PlanningGroupUI.tabNowID + " #tbMemberList tbody input[class='checkboxOne']")[displayIndex]).is(":checked") )
				{
					// 보이는 index 를 기준으로 삭제하면 삭제 되지 않는 tr 도 있어서 trIndex  기준으로 삭제한다.
					var customerId = $("#" + PlanningGroupUI.tabNowID + " #tbMemberList tbody tr #customerId").eq(displayIndex).val();
					indexArray.push( customerId );					
				}
			}			
			
			for( var i = 0 ; i < indexArray.length ; i++ )
			{
				var customerId = indexArray[i];
				PlanningGroupUI.addCustomersToListTableFromCustomerId( customerId );
				
			}
			
			
//			var excelUploadList = customerList.excelUploadList;
//			
//			for( var i = 0 ; i  <  excelUploadList.length ; i++ )
//			{
//				var one =  excelUploadList[i] ;				
//				PlanningGroupUI.addOneCustomerToListTable( one );
//			}
			
			
			// 모두 선택 리셋 
			$("#" + PlanningGroupUI.tabNowID+ " #tbMemberList th #checkboxAll").attr("checked" , false );
			
			
		},	

		
		/**
		 *  피보험자 목록에 추가 (한건) - customerId 로 추가  
		 * @author 
		 * @since 
		 * @param  {JSON} dataset   
		 * @return {void}
		 */
		addCustomersToListTableFromCustomerId : function( customerId  )
		{			
				
				var index = PlanningGroupUI.findIndexFromListBySearchValue(  PlanningGroupData.memberList ,   customerId , "customerId"  );
				
				//console.log( PlanningGroupData.memberList);
				//console.log(index);
				
				if( index >= 0 )
				{
					// 오른쪽 리스트에 추가
					PlanningGroupUI.addOneCustomerToListTable( PlanningGroupData.memberList[index] );
					
					// 왼쪽 테이블 리스트에서 삭제하기
					PlanningGroupUI.deleteOneMemberFromListTableBycustomerId( customerId );					
				}
				
		},			

		/**
		 * 계약자ㅣ의 구성원 목록에서 한건 삭제 by customerId 기준
		 * @author ot020 
		 * @since
		 * @param  {int} trIndex    
		 * @return {void}
		 */
		deleteOneMemberFromListTableBycustomerId : function( customerId )
		{
			// thead 는 제외				
			// tr 인덱스가 같은거 삭제 
			var displayListLength =  $("#" + PlanningGroupUI.tabNowID + " #tbMemberList tbody tr").length;
			var bFound = false ;   // trIndex 값은 고유값으로 세팅되었기 때문에 한개 발견하면 for 문 나온다. 
			
			for( var displayIndex = 0 ; ( displayIndex < displayListLength)   &&  (bFound == false) ; displayIndex++ )
			{
				
//				$("#" + PlanningGroupUI.tabNowID + " #tbMemberList tbody tr #customerId").eq(displayIndex).val();				
				
				if( $("#" + PlanningGroupUI.tabNowID + " #tbMemberList tbody tr #customerId").eq(displayIndex).val() == customerId )
				{
						$("#" + PlanningGroupUI.tabNowID + " #tbMemberList tbody").children().eq(displayIndex).remove();
						// console.log(" 삭제 displayIndex " + displayIndex   + " // " + trIndex );			
						bFound = true ;
						
						// memberList 도 정리
						var indexFromList = PlanningGroupUI.findIndexFromListBySearchValue(  PlanningGroupData.memberList ,  customerId , "customerId" );
						//console.log( PlanningGroupData.customerList  );
						//console.log( indexFromList  );

						if( indexFromList >= 0 ) PlanningGroupData.memberList[indexFromList ].itemSelected = true;
						
						// 계약자의 구성원 목록 변경시 숫자 관련 셋팅
						PlanningGroupUI.setMemberListCnt();

						
				}						
			}
							
			PlanningGroupUI.setNoRowDisplay( PlanningGroupUI.tabNowID ,   "tbMemberList"  );			
			
		},
		
		
		
		/**
		 * 피보험자 목록 변경시 숫자 관련 세팅 
		 * @author ot020
		 * @since 2014. 3. 27. 
		 * @return {void}
		 */
		setCustomerListCnt : function()
		{
			
			// 총갯수 표시
			$("#" + PlanningGroupUI.tabNowID + " #spCustomerListTotalCnt").text( $("#" + PlanningGroupUI.tabNowID + " #tbCustomerList tbody").children().length  );
			
			// 개별 등록시 피보험자명 표시 
			$("#" + PlanningGroupUI.tabNowID + " #spTemporaryCustomerLastIndex").text( PlanningGroupData.customerListTableLastIndex + 1  );
			
			// 가입 설계 탭 활성화 여부 
			if(  $("#" + PlanningGroupUI.tabNowID + " #tbCustomerList tbody").children().length > 0  )
				$("#LI_010203_TAB1").removeClass("ci-tab-disabled");
			else
				$("#LI_010203_TAB1").addClass("ci-tab-disabled");
				 

		},
		
		
		/**
		 *  피보험자 목록에 추가 (여러건)
		 * @author 
		 * @since 
		 * @param  {JSON} dataset   
		 * @return {void}
		 */
		addCustomersToListTable : function( customerList  )
		{
			
			var excelUploadList = customerList.excelUploadList;
			
			var totalCnt  = excelUploadList.length;
			var exceptCnt =0 ;
			
			for( var i = 0 ; i  <  excelUploadList.length ; i++ )
			{
				var one =  excelUploadList[i] ;
				if( one.birthday != "" && one.birthday != "" ) 
					PlanningGroupUI.addOneCustomerToListTable( one );
				else 
					exceptCnt++;
			}
			
			if( exceptCnt > 0  )
				alert("총 " + totalCnt + "건중 " + ( totalCnt - exceptCnt ) + "건 처리되었습니다. (" + exceptCnt + "건 제외됨)" );
			
		},	
		
		/**
		 *  피보험자목록에 추가 (한건)
		 * @author 
		 * @since 
		 * @param  {JSON} dataset   
		 * @return {void}
		 */ 
		addOneCustomerToListTable : function(  oneCustomer )
		{
			// 대상이 없습니다 가 있을 경우
			if( $("#" + PlanningGroupUI.tabNowID + " #tbCustomerList tbody").children().length == 1  )
			{
				var trIndex = $("#" + PlanningGroupUI.tabNowID + " #tbCustomerList tbody tr").eq(0).attr("trIndex");
				if( trIndex == 0  )
					$("#" + PlanningGroupUI.tabNowID + " #tbCustomerList tbody").children().remove();					
			}
		
			// 인덱스 추가 
			PlanningGroupData.customerListTableLastIndex++;

			// tbCustomerList
			var childrenLength = $("#" + PlanningGroupUI.tabNowID + " #tbCustomerList tbody").children().length ;
			var nextIndex = PlanningGroupData.customerListTableLastIndex  ;
			
			var customerName = ( PlanningGroupUI.tabNowID  == "LI_010203_T2" ?  oneCustomer.customerName   :  ("고객" + nextIndex)) ;
			var customerBirthday = oneCustomer.birthday;		 
			 
			// 보험연령 계산
			var insuranceAge =   0;
			var currentDate = curex.util.getCurrentDateString(); 
			insuranceAge = curex.util.calcInsuredAgeByBirthDate(currentDate , customerBirthday );
			
			// 상령일 계산
			var insuredInsureAgeChangeDate = curex.util.getChangeInsAgeDate( customerBirthday );			
			
			var strHTML = '';			
			strHTML += '<tr trIndex="' + nextIndex + '">';
			strHTML += '	<td>';
			strHTML += '		<input type="checkbox"  class="checkboxOne" />';			
			strHTML += '		<input type="hidden" id="trIndex" value="' + nextIndex + '" />';
			strHTML += '	</td>';
			// strHTML += '	<td>' + nextIndex + '</td>';
			strHTML += '	<td id=showIndex >' + (childrenLength+1) + '</td>';
			//strHTML += '	<td>' + customerName + '</td>';
			
			strHTML += '	<td>' + customerName  + '</td>';			
			strHTML += '	<td>' + curex.util.dateFormatter(customerBirthday , "-") + '</td>';
			strHTML += '	<td>' +  ( oneCustomer.gender == "M" ?  "남" : "여"  ) + '</td>';
			strHTML += '	<td>' + insuranceAge + '</td>';
								
			
			if( PlanningGroupUI.tabNowID  == "LI_010203_T2"  )
			{
				strHTML += '	<td>' +  curex.util.dateFormatter( insuredInsureAgeChangeDate  , "-") + '</td>';
				strHTML += '	<td>' + oneCustomer.jobCode + (  oneCustomer.jobCode != "" ?  '<BR>(' + oneCustomer.jobCodeName + ')' : '' ) + '</td>';
				strHTML += '	<td>' + oneCustomer.drvCode + (  oneCustomer.drvCode != "" ?  '<BR>(' + oneCustomer.drvCodeName + ')' : '' ) + '</td>';				
			}
			else
			{
				strHTML += '	<td>' + oneCustomer.jobCode + '</td>';
				strHTML += '	<td>' + oneCustomer.drvCode + '</td>';				
			}
			strHTML += '</tr>';

			// console.log( strHTML );
			
			// 피보험자 목록에 추가 
			$("#" + PlanningGroupUI.tabNowID + " #tbCustomerList tbody").append( strHTML );		

			// customerList 에 넣기
			oneCustomer.trIndex = PlanningGroupData.customerListTableLastIndex ;
			oneCustomer.customerName = customerName;
			oneCustomer.insuranceAge = insuranceAge;
			
			// 주민번호
			if( oneCustomer.customerRegNo == undefined )
				oneCustomer.customerRegNo = curex.util.getRegNoByBirthDayAndGender( customerBirthday ,  oneCustomer.gender  );

			// 나이
			if( oneCustomer.age == undefined )
				oneCustomer.age = curex.util.calcInsuredAgeByRsdn( currentDate ,  oneCustomer.customerRegNo  );
			
			PlanningGroupData.customerList.push(  oneCustomer  );
	
			// 화면에 숫자 관련사항 세팅 
			PlanningGroupUI.setCustomerListCnt();
				
		},
		
		
		/**
		 * 개별 등록 데이터 만들기 
		 * @author ot020
		 * @since 2014. 3. 26.
		 * @param  {JSON} dataset   
		 * @return {void}
		 */
		addIndividualOneCustomerToListTable : function()
		{
			
			// 값체크
			var customerName = $("#" + PlanningGroupUI.tabNowID + " #spCustomerName").text();
			var birthday = $("#" + PlanningGroupUI.tabNowID + " #birthday_dt").val();
			var gender = "";
			var jobCode = $("#" + PlanningGroupUI.tabNowID + " input[name=jobCode]").val();
			var occCode = $("#" + PlanningGroupUI.tabNowID + " input[name=occCode]").val();
			var istCode = $("#" + PlanningGroupUI.tabNowID + " input[name=istCode]").val();
			var drvCode = $("#" + PlanningGroupUI.tabNowID + " input[name=drvCode]").val();			
			var jobStartDate = $("#" + PlanningGroupUI.tabNowID + " input[name=jobStartDate]").val();
			
			if(	$("#" + PlanningGroupUI.tabNowID + " input[name=gender]:checked").length > 0 )
			{
				gender = $("#" + PlanningGroupUI.tabNowID + " input[name=gender]:checked").val();
			}
			else
			{
				alert("성별을 선택하세요. ");
				return;
			}
		
			
			var oneObject =  {};
			// var oneObject =  {birthday: "19760915", customerName: "이름7", drvCode: "87981", jobCode: "24583", gender: "F"};
			
			oneObject.customerName=customerName;
			oneObject.birthday=birthday.replace("-","").replace("-","");
			oneObject.gender=gender;
			oneObject.jobCode=jobCode;
			
			oneObject.jobCode=jobCode;
			oneObject.occCode=occCode;
			oneObject.istCode=istCode;
			oneObject.jobStartDate=jobStartDate;
			
			
			oneObject.drvCode=drvCode;
			
			// 리스트에 추가			
			PlanningGroupUI.addOneCustomerToListTable(oneObject);
			
			// 폼 리셋
			$("#" + PlanningGroupUI.tabNowID + " input[name=gender]").removeAttr("checked");   // 성별			
			$("#" + PlanningGroupUI.tabNowID + " input[name=jobCode]").val("");
			$("#" + PlanningGroupUI.tabNowID + " input[name=occCode]").val("");
			$("#" + PlanningGroupUI.tabNowID + " input[name=istCode]").val("");
			$("#" + PlanningGroupUI.tabNowID + " input[name=drvCode]").val("");
			$("#" + PlanningGroupUI.tabNowID + " #birthday_dt").val("1980-01-01");

			// 
			$("#" + PlanningGroupUI.tabNowID + " input[name=jobDesc]").val("");			
			$("#" + PlanningGroupUI.tabNowID + " input[name=jobStartDate]").val("");
			$("#" + PlanningGroupUI.tabNowID + " input[name=jobCodeDisp]").val("");
			
			$("#" + PlanningGroupUI.tabNowID + " input[name=drvDesc]").val("");
			$("#" + PlanningGroupUI.tabNowID + " input[name=drvStartDate]").val("");
			$("#" + PlanningGroupUI.tabNowID + " input[name=drvCodeDisp]").val("");
			
			
		},

		/**
		 * 피보험자 목록에서 모두 삭제 
		 * @author ot020
		 * @since 2014. 3. 25.   
		 * @return {void}
		 */
		removeCustomerListTableChild: function( )
		{
			// console.log( " removeCustomerListTableChild "+displayIndex  );
			// $("#" + PlanningGroupUI.tabNowID + " #tbCustomerList tbody").children().remove();
		},
		
		


		
		/**
		 * list 에서 searchField 로 찾아서 배열내 인덱스 반환  
		 * @author ot020
		 * @since 2014. 3. 25.   
		 * @param  {JSON} list  
		 * @return {int} 인덱스 값 반환 
		 */
		findIndexFromListBySearchValue : function( list , searchValue  , searchField )
		{			
			
/*			   $.each(list, function(index, result) {
				   
				   console.log(  "findIndexBySearchValue" );
				   console.log(  result );
				   console.log(  result[searchField]  + "  //  " +  searchValue );
				   
			      if(result[searchField] == searchValue) {
			          //Remove from array
			        //   array.splice(index, 1);
			    	  
			    	  console.log(  " 리턴값 " + index   );
			    	  
			    	  return index;
			    	  
			      }    			      
			      
			   });		*/	   
			   
			
//			var returnIndex = -1;
			
			for( var i = 0 ; i  < list.length  ; i++ )
			{				
				var result = list[i];
				
//				 console.log( result[searchField]  + "  //  " +  searchValue );
				 
				if( result[searchField]  == searchValue )
				{
//					console.log("찾았다. " + i );
//					bFound = true;
//					returnIndex = i;
					
					return i;
					
				}
			}			
					
			   
			   return -1 ;  // 없으면
			   
		},
		

		
		
		/**
		 * 피보험자 목록에서 한건 삭제 by trIndex 기준
		 * @author ot020 
		 * @since
		 * @param  {int} trIndex    
		 * @return {void}
		 */
		deleteOneCustomerFromListTableByTrIndex : function( trIndex )
		{
			
			// thead 는 제외				
			// tr 인덱스가 같은거 삭제 
			var displayListLength =  $("#" + PlanningGroupUI.tabNowID + " #tbCustomerList tbody tr").length;
			var bFound = false ;   // trIndex 값은 고유값으로 세팅되었기 때문에 한개 발견하면 for 문 나온다. 
			
			for( var displayIndex = 0 ; ( displayIndex < displayListLength)   &&  (bFound == false) ; displayIndex++ )
			{
				if( $("#" + PlanningGroupUI.tabNowID + " #tbCustomerList tbody tr").eq(displayIndex).attr("trIndex") == trIndex )
				{
						$("#" + PlanningGroupUI.tabNowID + " #tbCustomerList tbody").children().eq(displayIndex).remove();
						// console.log(" 삭제 displayIndex " + displayIndex   + " // " + trIndex );			
						bFound = true ;
						
						// customerList 도 정리
						//var indexFromList = PlanningGroupUI.findIndexByTrIndex(  PlanningGroupData.customerList ,  trIndex );
						var indexFromList = PlanningGroupUI.findIndexFromListBySearchValue(  PlanningGroupData.customerList ,  trIndex , "trIndex" ) ;
						//console.log( PlanningGroupData.customerList  );
						//console.log( indexFromList  +  " trIndex " +  trIndex  );
						
						
						// console.log( " findIndexBySearchValue   결과값  " + PlanningGroupUI.findIndexFromListBySearchValue(  PlanningGroupData.customerList ,  trIndex , "trIndex" )  ); 
						

						
						if( indexFromList >= 0 )
						{
							
							// 만약 단체설계 화면이면 왼쪽 계약자의 구성원 목록에 다시 추가				
							if( PlanningGroupUI.tabNowID == "LI_010203_T2" )
							{
								//console.log(   PlanningGroupData.customerList[indexFromList]  );
								//console.log( " // 만약 단체설계 화면이면 왼쪽 계약자의 구성원 목록에 다시 추가			  ");
								PlanningGroupUI.addOneMemberToListTable( PlanningGroupData.customerList[indexFromList] );
							}						

							
							//console.log( PlanningGroupData.customerList );
							//console.log( 'trIndex  : '  + trIndex  );
							// alert("ddd");
							
							
							PlanningGroupData.customerList =  curex.util.findAndRemoveFromJsonArray(PlanningGroupData.customerList, 'trIndex', trIndex );


							
							//console.log( "삭제후"  );
							//console.log( PlanningGroupData.customerList  );
							
						}
						
						
						
						// 화면에 숫자 관련사항 세팅 
						PlanningGroupUI.setCustomerListCnt();
							
						
				}						
			}
			
			// 인덱스 재정렬?
			$("#" + PlanningGroupUI.tabNowID + " #tbCustomerList tbody tr #showIndex").each(function(i){			
				$(this).html(i+1);				
			});
									
			
			PlanningGroupUI.setNoRowDisplay( PlanningGroupUI.tabNowID ,   "tbCustomerList"  );		
			
		},
		
		/**
		 *  피보험자 목록에서 여러건 삭제 (삭제 체크 된것만 삭제)
		 * @author ot020 
		 * @since
		 * @return {void}
		 */ 
		deleteCustomersFromListTable : function()
		{

			// console.log(  "#" + PlanningGroupUI.tabNowID + " #tbCustomerList tbody input[class='checkboxOne']" );
			var displayListLength = $("#" + PlanningGroupUI.tabNowID + " #tbCustomerList tbody input[class='checkboxOne']").length;
			
			var trIndexArray = Array();			
			
			for( var displayIndex = 0 ; displayIndex  < displayListLength ; displayIndex++ )
			{
				if( $($("#" + PlanningGroupUI.tabNowID + " #tbCustomerList tbody input[class='checkboxOne']")[displayIndex]).is(":checked") )
				{
					// 보이는 index 를 기준으로 삭제하면 삭제 되지 않는 tr 도 있어서 trIndex  기준으로 삭제한다.
					var trIndex = $("#" + PlanningGroupUI.tabNowID + " #tbCustomerList tbody tr").eq(displayIndex).attr("trIndex");
					trIndexArray.push( trIndex );
				}
			}			
			
			for( var i = 0 ; i < trIndexArray.length ; i++ )
			{
				var trIndex = trIndexArray[i];
				PlanningGroupUI.deleteOneCustomerFromListTableByTrIndex( trIndex  );
			}
			
			
			
			// 만약 하나도 없으면
			displayListLength = $("#" + PlanningGroupUI.tabNowID + "  #tbCustomerList tbody input[class='checkboxOne']").length;
			if( displayListLength == 0   )
			{
				// console.log("인덱스 리셋??????");	
				// deleteCustomersFromListTable
				
			}
			
			
			// 모두 선택 리셋 
			$("#" + PlanningGroupUI.tabNowID+ " #tbCustomerList th #checkboxAll").attr("checked" , false );

			
			
		},
		
		/**
		 * row에 데이터가 없을시 표시 해줌
		 * @author ot020
		 * @since 2014. 4. 4.
		 * @param  {String} tabId -  텝 id 
		 * @param  {String} tableId -  테이블 id 
		 * @return {void}
		 */
		setNoRowDisplay : function( tabId,   tableId  )
		{
			
			if( $("#" + PlanningGroupUI.tabNowID + " #" + tableId + " tbody").children().length == 0  )
			{
				var colspanCnt = $("#" + tabId + " #" + tableId + " colgroup").children().length;
				
				var strHTML = "";
				strHTML += '		<tr  trIndex=0>';			
				strHTML += '			<td colspan=' + colspanCnt + '>대상이 없습니다. </td>';
				strHTML += '		</tr>';												
				
				$("#" + tabId + " #" + tableId + " tbody").append( strHTML );				
				
			}
					
		},
		
		
		/**
		 * 데이터 로딩 중일때 row에 표시 해줌
		 * @author ot020
		 * @since 2014. 4. 4.
		 * @param  {String} tabId -  텝 id 
		 * @param  {String} tableId -  테이블 id 
		 * @return {void}
		 */
		setLoadingRowDisplay : function( tabId,   tableId  )
		{
			
			if( $("#" + PlanningGroupUI.tabNowID + " #" + tableId + " tbody").children().length == 0  )
			{
				var colspanCnt = $("#" + tabId + " #" + tableId + " colgroup").children().length;
				
				var strHTML = "";
				strHTML += '		<tr  trIndex=0>';			
				strHTML += '			<td colspan=' + colspanCnt + '><img src ="/img/common/loading_small.gif"></td>';
				strHTML += '		</tr>';												
				
				$("#" + tabId + " #" + tableId + " tbody").append( strHTML );				
				
			}
					
		},
		
		
		
		
		/**
		 *  템플릿
		 * @author 
		 * @since
		 * @return {void}
		 */  
		displayLipsPlanDiv : function()
		{
			//개인설계 제목영역 세팅
			$('#lipsPlanDiv').show();
			var titHtml = '<div class="pageTit">';					
			titHtml += '<span class="entry entryFull"><input type="text" id="planName" value="계획명을 입력하세요//" onFocusOut="if(this.value==\'\') this.value=\'계획명을 입력하세요\';" onClick="if(this.value==\'계획명을 입력하세요\') this.value=\'\';" style="width:185px" /></span>';
			titHtml += '<a href="javascript:return false;" class="btn smGnR"  onclick="savePlan(\'${menuID}_T1\');">저장ㅂ</a>&nbsp;' ;
			titHtml += '<a href="javascript:return false;" class="btn smGnR" onclick="saveMyPlan(\'${menuID}_T1\');">MyPlan 저장ㅂ</a>' ;
			titHtml += '</div>';
			//$('#lipsPlanDiv').html(titHtml);

			//alert("abcd1111");
			
			//console.log(" displayLipsPlanDiv   ");
			
		}, 
		
		/**
		 * 파일 업로드 후 결과 및 업로드 위치 , 파일 이름 받기 
		 * @author ot020
		 * @since 2014. 3. 27.
		 */
		uploadClientListExcelFile : function()
		{
			var $targetForm = $("#" + PlanningGroupUI.tabNowID + " #LI_010204_T1_fileUploadForm");
			curex.util.upload($targetForm , 'PlanningGroupUI.processClientListExcelFile');
		},
		
		
		/**
		 * 피보험자 목록 업로드 후 저장 위치로 파일 읽어 데이터 가져오기 
		 * @author ot020
		 * @since 2014. 3. 27.
		 * @param  {String} result -  파일 업로드 결과 
		 * @param  {String} uploadDir -  업로드 dir (마지막에 / 포함됨) 
		 * @param  {String} uploadFileName - 업로드 파일 이름    
		 * @return {void} 
		 */
		processClientListExcelFile  : function( result, uploadDir, uploadFileName )
		{
			 // alert(result + ":" + uploadDir + ":" + uploadFileName);			 
			 
			 if( result == "Y" )
			{
	             var input = new DataSet();
	             
	             input.put('uploadDir',uploadDir);
	             input.put('uploadFileName',uploadFileName);
	          		 
	       		 var ajaxUrl = "/main/lips/planning/simple_group_planning/excelFileUploadProcess.cmd";
	            		    
	             curex.util.submitAjax(null,{
	               url : ajaxUrl  ,
	               param : input.getParam(),
	               success : function(data){
	            	   
/*	 	               console.log( data );
	 	               return;
	 	               */
	 	                var jsonResult = JSON.parse(data);	 	                
	 	                
	 	                if( jsonResult.resultCode == "Y" )
	 	                {	 	                	
		 	                // 성공이면 업로드 파일 정보지운다.
	 	 	               $("#" + PlanningGroupUI.tabNowID + " #uploadfileName").val("");
	 	 	               $("#" + PlanningGroupUI.tabNowID + " #fileName").val("");

	 	 	               LI_010204_T1_fileUploadForm.reset();   // reset() 은 jquery로 안 되네... 
	 	 	               PlanningGroupUI.addCustomersToListTable(  jsonResult  );  // 화면단 처리
	 	                }
	 	                else
	 	                	alert("파일 업로드 실패하였습니다.(파일오류)");
	 	                
	               }
	              });	             

			}
			 else			
				 alert("파일 업로드 실패하였습니다. ");
			
			
		},
		
		
		/**
		 * 피보험자 목록 엑셀 파일 업로드
		 * @author ot020
		 * @since 2014. 3. 27.
		 */
		uploadClientListExcelFile11 : function()
		{
			
       	 	// alert("3333");
       	 	
			if( 1 == 2  )
			{
				var data = '{"excelUploadList":[{"birthday":"19800122","customerName":"이름1","drvCode":"87315","jobCode":"25411","gender":"M"},{"birthday":"2001-01-01","customerName":"이름2","drvCode":"87311","jobCode":"26153","gender":"F"},{"birthday":"2010-11-01","customerName":"이름3","drvCode":"87340","jobCode":"26153","gender":"M"},{"birthday":"1997-05-30","customerName":"이름4","drvCode":"87401","jobCode":"27253","gender":"M"},{"birthday":"1960-02-08","customerName":"이름5","drvCode":"87560","jobCode":"28658","gender":"F"},{"birthday":"1990-08-31","customerName":"이름6","drvCode":"88250","jobCode":"29485","gender":"F"},{"birthday":"1976-09-15","customerName":"이름7","drvCode":"87981","jobCode":"24583","gender":"F"}],"reservationNo":"2222","resultCode":"success"}';
				var jsonResult = JSON.parse(data); 

				var jsonResult = JSON.parse(data); 

		        PlanningGroupUI.addCustomersToListTable(  jsonResult  );
             
			}
			else
			{
				
				var $targetForm = $("#" + PlanningGroupUI.tabNowID + " #LI_010204_T1_fileUploadForm");
				
	 	        var data = $targetForm.serialize();     
	 	        
	 	        var uploadUrl= "/main/lips/planning/simple_group_planning/excelFileUploadProcess.cmd";
	 	        
	 	        $targetForm.ajaxSubmit({
	 	            url:uploadUrl,
	 	            type: "post",
	 	            dataType: "text",
	 	            data: data,
	 	            // cache: false,
	 	            processData: false,
	 	            contentType: false,
	 	            success: function(data, textStatus, jqXHR) {
	 	                //console.log( data );
	 	                var jsonResult = JSON.parse(data);
	 	                // alert( jsonResult.resultCode ) ;
	 	                
	 	                
	 	                // 성공이면 파일 정보지운다.
	 	               $("#" + PlanningGroupUI.tabNowID + " #uploadfileName").val("");
	 	               $("#" + PlanningGroupUI.tabNowID + " #fileName").val("");

	 	               LI_010204_T1_fileUploadForm.reset(); 

	 	              
	 	              //$("#" + PlanningGroupUI.tabNowID + " #uploadfileName").form.reset();
	 	              // document.get  [0].form.reset()
	 	                
	 	                PlanningGroupUI.addCustomersToListTable(  jsonResult  );  // 화면단 처리 
	 	                
	 	            },
	 	            error: function(jqXHR, textStatus, errorThrown) {}
	 	        });
			}
			
			
		},
		
		
		/**
		 * 팝업 레이어에서 직업 검색 후 결과값 처리 
		 * @author ot020
		 * @since 2014. 4. 14.
		 */
		setOccupation :  function(info) 
		{
			
			console.log( info );
				//alert("setOccupation >> " + info.code + ", " + info.name + ", " + info.date);
			$("#jobCode").val(info.code);
			$("#occCode").val(info.occCode);
			$("#istCode").val(info.istCode);
			
			$("#jobDesc").val(info.name);
			$("#jobStartDate").val(info.date);				
			//$("#jobCodeDisp").val(info.code + " (" +  info.name + ")");
			$("#jobCodeDisp").val(info.code );
		},
		

		
		/**
		 * 팝업 레이어에서 운전 코드  검색 후 결과값 처리 
		 * @author ot020
		 * @since 2014. 4. 14.
		 */ 
		setDrive : function(info) 
		{
			
			//alert("setDrive >> " + info.code + ", " + info.name + ", " + info.date);
			
				$("#drvCode").val(info.code);
			$("#drvDesc").val(info.name);
			$("#drvStartDate").val(info.date);
			//$("#drvCodeDisp").val(info.code + " (" +  info.name + ")");
			$("#drvCodeDisp").val(info.code );
			
		},
		
		
		
		
		/**
		 * 가입 설계 관련 함수
		 * @author ot020
		 * @since 2014. 4. 7.
		 * @return {void}
		 */
		____planningTabUI____ : function()
		{
			
			
		},
		
		
		
		/**
		 * 계약자 셀렉트 박스 세팅 
		 * @author ot020
		 * @since 2014. 4. 7.
		 * @return {void}
		 */
		setOnwerIdSelectBox : function()
		{

			var $selOwnerId = $(window[PlanningGroupUI.tabNowID]).find('select[id="ownerId"]');
			$selOwnerId.children().remove();						

			
			if( $(window['LI_010203_T2']).length > 0  )  // 단체설계 
			{

				var $selMemberList = $(window['LI_010203_T2']).find('select[id="selMemberList"]').children();
				
				// 셀렉트박스 세팅  
				for( var i = 0  ; i  < $selMemberList.length ; i++ )
				{
					var customerId = $selMemberList.eq(i).val();
					var customerName = $selMemberList.eq(i).text();					
					
					// 계약지 리스트에 있는 셀렉스박스에 추가
					$selOwnerId.append('<option value="' + customerId + '" >' + customerName + '</option>');
				}			

				// 셀렉트 된 항목 선택해줌
				var selCustomerId = $(window['LI_010203_T2']).find('select[id="selMemberList"]').children('option:selected').val();		
				$selOwnerId.val( selCustomerId );				
				
			}
			else if( $(window['LI_010204_T2']).length > 0  )  // 단체가상설계 
			{
				var customerId = $(window['LI_010204_T2']).find('input[id="hddCustomerId"]').val();
				var customerName = $(window['LI_010204_T2']).find('input[id="hddCustomerName"]').val();
				$selOwnerId.append('<option value="' + customerId + '" >' + customerName + '</option>');
			}
			

			// 셀렉트 된 사람  개인 정보 세팅 

			
			
		},		
		
		/**
		 * 피보험자 셀렉트 박스 세팅 
		 * @author ot020
		 * @since 2014. 4. 7.
		 * @return {void}
		 */
		setInsurePersonSelectBox : function(  customerList  )
		{
			
			var $selInsurePerson = $(window[PlanningGroupUI.tabNowID]).find('select[id="insuredPerson"]');
			
			$selInsurePerson.children().remove();						
			
			// 셀렉트박스 세팅  
			for( var i = 0  ; i  < customerList.length ; i++ )
			{
				var oneMember =  customerList[i];
				$selInsurePerson.append('<option value="' + oneMember.trIndex + '"  customerId="' +  oneMember.customerId + '">' + oneMember.customerName + '</option>');
				
			}

			// 외 XX명 표시  
			$(window[PlanningGroupUI.tabNowID]).find('span[id="spInsuredPersonCnt"]').html( customerList.length - 1  );
			
			// 셀렉트 된 사람 개인 정보 세팅 
			var nowSelectedTrIndex = $(window[PlanningGroupUI.tabNowID]).find('select[id="insuredPerson"]').val();
			if( nowSelectedTrIndex >= 0  ) PlanningGroupUI.setInsurePersonInfoDisplayByTrIndex( nowSelectedTrIndex );
			
			
		},	
		
		/**
		 * 피보험자 셀렉트 된 사람 개인 정보 표시 
		 * @author ot020
		 * @since 2014. 4. 7.
		 * @param  {JSON} dataset   새로 그려질 차트의 데이터 셋 (비율 변경 시에만 사용)
		 * @return {void}
		 */
		setInsurePersonInfoDisplayByTrIndex : function( trIndex )
		{
			var listIndex =  PlanningGroupUI.findIndexFromListBySearchValue( PlanningGroupData.customerList  , trIndex  , "trIndex" );
			if( listIndex >= 0 )	
				PlanningGroupUI.setInsurePersonInfoDisplayByOneItem(  PlanningGroupData.customerList[ listIndex ]  );
		},
		
		/**
		 * 피보험자 셀렉트 된 사람 개인 정보 표시 
		 * @author ot020
		 * @since 2014. 4. 7.
		 * @param  {JSON} dataset   새로 그려질 차트의 데이터 셋 (비율 변경 시에만 사용)
		 * @return {void}
		 */
		setInsurePersonInfoDisplayByCutomerId : function( customerId )
		{
			var listIndex =  PlanningGroupUI.findIndexFromListBySearchValue( PlanningGroupData.customerList  , customerId  , "customerId" );
			if( listIndex >= 0 )	
				PlanningGroupUI.setInsurePersonInfoDisplayByOneItem(  PlanningGroupData.customerList[ listIndex ]  );
		},
		
		
		/**
		 * 피보험자 셀렉트 된 사람 개인 정보 표시 
		 * @author ot020
		 * @since 2014. 4. 7.
		 * @param  {JSON} dataset   
		 * @return {void}
		 */
		setInsurePersonInfoDisplayByOneItem : function( customerOne )
		{
			
				var ageChangeDate = curex.util.getChangeInsAgeDate(   customerOne.birthday ) ;
				
				$(window[PlanningGroupUI.tabNowID]).find('span[id="spInsuredPersonCustomerRegNo"]').html( curex.util.displayRegNoToFormatDate( customerOne.customerRegNo , "-" ) );
				$(window[PlanningGroupUI.tabNowID]).find('span[id="spInsuredPersonAgeChangeDate"]').html( curex.util.displayDateToFormatDate( ageChangeDate , '-' ));
				
				// $(window[PlanningGroupUI.tabNowID]).find('span[id="spInsuredPersonJobCode"]').html(customerOne.jobCode  + " (" + customerOne.jobCodeName  + ")");
				var spCodeText = (  ( customerOne.jobCode == "" || customerOne.jobCode == undefined)  ? "코드없음" : customerOne.jobCode  );
				spCodeText +=  ( ( customerOne.jobCodeName == ""  || customerOne.jobCodeName == undefined )  ? "" : " (" + customerOne.jobCodeName  + ")" );				
				$(window[PlanningGroupUI.tabNowID]).find('span[id="spInsuredPersonJobCode"]').html(spCodeText);
				
				spCodeText = (  ( customerOne.drvCode == ""  || customerOne.drvCode == undefined ) ? "코드없음" : (  customerOne.drvCodeName == "" ? "코드없음" : customerOne.drvCodeName  )  );
				//$(window[PlanningGroupUI.tabNowID]).find('span[id="spInsuredPersonDrvCode"]').html( (  customerOne.drvCodeName == "" ? "코드없음" : customerOne.drvCodeName  ) );
				$(window[PlanningGroupUI.tabNowID]).find('span[id="spInsuredPersonDrvCode"]').html( spCodeText );
				
				$(window[PlanningGroupUI.tabNowID]).find('span[id="spInsuredPersonAge"]').html(customerOne.age );
				$(window[PlanningGroupUI.tabNowID]).find('span[id="spInsuredPersonGender"]').html(  curex.util.displayGenderToFormatDate( customerOne.gender , 'k1')  );
				
				
/*				<td><span id="spInsuredPersonCustomerRegNo">521205-1**</span><br />(상령일: <span id="spInsuredPersonAgeChangeDate">2014-03-31</span>)<br />
				<span id="spInsuredPersonJobCode">0102s (사무직)</span> / <span id="spInsuredPersonDrvCode">미운전</span> /<br />(<span id="spInsuredPersonAge">30</span>세/<span id="spInsuredPersonGender">남</span>)</td>
			
*/				

				
				// 피보험자 정보 히든에 세팅  
				PlanningGroupUI.setInsurePersonInfoInputValueByOneItem( customerOne );
				
				
//				// 새로고침하기?
//				if( $('input[name=iType]').val() != '-1'  && $('#mainProduct').val()  != ""  )
//					window['LI_010203_T1'].planUI.setMainProductInfo(  $('input[name=iType]').val() ,  $('#mainProduct').val()  );

				// window['LI_010203_T1'].planUI.setMainProductInfo("103040N","금리연동형연금1종");

				
				// 회색으로 표시된 보험료 계산 다시 
				if( $('input[name=iType]').val() != '-1'  && $('#mainProduct').val()  != ""  )
				{
					
					for( var i = 0  ; i  <   $("#tbSpecial tr").find("[name=residentNo]").parent().find("[name=residentNo]").length  ; i++ )
					{
						$("#tbSpecial tr").find("[name=residentNo]").eq(i).parent().find("[name=eachPremiumViewer]").val("");											
					}					

					// 주계약
					window['LI_010203_T1'].planFunc.liveCalculatePlan(   $("#autoComplete").parent('span').parent('td').parent('tr') );
					
					// 특약
					for( var i = 0  ; i  <   $("#tbSpecial tr").find("[name=residentNo]").parent().find("[name=residentNo]").length  ; i++ )
					{
						window['LI_010203_T1'].planFunc.liveCalculatePlan(  $("#tbSpecial tr").find("[name=residentNo]").eq(i).parent() );					
					}		
					
				}

				
				
				
		},
		
		
		test : function( trIndex )
		{
			
			var listIndex =  PlanningGroupUI.findIndexFromListBySearchValue( PlanningGroupData.customerList  , trIndex  , "trIndex" );
			if( listIndex >= 0 )	
			{
				// PlanningGroupUI.setInsurePersonInfoDisplayByOneItem(  PlanningGroupData.customerList[ listIndex ]  );				
				
				PlanningGroupUI.setInsurePersonInfoInputValueByOneItem(   PlanningGroupData.customerList[ listIndex ]   );
								
				// 실제 보험료 계산 버튼 클릭 
				//window['LI_010203_T1'].planFunc.calculatePlan();
				
				
				alert("ddddd");
				
			}				

			
		}, 
		
		/**
		 * 피보험자 정보 히든에 세팅  
		 * @author ot020
		 * @since 2014. 4. 7.
		 * @param  {JSON} dataset   
		 * @return {void}
		 */
		setInsurePersonInfoInputValueByOneItem : function( customerOne )
		{
			console.log(  customerOne );
			// 2014.04.10 - 피보험자 설정 
			if( $(window['LI_010203_T2']).length > 0  )  // 단체 설계
				for( var i = 0  ; i  < $("#divPlanningBoxPlanningMainInsured").find("input[name=clientId]").length ; i++  )
					$("#divPlanningBoxPlanningMainInsured").find("input[name=clientId]").eq(i).val( customerOne.customerId );
			else
				for( var i = 0  ; i  < $("#divPlanningBoxPlanningMainInsured").find("input[name=clientId]").length ; i++  )
					$("#divPlanningBoxPlanningMainInsured").find("input[name=clientId]").eq(i).val("");

			
			for( var i = 0  ; i  < $("#divPlanningBoxPlanningMainInsured").find("input[name=age]").length ; i++  )
			{
				$("#divPlanningBoxPlanningMainInsured").find("input[name=age]").eq(i).val( customerOne.age );
				$("#divPlanningBoxPlanningMainInsured").find("input[name=sex]").eq(i).val( ( customerOne.gender == 'M' ?  1 :  2  )  );
				$("#divPlanningBoxPlanningMainInsured").find("input[name=residentNo]").eq(i).val( customerOne.customerRegNo );
				$("#divPlanningBoxPlanningMainInsured").find("input[name=jobCode]").eq(i).val( customerOne.jobCode );
				$("#divPlanningBoxPlanningMainInsured").find("input[name=jobIstCode]").eq(i).val( customerOne.jobIstCode );
				$("#divPlanningBoxPlanningMainInsured").find("input[name=jobOccCode]").eq(i).val( customerOne.jobOccCode );
				
			}
			
/*				for( var i = 0  ; i  < $("#divPlanningBoxPlanningMainInsured").find("input[name=age]").length ; i++  )
				$("#divPlanningBoxPlanningMainInsured").find("input[name=age]").eq(i).val( customerOne.age );
			
			for( var i = 0  ; i  < $("#divPlanningBoxPlanningMainInsured").find("input[name=sex]").length ; i++  )
				$("#divPlanningBoxPlanningMainInsured").find("input[name=sex]").eq(i).val( ( customerOne.gender == 'M' ?  1 :  2  )  );

			for( var i = 0  ; i  < $("#divPlanningBoxPlanningMainInsured").find("input[name=residentNo]").length ; i++  )
				$("#divPlanningBoxPlanningMainInsured").find("input[name=residentNo]").eq(i).val( customerOne.customerRegNo );

			for( var i = 0  ; i  < $("#divPlanningBoxPlanningMainInsured").find("input[name=jobCode]").length ; i++  )
				$("#divPlanningBoxPlanningMainInsured").find("input[name=jobCode]").eq(i).val( customerOne.jobCode );

			for( var i = 0  ; i  < $("#divPlanningBoxPlanningMainInsured").find("input[name=jobIstCode]").length ; i++  )
				$("#divPlanningBoxPlanningMainInsured").find("input[name=jobIstCode]").eq(i).val( customerOne.jobIstCode );

			for( var i = 0  ; i  < $("#divPlanningBoxPlanningMainInsured").find("input[name=jobOccCode]").length ; i++  )
				$("#divPlanningBoxPlanningMainInsured").find("input[name=jobOccCode]").eq(i).val( customerOne.jobOccCode );
*/
		   	
			
			// $(window[PlanningGroupUI.tabNowID]).find("input[name=clientId]").val(customerOne.clinentId);
			//$(window[PlanningGroupUI.tabNowID]).find("input[name=age]").eq(0).val( customerOne.age );
			//$(window[PlanningGroupUI.tabNowID]).find("input[name=sex]").eq(0).val( ( customerOne.gender == 'M' ?  1 :  2  )  );
			
			// setInsurePersonInfoDisplayByOneItem
		},	
		
		/**
		 * 단체 설계 - 계약자의 plan list 표시 
		 * @author ot020
		 * @since 2014. 4. 7.
		 * @param  {JSON} dataList  데이터 
		 * @return {void}
		 */
		setPlanListByOwnerId : function( dataList )
		{
			
			// console.log( dataList  );
			
			var strHTML = "";
			
			for( var i = 0  ; i < dataList.out.length ; i++  )
			{
				var plan = dataList.out[i];	

				// console.log( plan );
				
				strHTML +='<li>';
				strHTML +='<a href="javascript:return false;" class="speechB" onClick=\'readPlan("'+plan.pln_id+'-' + plan.cs_flag_pln + '","' + PlanningGroupUI.tabNowID + '")\'>';
				strHTML +='	<span class="ellip">' + plan.pln_name + '</span>';
				strHTML +='	<span class="bubble2">';
				strHTML +='		<span class="bb">';
				strHTML +=				plan.pln_name ;
				strHTML +='			<span class="arr">&nbsp;</span>';
				strHTML +='		</span>';
				strHTML +='	</span>		';						
				strHTML +='</a>';
				// strHTML +='<span class="close">' + plan.pln_calculate_date + ' <a href="javascript:return false;"><img src="/img/common/btn_dels2.gif"  onClick=\'deletePlan("' +  plan.pln_id + '-' + plan.cs_flag_pln + '",null,this,"'+ PlanningGroupUI.tabNowID +'")\' alt="삭제" /></a></span>';
				strHTML +='<span class="close">' + plan.pln_calculate_date + ' <a href="javascript:return false;"><img src="/img/common/btn_dels2.gif"  onClick=\'PlanningGroupProcess.deletePlanOne("' +  plan.pln_id + '-' + plan.cs_flag_pln + '",null,this,"'+ PlanningGroupUI.tabNowID +'" , '  + plan.client_id +' , "' + plan.usr_company_id + '" )\' alt="삭제" /></a></span>';
				strHTML +='</li>';

				// PlanningGroupProcess.deletePlanOne
			}
		
			$("#savePlanList").html("");
			$("#savePlanList").html(strHTML);
			
			
			// 타이틀 세팅
			
			var customerName = $(window[PlanningGroupUI.tabNowID]).find('select[id="ownerId"]').children('option:selected').text();
			if(  customerName !=  curex.util.cutStringByByte( customerName ,  8  ) )
				 customerName = curex.util.cutStringByByte( customerName ,  8  ) + "..";
			
			$(window[PlanningGroupUI.tabNowID]).find('span[id="spPlanList"]').html(customerName + "님의 Plan");
			
			// 계약자 정보 세팅 
    		var customerId = $(window[PlanningGroupUI.tabNowID]).find('select[id="ownerId"]').children('option:selected').val();
    		// customerId =  17143338;
    		PlanningGroupData.getCustomerInfoByCustomerId(  customerId  , 'SL194'  ); 

			
		},
		
		/**
		 * 단체 설계에서 plan 탭 클릭 
		 * @author ot020
		 * @since 2014. 4. 8.
		 * @param  {JSON} dataset   새로 그려질 차트의 데이터 셋 (비율 변경 시에만 사용)
		 * @return {void}
		 */
		clickPlanListTab : function( clickTab )
		{

			//console.log("clickPlanListTab");
			
			
			if(  clickTab == 'tab2'  )
			{
				$(".tab1 a").removeClass("on");
				$(".tab2 a").addClass("on");

				$("#tabDiv01").hide();
				$("#tabDiv02").show();				
			}
			else
			{
				$(".tab2 a").removeClass("on");
				$(".tab1 a").addClass("on");

				$("#tabDiv02").hide();
				$("#tabDiv01").show();
				
			}
			
		},		
		
		
		/**
		 *  템플릿
		 * @author 
		 * @since
		 * @return {void}
		 */  
		isEnd : function()
		{
			// 마지막 함수,  아무 기능 안함..  	표시용임 
		}

	
};




//==========================================================================================
//청약 정보 탭 
var PlanningGroupOfferInfoUI = {
		
		// menuNowId : "LI_010203",
		
		/**
		 * 청약정보의 피보험자 정보 테이블 만들기
		 * @author OT020
		 * @since 2014. 4. 18.
		 * @param  {JSON} dataset   새로 그려질 차트의 데이터 셋 (비율 변경 시에만 사용)
		 * @return {void}
		 */
		setOfferListTable : function()
		{
			
			// 기존 항목 삭제 
			$("#" + PlanningGroupUI.tabNowID + " #tbOfferInfoList tbody tr").remove();
			
			
			for(  var i = 0 ; i <  PlanningGroupData.customerList.length ; i++)				
			{
				var oneCustomer =  PlanningGroupData.customerList[i];
				PlanningGroupOfferInfoUI.addOneMemberToOfferListTable(  oneCustomer );
			}
			
			// 데이터를 부른다. 
			// PlanningGroupOfferInfoUI.getCalculateOfferList();
			
		},

		
		/**
		 * 청약정보의 피보험자 정보 테이블에 구성원 추가 
		 * @author OT020
		 * @since 2014. 4. 18.
		 * @param  {JSON} dataset   새로 그려질 차트의 데이터 셋 (비율 변경 시에만 사용)
		 * @return {void}
		 */
		addOneMemberToOfferListTable : function( oneMember )
		{
			
			var nextIndex = $("#" + PlanningGroupUI.tabNowID + " #tbOfferInfoList tbody tr").length + 1 ;		
			
			var memberName =  oneMember.customerName;			
			var customerId = oneMember.customerId;
			var customerRegNo = oneMember.customerRegNo;
			var birthday = oneMember.birthday;
			
			// 보험연령 계산
			var insuranceAge =   0;
			var currentDate = curex.util.getCurrentDateString(); 
			insuranceAge = curex.util.calcInsuredAgeByBirthDate(currentDate , birthday );
			
			
			
			var strHTML = '';
			strHTML += '<tr id="trIndex' + oneMember.trIndex + '">';
			strHTML += '	<td>' + nextIndex + '</td>';							// 번호
			
			strHTML += '<input type=hidden name=customerId value="' + oneMember.customerId  + '">';							// customerid
			strHTML += '<input type=hidden name=trIndex value="' + oneMember.trIndex  + '">';							// trindex			
			
			strHTML += '	<td>가망yy</td>';						// 고객구분
			strHTML += '	<td>' + memberName + '</td>';						// 고객이름
			strHTML += '	<td>' + curex.util.dateFormatter(birthday , "-") + '</td>';				// 생년월일
			strHTML += '	<td>' + ( oneMember.gender == "M" ?  "남" : "여"  ) + '</td>';							// 성별
			strHTML += '	<td>' + insuranceAge + '</td>';							// 보험연령
			strHTML += '	<td class="tar" id=tdTotalAmount><center><img src ="/img/common/loading_small.gif"></center></td>';			// 합계 보험료
			strHTML += '	<td class="tar" id=tdMainAmount><img src ="/img/common/loading_small.gif"></td>';			// 주계약
			strHTML += '	<td class="tar" id=tdSpecialAmount><img src ="/img/common/loading_small.gif"></td>';			// 특약
			strHTML += '	<td id="tdUnderWritingResult"><a href="javascript:return false;"><span onclick="alert(\'ddddd\')">abcd</span></td>';		// 심사결과		Y/N/W 별 색상 다름
			strHTML += '	<td>회사xx</td>';								// 출력주소
			strHTML += '	<td>';
			strHTML += '		<input type="button" class="btn smGyRb" value="미리보기" id="btnDeleteCustomer" >';
			strHTML += '		<input type="button" class="btn smGyRb" value="출력" id="btnDeleteCustomer" >';
			strHTML += '	</td>';
			strHTML += '</tr>';
			
			// 피보험자 목록에 추가 
			$("#" + PlanningGroupUI.tabNowID + " #tbOfferInfoList tbody").append( strHTML );		
			
			
		},

		/**
		 * 청약정보의 피보험자 구성원의 보험료등 표시  
		 * @author OT020
		 * @since 2014. 4. 18.
		 * @param  {JSON} dataset   새로 그려질 차트의 데이터 셋 (비율 변경 시에만 사용)
		 * @return {void}
		 */
		setOneMemberOfferInfo : function( trIndex  , tryCnt  )
		{
			 
			var listIndex =  PlanningGroupUI.findIndexFromListBySearchValue( PlanningGroupData.customerList  , trIndex  , "trIndex" );
			if( listIndex >= 0 )
			{

				var $targetTr = $("#" + PlanningGroupUI.tabNowID + " #tbOfferInfoList tbody #trIndex" + trIndex  );
				var oneMember =  PlanningGroupData.customerList[ listIndex ];
				
				var specialAmountTotal = 0;
				
				// 보험료 표시 
				$targetTr.find("[id=tdTotalAmount]").html( curex.util.numberCommaRetrun( oneMember.totalPremium + "" ) );		//  합계 보험료
			
//				console.log( oneMember );
//				console.log( " setOneMemberOfferInfo " +  oneMember  + " trIndex "  + trIndex );
//				console.log( oneMember.premiumList );
//				console.log( oneMember.premiumList.length );
				
				var premiumListCnt = oneMember.premiumList.length;				
				
				for( var i = 0  ; i  <  premiumListCnt ; i++  )
				{
					if( i == 0  )
						$targetTr.find("[id=tdMainAmount]").html( curex.util.numberCommaRetrun( oneMember.premiumList[i].premium + "" )  );		//  주계약
					else if( i <  premiumListCnt -1   )
						specialAmountTotal  +=  oneMember.premiumList[i].premium;
					else
						console.log(  oneMember.totalPremium  + " = " +  oneMember.premiumList[i].premium );					
				}

				$targetTr.find("[id=tdSpecialAmount]").html( curex.util.numberCommaRetrun( specialAmountTotal  + "" )  );		//  특약
				
				//  심사 결과
				console.log( oneMember.underwritingResult );
				for( var i = 0  ; i <  oneMember.underwritingResult.length ; i++  )
				{
					console.log( oneMember.underwritingResult[i].message );
				}							
			}				
		},
		
		
		/**
		 * 함수 설명
		 * @author OT020
		 * @since 2014. 4. 18.
		 * @param  {JSON} dataset   새로 그려질 차트의 데이터 셋 (비율 변경 시에만 사용)
		 * @return {void}
		 */		
		getCalculateOfferList : function()
		{

			for( var i = 0 ;  i <  PlanningGroupData.customerList.length ; i++ )
			{
				var oneCustomer =  PlanningGroupData.customerList[i];
//				console.log( oneCustomer.customerRegNo );
//				console.log( oneCustomer.trIndex  + " i =  " + i );
				
				var $targetTr = $("#" + PlanningGroupUI.tabNowID + " #tbOfferInfoList tbody #trIndex" + oneCustomer.trIndex   );
				
				$targetTr.find("[id=tdMainAmount]").html('<center><img src ="/img/common/loading_small.gif"></center>');
				$targetTr.find("[id=tdSpecialAmount]").html('<center><img src ="/img/common/loading_small.gif"></center>');
				$targetTr.find("[id=tdTotalAmount]").html('<center><img src ="/img/common/loading_small.gif"></center>');
				
//				console.log( $targetTr );
//				console.log( $targetTr.find("[id=tdTotalAmount]") );
				
				// setTimer = setTimeout( console.log(  oneCustomer.trIndex  + "//"   + (new Date()) )  , 1000);
				
				// setTimer = setTimeout( window['LI_010203_T1'].planFunc.calculatePlanGroup( oneCustomer.trIndex  ) , 1000);
				// setTimeout(  window['LI_010203_T1'].planFunc.calculatePlanGroup( oneCustomer.trIndex  )  , 1000);

				window['LI_010203_T1'].planFunc.calculatePlanGroup( oneCustomer.trIndex  )  ;
				delayTime(1000);			// 딜레이
				
			}	

			
		}, 
		
		/**
		 * 함수 설명
		 * @author ot020
		 * @since 2014. 3. 27.
		 * @return {void}
		 */
		isEnd : function()
		{
			// 마지막 함수,  아무 기능 안함..  	표시용임 
		}
		
};




	
//==========================================================================================
//단체 계획 수립 - function 
var PlanningGroupProcess = {
		
		
		
		/**
		 * 계약자의 planList  한건 지우기
		 * @author ot020
		 * @since 2014. 4. 8.
		 * @param  {void}
		 * @return   {void}
		 */
		deletePlanOne : function( seqNo,planType,obj,areaName , customerId , userId  )
		{
			
/*			
			var frm = window[areaName].form;
			var needsType = $('input[name=needsType]',frm).val();

			$.post("/main/lips/planning/planningcrud/deletePlan.json",
					{sequentialNo: seqNo,needsType : needsType}, // param
					function(data){ // when it success
					
						if(data.result=="success"){
							alert("삭제 완료 되었습니다.");
							// 새계획으로 시작하기
							$(obj).parent('li').remove();
							
						}
					
			});
*/

			alert("ddddd");
			
			var frm = window[areaName].form;
			var needsType = $('input[name=needsType]',frm).val();
			
			
			
			//customerId = 17143338;
			userId = "SL194";
			
            //ajax 통해서 데이터를 가져온 후 화면에서 데이터 조작이 필요한 경우.
            // submit을 ajax로 해야 할 경우.
            var input = new DataSet();
            input.put('sequentialNo', seqNo );
            input.put('needsType', needsType );
            input.put('customerId', customerId );
            input.put('userId', userId );
            
            
            // var ajaxUrl = "/main/customer/management/totalInfo.cmd";
            var ajaxUrl = "/main/lips/planning/group_planningajax/deletePlan.cmd";
                        	
            curex.util.submitAjax(null,{
              url : ajaxUrl , 
              param : input.getParam(),
              success : function(data){
              	//console.log(data);         
              	
              	// PlanningGroupUI.setPlanListByOwnerId( data.planList );              	
              	
              }
             });

		}, 		
		
		
		
		
		/**
		 *  템플릿
		 * @author 
		 * @since
		 * @return {void}
		 */  
		isEnd : function()
		{
			// 마지막 함수,  아무 기능 안함..  	표시용임 
		}
		
};		
		