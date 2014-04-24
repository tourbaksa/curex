/**
  사이트 글로벌 네비게이션

  오상원
*/
(function (curex) {

    var self = {};

    var OPENING_DELAY = 50;

    var CLOSING_DEALY = 200;

    var INITIAL_DELAY = 1000;    

    var initalRefresh = null;

    var initialDelay = null;

    var openingDelay = null;

    var closingDelay = null;
    
    var closingDelay2 = null;

    var gnb = null;

    var depth1Links = null;

    var focusedDepth1Links = null;

    var depth2Wraps = null;

    var depth3Links = null;    

    var popupLinks = null;
    
    var popupLinksNeedLogin = null;

    var selectedDepth1Link = null;
    var selectedDepth2Wrap = null;
    var selectedDepth2Link = null;
    var selectedDepth3Link = null;

    var openedPanel = null;
    var openedPanel2 = null;

    var animating = false;

    var gnbCloseBtn = null;

    function selectGnbElements () {

      gnb = $('#gnb');

      depth1Links = gnb.find('.depth1-link');

      depth2Wraps = gnb.find('.depth2-wrap');

      depth2Links = gnb.find('.depth2-link');
      
      depth3Wraps = gnb.find('.depth3-wrap');

      depth3Links = gnb.find('.depth3-link');                       

      popupLinks = gnb.find('[data-linkType="popup"]');
      
      popupLinksNeedLogin = gnb.find('[data-linkType="popupLogin"]');
      
      selectedDepth1Link = $('.depth1-link-selected');
      selectedDepth2Wrap = $('.depth2-Wrap-selected');
      selectedDepth2Link = $('.depth2-link-selected');

      gnbCloseBtn = gnb.find('.gnb-close-btn');

    }

    function isOpened (div) {
        return div.hasClass('opened');
    }

    function applyWookmark (div) {
      var depth2Ul = div.find('.depth2-ul');
      var items = depth2Ul.find('>li');

      /*items.wookmark({
        container : depth2Ul
      });*/

      div.data('wookmark-applied', true);
      
    }

    function openDepth2Wrap (depth1Link, div) {

        openingDelay = null;

        if (openedPanel !== null) {
          closeDepth2Wrap(openedPanel);
        }
        selectedDepth1Link.removeClass('on');
        selectedDepth2Wrap.hide();
        
        depth1Link.addClass('on');        
        div.show();
        div.addClass('opened');

        if (!div.data('wookmark-applied')) {
          applyWookmark(div);  
        }

        openedPanel = div;

    }

    function closeAllDepth2Wrap () {
        depth2Wraps.each(function () {
            closeDepth2Wrap($(this), false);
        });
    }

    function closeDepth2Wrap (div, withAnimation) {    	
      if (div === null) {
    	  
		  if (selectedDepth2Link && !selectedDepth2Link.hasClass('on')) {
	          selectedDepth2Link.addClass('on');          
	      }  
		  return;
      }
      
      div.removeClass('opened');
      div.hide();
      
      var depth1Link = div.siblings('.depth1-link');
      depth1Link.removeClass('on');      
      
      if (selectedDepth1Link && !selectedDepth1Link.hasClass('on')) {    	  
        selectedDepth1Link.addClass('on');
        if(selectedDepth2Wrap){
        	selectedDepth2Wrap.show();	
        }        
        if (selectedDepth2Link && !selectedDepth2Link.hasClass('on')) {        	
            selectedDepth2Link.addClass('on');          
        }
      }                  
      openedPanel = null;
        
    }
    
    
    function openDepth3Wrap (depth2Link, div) {
        openingDelay = null;

        if (openedPanel2 !== null) {        	
          closeDepth3Wrap(openedPanel2);
        }
        depth2Link.addClass('on');        
        div.show();
        div.addClass('opened');

        if (!div.data('wookmark-applied')) {
          applyWookmark(div);  
        }
        //3depth 있는 경우만
        if(div.hasClass('depth3-wrap')){
        	openedPanel2 = div;	
        }
        

    }
    
    function closeDepth3Wrap (div, withAnimation) {    	
        if (div === null) {
          return;
        }
        div.removeClass('opened');
        div.hide();
        
        var depth2Link = div.siblings('.depth2-link');
        depth2Link.removeClass('on');        
        
        openedPanel2 = null;
          
      }
    
    function closeDepth2Link (depth2Link, self) {    	
    	if(self){
    		depth2Link.removeClass('on');	
    	}
    	var li = depth2Link.parent().siblings();
    	li.children().removeClass('on');    	
    }
    

    function openDepth4Ul (ul, indi) {
        closeAllDepth4Ul();
        indi.siblings('.has-depth4').addClass('opened');
        indi.addClass('opened');
        ul.addClass('opened');
    }

    function closeAllDepth4Ul () {
        var localDepth4Uls = openedPanel.find('.depth4-ul');
        localDepth4Uls.each(function () {
            var ul = $(this);
            var indi = ul.siblings('.depth4-indi');
            closeDepth4Ul(ul, indi);
        });
    }


    function closeDepth4Ul (ul, indi) {
      
      indi.siblings('.has-depth4').removeClass('opened');
      indi.removeClass('opened');
      ul.removeClass('opened');
    }

    function closeAndFocus () {
      if (openedPanel !== null) {
        closeAllDepth4Ul();
        closeDepth2Wrap(openedPanel, false);

        if (focusedDepth1Links !== null) {
          focusedDepth1Links.focus();
          focusedDepth1Links = null;
        }
      }
    }


    function addEvents () {

      /**
       * 뎁스1 클릭 이벤트
       */
/*      depth1Links.on('mouseenter', function (e) {

        var depth1Link = $(this);

        if (initialDelay !== null) {
          clearTimeout(initalRefresh);
          initalRefresh = setTimeout(function () {
            depth1Link.trigger('mouseenter');
          }, 100);

          return;
        }

        e.preventDefault();

        if (animating) {
            return;
        }

        clearTimeout(closingDelay);

        openingDelay = setTimeout(function () {

          var depth2Wrap = depth1Link.siblings('.depth2-wrap');
          openDepth2Wrap(depth1Link, depth2Wrap);

        }, OPENING_DELAY);
        
      });*/

      if (getDevice() !== 'pc' && !ci.agent.isMac) {

        depth1Links.on('click', function (e) {
          e.preventDefault();
        });

      } else {

        depth1Links.on('click', function (e) {
          //Loader.show();
        });

      }

      /*depth1Links.on('mouseleave', function (e) {
    	  
        if (openingDelay !== null) {
          clearTimeout(openingDelay);
        }

        if (initialDelay !== null) {
          clearTimeout(initalRefresh);
          clearFirstOpen();
        }
        closingDelay = setTimeout(function () {        	
          closeDepth2Wrap(openedPanel, false);
        }, CLOSING_DEALY);        
      });

      depth1Links.on('keydown', function (e) {

        var keyCode = e.keyCode;
        
        if (keyCode == 13) {
          e.preventDefault();

          var depth1Link = $(this);
          var depth2Wrap = depth1Link.siblings('.depth2-wrap');

          if (isOpened(depth2Wrap)) {
              closeDepth2Wrap(depth2Wrap);
          } else {
              openDepth2Wrap(depth1Link, depth2Wrap);
          }
         
        }
        
      });

      depth1Links.eq(0).on('keydown', function (e) {

        var keyCode = e.keyCode || e.which;
        
        if (e.shiftKey && keyCode == 9) {

            var depth1Link = $(this);
            var depth2Wrap = depth1Link.siblings('.depth2-wrap');

            if (isOpened(depth2Wrap)) {
                closeDepth2Wrap(depth2Wrap);
            }
        }
      });
      */

      depth2Wraps.on('mouseenter', function () {
        clearTimeout(closingDelay);
        clearTimeout(closingDelay2);
      });


      depth2Wraps.on('mouseleave', function () {

        closingDelay = setTimeout(function () {
          closeDepth2Wrap(openedPanel, false);
        }, CLOSING_DEALY);
        
      });
      
      depth2Links.on('mouseenter', function (e) {

          var depth2Link = $(this);

          if (initialDelay !== null) {
            clearTimeout(initalRefresh);
            initalRefresh = setTimeout(function () {
              depth2Link.trigger('mouseenter');
            }, 100);

            return;
          }

          e.preventDefault();

          if (animating) {
              return;
          }

          clearTimeout(closingDelay);
          clearTimeout(closingDelay2);

          openingDelay = setTimeout(function () {

            var depth3Wrap = depth2Link.siblings('.depth3-wrap');
            openDepth3Wrap(depth2Link, depth3Wrap);            
          }, OPENING_DELAY);
          closeDepth2Link($(this),false);
        });
      
      depth2Links.on('mouseleave', function (e) {
    	  var depth2Link = $(this);
    	  if (openingDelay !== null) {
              clearTimeout(openingDelay);
            }

            if (initialDelay !== null) {
              clearTimeout(initalRefresh);              
              clearFirstOpen();
            }                        
            closingDelay2 = setTimeout(function () {
            	closeDepth2Link(depth2Link,true);
            	closeDepth3Wrap(openedPanel2, false);              
            }, CLOSING_DEALY);
        });

        depth2Links.on('keydown', function (e) {

          var keyCode = e.keyCode;
          
          if (keyCode == 13) {
            e.preventDefault();

            var depth2Link = $(this);
            var depth3Wrap = depth2Link.siblings('.depth3-wrap');

            if (isOpened(depth3Wrap)) {
                closeDepth3Wrap(depth3Wrap);
            } else {
                openDepth3Wrap(depth2Link, depth3Wrap);
                closeDepth2Link($(this),false);
            }
           
          }
          
        });

        depth2Links.eq(0).on('keydown', function (e) {

          var keyCode = e.keyCode || e.which;
          
          if (e.shiftKey && keyCode == 9) {

              var depth2Link = $(this);
              var depth3Wrap = depth2Link.siblings('.depth3-wrap');

              if (isOpened(depth3Wrap)) {
                  closeDepth3Wrap(depth2Wrap);
              }
          }
        });


      depth2Wraps.each(function () {

        var depth2Wrap = $(this);

        depth2Wrap.find('a:first').on('keydown', function (e) {

          var keyCode = e.keyCode || e.which;
          
          if (e.shiftKey && keyCode == 9) {
             closeDepth2Wrap(openedPanel, false);
          }
        }).on('focus', function (e) {

          focusedDepth1Links = depth2Wrap.siblings('.depth1-link');
        });

      });
      
      
      depth3Wraps.on('mouseenter', function () {
    	  clearTimeout(closingDelay);
          clearTimeout(closingDelay2);          
        });


      depth3Wraps.on('mouseleave', function () {
    	  
        closingDelay2 = setTimeout(function () {        	
          closeDepth3Wrap(openedPanel2, false);
        }, CLOSING_DEALY);
          
      });           

      gnb.on('keydown.closegnb', 'a', function (e) {

        var keyCode = e.keyCode;

        if (keyCode === 27) {
          closeAndFocus();
        }
      });

      popupLinks.on('click', function (e) {

        e.preventDefault();

        var url = $(this).attr('href');

        window.open(url, '', 'width=900, height=880, scrollbars=yes');
      });
      
      popupLinksNeedLogin.on('click', function (e) {
	    
    	  e.preventDefault();
	
	    var url = $(this).attr('href');
	    
	    if(!get__ISLOGIN()){
	    	if(confirm('로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?')){
	    		window.location.href='/main/customer/login/index.cmd';
	    	}
	    	return false;
	    }
	    
		window.open(url,'curex','toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=no,width=874,height=624,left=200,top=200');
	  });

      gnbCloseBtn.on('click', function (e) {
        closeAllDepth2Wrap();
      });

    } // end function addEvents

    function blockFirstOpen () {

      initialDelay = setTimeout(function () {
        clearFirstOpen();
      }, INITIAL_DELAY);
    }

    function clearFirstOpen () {
      if (initialDelay !== null) {
        initialDelay = null;
      }
    }
    
    
    self.clear = function(){
    	selectedDepth1Link = null;
      selectedDepth2Wrap = null;
      selectedDepth2Link = null;
      selectedDepth3Link = null;
        
      //현재 선택된 메뉴 정보 삭제.
      gnb.find('a').removeClass('depth1-link-selected')
        .removeClass('depth2-Wrap-selected')
        .removeClass('depth2-link-selected')
        .removeClass('depth3-link-selected')
        .removeClass('on');

      //2depth wrap 숨기기.
      gnb.find('.depth2-wrap').hide();
    };
      

    self.setDepth1Link = function(obj){    	
    	selectedDepth1Link = obj;
    };
    self.setDepth2Link = function(obj){    	
        selectedDepth2Link = obj;
    };
    self.setDepth2Wrap = function(obj){
        selectedDepth2Wrap = obj;
        obj.show();
    };
    
    self.setDepth3Link = function(obj){    	
        selectedDepth3Link = obj;
    };
    
    
    self.getDepth1Link = function(){    	
    	return selectedDepth1Link;
    };
    self.getDepth2Link = function(){    	
        return selectedDepth2Link;
    };    
    self.getDepth3Link = function(){      
        return selectedDepth3Link;
    };
    self.getDepth2Wrap = function(){      
        return selectedDepth2Wrap;
    };
    
    /**
     * public functions
     */

    self.init = function () {


      if (getDevice() !== 'pc' && !ci.agent.isMac) {
        OPENING_DELAY = 0;
        INITIAL_DELAY = 0;
        CLOSING_DEALY = 0;
      }
      selectGnbElements();
      blockFirstOpen();
      addEvents();
     
    };

    /**
     *
     */
    self.close = function () {
      closeAllDepth2Wrap ();
    };

    if (!curex) {
      window.curex = curex = {};
    }
    curex.globalnavi = self;

})(window.curex);