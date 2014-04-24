/**
 * 
 */
/**
 * bld의 output필드들을 이용해서 자동으로 그리드 생성
 */
(function(ci) {

	var self = {};

	var GET_BLD_URL = '/WEB-APP/webponent/datagrid/gridController/getOutputFields.cmd';

	var GET_DB_DATA_URL = '/WEB-APP/webponent/datagrid/gridController/getFieldData.cmd';

	var INSERT_DB_URL = '/WEB-APP/webponent/datagrid/gridController/insertFieldData.cmd';

	// form JSON.js 에 있는 함수를 복사, JSON 을 String 형식으로 변환해줌. 사용여부 아직 모름..
	function stringify(obj) {
		var t = typeof (obj);
		if (t != "object" || obj === null) {
			// simple data type
			if (t == "string")
				obj = '"' + obj + '"';
			return String(obj);
		} else {
			// recurse array or object
			var n, v, json = [], arr = (obj && obj.constructor == Array);
			for (n in obj) {
				v = obj[n];
				t = typeof (v);
				if (t == "string")
					v = '"' + v + '"';
				else if (t == "object" && v !== null)
					v = stringify(v);
				json.push((arr ? "" : '"' + n + '":') + String(v));
			}
			return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
		}
	}
	

	function loadOutputFields(option) {

		var parameter = {};

		parameter.BLD_NAME = option.bld;

		parameter.BLOCK_NAME = '';

		parameter.menu_name = option.bld;

		if (option.block) {
			parameter.BLOCK_NAME = option.block;
		}

		$.ajax({
			url : GET_BLD_URL,
			type : 'post',
			data : parameter,
			success : function(data) {
				//기존 localStorage를 사용할떄의 구현 방식
				/*var jsonRemote = data;

				var jsonLocal = localStorage.getItem(option.uniqueKey);

				var tableInfo = null;

				if (jsonLocal != null) {
					tableInfo = fn_compareFields(jsonLocal, jsonRemote);
				} else {
					tableInfo = $.parseJSON(jsonRemote);
				}

				var grid = makeTable(tableInfo, option);
				var menuHtml = fn_getCheckBoxes(tableInfo);

				makeSettingLayer(grid, menuHtml, option);

				if (option.success) {
					option.success(grid);
				}*/
			}
		}).done(function(data){
			var jsonBld = data;
			var jsonDb = null;
			$.ajax({
				url : GET_DB_DATA_URL,
				type : 'post',
				data : parameter,
				success : function(data){
					jsonDb = data;
				}
			}).done(function(){
				var tableInfo = null;

				if (jsonDb != null && jsonDb != "") {
					tableInfo = fn_compareFields(jsonDb, jsonBld, option.bld);
				} else {
					insertFieldData(option.bld, jsonBld);
					tableInfo = $.parseJSON(jsonBld);
				}

				var grid = makeTable(tableInfo, option);

				if (option.settingLayer === true) {
					var menuHtml = fn_getCheckBoxes(tableInfo);
					makeSettingLayer(grid, menuHtml, option);
				}
				
			});
		});
	}

	function makeTable(info, option) {

		var table = $('<table>');
		var tableHeader = $('<thead>');
		var tableBody = $('<tbody>');

		var tableHeaderTr = $('<tr>');
		var tableBodyTr = $('<tr>');

		$.each(info, function(i, v) {

			var th = $('<th>');

			th.text(v.label);

			tableHeaderTr.append(th);

			var td = $('<td>');

			var calculatedWidth = v.label.length * 15 + 40 + 'px';

			td.attr('width', calculatedWidth);

			td.attr('data-bind', v.name);

			if (v.visible === '') {
				td.attr('hidden', 'hidden');
			}

			if (v.fixed === 'fixed') {
				td.attr('fixed', 'fixed');
			}

			if (v.align.length > 0) {
				td.attr('align', v.align);
			}

			if (v.width.length > 0) {
				td.attr('width', v.width);
			}

			tableBodyTr.append(td);

		});

		tableHeader.append(tableHeaderTr);
		tableBody.append(tableBodyTr);

		table.append(tableHeader);
		table.append(tableBody);

		option.container.append(table);

		var grid = ci.datagrid.init(table, option.grid);

		if (option.success) {
			option.success(grid);
		}

		return grid;

	}

	// bld로 부터 가지고온 것이 local데이터와 틀린지 비교하기.
	function fn_compareFields(local, bld, menu_name) {

		var localJSON = sortData("name", true, $.parseJSON(local), "string");
		var bldJSON = sortData("name", true, $.parseJSON(bld), "string");

		var localLen = localJSON.length;
		var bldLen = bldJSON.length;
		if (localLen != bldLen) { // 길이 비교, 우선 길이가 같지 않다면 필드가 변경된 것이므로,
			// bld데이터를 return 한다.
			// BLD가 변경되어, DB에 데이터를 삽입한다.
			insertFieldData(menu_name, bld);
			alert('데이터가 변경되어 컬럼 설정이 재설정 됩니다.')
			return sortData("index", true, $.parseJSON(bld), "number");
		} else {
			var idx = 0;
			for (var i = 0; i < localLen; i++) {
				if (localJSON[i]['name'] != bldJSON[i]['name']) {
					// 필드명이 변경됨
					break;
				} else if (localJSON[i]['label'] != bldJSON[i]['label']) {
					// 라벨이 변경됨
					break;
				} else if (localJSON[i]['data-hidden'] != bldJSON[i]['data-hidden']) {
					// DATA 숨김 속성이 변경됨
					break;
				}
				idx++;
			}
			if (localLen == idx) {
				return $.parseJSON(local); // local 구조 리턴
			} else {
				// BLD가 변경되어, DB에 데이터를 삽입한다.
				insertFieldData(menu_name, bld);
				alert('데이터가 변경되어 컬럼 설정이 재설정 됩니다.');
				return sortData("index", true, $.parseJSON(bld), "number");
			}
		}
	}

	// json일 경우에 내부, json 의 내부 데이터 속성에 맞도록 데이터 소팅 하는 함수
	// 유효성 검새할 때 사용
	function sortData(prop, asc, obj, valueType) {
		if (valueType == "number") {
			obj = obj.sort(function(a, b) {
				if (asc)
					return (new Number(a[prop]) > new Number(b[prop])) ? 1 : ((new Number(a[prop]) < new Number(b[prop])) ? -1 : 0);
				else
					return (new Number(b[prop]) > new Number(a[prop])) ? 1 : ((new Number(b[prop]) < new Number(a[prop])) ? -1 : 0);
			});
			return obj;
		} else {
			obj = obj.sort(function(a, b) {
				if (asc)
					return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
				else
					return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
			});
			return obj;
		}
	}

	// jsonData 라는 변수에 json 형식으로 데이터가 들어가 있는 상태에서, sortable 이 가능한 html Dom 엘레멘트를
	// 생성하는 함수
	function fn_getCheckBoxes(obj) {

		if (typeof obj == "string") {
			obj = $.parseJSON(obj);
		} else if (typeof obj != "object") {
			alert("ci.dynamicGrid.js : ERROR");
			return;
		}

		var menuHtml = $('<div>');

		$.each(obj, function(i, value) {

			var li = $('<li>');

			var checkBox = $('<input type="checkbox">');

			li.append(checkBox);

			setCheckBoxAttributes(li, checkBox, value);

			menuHtml.append(li);

		});

		return menuHtml.html();
	}

	function setCheckBoxAttributes(li, checkBox, value) {

		if (value['hidden'] == 'hidden') {
			li.hide();
		}

		if (value['fixed'] == 'fixed') {
			li.addClass('grid-column-fixed');
			checkBox.attr('disabled', 'disabled');
		}

		if (value['visible'] == 'visible') {
			checkBox.attr('checked', 'checked');
		}

		checkBox.attr('data-align', value['align']);
		checkBox.attr('data-name', value['name']);
		checkBox.attr('data-label', value['label']);
		checkBox.attr('data-visible', value['visible']);
		checkBox.attr('data-hidden', value['hidden']);
		checkBox.attr('data-fixed', value['fixed']);
		checkBox.attr('data-width', value['width']);

		li.append(value['label']);
	}

	function makeSettingLayer(grid, menuHtml, option) {

		var gridWrapper = grid.getWrapper();

		gridWrapper.find('.grid-setting-btn').remove();

		var button = null;

		if (option.settingButton) {
			button = option.settingButton;
		} else {
			button = $('<input class="grid-setting-btn" type="button" value="그리드세팅"/>');
			grid.getWrapper().after(button);
		}

		var dialogContent = $('<div class="grid-setting-layer ci-dialog-content">');
		var gridSortable = $('<ul class="grid-sortable FormSet">');

		dialogContent.append(gridSortable);

		gridSortable.append(menuHtml);

		button.off('click').on('click', function() {
			ci.dialog.open({
				id : 'grid_setting',				
				width : '680px',
				dom : dialogContent,
				focus : $(this),
				closebutton : false,
				dialogClass : 'searchField_pop',
				notitle : true,
				buttons : [ {
					text : '적용',
					className : 'btn fieldClose',
					'class' : 'smGyRb',					
					click : function() {
						var gridSortable = $(this).find('.grid-sortable');
						fn_saveJSON(option.uniqueKey, gridSortable);
						ci.dialog.close('grid_setting');
						option.container.empty();
						ci.dynamicGrid.init(option);
					}
				

				} ],
				afterAppend : function(inner) {

					var gridSortable = $(this).find('.grid-sortable');
					gridSortable.sortable({
						/*axis : 'y',*/
						containment : 'parent',
						items : 'li:not(.grid-column-fixed)'
					});
					gridSortable.disableSelection();
				}
			});
		});

		

	}

	// 현재 JSON을 Json format의 문자열로 변환하여 저장하도록함
	function fn_saveJSON(key, sortable) {

		if(typeof sortable == "string"){

		}
		var arr = [];

		var chkObjs = sortable.find("input[type=checkbox]");

		chkObjs.each(function(i) {
			var obj = {};
			var checkBox = $(this);

			obj = getCheckBoxAttributes(obj, checkBox);

			arr.push(obj);
		});

		//localStorage.setItem(key, stringify(arr));
		insertFieldData(key, stringify(arr));
	}

	//DB에 JSON 저장 , jsonData 는 json format을 이룬 string 타입이여야 한다.
	function insertFieldData(menu_name, jsonData){
		var parameter = {};

		parameter.menu_name = menu_name;
		
		parameter.FIL_ORDER = jsonData;

		$.ajax({
			url : INSERT_DB_URL,
			type : 'post',
			data : parameter,
			success : function(data){
				
			}
		});
	}

	function getCheckBoxAttributes(obj, checkBox) {

		obj.name = checkBox.attr('data-name');
		obj.label = checkBox.attr('data-label');

		if (checkBox.is(':checked')) {
			obj.visible = 'visible';
		} else {
			obj.visible = '';
		}

		obj.align = checkBox.attr('data-align');
		obj.hidden = checkBox.attr('data-hidden');
		obj.fixed = checkBox.attr('data-fixed');
		obj.width = checkBox.attr('data-width');

		return obj;
	}

	self.init = function(option) {

		option.container.empty();
		
		if (option.bld) {
			option.uniqueKey = option.bld;
			loadOutputFields(option);

		} else if (option.tableInfo) {

			return makeTable(option.tableInfo, option);
		}
		

	};

	if (!ci) {
		window.ci = {};
	}

	ci.dynamicGrid = self;

})(window.ci);