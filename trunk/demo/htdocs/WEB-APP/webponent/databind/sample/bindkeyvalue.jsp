<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://www.cyber-i.com/coreview/menu" prefix="m"%>
<%@ taglib uri="http://www.cyber-i.com/coreview/layout" prefix="layout"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<html lang="ko">
<head>
<layout:elementGroup sequencialTypeNames="css,less,text,js">
	<layout:element name="data-bind" />
	<layout:element name="websocket" autoDevicePostfix="true"/>
	
	<layout:element name="codemirror" />
</layout:elementGroup>
<link rel="stylesheet" type="text/css" href="data-bind.css">
</head>
<body>
<h4><div class="fl">bindkeyvalue</div><div class="fr"><a href="index.jsp">목록</a></div><div class="clear"></div></h4>
<div id="preview" class="preview"></div>

<div id="htmlview">
<textarea id="html" name="html" style="display: none;">
<form id="frm">
    <div class="fl">
        <h2>table</h2>
        <table summary="관심종목에 대한 종목코드, 종목명, 현재가, 전일비, 등락율, 거래량 항목을 제공합니다." border="1">
            <caption>관심종목에 대한 정보를 제공하는 표</caption>
            <thead>
                <tr>
                    <th scope="col">종목코드</th>
                    <th scope="col">종목명</th>
                    <th scope="col">현재가</th>
                    <th scope="col">전일비</th>
                    <th scope="col">등락율</th>
                    <th scope="col">거래량</th>
                </tr>
            </thead>
            <tbody data-bind="_this.withItem(a,false)^_this.replaceItem(x32,x32.jcode)">
                <tr data-bindkey="block[0].code">
                    <td data-bind="block[0].code"></td>
                    <td data-bind="block[0].name"></td>
                    <td data-bind="block[0].price^curJuka"></td>
                    <td data-bind="block[0].change^debi"></td>
                    <td data-bind="block[0].changeRatio^dungrak"></td>
                    <td data-bind="block[0].volume^volume"></td>
                </tr>
                <tr data-bindkeyvalue="122630">
                    <td data-bind="block[1].code"></td>
                    <td data-bind="block[1].name"></td>
                    <td data-bind="block[1].price^curJuka"></td>
                    <td data-bind="block[1].change^debi"></td>
                    <td data-bind="block[1].changeRatio^dungrak"></td>
                    <td data-bind="block[1].volume^volume"></td>
                </tr>
                <tr data-bindkeyvalue="000660">
                    <td data-bind="block[2].code"></td>
                    <td data-bind="block[2].name"></td>
                    <td data-bind="block[2].price^curJuka"></td>
                    <td data-bind="block[2].change^debi"></td>
                    <td data-bind="block[2].changeRatio^dungrak"></td>
                    <td data-bind="block[2].volume^volume"></td>
                </tr>
            </tbody>
        </table>
    </div>
    
    <div class="clear"></div>
</form>
</textarea>
</div>

<div id="scriptview">
<textarea id="script" name="script" style="display: none;">
<script type="text/javascript">
    //임시 데이터
    var jsonData = {
        a:{
            block:[
                {code:"005930",name:"삼성전자",price:"1,495,000",change:"10,000",changeRatio:"0.67",volume:"58,948"},
                {code:"122630",name:"KODEX 레버리지",price:"12,120",change:"135",changeRatio:"1.13",volume:"11,600,333"},
                {code:"000660",name:"SK하이닉스",price:"31,700",change:"300",changeRatio:"0.96",volume:"1,323,825"}
            ]
        }
    };

    var formId = "frm";
    
    var binder = manager.addBinder(formId,true);//해당 폼을 매니저에 등록
    binder.bind(jsonData);//jsonData를 해당 element에 binding
    
    
    //실시간 데이터 수신을 위한 웹소켓 연결
    startWebsocket();//websocket.base.js
    
    //실시간 등록,해제함수  ([+|-],[실시간등록코드], [폼아이디], [실시간수신TR])
    var block = jsonData.a.block;
    var sendList = new Array();
    for( var i = 0, ic = block.length; i < ic; i++ ){
        sendList.push(block[i]["code"]);
    }
    send("+",sendList.join("|"),formId,"x32");
</script>
</textarea>
</div>
<div class="clear"></div>





	
<script type="text/javascript">
	var delay;
	// Initialize CodeMirror editor with a nice html5 canvas demo.
	var editor = CodeMirror.fromTextArea(document.getElementById('html'), {
		mode : 'text/html',
		tabMode : 'indent'
	});
	editor.on("change", function() {
		clearTimeout(delay);
		delay = setTimeout(updatePreview, 300);
	});
	
	var delay2;
	var script = CodeMirror.fromTextArea(document.getElementById('script'), {
		mode : 'text/html',
		tabMode : 'indent'
	});
	script.on("change", function() {
		clearTimeout(delay2);
		delay2 = setTimeout(updatePreview, 300);
	});

	function updatePreview() {
		var previewFrame = document.getElementById('preview');
		//var preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document;
		//preview.open();
		//preview.write(editor.getValue());
		//preview.close();
		$(previewFrame).html(editor.getValue()+script.getValue());
	}
	setTimeout(updatePreview, 300);
</script>
</body>
</html>