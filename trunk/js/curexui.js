/*
	임순옥
*/

$(document).ready(function(){
	if($("div#checkList").length){curexFront.checkList();}
	if($("div.tab02").length){curexFront.tab();}
	curexFront.rolling();
	curexFront.event();
});

var curexFront ={};

curexFront = {

	init:function(scope){
		this.op = scope;
	},

	event:function(){
		var scope = this.op
			, $previousBtn = $("div.previous .ImgArrow", scope).parent() //기계약합산 잔여한도 조회버튼
			, $InfoWriteBtn =$("table a.InfoWbtn", scope) //테이블정보입력 버튼
			, $Delbtn = $("a.cellDel", scope) || $("a.cellDel")  //테이블 셀삭제버튼
			, $cinsrtbtn = $("a.cellInsert", scope) || $("a.cellInsert")//주계약/특약 특약피버험자 추가버튼
			, $bePointBtn = $("a.bePoint", scope) || $("a.bePoint") //산출기준 팝업
			, $spClose = $("a.spClose", scope) || $("a.spClose"); //산출기준 팝업 닫기
		
			/* 기계약 합산잔여한도 */
			$previousBtn.off().on({
				click : function(){
					var $ele = $(this).find("span") 
						, $visibleObj = $("div.preSearch");

					if(!$visibleObj.length){return false;}
					if(!$ele.hasClass("up")){ $ele.addClass("up"); $visibleObj.slideDown(200);}
					else{$ele.removeClass("up"); $visibleObj.slideUp(100);}
					return false;
				}
			});

			/* 테이블 정보입력 */
			$InfoWriteBtn.each(function(){
				$(this).off().on({
					click : function(){
						var $objTable = $(this).closest("table")
							, $btnIdx = $objTable.find(".btn span.txtArrow").parent().index($(this)) //내가 클릭한버튼이 현재 테이블에서 몇붠쮀?
							, $objTd = $objTable.find("tr.view").eq($btnIdx).children()
							, $ele = $(this).find("span");

						if (!$objTd.find("div.conTable").length){return false;} //테이블안에 입력테이블이 없으면 아무동작하지않음
						if(!$ele.hasClass("up")){
							$ele.addClass("up"); $objTd.slideDown(300);
						}else{$ele.removeClass("up");$objTd.slideUp(0);}
						return false;
					}
				});
			});

			/* 테이블 셀삭제 버튼 */
			$Delbtn.each(function(){
				$(this).off().on({
					click:function(){
						$(this).closest("tr").remove();
						return false;
					}
				});
			});

			/* 주계약&특약 추가버튼 */
			$cinsrtbtn.each(function(){
				$(this).off().on({
					click:function(){
						var $riderCont = $("div.riderPlus",scope) ||$("div.riderPlus")
							, old = $riderCont.find(".clone").length
							, newc = old + 1
							, cloned = $riderCont.find("tr").eq(0).clone().addClass("clone");

						if($riderCont.is(":hidden")){$riderCont.css({"display":"block"});}
						if(!$riderCont.find("tr").hasClass("clone")){$riderCont.find("tr").remove();}
						$riderCont.find("table tbody").append(cloned);
						return false;
					}
				});
			});


		/* 산출기준레이어팝업 */
		function standard(){
			var flag ,
				  stObj = $("div.smartPicWrap"),
				  stObj_hw = stObj.height()/2,
				  stObj_y = stObj.position().top

			$spClose.off().on({
				click:function(){
					var popObj = $("div.spBox").find("div.compLayer");
					popObj.css({"display" : "none"})
					return false;
				}
			});

			$bePointBtn.each(function(idx){
				$(this).off().on({
					click:function(e){
						var spBox = $(this).closest("div.spBox"),
							  popObjLayer = spBox.find("div.compLayer"),
							  spBoxy = spBox.position().top,
							  posy= spBoxy- stObj_y;

						if (posy > stObj_hw){
							stObj.animate({
								scrollTop : spBoxy
							},"fast");
						}

						$("div.spBox").eq(flag).find("div.compLayer").css({"display" : "none"});
						popObjLayer.css({"display" : "block"})

						flag = idx;
						return false;
					}
				});
			});
		}
		standard();


	},


	tab:function(){
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

	rolling:function(){
		var scope = this.op
			, $bnrWrap = $("div.spbnrZone", scope) || $("div.spbnrZone")
			, $btn = $bnrWrap.find("span.bntCtrl button")
			, $bnrCont = $bnrWrap.find("div.bnrList")
			, $bnrItem = $bnrCont.find("img")
			, $bnrLeng = $bnrItem.length
			, $bnrW = 242
			, $flag = 0
			, $idx
			, $timer = null
			, isAnimating = 'no';


			//$bnrCont.wrap("<div class='slideWrap'></div>")
			$bnrCont.width($bnrW * $bnrLeng);

			$bnrItem.each(function(i){
				$(this).css({
					position:"absolute",
						left:"0",
						top:"0",
						display:i==0 ? "block" : "none"
				});
			});

			$btn.each(function(){
				$(this).off().on({
					click:function(){
						var $idx = $(this).index();
						move($idx);
						$flag = $idx;
						return false;
					}
				});
			});

			function next(){move(($flag+1) % $bnrLeng);}
			function move($idx){
				if($idx == $flag) return;
				if(isAnimating == 'no'){
					isAnimating = 'yes'
					window.clearTimeout($timer); 
					$bnrItem.eq($flag).show().css({"left": 0}).animate({
						"left" : -$bnrW
					},"slow", function(){
						$(this).hide();
						if ($timer) { start(); }
						isAnimating = 'no'
					});

					$bnrItem.eq($idx).show().css({
						"left": $bnrW
					}).animate({
						"left" : 0
					},"slow", function(){
						isAnimating = 'no'
					});
				}

				if ($btn) {
					$btn.eq($flag).removeClass("on");
					$btn.eq($idx).addClass("on");
				}
				$flag = $idx;
			}

			function start(){
				stop();
				$timer = window.setTimeout(next, 2000)
			}
			
			function stop(){
				window.clearTimeout($timer);
				$timer = null;
			}
			start();
	},

	checkList:function(){
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
	},


}

