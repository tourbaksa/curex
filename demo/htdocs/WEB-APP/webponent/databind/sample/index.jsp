<!-- 주식주문 -->

<%@ page contentType="text/html; charset=utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<meta charset="utf-8">

<div class="screen">
	<table border="1" style="width:100%;border-collapse: collapse;">
        <caption>element에 추가 할 수 있는 data-속성</caption>
        <colgroup>
            <col width="220px;">
            <col width="100px;">
        </colgroup>
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
                        또한 <a href="#listFunction">TBODY, UL, OL 등 리스트 형태의 element는 따로 정의된 함수</a>를 이용하여 처리된다.
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
                        그리하여 특정값(변화가 없는 고정값)을 저장해두고 실시간시에 사용하기 위해 만들어진 기능이다.구분자 ^ 를이용하여
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
    
    <br /><br /><br /><br /><br />
    
    <table border="1" style="width:100%;border-collapse: collapse;" id="listFunction">
        <caption>TBODY, UL, OL 등 리스트 형태의 element에서 사용하는 미리 정의된 함수</caption>
        <colgroup>
            <col width="220px;">
            <col width="100px;">
        </colgroup>
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
                <td>listItem(val)</td>
                <td>조회</td>
                <td>
                    &lt;tbody data-bind="<strong>_this.listItem(a.block)</strong>"&gt;&lt;/tbody&gt;<br />
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
    
    <br /><br /><br /><br /><br />
    
    <table border="1" style="width:100%;border-collapse: collapse;">
        <caption>databind 중요 함수</caption>
        <colgroup>
            <col width="220px;">
            <col width="100px;">
        </colgroup>
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
                <td>removeReceiveCodeByForm<br />(formOrformId)</td>
                <td>manager</td>
                <td>
                    해당폼으로 등록되어 있는 모든 실시간 정보를 해제 한다. wts와 같이 화면이동 없이 구현되는 경우 화면이 닫힐때 반듯이 호출하여 실시간 정보를 해제 한다.<br />
                </td>
                <td></td>
            </tr>
            <tr>
                <td>addBinder<br />(formId,alsoAnalyze)</td>
                <td>manager</td>
                <td>
                    해당하는 폼의 아이디로 Binder를 생성한다. 이미 존재 하는 Binder라면 새로 생성하지 않고 리턴한다.<br />
                    alsoAnalyze가 true라면 analyze작업까지 수행한다.
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
                <td>reAnalyze<br />(formId)</td>
                <td>manager</td>
                <td>
                    reAnalyze는 binder의 analyze를 다시 한번 할때 사용한다. 동일한 html에 tr을 바꾸거나 data-bind정보를 새로운것으로 교채시 사용한다.<br />
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
            
            <tr>
                <td>subBind<br />(jsonObject,subBindId)</td>
                <td>binder</td>
                <td>
                    인자로 들어온 jsonObject를 data-subbind="subBindId"가 선언된 element의 하위element에 bind 시킨다. 
                </td>
                <td></td>
            </tr>
            
        </tbody>
    </table>
</div>