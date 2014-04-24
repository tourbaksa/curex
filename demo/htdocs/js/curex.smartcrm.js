/**
 * smartcrm 공통 팝업
 */

(function(curex) {
	var self = {};			
	
	var BASIC_SMS_URL = "http://www.messageplus.co.kr/page/prlife/prlife_index.jsp";
	
	/**
	@functionName    : init
	@param    : 	type  
						gridTable
						userId
						
	@Return : 
	 - 
	**/
	self.sendMyLP = function(type, gridTable, clientId, curexUserID){
		
		var userflag = true;
	    var gridData = null;
	    /*var token = "|";
	    //var clientId = "";
	    var cellPhones = ""; 
	    var userNms = ""; 
	    var userTitles = "";
	    var userFams = "";*/


		if ( type == "" ) type = null;
		if ( gridTable == "" ) gridTable = null;
		if ( clientId == "" ) clientId = null;
		if ( curexUserID == "" ) curexUserID = null;

	    if( type == null )
	    {
	        alert('타입을 선택해주세요.');
	        return;
	    } else if ( type != null  ) {
			
			
			if ( gridTable == null  && clientId == null  && curexUserID == null  ) {
				userflag = false;
			} else if ( gridTable != null  ){
				var gridData = gridTable.getCheckedRowData();
				if ( gridData.length == 0 ) {
					userflag = false;
				}
			}
		}

	    if( !userflag )
	    {
	        alert('선택된 고객이  없습니다.');
	        return;
	    }
	    

	  /* 	if(type == "sms" || type == "sur") { 
	   		token = "";
		}*/


		var input = new DataSet();


		input.put("TYPE", type);
	   	
	   	if ( gridData != null ) {
			
			for ( i=0; i<gridData.length; i++) {
				CLIENT_ID = gridData[i].get('CLIENT_ID');
				CUSTOMER_ID = gridData[i].get('CUSTOMER_ID');
				if ( CLIENT_ID != "" && CLIENT_ID != null ) 
					input.add("CLIENT_ID", CLIENT_ID);
				if ( CUSTOMER_ID != "" && CUSTOMER_ID != null ) 
					input.add("CUSTOMER_ID", CUSTOMER_ID);
			}
			
			if ( input.getCount("CLIENT_ID") == 0 && input.getCount("CUSTOMER_ID") == 0 ) {
				alert("고객이 없습니다.");
				return;
			}
	   		
	   	} else if ( clientId != null  ) { 
			input.put("CLIENT_ID", clientId);
	   	} else if ( curexUserID != null ) { 
			input.put("CUSTOMER_ID", curexUserID);
	   	}


		if(type == "sms" || type == "sur") {
	    	
	    	BASIC_SMS_URL = "http://www.messageplus.co.kr/page/prlife/prlife_index.jsp";
			
			curex.util.submitAjax(null, {
				url : "/main/smartcrm/smartCrmCom/getCustomerInfoForSMS.cmd",
				data : input.getParam(),
				success : function(data){
					setCustomerInfoSms(data);
				}
			});

		} else {
		
			curex.util.submitAjax(null, {
				url : "/main/smartcrm/smartCrmCom/getCustomeInfoList.cmd",
				data : input.getParam(),
				success : function(data){
					setCustomerInfo(type, data);
				}
			});

		}

	    
	   /* if (type == "magazine") {
		
	     	pars = "user=" + userid + "&customer=" + clientId2 +"&type=" + type; // prototype.js
	    
	      if(scnt == p_cnt) {
	        alert('가망고객에게는 제공되지 않는 서비스 입니다.');
	        //closeProgress();
	        return;
	      } 
	      
	      if(p_cnt > 0 ) {
			alert('가망고객에게는 제외되고 계약고객에게만 발송 됩니다.');	      	
	      }    
	    
	      var tmsg = userNms2 + "^" + userIdenNms + "^" + userEmails + "^" + userMagazineCodes;
	      setCustomerInfo4Magazine_byGauce(tmsg);
	    
	    
	    } else if(type == "sms" || type == "sur") {
	    	
	    	BASIC_SMS_URL = "http://www.messageplus.co.kr/page/prlife/prlife_index.jsp";
			
			curex.util.submitAjax(null, {
				url : "/main/smartcrm/smartCrmCom/getCustomerInfoForSMS.cmd",
				data : input.getParam(),
				success : function(data){
					setCustomerInfoSms(data);
				}
			});
	    
	  	} else {
	      //openProgress();	
	      //var tmsg = userNms2 + "^" + userEmails + "^" + clientId3 + "^" + userIdenNms + "^" + userAddresses + "^" + cellPhones2 + "^" + userGenders + "^" + userSources + "^" + userZipcodes + "^" + userFams2 + "^" + userTitles2;
	      

	      //setCustomerInfo_byGauce(tmsg, email_cnt, no_email_cnt, access_token, target_url, lpId);

		
			curex.util.submitAjax(null, {
				url : "/main/smartcrm/smartCrmCom/getCustomeInfoList.cmd",
				data : input.getParam(),
				success : function(data){
					setCustomerInfo(data);
				}
			});
	    }*/
		
		
	}

	/*
		Email, lp 소식지
	*/
	setCustomerInfo =  function(type, data){

	    var token = "|";
	    var clientId = "";
	    var cellPhones = ""; 
	    var userNms = ""; 
	    var userTitles = "";
	    var userIdenNms = "";
	    var userGenders = "";
		var userAddresses = ""; 
	    var userMagazineCodes = "";
	    var userZipcodes = "";
	    var userEmails = "";
	    var userSources = "";

		var dataList = data.customerList.resultDataList;

	    var temp2 = '';
	    var no_email_cnt=0;

		for (rowi = 0; rowi < dataList.length; rowi++)
		{
			var dataDetail = dataList[rowi];
			
			if ( temp2 != '' ) 
				temp2 += "' , '";
			
			temp2 += dataDetail.CUSTOMER_ID;
			
			if( dataDetail.EMAIL != "Y"   )
				no_email_cnt++;
		}

	    var temp2 = '';
	    var email_cnt =0;
	    var no_email_cnt=0; //Email 없는 고객 건수
      	var p_cnt = 0;  //가망 고객 건수

		for (rowi = 0; rowi < dataList.length; rowi++)
		{
			var dataDetail = dataList[rowi];

			clientId += dataDetail.CUSTOMER_ID;
			cellPhones += dataDetail.CELL_PHONE_NO;

	       	userNms += dataDetail.CUSTOMER_NAME;
	       	userTitles += dataDetail.APPELLATION;

	       	
	        if(dataDetail.POLICY_YN == "N") {
	        	p_cnt++;
	        }

	       	if (type == 'email') { 

    	       	if(dataDetail.EMAIL != "") {   
    		        //clientId3 += TOINB_DATA_OBJECT.ColumnString(rowi,TOINB_DATA_OBJECT.ColumnIndex('O_CLIENT_ID')) + token;
    		       	//cellPhones2 += " " + token;
    		       	//userNms2 += TOINB_DATA_OBJECT.ColumnString(rowi,TOINB_DATA_OBJECT.ColumnIndex('O_CLIENT_NAME')) + token;
    		       	//userTitles2 += TOINB_DATA_OBJECT.ColumnString(rowi,TOINB_DATA_OBJECT.ColumnIndex('O_CUS_TITLE')) + token;
    		       	//userFams2 += TOINB_DATA_OBJECT.ColumnString(rowi,TOINB_DATA_OBJECT.ColumnIndex('O_CUS_FAMILIARITY')) + token;
    	        	
    	        	userIdenNms +=  " " + token;
    	        	userGenders +=  " " + token;
    	        	userMagazineCodes += " " + token;
    	        	userEmails += dataDetail.EMAIL + token;
    	        	userAddresses += " " + token;
    	        	userZipcodes += " " + token; 
    	        	userSources += "lips" + token;
    	        	
    	        	email_cnt++;
    	        	
    	        } else {
    	        	no_email_cnt++;
    	        }

	       	}
		}

		if (type == 'email') { 

			if(no_email_cnt > 0)
			 	alert("총 "+no_email_cnt+"명 고객님의 e_mail주소가 없습니다. \n제외하고 발송됩니다.");


			if(type != 'pms' && email_cnt == 0){
				closeProgress();
				return;
			}


			var input = new DataSet();

			input.add("clientId", clientId);
			input.add("cellPhones", cellPhones);
			input.add("userNms", userNms);
			input.add("userTitles", userTitles);
			input.add("userIdenNms", userIdenNms);
			input.add("userGenders", userGenders);
			input.add("userAddresses", userAddresses);
			//input.add("userMagazineCodes", userMagazineCodes);
			input.add("userZipcodes", userZipcodes);
			input.add("userEmails", userEmails);
			input.add("userSources", userSources);
			csStationDialogOpen(input);




		/*
			var url = document.sendForm.url.value + "/lphome/admin/SendFromCurex.do?bypass=1";
			
			var t_type = document.sendForm.flag.value;
			if(t_type == "eCard") {
				url = "/ecard_main.do?method=make";
			} else if(t_type == "eLetter") {
				url = "/eletter_main.do?method=make";
			} else if(t_type == "ePost") { 		
				url = "/epost_main.do?method=make";
			} else if(t_type == "news")  {
				url += "&accessToken="+access_token+"&targetUrl="+target_url+"&lpId="+lpId;
				sendForm.flag.value = 'curex_lp_news';
			}

		newWin = window.open('/html/progress.html', t_type, 'status=no, scrollbars=yes, resizable=no, menubar=no, width=677,height=600,left=220 ,top=100');

		newWin.focus();
		document.sendForm.target = t_type;
		document.sendForm.method = "post";
		document.sendForm.action = url;
		document.sendForm.submit();

		closeProgress();*/
		}

	}


	/*
		SMS 전송
	*/
	setCustomerInfoSms = function(data){
	    var token = "";
	    var dataSplit = data.split("|");
		var loginInfo = dataSplit[0];
		var customerinfoList = dataSplit[1];
		var cnt = parseInt(dataSplit[2]);
		var all_cnt = parseInt(dataSplit[3]);

		var customerinfos = customerinfoList.split("^");
		


		if(cnt == all_cnt) {
		 	alert("고객님의 휴대폰 번호가 없습니다. ");
			return;	
		}  

		if(parseInt(cnt) > 0) {
		 	alert("총 "+cnt+"명 고객님의 휴대폰 번호가 없습니다. \n제외하고 발송됩니다.");
		} 
	   
	    var sdsForm = document.createElement("form");
	    var logininfo = document.createElement("input");
	    
	    logininfo.type="hidden";
	    logininfo.name="logininfo";
	    logininfo.value=loginInfo;
	    
	    sdsForm.appendChild(logininfo);
	    
	    var hdn = []; 
	    
	    for (var j = 0; j < customerinfos.length; j++) {

		      hdn[j] = document.createElement("input");
		      hdn[j].type = "hidden";
		      hdn[j].name = "receivers";
		      hdn[j].id = "receivers";
		      var val = customerinfos[j];
		      hdn[j].value = val;
	          sdsForm.appendChild(hdn[j]);
	    }


	    document.body.appendChild(sdsForm);

	    self.smsPageOpen(sdsForm);

		document.body.removeChild(sdsForm);	
	}

	self.smsPageOpen = function(sdsForm, smart_dialog){

		var width_1=960;
		var height_1=780;
	    var left=((screen.availWidth-eval(width_1))/2)-5;
	    var top=((screen.availHeight-eval(height_1))/2)-10;
		var url = BASIC_SMS_URL;

		var myWin = window.open("/html/progress.html","popPrlife","width="+width_1+", height="+height_1+", scrollbars=no, left="+left+", top="+top);
		sdsForm.target ="popPrlife";
		sdsForm.method = "post";
		sdsForm.action = url;
		sdsForm.submit();
		myWin.focus();

		if ( smart_dialog != "" )  parent.curex.dialog.close("smart_dialog");
	} 
	
	

	/**
	@functionName    : 
	@param    : 
	@Return : 
	 - 라벨지 출력
	**/
	self.printDM = function(gridTable){
		var userflag = true;
		
		if ( gridTable == null ) {
			userflag = false;
		} else {
			
			var gridData = gridTable.getCheckedRowData();
			if ( gridData.length == 0 ) {
				userflag = false;
			}
		}

	    if( !userflag )
	    {
	        alert('선택된 고객이  없습니다.');
	        return;
	    }
	    

		var input = new DataSet();
		
		for ( i=0; i<gridData.length; i++) {
			CLIENT_ID = gridData[i].get('CLIENT_ID');
			CUSTOMER_ID = gridData[i].get('CUSTOMER_ID');
			if ( CLIENT_ID != "" && CLIENT_ID != null ) 
				input.add("CLIENT_ID", CLIENT_ID);
			if ( CUSTOMER_ID != "" && CUSTOMER_ID != null ) 
				input.add("CUSTOMER_ID", CUSTOMER_ID);
		}

		
		curex.util.submitAjax(null, {
			url : "/main/smartcrm/smartCrmCom/getCustomeInfoList.cmd",
			data : input.getParam(),
			success : function(data){
				setPringDm(data);
			}
		});
	}

	setPringDm = function(data){	
		
		var dataList = data.customerList.resultDataList;

	    
		var height = 280;
		var width = 500;
		
		var winl = (screen.width - width) / 2;
		var wint = (screen.height - height) / 2;

	    var winopts ="scrollbars=no,width="+width+",height="+height+",top="+wint+",left="+winl;

	    var temp2 = '';
	    var notcall=0;

		for (rowi = 0; rowi < dataList.length; rowi++)
		{
			var dataDetail = dataList[rowi];
			
			if ( temp2 != '' ) 
				temp2 += "' , '";
			
			temp2 += dataDetail.CUSTOMER_ID;
			
			if( dataDetail.CREDIT_INFO_AGREE_YN != "Y"   )
				notcall++;
		}
				
		if(notcall > 0)
		{
			if(!confirm("총 "+notcall+"명 고객님이 DM거부고객입니다.(24조)\n제외하고 발송됩니다."))
			{
				return;
			}
		}

		labelDialogOpen("2", temp2);

		
//		var cont = $("#labelLayerFrm").contents()
//		cont.find("#searchType").val("2");
//		cont.find("#searchCondition").val(temp2);

		/*var dmForm = document.createElement("form");
		dmForm.setAttribute("method", "post");
		dmForm.setAttribute("action", "/main/smartcrm/smartCrmCom/prepareDMPrint.cmd?searchType=2");
		dmForm.setAttribute("target", "labelLayerFrm");
		document.body.appendChild(dmForm);
		
		var searchCondition = document.createElement("input");
		searchCondition.setAttribute("type", "hidden");
		searchCondition.setAttribute("name", "searchCondition");
		searchCondition.setAttribute("id", "searchCondition");
		dmForm.appendChild(searchCondition);
		
		dmForm.searchCondition.value = temp2;
		dmForm.submit();*/
		//popWindow.focus();
	}
	
	/*
	 * 라벨 팝업 오픈
	 */
	labelDialogOpen = function (type, cond) {
		
		createSmartLayer();

        var dia = curex.dialog.open({
            id : 'smart_dialog',
            width : 400,
            //height : 400,
            title : 'DM(라벨지) 인쇄',
            modal:true,
            iframeUrl : "/main/smartcrm/smartCrmCom/prepareDMPrint.cmd",
            dom : $('#smart_Layer', wrap),
            ajaxOption : { //일반적인 ajax 옵션들을 여기서 정의할수 있음
                data : {
                	searchType : type,
                	searchCondition : cond
                }
            },
            focus : $(this)
        });
    };
    
	pringDMDialogOpen = function (form) {
		
		curex.dialog.close("smart_dialog");
		
		createSmartLayer();
		
        var dia = curex.dialog.open({
            id : 'smart_dialog',
            width : 800,
            height : 600,
            title : "Life Planning System 2003 - 리스트 인쇄",
            modal:true,
            iframeUrl : "/main/smartcrm/smartCrmCom/printDMOpen.cmd",
            dom : $('#smart_Layer', wrap),
            ajaxOption : { //일반적인 ajax 옵션들을 여기서 정의할수 있음
                data : $(form)
            },
            focus : $(this)
        });
    };	
    

	csStationDialogOpen = function (input) {

		if ( input == null ) {
			input = new DataSet();
		}
		
		curex.dialog.close("smart_dialog");
		
		createSmartLayer();
		
        var dia = curex.dialog.open({
            id : 'smart_dialog',
            width : 1000,
            height : 700,
            title : "CS 스테이션",
            modal:true,
            iframeUrl : "/main/smartcrm/smartCsStation/index.cmd",
            dom : $('#smart_Layer', wrap),
            ajaxOption : { //일반적인 ajax 옵션들을 여기서 정의할수 있음
                data : input
            },
            focus : $(this)
        });
    };	
    
    createSmartLayer = function(){
    	
		if ( $('#smart_Layer', wrap).attr("id") == null ) {
			$("<div id='smart_Layer' class='ci-dialog-content'></div>").appendTo(wrap);
		}
    }

	
	if (!curex) {
		window.curex = curex = {};
	}
	curex.smartcrm = self;
	
})(window.curex);