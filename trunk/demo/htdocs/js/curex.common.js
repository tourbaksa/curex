/*
 * curex 내 공용함수
 *
 * 
 * 삭제 예정!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 *
 * 
 * 

curex.util.js 내 함수 사용하세요.  

=============================================================

getCurrentDateString()  => curex.util.getCurrentDateString()

getDateStringYYYY_MM_DD( YYYYMMDD  ) =>  curex.util.dateFormatter( YYYYMMDD  ,"-" )

verifyDate(   => curex.util.verifyDate(

getChangeInsAgeA(  => curex.util.getChangeInsAgeDate(

getBirthdayFromRSDN(rsdn )  => curex.util.removeDelim( curex.util.birthDateReturn( rsdn ) , "-" );

calcInsuredAgeByRsdn( => curex.util.calcInsuredAgeByRsdn(

calcInsuredAgeByBirthDate( => curex.util.calcInsuredAgeByBirthDate(


 * */



		
//==================================================================
// 날짜 관련 함수 		
//==================================================================

		/**
		 * 현재 날짜 8자리 문자로 리턴	
		 * @author ot020
		 * @since 2014. 3. 26.
		 * @return {string} YYYYMMDD
		 */
		function getCurrentDateString_bak(){

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

		}	
		

		/**
		 * 현재 날짜 8자리 문자를 YYYY-MM-DD  로 반환 	
		 * @author ot020
		 * @since 2014. 3. 31.
		 * @param {string} YYYYMMDD 
		 * @return {string} YYYY-MM-DD
		 */
		function getDateStringYYYY_MM_DD_bak(  yyyymmddDate  ){

			var returnDate = "";		
			returnDate = yyyymmddDate.substr( 0 , 4  ) + "-" +  yyyymmddDate.substr( 4 , 2  ) + "-" +  yyyymmddDate.substr( 6 , 2  ) ;
			return returnDate;

		}	

		
		/**
		 * //'YYYYMMDD" 형식의 날자가 옳바른지 검증(LiPSUtil.verifyDate 메소드와 동일하게 구현)
		 * @author ot020
		 * @since 2014. 3. 26.
		 * @param  {int} year 
		 * @param  {int} month 
		 * @param  {int} day 		  
		 * @return {boolean}
		 */		
		function verifyDate_bak(year, month, day){
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
		} 

		
		
		/**
		 * 상령일을 구하는 함수  (/CuREX_LiPS/src/main/webapp/planning/PlanningFormForAll.jsp) 
		 * @author ot020
		 * @since 2014. 4. 1.
		 * @param  {string} birthday(YYYYMMDD) : 생일 
		 * @return {string} YYYYMMDD 형식 
		 */		
		function getChangeInsAgeA_bak(birthday)
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
		    
		}
		
		
//==================================================================
// 나이 관련 
//==================================================================		
		
		/**
		 * 주민번호로 생일날짜(YYYYMMDD) 구하기 
		 * @author ot020
		 * @since 2014. 3. 26.
		 * @param  {string} rsdn : 주민번호 xxxxxxY 
		 * @return {string} YYYYMMDD 형식
		 */
		function getBirthdayFromRSDN_bak(rsdn){
			var birthday = null;
			var code = 0;

			
			try{
				
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
				
			}
			catch(e){
				birthday = null;
			}

			return birthday;
			
		} 		
				

		
		/**
		 * 기준날짜, 주민번호로 나이 구하기
		 * @author ot020
		 * @since 2014. 3. 26.
		 * @param  {string} appDate : 기준날짜 (YYYYMMDD 형식)
		 * @param  {string} birthDate : 생일날짜 (YYYYMMDD 형식) 
		 * @return {void}
		 */		
		function calcInsuredAgeByRsdn_bak(appDate, residentNo){
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
		}
		
	
		
		/**
		 * 기준날짜 , 생일 날짜로 나이 구하기
		 * @author ot020
		 * @since 2014. 3. 26.
		 * @param  {string} appDate : 기준날짜 (YYYYMMDD 형식)
		 * @param  {string} birthDate : 생일날짜 (YYYYMMDD 형식) 
		 * @return {void}
		 */
		function calcInsuredAgeByBirthDate_Bak(appDate, birthDate){
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
		}
				

		function changeNumberToDate_bak(obj, data)
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
					data = dYear + ".";
				}
			} else if( data.length > 4 && data.length < 6){
				if(data.substring(4,5)>1){
					data = dYear + "-" + "0" + data.substring(4,5);
				} else{
					data = dYear + "-" + dMonth;
				}
			} else if( data.length == 6){

				//백스페이스 처리
				if(event.keyCode == 8){
					data = dYear + "-" + dMonth;
				} else{
					data = dYear + "-" + dMonth + "-";
				}

				if( data.substring(5,7) > 12 || data.substring(5,7) < 0){
					alert("'월'에는 1부터 12까지의 숫자를 넣어 주세요.");
					data = dYear + "-";
					obj.focus();
					return 0;
				}
			} else if( data.length > 6 && data.length <= 8){

				data = dYear + "-" + dMonth + "-" + dDay;
				
				// 생년에 따른 월과 일이 범위안에 있는가 체크한다.(윤년 확인)
				if((dMonth== 1 || dMonth==3 || dMonth==5 || dMonth==7 || dMonth==8 || dMonth==10 || dMonth==12) && dDay>31){
					alert("잘못된 날짜입력입니다.");
					data = dYear + "-" + data.substring(5,7) + "-";
					obj.focus();
					return 0;
				} else if ((dMonth==4 || dMonth==6 || dMonth==9 || dMonth==11) && dDay>30){
					alert("잘못된 날짜입력입니다.");
					data = dYear + "-" + data.substring(5,7) + "-";
					obj.focus();
					return 0;
				} else if (dMonth==2){
					if((((dYear % 4)==0) && ((dYear % 100)!=0) || (dYear==0)) && dDay>29){
						alert("잘못된 날짜입력입니다.");
						data = dYear + "-" + data.substring(5,7) + "-";
						obj.focus();
						return 0;
					} else if(!(((dYear % 4)==0) || (dYear==0)) && dDay>28){
						alert("잘못된 날짜입력입니다.");
						data = dYear + "-" + data.substring(5,7) + "-";
						obj.focus();
						return 0;
					}
				}
			} 
			obj.val(data);
			return 1;
		}
		
