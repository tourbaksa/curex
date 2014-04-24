/**
 * ci.dialog wrapping
 */

(function(curex) {
	var self = {};

	//dialog open
	self.open = function(userOption){
		if(userOption.appendTo){
		}else{
			if(userOption.admin){//관리자.
			}else if(userOption.main){//메인 sitemap
			}else if(userOption.parent){//팝언 안에서 띄울때				
			}else{
				userOption.appendTo = '#contents';
			}	
		}
		
		userOption.maxHeight = '728';

		if(userOption.iframeUrl){
			if(userOption.className){
				userOption.className  = userOption.className+" visibility_hidden";
			}else{
				userOption.className  = "visibility_hidden";
			}
		}		
		
		var dialog = ci.dialog.open(userOption);
		
		if(dialog === undefined){
			return dialog;
		}

		
		//dialog 높이가 wrap height(728px) 보다 크면 
		//dialog 높이를 728로 맞춰줌.
		if(userOption.parent){			
		}else{
			if(dialog.height() > $('#wrap').height()){			
				dialog.height($('#wrap').height()-97);
			}	
		}
		var top = '0';
		var left = '0';
		if(userOption.position){
			if(userOption.position.length == 2){
				top = userOption.position[0];
				left = userOption.position[1];
			}
		}
		

		//내부 iframe으로 화면 불러올 경우.		
		if(userOption.iframeUrl){
			var iframe = $('<iframe id="'+userOption.id+'_iframe" name="'+userOption.id+'_iframe" src="" onload="curex.dialog.iframeLoad(this,\''+userOption.id+'\','+userOption.height+','+userOption.parent+',\''+top+'\',\''+left+'\')" width="100%" height="100%" marginheight="0" marginwidth="0" frameborder="0" ></iframe>');
			iframe.data('dialogObj', dialog);			
			dialog.find('#'+userOption.dom.attr('id')).append(iframe);

			$form = $('<form action="'+userOption.iframeUrl+'" target="'+userOption.id+'_iframe" method="post"></form>')
			$form.append('<input type="hidden", name="dialogId" value="'+userOption.id+'"></input>');
			//param 추가 
			
			if(userOption.ajaxOption){
				if(userOption.ajaxOption.data){
					var param = userOption.ajaxOption.data;
					if(param instanceof jQuery || param instanceof DataSet){
						var ds = new DataSet();
						if(param instanceof jQuery){
							if(param.is('form')){
								ds = curex.util.transFormToDs(param);	
							}						
						}else{//dataSet
							ds = param;
						}
						var keyArry = ds.keyArry;
						var count = keyArry.length;						
						for(var i=0; i<count; i++){							
							$form.append('<input type="hidden" name="'+keyArry[i]+'" value="'+ds.get(keyArry[i])+'"></input>');
						}

					}else{
						$.each(userOption.ajaxOption.data,function(key, value){
							$form.append('<input type="hidden" name="'+key+'" value="'+value+'"></input>');
						});			
					}
				}				
			}			

			if(userOption.admin){
				$('body').append($form);
			}else if(userOption.main){
				$('body').append($form);
			}else if(userOption.parent){
				$('body').append($form);
			}else{
				//ie submit 하기 위해서 body에 append 후 삭제.
				$('#contents').append($form);	
			}
			$form.submit();
			$form.remove();
			
		}else{
			
		}

		return dialog;
	};

	self.close = function(dialog){
		ci.dialog.close(dialog);
	};

	self.iframeLoad = function(obj,dialogId,height,parent, top, left){		
		var iframe = $(obj);		
		var dialog = iframe.data('dialogObj').parent();
		var content = $(iframe.data('dialogObj'));		
		
		iframe.contents().find("html").css('overflow','auto');
				
		if(height !== undefined && height != null && height !== ''){			
			if(ci.agent.isIe){				
				height = content.height();
			}else{				
				height = content.height()-3;	
			}
		}else{
			if(ci.agent.isIe){
				height = $("div:first",obj.contentWindow.document.body).height();
			}else{
				height = iframe.contents().find("div").eq(0).height();
			}
		}
		
		if(parent !== undefined && parent == true){//popup 안에서 popup 띄울때.			
			if(height > dialog.parent().height()){
				dialog.height(dialog.parent().height()-2);
				var title = dialog.find('.ui-dialog-titlebar').innerHeight();
				var foot = dialog.find('.ui-dialog-buttonpane').innerHeight();
				iframe.height(dialog.parent().height()-title-foot-74);
			}else{
				iframe.height(height);
			}
		}else{
			if(height > $('#wrap').height()){				
				dialog.height($('#wrap').height());

				var title = dialog.find('.ui-dialog-titlebar').innerHeight();
				var foot = dialog.find('.ui-dialog-buttonpane').innerHeight();
				iframe.height($('#wrap').height()-title-foot-74);

				dialog.position({
					at : 'top',
					my : 'top',
					of : window
				});

			}else{
				iframe.height(height);
				var at = 'center';
				var my = 'center';

				if(0 != left){
					if(isNaN(left)){
						at = left;
						my = left;
					}else{							
						at = 'left+'+left;
						my = 'left+'+left;		
					}
				}

				if(0 != top){
					if(isNaN(top)){
						at += ""+ top;
						my += ""+ top;
					}else{
						at += ' top+'+top;
						my += ' top+'+top;
					}
				}

				dialog.position({
					at : at,
					my : my,
					of : window
				});
			}
		}
		

		
		setTimeout(function(){
			dialog.removeClass('visibility_hidden');
		},350);
		
	};

	self.get = function(dialogId) {
		return ci.dialog.get(dialogId).find('iframe').contents().find('html');
	};

	self.sendParam = function(dialogId,ds){		
		var dialog = self.get(dialogId);
		var keyArry = ds.keyArry;
		var count = keyArry.length;		
		for(var i=0; i<count; i++){
			var obj = dialog.find('#'+keyArry[i]);
			
			if(obj.prop('type') == 'text' 
				|| obj.prop('type') == 'password'
				|| obj.prop('type') == 'hidden'
				|| obj.prop('type') == 'select-one'){
				dialog.find('#'+keyArry[i]).val(ds.get(keyArry[i]));	

			}else if(obj.prop('type') == 'radio'){
				var name = obj.attr('name');
				$('input:radio[name='+name+'][value='+ds.get(keyArry[i])+']',dialog).prop('checked',true);

			}else if(obj.prop('type') == 'checkbox'){
				var name = obj.attr('name');
				$('input:checkbox[name='+name+'][value='+ds.get(keyArry[i])+']',dialog).prop('checked',true);
				
			}else{
				dialog.find('#'+keyArry[i]).html(ds.get(keyArry[i]));	
			}			
		}
	};

	self.callFunction = function(dialogId, param){		
		var dialog = ci.dialog.get(dialogId);		
		dialog.trigger('callFunction',param);
	};


	if (!curex) {
		window.curex = curex = {};
	}
	curex.dialog = self;
	
})(window.curex);