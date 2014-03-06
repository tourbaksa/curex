/*
	임순옥
*/
$(document).ready(function(){
	curexFront.checkList();
});

var curexFront = {};

curexFront.checkList = function(){
	var $obj = $("#checkList")
		, detached = false
		, footerHeight = $("#footer").height()

	$(window).scroll( checkOffset );
	$(window).load( checkOffset ); //로드될때 스크롤길이 췌퀫!
	
	function checkOffset(){
		var scrollBottom = $(document).height() - $(window).height() - $(window).scrollTop();
		if(scrollBottom >= footerHeight){
			if(!detached){detached = true; $obj.addClass("fixed");}
		}else{
			if(detached){detached = false; $obj.removeClass("fixed");}
		}
	}
}