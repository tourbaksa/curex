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
	<layout:element name="codemirror" />
</layout:elementGroup>
<link rel="stylesheet" type="text/css" href="data-bind.css">
</head>
<body>
<h4><div class="fl">filter</div><div class="fr"><a href="index.jsp">목록</a></div><div class="clear"></div></h4>
<div id="preview" class="preview"></div>

<div id="htmlview">
<textarea id="html" name="html" style="display: none;">
<form id="frm">
	<div class="examDiv">
		<h2>table</h2>
		<p>filter에 의해 show가 false인것은 안보임</p>
		<table>
			<thead>
				<tr>
					<th>종목코드</th>
					<th>종목명</th>
					<th>가격</th>
					<th>show</th>
				</tr>
			</thead>
			<tbody data-bind="_this.listItem(a.block)" data-filter="tableFilter">
				<tr>
					<td data-bind="code"></td>
					<td data-bind="name"></td>
					<td data-bind="price"></td>
					<td data-bind="show"></td>
				</tr>
			</tbody>
		</table>
	</div>
	
	<div class="examDiv">
		<h2>ul</h2>
		<p>filter에 의해 show가 true인것은 안보임</p>
		<ul data-bind="_this.listItem(a.block)" data-filter="ulFilter">
			<li>
				<span data-bind="code"></span>
				<span data-bind="name"></span>
				<span data-bind="price"></span>
				<span data-bind="show"></span>
			</li>
		</ul>
	</div>
	
	<div class="examDiv">
		<h2>ol</h2>
		<p>filter에 의해 데이터가 변경</p>
		<ol data-bind="_this.listItem(a.block)" data-filter="olFilter">
			<li>
			    <span data-bind="code"></span>
                <span data-bind="name"></span>
                <span data-bind="price"></span>
                <span data-bind="show"></span>
            </li>
		</ol>
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
                {show:"true",code:"005930",name:"삼성전자",price:"1,495,000",change:"10,000",changeRatio:"0.67",volume:"58,948"},
                {show:"false",code:"122630",name:"KODEX 레버리지",price:"12,120",change:"135",changeRatio:"1.13",volume:"11,600,333"},
                {show:"true",code:"000660",name:"SK하이닉스",price:"31,700",change:"300",changeRatio:"0.96",volume:"1,323,825"}
            ]
        }
    };

	var formId = "frm";
	
	//manager:BinderManager로 databind.js에서 초기화된 전역변수
	var binder = manager.addBinder(formId,true);//해당 폼을 매니저에 등록
	binder.bind(jsonData);//jsonData를 해당 element에 binding
	
	
	//filter function
	//조건에 따라 로우를 보여주고 안보여줌
	function tableFilter(data){
		if(data.show=="false"){
			return false;//보여주지 않으려면 false 리턴
		}
		
		return true;//기본적으로 true 리턴
	}
	
	function ulFilter(data){
		if(data.show=="true"){
			return false;//보여주지 않으려면 false 리턴
		}
		
		return true;//기본적으로 true 리턴
	}
	
	function olFilter(data){
		data.code = "<span style='color:red;'>"+data.code+"</span>";//데이터 변경
		data.name = "<span style='color:blue;'>"+data.name+"</span>";//데이터 변경
		return true;//기본적으로 true 리턴
	}
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