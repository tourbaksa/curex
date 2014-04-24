<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" 	uri="http://java.sun.com/jsp/jstl/functions" %>
<html lang="ko">
<head>




</head>
<body>
	<h4><div class="fl">function</div><div class="fr"><a href="main.jsp">이전</a></div><div class="clear"></div></h4>
	<table border="1" style="width:100%;border-collapse: collapse;">
		<caption>TBODY, UL, OL 등 리스트 형태의 element에서 사용하는 미리 정의된 함수</caption>
		<thead>
			<tr>
				<th>name</th>
				<th>type</th>
				<th>description</th>
				<th>exam</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>loop(val)</td>
				<td>조회</td>
				<td>
					&lt;tbody data-bind="<strong>_this.loop(a.block)</strong>"&gt;&lt;/tbody&gt;<br />
					<p>
						loop은 리스트 형태로 들어온 데이터를 반복을 돌며 모두 표현시에 사용되는 메서드이다.<br/> 
						이런 내부 함수들의 하위의 자식요소들은 인자로 들어온 depth이후를 data-bind 속성에 부여한다.<br />
					</p>
				</td>
				<td><a href="bind.jsp">예제</a></td>
			</tr>
			<tr>
				<td>withItem(val)</td>
				<td>조회</td>
				<td>
					&lt;tbody data-bind="<strong>_this.withItem(a.block)</strong>"&gt;&lt;/tbody&gt;<br />
					<p>
						withItem은 데이터를 그대로 화면에 바인드 시켜주는 기능이다. loop과 다른점은 loop은 내부적으로
						반복을 수행하지만 withItem은 단순히 인자로 들어온 값을 prefix로 연결하여 하위 노드들의 data-bind를 처리 한다.
					</p>
				</td>
				<td><a href="bindkeyvalue.jsp">예제</a></td>
			</tr>
			<tr>
				<td>prependItem(val)<br />appendItem(val)</td>
				<td>실시간</td>
				<td>
					&lt;tbody data-bind="_this.loop(a.block)<strong>^_this.appendItem(x32)</strong>"&gt;&lt;/tbody&gt;<br />
					<p>
						appendItem,prependItem은 실시간으로 들어온 데이터를 앞 또는 뒤에다가 추가하는 용도의 메서드이다. 
					</p>
				</td>
				<td><a href="appendItem.jsp">예제</a></td>
			</tr>
			<tr>
				<td>replaceItem(val,uniqueKey)</td>
				<td>실시간</td>
				<td>
					&lt;tbody data-bind="_this.loop(a.block)<strong>^_this.replaceItem(x32,x32.jcode)</strong>"&gt;&lt;/tbody&gt;<br />
					<p>
						replaceItem은 실시간으로 들어온 데이터를 uniqueKey에 해당하는 그룹을 찾아 실시간 데이터로 변환시키는 메서드이다.
						replaceItem을 사용시에는 반듯이 <a href="bindkey.jsp">data-bindkey</a> 또는 <a href="bindkeyvalue.jsp">data-bindkeyvalue</a>값을 설정하여야 한다. 
					</p>
				</td>
				<td><a href="bindkey.jsp">예제</a></td>
			</tr>
		</tbody>
	</table>
	
	
	<table border="1" style="width:100%;border-collapse: collapse;">
		<caption>databind 중요 함수</caption>
		<thead>
			<tr>
				<th>name</th>
				<th>class</th>
				<th>description</th>
				<th>exam</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>send<br />(flag,jcode,formId,trName)</td>
				<td>manager</td>
				<td>
					manger.send로 호출하며 웹소켓서버에 실시간 수신 제어를 담당하는 함수이다.<br />
					@flag   : ( +, - , ++ , -- )4가지의 기호이며 각각 실시간 등록, 해제, 갱신(resume), 중지(pause) 의 flag 값이다.(갱신과 중지에 상관없이 등록 해제 작업은 계속 발생하여야 한다.)<br />
					@jcode  : 실시간으로 등록할 종목코드 값을 의미한다. ex)005930<br />
					@formId : databind에 의한 실시간 적용은 실시간 데이터 수신시 해당 아이디를 가지는 바인더를 찾아 그 안에만 적용하므로 formId(binder id)가 필요하다.<br />
					@trName : 실시간 데이터 스키마 정보를 담고 있는 bld를 적는다. ex)x32<br />
					<br />
					
					ex)manager.send("+","005930","formId","x32"); 또는 manager.send("+","001|101|201^101GC000","formId","x31^x41");<br />
					send시 첫번째 예제처럼 하나만 등록하는 방식과 두번째 방식처럼 코드구분자 |과 영역구분자 ^를 이용하여 한번에 여러개를 전송할 수 있다.<br />
					코드 구부자는 x31에서 실시간을 수신받는 여러개의 코드값(001, 101, 201 )을 구분하는 구분자로 사용된다. 만약 다른 실시간 tr을 사용한다면<br />
					영역 구분자 ^를 이용하여 한번의 전송으로 여러개를 동시에 처리 할 수 있다.
				</td>
				<td></td>
			</tr>
			<tr>
				<td>reAnalyze<br />(form,bldinfo,realbldinfo)</td>
				<td>manager</td>
				<td>
					reAnalyze는 binder의 analyze를 다시 한번 할때 사용한다. 동일한 html에 tr을 바꾸거나 data-bind정보를 새로운것으로 교채시 사용한다.<br />
				</td>
				<td></td>
			</tr>
			<tr>
				<td>removeReceiveCodeByForm<br />(formOrformId)</td>
				<td>manager</td>
				<td>
					해당폼으로 등록되어 있는 모든 실시간 정보를 해제 한다. wts와 같이 화면이동 없이 구현되는 경우 화면이 닫힐때 반듯이 호출하여 실시간 정보를 해제 한다.<br />
				</td>
				<td></td>
			</tr>
			<tr>
				<td>addBinder<br />(formId)</td>
				<td>manager</td>
				<td>
					해당하는 폼의 아이디로 Binder를 생성한다. 이미 존재 하는 Binder라면 새로 생성하지 않고 리턴
				</td>
				<td></td>
			</tr>
			<tr>
				<td>getBinder<br />(formId)</td>
				<td>manager</td>
				<td>
					해당하는 폼의 아이디로 생성된 Binder를 리턴한다.
				</td>
				<td></td>
			</tr>
			<tr>
				<td>removeBinder<br />(formId)</td>
				<td>manager</td>
				<td>
					해당하는 폼의 아이디로 생성된 Binder를 삭제한다.
				</td>
				<td></td>
			</tr>
			
			<tr>
				<td>analyze<br />(formId)</td>
				<td>binder</td>
				<td>
					해당 폼을 분석하여 호출될 bld 정보 및 바인드가 필요한 자식요소들에게 이벤트를 부여하며 서버에 통신에 필요한 정보를 등록한다. 
				</td>
				<td></td>
			</tr>
			<tr>
				<td>bind<br />(jsonObject)</td>
				<td>binder</td>
				<td>
					인자로 들어온 jsonObject를 analyze를 통해 분석된 element에 bind 시킨다. 
				</td>
				<td></td>
			</tr>
			
		</tbody>
	</table>
</body>
</html>