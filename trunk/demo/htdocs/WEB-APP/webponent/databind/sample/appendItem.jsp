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
<h4><div class="fl">appendItem</div><div class="fr"><a href="index.jsp">목록</a></div><div class="clear"></div></h4>
<div id="preview" class="preview"></div>

<div id="htmlview">
<textarea id="html" name="html" style="display: none;">
<form id="frm">
	<div class="fl">
		<h5>table</h5>
		<table summary="선택한 종목에 대한 시간, 현재가, 대비, 체결량 항목을 제공합니다.">
			<caption>선택한 종목에 대한 정보를 제공하는 표</caption>
			<thead>
				<tr>
					<th scope="col">시간</th>
					<th scope="col">현재가</th>
					<th scope="col">대비</th>
					<th scope="col">체결량</th>
				</tr>
			</thead>
			<tbody data-bind="_this.listItem(a.block)^_this.prependItem(x32)">
				<tr>
					<td data-bind="times^times"></td>
					<td data-bind="price^curJuka"></td>
					<td data-bind="change^debi"></td>
					<td data-bind="volumn^nowVol"></td>
				</tr>
			</tbody>
		</table>
	</div>
	
	<div class="fr">
		<h5>ul</h5>
		<ul data-bind="_this.listItem(a.block)^_this.appendItem(x32)">
			<li>
				<span data-bind="times^times"></span>
				<span data-bind="price^curJuka"></span>
				<span data-bind="change^debi"></span>
				<span data-bind="volumn^nowVol"></span>
			</li>
		</ul>
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
				{times:"13:34:46",price:"11,300",change:"65",volumn:"10"},
				{times:"13:34:45",price:"11,295",change:"60",volumn:"1,100"},
				{times:"13:34:38",price:"11,295",change:"60",volumn:"4,500"},
				{times:"13:34:19",price:"11,295",change:"60",volumn:"100"},
				{times:"13:34:13",price:"11,300",change:"65",volumn:"10"},
				{times:"13:34:10",price:"11,295",change:"60",volumn:"1,261"},
				{times:"13:34:10",price:"11,295",change:"60",volumn:"300"},
				{times:"13:34:09",price:"11,300",change:"65",volumn:"133"},
				{times:"13:34:03",price:"11,300",change:"65",volumn:"50"},
				{times:"13:33:56",price:"11,300",change:"65",volumn:"353"},
				{times:"13:33:55",price:"11,295",change:"60",volumn:"3,000"},
				{times:"13:33:53",price:"11,290",change:"55",volumn:"1"},
				{times:"13:33:44",price:"11,295",change:"60",volumn:"3,999"},
				{times:"13:33:43",price:"11,300",change:"65",volumn:"118"},
				{times:"13:33:41",price:"11,300",change:"65",volumn:"2,742"},
				{times:"13:33:41",price:"11,300",change:"65",volumn:"5"},
				{times:"13:33:39",price:"11,300",change:"65",volumn:"10"},
				{times:"13:33:36",price:"11,300",change:"65",volumn:"5"},
				{times:"13:33:32",price:"11,300",change:"65",volumn:"7"},
				{times:"13:33:25",price:"11,300",change:"65",volumn:"5"},
				{times:"13:33:22",price:"11,300",change:"65",volumn:"400"},
				{times:"13:33:19",price:"11,300",change:"65",volumn:"3"},
				{times:"13:33:18",price:"11,300",change:"65",volumn:"5"},
				{times:"13:33:12",price:"11,300",change:"65",volumn:"20"},
				{times:"13:33:11",price:"11,305",change:"70",volumn:"500"},
				{times:"13:33:07",price:"11,305",change:"70",volumn:"3"},
				{times:"13:33:01",price:"11,305",change:"70",volumn:"12"},
				{times:"13:33:00",price:"11,305",change:"70",volumn:"10"},
				{times:"13:32:59",price:"11,310",change:"75",volumn:"122"},
				{times:"13:32:57",price:"11,305",change:"70",volumn:"100"}
			]
		}
	};

	var formId = "frm";
	
	var binder = manager.addBinder("frm",true);//해당 폼을 매니저에 등록
    binder.bind(jsonData);//jsonData를 해당 element에 binding
	
	
	//실시간 데이터 수신을 위한 웹소켓 연결
	startWebsocket();//websocket.base.js
	
	//실시간 등록,해제함수  ([+|-],[실시간등록코드], [폼아이디], [실시간수신TR])
	send('+',"122630",formId,"x32");
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