/**
 * floating bar button 제어
 */

(function(curex) {
	var self = {};			
	
	/**
	@functionName    : init
	@param    : 
	@Return : 
	 - 화면 별 floating bar 제어.
	**/
	self.init = function(option){		
		var floating = $('#checkList');		
		if(floating.length > 0){
			floating.remove();
		}
		
		$('#wrap').addClass('checkList');

		var divWrap = $('<div id="checkList"></div>');			
		var listOpen = $('<h2><a href="#listMenu">CHECKLIST</a></h2>');
		var listDiv = $('<div class="listMenu" id="listMenu" style="display:none"><h3>CHECK LIST <span class="red">*보험료 계산을 다시 하신 후 재확인해주세요</span></h3></div>');
		var listView = $('<ul class="view"></ul><a href="#none" class="enter">확인</a>');
		var btnListUl = $('<ul class="list"></ul>');
		var leftBtnListUl = $('<ul class="h2List"></ul>');
	
		if(option.checkListBtn == false){
			divWrap.append(leftBtnListUl);
			divWrap.append(btnListUl);
		}else{
			divWrap.append(listOpen);
			divWrap.append(leftBtnListUl);
			divWrap.append(btnListUl);
			listDiv.append(listView);
			divWrap.append(listDiv);	

			listOpen.on('click',function(e){
				e.preventDefault();
				listDiv.removeClass('opened');
				if(listDiv.css('display') == 'none'){					
					listDiv.css('bottom',  -(listDiv.height()+40));
					listDiv.show();
					listDiv.addClass('opened', 700, 'easeOutQuint', function() {
					});
				}else{							
					listDiv.animate({
			               bottom : - ($(this).height()+40)
			        },500,function(){        	   
			        	   $(this).hide();
			        });
				}			
			});
		}										

		$('#wrap').append(divWrap);
		floating = divWrap;
		
		//var listMenu = $('#listMenu', floating);
		//listMenu.hide();
		//var list_h3 = $('> h3 > span', listMenu);
		//list_h3.html('');
		var leftUl = $('> ul.h2List', floating);			
		leftUl.empty();		
		if(option.leftBtnList){			
			for(var i=0; i<option.leftBtnList.length; i++){
				var li = $('<li><a href="#'+option.leftBtnList[i].btnId+'">'+option.leftBtnList[i].button+'</a></li>');
				li.attr('data-btnId',option.leftBtnList[i].btnId);
				//활성화
				if(option.leftBtnList[i].active == true){
					var aTag = $(' > a', li);
					aTag.addClass('on');

					if(option.leftBtnList[i].btnClass){
						aTag.addClass(option.leftBtnList[i].btnClass);
					}	
					
					if(option.leftBtnList[i].viewDiv){
						aTag.bind("click", function(){
							curex.floatingBar.oepnLeftLayer($(this).data('viewDiv'));							
						});
					}
					if(option.leftBtnList[i].click){
						aTag.bind("click", option.leftBtnList[i].click);
					}
					
				}else{
					var aTag = $(' > a', li);
					aTag.css('cursor','default');

					if(option.leftBtnList[i].btnClass){
						aTag.addClass(option.leftBtnList[i].btnClass);
					}
				}
				
				if(option.leftBtnList[i].visible !== undefined && option.leftBtnList[i].visible == false){
					li.hide();					
				}
				//호출 function 세팅.
				if(option.leftBtnList[i].viewDiv){
					aTag.data('viewDiv',option.leftBtnList[i].viewDiv);	
				}
				if(option.leftBtnList[i].click){
					aTag.data('func',option.leftBtnList[i].click);
				}
				leftUl.append(li);
			}			
		}

		var ul = $('> ul.list', floating);			
		ul.empty();		
		if(option.btnList){
			for(var i=0; i<option.btnList.length; i++){				
				var li = $('<li><a href="#none">'+option.btnList[i].button+'</a></li>');
				li.attr('data-btnId',option.btnList[i].btnId);
				//활성화
				if(option.btnList[i].active == true){
					var aTag = $(' > a', li);
					aTag.addClass('on');

					if(option.btnList[i].btnClass){
						aTag.addClass(option.btnList[i].btnClass);
					}
					
					if(option.btnList[i].viewDiv){
						aTag.bind("click", function(){
							curex.floatingBar.oepnLeftLayer($(this).data('viewDiv'));
						});
					}
					if(option.btnList[i].click){						
						aTag.bind("click", option.btnList[i].click);
					}
				}else{
					var aTag = $(' > a', li);
					aTag.css('cursor','default');

					if(option.btnList[i].btnClass){
						aTag.addClass(option.btnList[i].btnClass);
					}
				}
				
				if(option.btnList[i].visible !== undefined && option.btnList[i].visible == false){
					li.hide();					
				}
				//호출 function 세팅.
				if(option.btnList[i].viewDiv){
					aTag.data('viewDiv',option.btnList[i].viewDiv);	
				}
				if(option.btnList[i].click){
					aTag.data('func',option.btnList[i].click);
				}
				ul.append(li);				
			}
		}
		if(option.quickBtn !== undefined && option.quickBtn == false){
			ul.append('<li class="quB"><a href="#none"><img src="/img/common/quick.gif" alt="quick"></a></li>');	
		}

		floating.wrapInner("<div class='checkInner' />")
		

		//left 버튼 layer 처리.
		/*if (leftUl.length){
			var _this = $(leftUl)
				, $btn = _this.find("a")					
				, $listMenu = floating.find(".listMenu").height()
				, flag = 0;				
			floating.wrapInner("<div class='checkInner' />")
			
			$btn.each(function(idx){					
				$(this).off().on({
					click:function(e){
					var layer = $($btn.eq(idx).attr("href"));
					console.log(layer);
					var temp = layer.dialog({
							appendTo: ".checkInner",
							autoOpen: false,
							resizable: false,
							closeOnEscape: false,
							width:1024,
							modal: true,
					});
					var $close = temp.find(".enter");

					$close.click(function(){
						$($btn.eq(flag).attr("href")).dialog( "close" );
					});

					temp.parent().find('.ui-dialog-titlebar').hide();

					layer.dialog({dialogClass:'checkPopMenu'});
					layer.dialog("open");
					flag = idx;
					return false;
					}
				});
			});
		}*/
	};

	//leftBtn open layer
	self.oepnLeftLayer = function(viewDiv){
		var temp = viewDiv.dialog({
				appendTo: ".checkInner",
				autoOpen: false,
				resizable: false,
				closeOnEscape: false,
				width:1024,
				modal: true
		});
		var $close = temp.find(".enter");

		$close.click(function(){
			temp.dialog( "close" );
		});

		temp.parent().find('.ui-dialog-titlebar').hide();
		viewDiv.dialog({dialogClass:'checkPopMenu'});
		viewDiv.dialog("open");
	}
	
	//버튼 활성화 제어
	self.setActive = function(btnOption){
		var floating = $('#checkList');		
		var li = []; 
		var active = [];
		var visible = [];
		if(btnOption){
			var cnt = btnOption.length;
			if(cnt === undefined && btnOption.btnId !== undefined){
				li[0] = floating.find('> ul.list > li[data-btnId='+btnOption.btnId+']');
				active[0] = btnOption.active;
				visible[0] = btnOption.visible;
			}else{				
				for(var i=0; i<cnt; i++){
					if(btnOption[i].btnId){
						li[i] = floating.find('> ul.list > li[data-btnId='+btnOption[i].btnId+']');	
						active[i] = btnOption[i].active;
						visible[i] = btnOption[i].visible;
					}
				}
			}			
			var liCnt = li.length;

			for(var j=0; j<liCnt; j++){				
				var aTag = $(' > a',li[j]);				
				if(active[j] !== undefined){					
					if(active[j] == true){
						if(aTag.hasClass('on')){							
						}else{
							aTag.addClass('on').css('cursor','pointer');				
							aTag.bind("click", aTag.data('func'));
						}
					}else{
						aTag.removeClass('on').css('cursor','default');
						aTag.unbind('click');					
					}
				}

				if(visible[j] !== undefined){					
					if(visible[j] == true){
						li[j].show();	
					}else{						
						li[j].hide();
					}
				}
			}			

		}
				
	};	
	//floating Bar 삭제.
	self.remove = function(){
		var floating = $('#checkList');		
		if(floating.length > 0){
			floating.remove();
		}
	}
	
	if (!curex) {
		window.curex = curex = {};
	}
	curex.floatingBar = self;
	
})(window.curex);