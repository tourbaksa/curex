/*
	임순옥
*/

if(!window.curex){
	window.curex = curex = {};
}

curex.ui = {
	init:function(scope){
		this.op = scope;
	},
	event:function(){
		var scope = this.op
			, $previousBtn = $("div.previous .ImgArrow", scope).parent() //기계약합산 잔여한도 조회버튼
			, $InfoWriteBtn =$("table .InfoWbtn", scope) //테이블정보입력 버튼
			, $Delbtn = $(".cellDel", scope) || $(".cellDel")  //테이블 셀삭제버튼
			, $cinsrtbtn = $(".cellInsert", scope) || $(".cellInsert")//주계약/특약 특약피버험자 추가버튼
			, $tooltip = $(".tooltip", scope) || $(".bubbleLnk") // thankyou Call 말풍선
			, $fieldOpen = $(".fieldOpen", scope) || $(".fieldOpen") // 검색필드선택
			, $btnReview  = $(".btnReview ", scope) || $(".btnReview "); // 보장리뷰레이어

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

			/* 툴팁 */
			$tooltip.each(function(idx){
				if ($(this).hasClass("over")){
					$(this).off().on({
						mouseover:function(){
							$(".bubble").css("display","none");
							if ( idx == $tooltip.length -1){
								$(this).parents().find(".bubble").eq(idx).css({
									"display":"block",
									"left" : -10,
								});
								$(this).parents().find(".bubble .arr").eq(idx).css({
									"left" : 50
								});
							}
							$(this).parents().find(".bubble").eq(idx).css({
								"display":"block" 
							});
						},
						mouseleave:function(){
							$(".bubble").css("display","none");
						},
						click:function(){
							return false;
						}
					});
				}else{
					$(this).off().on({
						click:function(){
							$(".bubble").css("display","none");
							$(this).parents().find(".bubble").eq(idx).css({
								"display":"block" 
							});
							return false;
						}
					});
				}
			});

			$fieldOpen.each(function(){
				$(this).off().on({
					click:function(){
						var $fieldLayer = $(".searchField", scope);
						$fieldLayer.css({"display" : "none"});
						if($fieldLayer.is(":hidden")){
							$fieldLayer.css({"display" : "block"});
						}
					}
				});
			});

			$(".fieldClose").click(function(){
				$(".searchField", scope).css({"display" : "none"});
			});

			$btnReview.each(function(idx){
				$btnReview.addClass("close");
				$(this).off().on({
					click:function(){
						if($(this).hasClass("close")){
							$btnReview.addClass("close");
							$(".ReviewWrap", scope).hide();
							$(this).removeClass("close");
							$(".ReviewWrap", scope).eq(idx).show();
						}
						return false;
					}
				});
			});
			/* lips 세일즈메테리얼 */
			var sales = function(obj){
				var $obj = $(obj)
					, $btn = $obj.find(".smWtRb")
					, $objLayer = $obj.find(".salesListBox")

				$btn.off().on({
					click:function(){
						var $span = $(this).find("span");
						if ($span.hasClass("up")){
							$objLayer.stop(true, true).slideUp();
							$span.removeClass("up");
							$span.addClass("down");
							if($(this).find(".txt").text() == "닫기"){
								$(this).find(".txt").text("열기")
							}
						}else{
							$objLayer.stop(true, true).slideDown();
							$span.removeClass("down");
							$span.addClass("up");
							if($(this).find(".txt").text() == "열기"){
								$(this).find(".txt").text("닫기")
							}
						}
						return false;
					}
				});
			}
			sales(".salesListWrap");
	},

		/* 산출기준레이어팝업 */
	standard:function(){
		var scope = this.op
			, $bePointBtn = $(".calcStandard", scope) || $(".calcStandard") //산출기준 팝업
			, $spClose = $(".spClose", scope) || $(".spClose") //산출기준 팝업 닫기
			, stObj = $("div.smartPicWrap")
			, stObj_hw = stObj.height()/2 // 전체컨텐츠 높이 /2
			, stObj_y = stObj.position().top // 현재 컨텐츠가 window에서 떨어진 top길이

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
					standent(this);
				}
			});
		});

	function standent(ev, idx){
		var $this = $(ev),
			  spBox = $this.parent("div.spBox"),
			  popObjLayer = spBox.find("div.compLayer"),
			  spBoxy = spBox.position().top, 
			  posy= spBoxy- stObj_y; // 레이어를 담고있는 spBox의 top위치
			if (posy > stObj_hw){ //현재 클릭한 박스를 담고있는 컨텐츠 위치값이 컨텐츠높이반값보다 크면 박스가 위로뜸.
				$(".btmArrow").remove();
				popObjLayer.append("<span class='btmArrow' />")
				popObjLayer.removeClass("bottom")
				popObjLayer.addClass("bottom")
				popObjLayer.css({"display" : "block" });
				$(".btmArrow").css({"display" : "block"});
			}
			$("div.spBox").find("div.compLayer").css({"display" : "none"});
			popObjLayer.css({"display" : "block"})
			return false;
		}
	},
	tab:function(){
		var scope = this.op
		/* 설계페이지 좌측 탭 */
		function notice(){
		var $tabObj = $("div.tab02", scope)
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
		}
		notice();
		/* 가입설계 탭스타일 적용 */
		$(".planTab a").each(function(){
			if($(this).hasClass("type2")){
				$(this).closest(".planTab").addClass("type2");
			}
			$(this).off().on({
				click:function(){
				
					if($(this).hasClass("type2")){
						$(this).closest(".planTab").removeClass("type2");
						$(this).closest(".planTab").addClass("type2");
					}else{
						$(this).closest(".planTab").removeClass("type2");
					}
				}
			});
		});
	},
	rolling:function(){
		var scope = this.op
		/* smartcrm 스마트픽 롤링 */
		var smartRolling = function(obj){ 
				var $bnrWrap = $(obj)
				, $btn = $bnrWrap.find(".bntCtrl button")
				, $bnrCont = $bnrWrap.find("div.bnrList")
				, $bnrItem = $bnrCont.find("a")
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
		}
		smartRolling(".spbnrZone");

		$.fn.salesSlide = function(options){
			var defaults = {
				prev : ".prev",
				next : ".next"
			}
			options = $.extend(defaults, options);
			return this.each(function(i){
				var o = options
					, $obj = $(this)
					, $btn = $(o.btn, $obj)
					, $prev = $(o.prev, $obj)
					, $next = $(o.next, $obj)
					, $slideWrap = $(".slideList", $obj) // 슬라이드할 컨텐츠
					, $item = $(".slideList", $obj).children()
					, $thumbLink= $(".item", $obj).find("a")
					, widthx = $item.outerWidth(true) // 리스트 가로사이즈
					, isAnimating = 'no'
					, direction
					, oldIdx = 0
					, newIdx = 0;

				$item.each(function(idx){
					$(this).css({
						position:"absolute",
							left:"0",
							top:"0",
							display:idx==0 ? "block" : "none"
					});
				});

				$prev.click( btnClick );
				$next.click( btnClick );

				function btnClick(){
					if($(this).attr("class") == "next"){
						direction = "next"; 
						newIdx++ ;
					}else{
						direction = "prev";
						newIdx--;
					}
					newIdx = newIdx === -1 ? $item.size()-1 : newIdx % $item.size();
					move(newIdx)
					showNum(newIdx)
					oldIdx = newIdx;
					return false;
				}

				$thumbLink.each(function(idx){
					$(this).off().on({
						click:function(){
							var newIdx = $thumbLink.index(this);
							showNum(newIdx);
							move(newIdx);
							oldIdx = newIdx;
							return false;
						}
					});
				});

				function showNum(newIdx){
					$(".itemLeng").find("span").text(newIdx+1)
				}
				function move(newIdx){
					if(newIdx == oldIdx) return;
					if(isAnimating == 'no'){
						isAnimating = 'yes'
						if (direction === "next"){
							$item.eq(oldIdx).show().css({"left": 0}).animate({
							"left" : -widthx
							},"normal", function(){
								$(this).hide();
								isAnimating = 'no'
							});

							$item.eq(newIdx).show().css({
								"left": widthx
								}).animate({
									"left" : 0
								},"normal", function(){
									isAnimating = 'no'
							});
						}else{
							$item.eq(oldIdx).show().css({"left": 0}).animate({
							"left" : widthx
							},"normal", function(){
								$(this).hide();
								isAnimating = 'no'
							});

							$item.eq(newIdx).show().css({
								"left": -widthx
								}).animate({
									"left" : 0
								},"normal", function(){
									isAnimating = 'no'
							});

						}
						
					}
				}
			});
		}
		$(".viewWrap").salesSlide();
	},
	checkList:function(){
		var checkList = function(obj){
			var $obj = $(obj)
				, ani = false
				, timer = null
				, footerHeight = $("#footer").height()

			$obj.parents("#wrap").addClass("checkList");
			function checkOffset(){
				var scrollBottom = $(document).height() - $(window).height() - $(window).scrollTop();
				if(scrollBottom >= footerHeight){
					if(!ani){ani = true; $obj.addClass("fixed"); }
				}else{
					if(ani){ani = false; $obj.removeClass("fixed");}
				}
			}

			$(window).unbind("scroll", checkOffset );
			$(window).bind( "scroll", checkOffset  );
			$(window).load( checkOffset ); //로드될때 
			/*$(window).on("resize",function(){
				clearTimeout(timer);
				timer = setTimeout(checkOffset , 300); 
			});*/

			if ($(".h2List").length){
				var _this = $(".h2List")
					, $btn = _this.find("a")
					, $close = $obj.find(".enter")
					, $listMenu = $obj.find(".listMenu").height()
					, flag = 0;
				
				$obj.wrapInner("<div class='checkInner' />")
				$close.click(function(){
					$($btn.eq(flag).attr("href")).dialog( "close" );
				});
				$btn.each(function(idx){
					$(this).off().on({
						click:function(e){
						var layer = $($btn.eq(idx).attr("href"))
							layer.dialog({
									appendTo: ".checkInner",
									autoOpen: false,
									resizable: false,
									closeOnEscape: false,
									width:1024,
									modal: true,
							});
							$(".ui-dialog-titlebar").hide()
							layer.dialog({dialogClass:'checkPopMenu'});
							layer.dialog("open");
							flag = idx;
							return false;
						}
					});
				});
			}

		}
		if($("#checkList").length){checkList("#checkList");}
	},

	/*큐렉스 탭역역 1tab, 2tab까지만 구현 */
	curexTab:function(){
		var scope = this.op
		$.fn.attab = function(options){
			var defaults = {
				display : "block"
			}
			var opts = $.extend(defaults, options);

			return this.each(function(){
				var $obj = $(this)
				, $active
				, $content
				, $links = $obj.find("a");
				if(!$links.parent().hasClass("active")){
					$active = $($links.filter('[href="'+location.hash+'"]')[0] || $links[0]);
				}else{
					$active = $($obj.find("li.active a"));
				}
				$content = $($active[0].hash, scope);
				
				if(opts.display == "block"){
					$links.not($active).each(function () {
						$($(this).attr('href'),scope).hide();
					});
				}else{
					$links.each(function () {
						$($(this).attr('href'),scope).hide();
					});
				}

				// 이벤트
				$obj.find("a").off().on({
					click:function(e){
						
					$active.parent().removeClass('active');
					$content.hide();

					$active = $(this);
					$content = $(this.hash);

					$active.parent().addClass('active');
					$content.show();
					e.preventDefault();
					}
				});
			});
		}
		$(".attab",scope).attab();
		$(".atsubtab",scope).attab();
	},

	/*큐렉스 라디오버튼탭 */
	RdTab:function(){
		var scope = this.op

		$.fn.Rdtab = function(){
			return this.each(function(){
				var $objWrap = $(this)	
				, $obj = $(".RdTab",$objWrap)
				, $radio = $obj.find("input[type='radio']")
				, $radioCnt = $("[class*='RdTabCont']", $objWrap)
				$radio.eq(0).prop('checked', true);
				$radioCnt.hide();
				$radioCnt.eq(0).show();
				$radio.each(function(idx){
					$(this).change(function(){
						var nidx = idx +1;
						$radioCnt.hide()
						if ($(".RdTabCont"+ nidx).is(":hidden")){
							$(".RdTabCont"+ nidx).show();
						}
						return false;
					});
				});
			});
		}
		$(".RdWrap",scope).Rdtab();
	},

	inputWidth:function(){
		var $obj = $(".entry")
			 ,$input =$obj.find("input[type='text']")
			 ,$dsize = $input.attr("size")
			 ,$dwidth = $input.outerWidth()
			 ,$ewidth = "200px";

		$input.val("계획명을 입력하세요.");
		$input.focus(function(){ this.value = "";}); /*blur(function(){this.value = "계획명을 입력하세요."; $(this).outerWidth($dwidth);});*/

		$input.focus(function(){
			$(this).val(function() {
				$(this).val('');
			});
			$(this).animate({
				width: $ewidth
			}, 400 )
		}); 
	},

	/* 니드분석 */
	nidFun:function(){
		var scope = this.op
		function household(){
			var $obj = $(".importWrap ", scope)
				 ,$revise = $(".revise", $obj)
				 ,$reviseWrap = $revise.closest(".importForm").parent("div[class*='import']");

			$reviseWrap.hide();
			$reviseWrap.eq(0).show();
			$revise.each(function(idx){
				$(this).off().on({
					click:function(){
						$reviseWrap.show();
						$(this).closest(".importForm").parent(".import"+(idx+1)).hide();
					}
				})
			});
			
		}
		household();

		$.fn.fundAni = function(){
			return this.each(function(){
				var _this = $(this)
					, $obj = _this.find(".nizWrap")
					, $nizDown = $obj.find(".nizDown")
					, $nizDbtn = $obj.find(".nizTit .btn")
					, $nizCont = $obj.find(".nizLayer")
					, $nizCtar = $obj.find(".nizContainer")
					, $nizTitarr = $obj.find(".nizTit")
					, $nizClose = $obj.find(".close")
					, posx = /*$obj.outerWidth()*/269
					, $flag = 0
					, paddingbtm;

				/* arrow */
				$nizDown.each(function(idx){
					$(this).off().on({
						click:function(){
							if($(this).find(".ImgArrow").hasClass("up")){
								$(this).find(".ImgArrow").removeClass("up");
								$nizCtar.eq(idx).slideDown();
								$nizClose.eq($flag).click();
							}else{
								$(this).find(".ImgArrow").addClass("up");
								$nizCtar.eq(idx).slideUp();
								$nizClose.eq($flag).click();
							}
							return false;
						}
					});
				});

				$nizDbtn.each(function(i){
					$(this).off().on({
						click:function(){
							var nizTit = $(this).parent(".nizTit");
							if(!nizTit.hasClass("slideOver")){
								nizTit.addClass("slideOver")
								nizAct(nizTit, i)
								if (i != $flag){
									var old = $nizDbtn.eq($flag).parent(".nizTit");
									nizBisic(old);
								}
							}
							$flag = i;
							return false;
						}
					});
				});

				$nizClose.each(function(){
					$(this).off().on({
						click:function(){
							var old = $nizDbtn.eq($flag).parent(".nizTit");
							nizBisic(old)
							return false;
						}
					});
				});
				function nizAct(e , index){
					var layer = e.parent(".nizCont").find(".detailView");
					var $btny = $nizDbtn.eq(index).parent().offset().top
					var $_thisy = _this.offset().top
					var $currenty =((_this.height()+_this.find(".btnWrap").outerHeight()) - ($btny - $_thisy));
					var LayerH = layer.outerHeight();
					var $resty = (LayerH - $currenty) + 20 ;
					e.animate({
							"background-color" : "#00B7E6" ,
							"color" : "#fff"
						},"fast", function(){
							$(this).find("h5").append("<span> &gt;</span>");
							$(this).find("span[class*='sbx']").hide();
							$(this).find(".btn ").hide();
						}
					);
					if (0< $resty ){
						_this.animate({
							"padding-bottom" : $resty
						});
						paddingbtm = $resty ;
					}
					layer.show("slide",{direction:"left"},500, function(){
						/*$('html, body').animate({
							scrollTop: $(this).offset().top
						}, 400);*/
					});
				}
				function nizBisic(e){
					e.removeClass("slideOver")
					e.animate({
							"background-color" : "#F5F5F5" ,
							"color" : "#707070"
						},"fast", function(){
							$(this).find("h5 span").remove();
							$(this).find("span[class*='sbx']").show();
							$(this).find(".btn ").show();
						}
					);
					e.parent(".nizCont").find(".detailView").hide("slide",{direction:"left"},500, function(){
							if (parseInt(_this.css("padding-bottom")) == paddingbtm){
								_this.animate({
									"padding-bottom" : 0
								},400);
							}
					});
				}
			});
		}
		$(".mainTabZone .left", scope).fundAni();
	},
	quick:function(){
		var scope = this.op
			, $quickbar = $("#quick" , scope) || $("#quick")
			, $window = $(window)
			, offset = $quickbar.offset()
			, $quickBtn = $quickbar.find(".quickBtn")
			, $quickList = $quickbar.find("ul")
			, top = 15 ;

		$window.load(function(){ mainSize() });
		$window.resize(function(){mainSize() }).resize();
		function mainSize(){
			var width = parseInt($(this).width());
			if(width <= 1024){
				$quickbar.css({
					"right" : 0
				});
			}else{
				$quickbar.css({
					"right" : -70
				});
			}
		}
		$window.scroll(function() {
			if ($window.scrollTop() > offset.top) {
				$quickbar.stop().animate({
					marginTop: $window.scrollTop() - offset.top + top
				});
			} else {
				$quickbar.stop().animate({
					marginTop: 0
				});
			}
		});
		$quickList.css({
			"margin-top" : -$quickList.height()
		});
		$quickBtn.off().on({
			click:function(){
				if(!$(this).hasClass("down")){
					$(this).addClass("down");
					$quickList.animate({
						"margin-top" : 0
					});
				}else{
					$(this).removeClass("down");
					$quickList.animate({
						"margin-top" : -$quickList.height()
					});
				}
				return false;
			}
		});
	},

	/* 제어판 */
	control:function(){
		if (!$(".ctrlMenu").length){return false;}
		var ctrlMenu = function(menu){
			var $ctrlMenu = $(menu)
				, $ctrlMenulist = $ctrlMenu.find("ul")
				, $selector = $ctrlMenu.find("> ul > li > a")
				, flag;
			$selector.each(function(idx){
				$(this).off().on({
					click:function(){
						if (!$(this).hasClass("active")){
							$selector.removeClass();
							$(this).addClass("active");
							$selector.eq(flag).next().slideUp(500);
							$(this).next("ul").slideDown(500);
						}else{
							$selector.removeClass();
							$(this).next("ul").slideUp(500)
						}
						flag = idx;
						return false;
					}
				});
			});
		}
		ctrlMenu(".ctrlMenu");
		var coverList = function(cover){
			var $cover = $(cover)
				, $hover = $cover.find("a")
			$hover.each(function(){
				$(this).off().on({
					mouseover:function(){
						$cover.find("dl").removeClass("hover");
						$(this).parents("dl").addClass("hover");
					},
					mouseleave:function(){
						$cover.find("dl").removeClass("hover");
					},
					click:function(){
						$cover.find("dl").removeClass("select");
						$(this).parents("dl").addClass("select");
						return false;
					}
				});
			});
		}
		coverList(".coverList");
	},

}

$(document).ready(function(){
	curex.ui.checkList();
	curex.ui.rolling();
	curex.ui.event();
//	if($("div.smartPicWrap").length){curex.ui.standard();} 페이지에서 직접호출
	curex.ui.tab();
	curex.ui.curexTab();
	curex.ui.RdTab();
	curex.ui.nidFun(); //니드분석
	if($(".entry ").length){curex.ui.inputWidth();}// input width
	if($("#quick").length){curex.ui.quick();}// 퀵메뉴
	curex.ui.control(); //제어판메뉴

});


