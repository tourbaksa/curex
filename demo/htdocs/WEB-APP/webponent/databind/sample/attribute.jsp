<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" 	uri="http://java.sun.com/jsp/jstl/functions" %>
<html lang="ko">
<head>




</head>
<body>
	<h4><div class="fl">attribute</div><div class="fr"><a href="main.jsp">이전</a></div><div class="clear"></div></h4>
	<table border="1" style="width:100%;border-collapse: collapse;">
		<caption>element에 추가 할 수 있는 data-속성</caption>
		<thead>
			<tr>
				<th>name</th>
				<th>target<br/>Element</th>
				<th>description</th>
				<th>exam</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>data-bind</td>
				<td>FORM  하위의<br />모든 element</td>
				<td>
					&lt;input <strong>data-bind="a.name^x.name"</strong> value="기본값" &gt;<br />
					&lt;div <strong>data-bind="printName(a.name)^printName(x.name)"</strong>&gt;&lt;/div&gt;<br />
					&lt;tbody <strong>data-bind="_this.loop(a.block)^_this.replaceItem(x32,x32.jcode)"</strong>&gt;&lt;/tbody&gt;<br />
					<p>
						databind의 핵심속성으로 모든 요소에 추가 할 수 있다. data-bind는 크게 2가지의 표현식(값,function)이 존재 하며 구분자 ^에 의해 조회표현식과
						실시간 표현식이 구분된다. input과 같은 value값을 가지는 노드는 value에 값이 바인딩되며 div또는 span은 innerHTML로 바인딩된다.
						또한 <a href="function.jsp">TBODY, UL, OL 등 리스트 형태의 element는 따로 정의된 함수</a>를 이용하여 처리된다.
					</p> 
				</td>
				<td><a href="bind.jsp">예제</a></td>
			</tr>
			<tr>
				<td>data-bldinfo</td>
				<td>FORM</td>
				<td>
					<strong>data-bldinfo="{a:'wts/tr/11100000',b:'wts/tr/11000000'}"</strong><br />
					<p>
						폼에 다음과 같은 속성을 추가시 bind 과정에서
					</p> 
				</td>
				<td><a href="bind.jsp">예제</a></td>
			</tr>
			<tr>
				<td>data-cache</td>
				<td>FORM</td>
				<td>
					<strong>data-cache="a.전일종가"</strong><br />
					<p>
						data-cache속성은 조회시 특정값을 캐쉬에 저장해 두는 기능이다.
						조회표현식과 실시간 표현식은 서로 처리되는 시점이 다르기 때문에 조회된 특정값을 실시간 표현식등에서 사용 할 수가 없다. 
						그리하여 특정값(변화가 없는 고정값)을 저장해두고 실시간시에 사용하기 위해 만들어진 기능이다.구분자 , 를이용하여
						여러개 등록 가능하며 표현식에서 사용시 반듯이 $로 앞뒤를 감싸주어야 한다. $a.전일종가$<br /><br />
						"getCTB(a.전일종가,a.현재가)^getCTB($a.전일종가$,x3b.현재가)"<br />
						위의 실시간 표현식에서 getCTB는 a영역 의 값들을 참조 할수가 없기에 위와 같이 캐쉬기능을 이용하여 처리 되었다.
					</p>
				</td>
				<td><a href="bind.jsp">예제</a></td>
			</tr>
			<tr>
				<td>data-filter</td>
				<td>tbody<br />ul<br/>ol</td>
				<td>
					&lt;tbody data-bind="_this.loop(a.block)" <strong>data-filter="filterFunction"</strong> &gt;&lt;/tbody&gt;<br />
					function <strong>filterFunction</strong>(data){<br />
					&nbsp;&nbsp;&nbsp;&nbsp;if(data.show==false){<br />
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return false;<br />
					&nbsp;&nbsp;&nbsp;&nbsp;}<br />
					&nbsp;&nbsp;&nbsp;&nbsp;return true;<br />
					}<br />
					<p>
						data-filter는 tbody 나 ul과 같은 리스트 속성의 데이터값에 대한 제어를 담당하기 위한 속성이다. data-filter에는 function또는 function명이 들어 갈수 있으며
						제어 function에서 true를 반환시 리스트로 표시되며 false반환시 보이지 않게 된다. 또한 data의 값을 filter내에서 변경 할 수 있다.
					</p>
				</td>
				<td><a href="filter.jsp">예제</a></td>
			</tr>
			<tr>
				<td>data-rowgroup</td>
				<td>tbody<br />ul<br/>ol</td>
				<td>
					&lt;tbody data-bind="_this.loop(a.block)" <strong>data-rowgroup="3"</strong> &gt;&lt;/tbody&gt;<br />
					<p>
						data-rowgroup 은 tbody의 경우 tr 3개가 하나의 묶음으로 표현되는 경우가 있다. 그런경우에 rowgroup을 적어준다. 값이 없다면 자동으로 1로 설정된다.
					</p>
				</td>
				<td><a href="rowgroup.jsp">예제</a></td>
			</tr>
			<tr>
				<td>data-bindkey</td>
				<td>tr<br />li</td>
				<td>
					&lt;tr <strong>data-bindkey="code"</strong> &gt;&lt;/tr&gt;<br />
					<p>
						data-bindkey 는 tbody 또는 ul등에서 "data-bind=^_this.replaceItem(x32,x32.jcode)" 사용시 고유키의 키값을 적는 기능이다.
						data-bindkey값을 설정하면 내부적으로 data-bindkeyvalue값을 해당값으로 세팅하게 되며 replaceItem 호출시 고유값(x32.jcode)와
						data-bindkeyvalue값이 같은 tr 또는 li등을 선택하여 내부의 값을 바인딩한다. 
					</p>
				</td>
				<td><a href="bindkey.jsp">예제</a></td>
			</tr>
			<tr>
				<td>data-bindkeyvalue</td>
				<td>tr<br />li</td>
				<td>
					&lt;tr <strong>data-bindkeyvalue="005930"</strong> &gt;&lt;/tr&gt;<br />
					<p>
						data-bindkeyvalue 는 보통 data-bindkey에 의해 자동으로 설정되게 하는경우가 보통이나 수동으로 하기 위한경우를 위한 속성이다.<br />
						"data-bind=^_this.replaceItem(x32,x32.jcode)" 에서 x32.jcode와 data-bindkeyvalue가 같은 tr 또는 li등이 변경되기 위한 타겟으로 설정된다. 
					</p>
				</td>
				<td><a href="bindkeyvalue.jsp">예제</a></td>
			</tr>
		</tbody>
	</table>
	
	
</body>
</html>