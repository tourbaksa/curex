/*
	임순옥
*/

$(document).ready(function(){
	if($("#checkList").length){curexFront.checkList();}
	if($("div.tab02").length){curexFront.data.dataTab();}
	curexFront.data.celldel();
	curexFront.data.toggle();
});

var curexFront ={};

curexFront.checkList = function(){
	var $obj = $("#checkList")
		, detached = false
		, footerHeight = $("#footer").height()

	$(window).scroll( checkOffset );
	$(window).load( checkOffset ); //로드될때 스크롤길이 췌퀫!
	$(window).resize( checkOffset ).resize(); //리사이즈될때 스크롤길이 췌퀫!
	
	function checkOffset(){
		var scrollBottom = $(document).height() - $(window).height() - $(window).scrollTop();
		if(scrollBottom >= footerHeight){
			if(!detached){detached = true; $obj.addClass("fixed");}
		}else{
			if(detached){detached = false; $obj.removeClass("fixed");}
		}
	}
}

/* case1 - TAB컨텐츠아래에 버튼과 TAB이 있을때 */
curexFront.data = {

	init:function(scope){
		this.op = scope;
	},

	toggle:function(){
		var scope = this.op;
		$(".btn", scope).off().on({
			click:function(){
				var $this = $(this)
					, $span = $(this).find("span");
			console.log($this)
				planSum($span);
				InfoWrite($this, $span);
				return false;
			}
		});
		/* 가입설계 - 기계약합산*/
		var planSum = function($ele){
			var $visibleObj = $("div.preSearch");
			if(!$visibleObj.length){return false;}
			if(!$ele.hasClass("up")){ $ele.addClass("up"); $visibleObj.slideDown(200);}
			else{$ele.removeClass("up"); $visibleObj.slideUp(100);}
		}
		/* 청약정보 정보입력 */
		var InfoWrite = function($this, $ele){
			var $objTable = $this.closest("table")
				, $btnIdx = $objTable.find(".btn span.txtArrow").parent().index($this) //내가 클릭한버튼이 현재 테이블에서 몇붠쮀?
				, $objTd = $objTable.find("tr.view").eq($btnIdx).children();

			if(!$objTable.length){return false;}
			if(!$ele.hasClass("up")){ $ele.addClass("up"); $objTd.slideDown(300);}
			else{$ele.removeClass("up");$objTd.slideUp(0);}
		}
	},

	dataTab:function(){
		var scope = this.op
			 , $tabObj = $("div.tab02", scope)
			 , $tabBtn = $tabObj.find("h3 a")
			 , $tabCnt = $tabObj.find("div[id*='tabDiv']")
			$tabBtn.each(function(){
				$(this).off().on({
					click:function(){
						var idx = $tabBtn.index($(this));
						$tabCnt.css({"display": "none"});
						$tabCnt.eq(idx).css({"display": "block"}); 
						$tabBtn.removeClass("on");
						$(this).addClass("on");
						return false;
					}
				});
			});
	},

	celldel:function(){
		var scope = this.op 
		, $Delbtn = $("a.cellDel", scope);
		$Delbtn.each(function(){
			$(this).off().on({
				click:function(){
					$(this).closest("tr").remove();
					return false;
				}
			});
		});
	
	}


}

