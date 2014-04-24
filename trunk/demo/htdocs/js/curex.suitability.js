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

	/*
     * 계약자의 적합성진단 정보를 가져옴
     */
    self.getSuitabilityType = function() {
    	 
       // openProgress();
        var theURL = "/main/customer/common/getSuitabilityData.cmd";
        

        tId = "206";
        var pars = "customerId=" + tId + "&method=data";               
        
        jQuery.ajax({
            type: 'post'
            , async: true
            , url: theURL
            , data: pars
            , success: function(data) {
            	 
               if(data !=null && data !="")
               {
            	   setInfo(data);
               }
              }
            , error: function(data, status, err) {
                alert('서버와의 통신이 실패했습니다.');
              }
            , complete: function() { 
					//closeProgress();
            }
        });

    };
    

    
              
    /*
     * 가져온 적합성 진단 정보를 세팅 해줌  
     */
    function setInfo(data) {
 
 	    //// 0) 전역변수 설정
 	   suitabilityGlobal = data.suitability;
 	    
			//// 1) 변수선언
 	    //alert(1);
 	    var invTypeCode = data.suitability.invTypeCode; // 투자성향
		var prdTypeCode = data.suitability.prdTypeCode; // 상품성향
		var isHighRiskConf = data.suitability.isHighRiskConf; // 고위험변액 선택  true, false
		var isOtherProtPurpConf = data.suitability.isOtherProtPurpConf; // 상품성향 불일치 선택  true, false
		
		var prdTypeCodeDate = data.suitability.prdTypeCodeDate; // 상품성향 작성일
		var highRiskConfDate = data.suitability.highRiskConfDate; // 고위험변액 선택 작성일
		var isOtherProtPurpConfDate = data.suitability.isOtherProtPurpConfDate; // 상품성향 불일치 선택 작성일
		
		var prdTypeCodeEndDate = data.suitability.prdTypeCodeEndDate; // 상품성향 만기일

		var isPrdTypeCodeScan = data.suitability.productScanYn != "" && data.suitability.productScanYn ? "Y" : "N"; // 상품성향 스캔여부
		var isHighRiskConfScan = data.suitability.confirmHighScanYn != "" && data.suitability.confirmHighScanYn ? "Y" : "N"; // 고위험변액 선택  스캔여부
		var isOtherProtPurpConfScan = data.suitability.confirmDifferenceScanYn != "" && data.suitability.confirmDifferenceScanYn ? "Y" : "N"; // 상품성향 불일치 선택  스캔여부

        var txtInvestmentType  = "-";
        var txtProductType  = "-";
        
        var m_isHighRiskConf  ="";  // 고위험변액확인서(m_curex에서 사용하기위함)
        var m_isOtherProtPurpConf =""; //상품성향 불일치 (m_curex에서 사용하기위함)
        //고위험변액확인서 
        if(isHighRiskConf){m_isHighRiskConf ="Y"}else{m_isHighRiskConf="N"}
         
       //상품성향 불일치확인서
       if(isOtherProtPurpConf){m_isOtherProtPurpConf ="Y"}else{m_isOtherProtPurpConf="N"}
        
        // 투자성향
        if(invTypeCode == "1") {
     	   txtInvestmentType  = "안정형";
        } else if(invTypeCode == "2"){ 
     	   txtInvestmentType  = "중립형";
        }else if(invTypeCode == "3"){ 
     	   txtInvestmentType  = "성장형";
        }
        // 상품성향
        if(prdTypeCode == "1"){ 
     	   txtProductType  = "보장형";
        }else if(prdTypeCode == "2"){ 
     	   txtProductType  = "저축형";
        }
		
        //alert(2);
        
        ///// 2) 기존 data 초기화
		
        disableSuitabilityComponent();
        
		   //// 3) 적합성 정보 세팅
        // 상품성향 진단이 실시되었고, 그것의 만기일이 지나지 않았을 경우
        // 적합성진단에서 상품성향 진단일이 만기의 기준이므로 다른 속성들은 하위로 포함 - 2012.09.17
       /* if(prdTypeCode != "" && isExpireOnToday(prdTypeCodeEndDate)) {
        		jQuery('#txtProductType').css('color','red'); // 상품성향
        		jQuery('#txtInvestmentType').css('color','red'); // 투자성향
        		
        		jQuery('#txtSuitabilityTestDate').css('color','red');
        		jQuery('#txtSuitabilityTestEndDate').css('color','red');
        		
        		jQuery('#txtSuitabilityTestScan').css('color','red');
        		
        } else {
        		jQuery('#txtProductType').css('color','000000'); // 상품성향
        		jQuery('#txtSuitabilityTestDate').css('color','000000'); // 진단일
        		jQuery('#txtSuitabilityTestEndDate').css('color','000000'); // 만기일
        		
        		jQuery('#txtInvestmentType').css('color','000000'); // 투자성향
        		jQuery('#txtSuitabilityTestScan').css('color','000000');
        }         */      
 
        
        //// 적합성 진단결과 최종 세팅(미진단의 경우 default 값 세팅)
        jQuery('#txtProductType').text(txtProductType);
        jQuery('#txtInvestmentType').text(txtInvestmentType);
        
        ////////////////////////////////mCurex용/////////////////////////////////////////
        jQuery('span[id="txtSuitabilityTestDate"]').text(changeDateFormat(prdTypeCodeDate));			//진단일
        jQuery('span[id="txtIsOtherProtPurpConf"]').text(m_isOtherProtPurpConf);			//상품성향 불일치확인
        jQuery('span[id="txtIsHighRiskConf"]').text(m_isHighRiskConf);			//고위험변액 불일치확인  
        jQuery('span[id="txtIsHighRiskConfScan"]').text(isHighRiskConfScan);			//고위험변액스캔여부
        jQuery('span[id="txtIsPrdTypeCodeScan"]').text(isPrdTypeCodeScan);			//상품성향스캔여부
        jQuery('span[id="txtIsOtherProtPurpConfScan"]').text(isOtherProtPurpConfScan);			//상품성향불일치 스캔여부
        //////////////////////////////////////////////////////////////////////////////////////////////////
         
		   // 적합성진단만기일 여부
        if(prdTypeCodeEndDate != "" && prdTypeCodeEndDate != null){
        	 
     	   jQuery('#txtSuitabilityTestDate').text(changeDateFormat(prdTypeCodeDate));
     	   jQuery('#txtSuitabilityTestEndDate').text(changeDateFormat(prdTypeCodeEndDate));
     	   jQuery('#txtSuitabilityTestScan').text(isPrdTypeCodeScan);
     	   
            // 고위험선택확인
            if(isHighRiskConf){ 
            		jQuery('#txtTakingHighRiskDate').text(changeDateFormat(highRiskConfDate));
            		jQuery('#txtTakingHighRiskScan').text(isHighRiskConfScan);
            		jQuery('#chkTakingHighRisk').attr("checked",true);
            		if(isHighRiskConfScan == "Y"){

            			jQuery('#chkTakingHighRisk').attr("disabled",true); // 스캔완료 && checked 상태에서는 해제 불가	
            		} else {
            			jQuery('#chkTakingHighRisk').removeAttr("disabled"); 
            		}					    
            } else {
					jQuery('#chkTakingHighRisk').removeAttr("disabled");
			   }

            // 상품성향 불일치 확인서
            if(isOtherProtPurpConf){ 
           		jQuery('#txtConfirmProductTypeDiffDate').text(changeDateFormat(isOtherProtPurpConfDate));
           		jQuery('#txtConfirmProductTypeDiffScan').text(isOtherProtPurpConfScan);
           		jQuery('#chkConfirmProductTypeDiff').attr("checked",true);
           		if(isOtherProtPurpConfScan == "Y"){
        			
           			jQuery('#chkConfirmProductTypeDiff').attr("disabled",true); // 스캔완료 && checked 상태에서는 해제 불가
           		} else {
           			jQuery('#chkConfirmProductTypeDiff').removeAttr("disabled");
           		}
				    
            } else {
					jQuery('#chkConfirmProductTypeDiff').removeAttr("disabled");
			   }
        } else {
				disableSuitabilityComponent();
        }            
        
        // 적합성 진단 박스에 계약자 성명 세팅
        jQuery("#txtOwnerName").text(jQuery("#planCstm1").text());
         
       // hideCalculateResultButton();
    }           
    
    /**
     * 적합성 진단관련 compoent들 disabled
     */
    function disableSuitabilityComponent(){

 	   jQuery("#chkConfirmProductTypeDiff").attr("disabled",true);
	   jQuery("#chkTakingHighRisk").attr("disabled",true);
	   jQuery("#chkConfirmProductTypeDiff").attr("checked",false);
	   jQuery("#chkTakingHighRisk").attr("checked",false);
	  
	   // componet contents reset
	   jQuery("#txtOwnerName").text("");
	   jQuery("#txtProductType").text("-");
	   jQuery("#txtInvestmentType").text("-");
	   jQuery("#txtSuitabilityTestEndDate").text("-");
	   jQuery("#txtSuitabilityTestDate").text("-");
	   jQuery("#txtConfirmProductTypeDiffDate").text("-");
	   jQuery("#txtTakingHighRiskDate").text("-");
	   
	   jQuery("#txtSuitabilityTestScan").text("-");
	   jQuery("#txtConfirmProductTypeDiffScan").text("-");
	   jQuery("#txtTakingHighRiskScan").text("-");
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
    
    /**
     * 날짜포맷 변경 20110827 -> 2011.08.27
     */           
    function changeDateFormat(t) {        	   
        if(t == "" || t == null)
            return "";
        
        return t.substring(0,4) + "." + t.substring(4,6)+"." + t.substring(6); 
    }
    
	
	if (!curex) {
		window.curex = curex = {};
	}
	curex.suitability = self;
	

	
})(window.curex);