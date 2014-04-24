//일자 포맷.
function dateFormat(val,delim,obj){	
	if(delim == '' || delim == null || delim === undefined){		
		delim = '';
	}else if(typeof delim == 'object'){		
		obj = delim;
		delim = '';
	}	
	
	if(val != '' && val !== undefined && val != null){
		if(val.length == 8){
			return val.substring(0,4)+delim+val.substring(4,6)+delim+val.substring(6,8);
		}else{
			return val;	
		}			
	}else{
		return val;
	}	
}
//e-mail 도메인 선택.
function setEmail(val,obj){	
	if(val != '' && val != null & val !== undefined){
		if(val.indexOf('@') > -1){
			var domain = val.split('@');
			if(domain.length == 2){
				return domain[0];
			}
		}
	}	
}

//e-mail 도메인 선택.
function setEmailDomain(val,obj){	
	if(val != '' && val != null & val !== undefined){
		if(val.indexOf('@') > -1){
			var domain = val.split('@');
			if(domain.length == 2){				
				$(obj).find('option[value="'+domain[1]+'"]').attr('selected','selected');		
			}
		}
		
		
				
	}	
}
//성별명 가져오기
function getGender(val,obj){
	var gender = val;
	if("M" == val){
		gender = "남";
	}else if("F" == val){
		gender = "여";
	}
	
	return gender;
}
//select box option 선택
function setSelectBox(val,obj){
	
}
//radio 선택
function setRadio(val,obj){
	
}

//checkbox 선택
function setCheckBox(val, obj){
	
}

//click event
function setClickEvent(val, str, obj) {
	$(obj).on('click',function(){
		eval(str);
	});	
}


/*
 * set Image
 * var = img 명
 * str = 경로
 */ 

function setImage(val, str, obj) {
	
	if ( str == null )  str = "";
	$(obj).append("<img src='"+str+val+"'> ");
}

