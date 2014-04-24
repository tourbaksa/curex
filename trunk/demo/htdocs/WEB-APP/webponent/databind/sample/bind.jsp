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

<h4><div class="fl">bind</div><div class="fr"><a href="index.jsp">목록</a></div><div class="clear"></div></h4>
<div id="preview" class="preview"></div>

<div id="htmlview">
<textarea id="html" name="html" style="display: none;">
<form id="frm">
	<div class="fl">
		<h2>input, div, span, ...</h2>
		<span data-bind="idName(a.id,a.name)"></span>
		<div data-bind="a.id"></div> 
		<input data-bind="a.name" type="text" />
		<input data-bind="a.name" type="button" />
	</div>

	<div class="fl">
		<h2>table</h2>
	
		<table>
			<thead>
				<tr>
					<th>가</th>
					<th>나</th>
					<th>다</th>
				</tr>
			</thead>
			<tbody data-bind="_this.listItem(a.block)">
				<tr>
					<td><span data-bind="ga"></span>원</td>
					<td data-bind="na"></td>
					<td data-bind="da"></td>
				</tr>
			</tbody>
		</table>
	</div>
	
	<div class="fl">
		<h2>ul</h2>
	
		<ul data-bind="_this.listItem(a.block)">
			<li><span data-bind="ga"></span></li>
		</ul>
	</div>
	
	<div class="fl">
		<h2>ol</h2>
	
		<ol data-bind="_this.listItem(a.block)">
			<li><span data-bind="na"></span></li>
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
			id:"neoxeni",
			name:"이정범",
			block:[
				{ga:"111_1",na:"111_2",da:"111_3",show:true},
				{ga:"222_1",na:"222_2",da:"222_3",show:true},
				{ga:"333_1",na:"333_2",da:"333_3",show:false},
				{ga:"444_1",na:"444_2",da:"444_3",show:true}
			]
		}
	};

	var binder = manager.addBinder("frm",true);//해당 폼을 매니저에 등록
	binder.bind(jsonData);//jsonData를 해당 element에 binding
	
	//bind function
	function idName(id,name){
		return id+"("+name+")";
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