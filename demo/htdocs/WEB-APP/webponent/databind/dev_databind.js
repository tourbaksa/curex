/**
 * /http://javascriptcompressor.com/ Base62 encode, Shrink variables 체크후 압축
 */

var manager = new BinderManager();
function BinderManager() {
	var realTimeInfo = new Object();// 웹소켓 서버가 꺼져 있으면 여기에 실시간정보가 쌓임
	$(document).bind('socket:open', function(e, data) {// 실시간 정보가 켜지면 실시간정보 전송
		for ( var i in realTimeInfo) {
			manager._socket.send(realTimeInfo[i]);
		}

		realTimeInfo = new Object();
	});

	var _this = this;

	this._WtsDebugMode = false;// 하단에 로그 출력 여부 log("디버깅중");
	this._WtsDebugPosition = "console";
	this._WtsDebugLogType = {
		"REAL_TIME" : false,
		"DATA" : false,
		"ERROR" : true,
		"MANAGER" : false,
		"BINDER" : false,
		"ETC" : false
	};

	this._socket = undefined;

	this.binderMap = {};

	this.receiveCodeMap = new Object();

	this.formCodeMap = new Object();

	this.send = function(flag, jcode, formObjId, trNames) {
		if (jcode == "") {// 종목코드가 없을시는 리턴
			return;
		}

		if (flag == "+") {
			setTimeout(function() {
				_this.addReceiveCode(jcode, formObjId, trNames);
			}, 500);
		} else {
			_this.removeReceiveCode(jcode, formObjId);
		}
	};

	this.reAnalyze_old = function(formId) {
		var binder = manager.addBinder(formId);
		binder.analyze(formId);
		binder.syncServer(true); // 시간에 관계없이 무조건 sync
	};

	this.reAnalyze = function(f, bldinfo, readbldinfo) {
		var $f = $(f);
		var fid = $f.attr("id");
		_this.removeBinder(fid);

		if (bldinfo !== undefined) {
			$f.attr("data-bldinfo", bldinfo);
		}

		if (readbldinfo !== undefined) {
			$f.attr("data-realbldinfo", readbldinfo);
		}

		var binder = _this.addBinder(fid);
		binder.analyze(fid);
		binder.syncServer(true);// 시간에 관계없이 무조건 sync
	};

	this.setWebSocket = function(socket) {
		this._socket = socket;
	};

	this.addReceiveCode = function(receiveCodes, formObjId, trNames) {
		// 코드 구분자 | 영역구분자 ^
		// 001|101|201^101GC000, fpInterest1, x31^x41 <-- 인자순서
		// 001|101|201:fpInterest1:x31 와 101GC000:fpInterest1:x41 로 쪼개어짐
		_this.removeReceiveCodeByForm(formObjId);

		var binder = _this.getBinder(formObjId);

		var realCodeMap = new Object();
		if (binder) {
			binder.realCodeMap = new Object();
			realCodeMap = binder.realCodeMap;
		}

		var receiveCodeArr = receiveCodes.split("^");
		var trNameArr = trNames.split("^");

		// 아래 통으로 주석된 부분을 ^로 끊어서 for문으로 해당 갯수만큼 실행
		if (receiveCodeArr.length == trNameArr.length) {// 갯수가 틀리면 등록방법이 정상X
			for ( var q = 0, qc = receiveCodeArr.length; q < qc; q++) {
				var receiveCodeSplit = receiveCodeArr[q].split("|");
				for ( var i = 0, ic = receiveCodeSplit.length; i < ic; i++) {
					var receiveCode = receiveCodeSplit[i];
					realCodeMap[receiveCode] = receiveCode;
					var obj = _this.receiveCodeMap[receiveCode];
					if (obj === undefined) {
						obj = new Object();
						obj.cnt = 1;
						obj.bindId = new Object();
						obj.bindId[formObjId] = receiveCode;
						log("완전추가" + formObjId + ":" + receiveCode, "addReceiveCode", "MANAGER");
					} else {
						if (obj.bindId[formObjId] != receiveCode) {
							log("부분추가" + formObjId + ":" + receiveCode, "addReceiveCode", "MANAGER");
							obj.cnt += 1;
							obj.bindId[formObjId] = receiveCode;
						}
					}
					_this.receiveCodeMap[receiveCode] = obj;
				}
			}

			if (_this._socket && (_this._socket.readyState == 1)) {
				_this._socket.send('+' + receiveCodes + ":" + formObjId + ":" + trNames);
			} else {
				realTimeInfo[formObjId] = '+' + receiveCodes + ":" + formObjId + ":" + trNames;
				log(formObjId + "소켓이 없음", _this._socket, "addReceiveCode", "MANAGER");
			}
		}
	};

	this.removeReceiveCode = function(receiveCodes, formObjId, trName) {
		var receiveCodeArr = receiveCodes.split("^");
		// 아래 통으로 주석된 부분을 ^로 끊어서 for문으로 해당 갯수만큼 실행
		for ( var q = 0, qc = receiveCodeArr.length; q < qc; q++) {
			var receiveCodeSplit = receiveCodeArr[q].split("|");
			for ( var i = 0, ic = receiveCodeSplit.length; i < ic; i++) {
				var receiveCode = receiveCodeSplit[i];
				var obj = _this.receiveCodeMap[receiveCode];
				if (obj !== undefined) {
					if (obj.cnt == 1) {
						log("완전삭제" + formObjId + ":" + receiveCode, "removeReceiveCode", "MANAGER");
						delete _this.receiveCodeMap[receiveCode];
					} else {
						log("부분삭제" + formObjId + ":" + receiveCode, "removeReceiveCode", "MANAGER");
						obj.cnt -= 1;
						delete obj.bindId[formObjId];
						_this.receiveCodeMap[receiveCode] = obj;
					}
				}
			}
		}

		if (_this._socket && (_this._socket.readyState == 1)) {
			_this._socket.send('-' + receiveCodes + ":" + formObjId);
		} else {
			realTimeInfo[formObjId] = '-' + receiveCodes + ":" + formObjId;
			log(formObjId + "소켓이 없음", _this._socket, "removeReceiveCode", "MANAGER");
		}
	};

	// 폼에 등록되어 있는 모든 실시간 정보를 해제
	this.removeReceiveCodeByForm = function(formId) {
		var binder = _this.getBinder(formId);
		if (binder) {
			var realCodeMap = binder.realCodeMap;
			var realCodeArray = [];
			for ( var i in realCodeMap) {
				realCodeArray.push(i);
			}

			if (realCodeArray.length > 0) {
				_this.removeReceiveCode(realCodeArray.join("|"), formId);
				/* binder.realCodeMap = new Object(); */
			}
		}
	};

	this.resetReceiveCode = function(formId) {
		_this.removeReceiveCodeByForm(formId);
	};

	this.getReceiveCodeCount = function(receiveCode) {
		var cnt = _this.receiveCodeMap[receiveCode].cnt;
		return (cnt === undefined) ? 0 : cnt;
	};

	this.addBinder = function(formId, alsoAnalyze) {
		var binder = this.getBinder(formId);
		if (binder === undefined) {
			binder = new Binder(this);
			_this.binderMap[formId] = binder;
		}

		if (alsoAnalyze === true) {
			binder.analyze(formId);
		}

		return binder;
	};

	this.getBinder = function(formId) {
		var binder = _this.binderMap[formId];
		if (binder !== undefined) {
			return binder;
		} else {
			log("There is no Binder [ " + formId + " ]", "getBinder", "MANAGER");
			return undefined;
		}
	};

	this.removeBinder = function(formId) {
		var binder = _this.getBinder(formId);
		if (binder) {
			binder.bindMetaMap = null;
		}

		_this.removeReceiveCodeByForm(formId);
		delete _this.formCodeMap[formId];
		delete _this.binderMap[formId];
	};

	this.submitAjax = function(formObj, param) {
		var binder = _this.getBinder(formObj.id);
		if (binder === undefined) {// 부분바인드로 변경하면서 아직 바인드되지 않은 폼이 넘어옴(그러므로 패스)
			return false;
		}

		binder.submitAjax(formObj, param);
		return false;
	};

	this.xSubmitAjax = function(formObj, param) {
		var binder = _this.getBinder(formObj.id);
		if (binder === undefined) {// 부분바인드로 변경하면서 아직 바인드되지 않은 폼이 넘어옴(그러므로 패스)
			return false;
		}

		binder.xSubmitAjax(formObj, param);
		return false;
	};

	this.prePrefixData = '';

	this.onDataReceive = function(data, bindScope) {
		data = data.replace(/\\/g, ',^').replace(/\?/g, '`#').replace(/\^/g, '~#').replace(/#/g, '","').replace(/~/g, '000').replace(/`/g, '00').replace(/@/g, '0.');
		var sp = data.indexOf('"');
		if (sp == 0) {
			data = prePrefixData + data;
		} else {
			prePrefixData = data.substring(0, sp);
		}
		data += '"])';
		log(data, 'REAL_TIME', 'REAL_TIME');

		data = "var a = {};" + data;

		eval(data);

		var bindScopes = a._b;
		bindScopes = bindScopes.split("|");
		for ( var i = 0, ic = bindScopes.length; i < ic; i++) {
			try {
				var binder = _this.binderMap[bindScopes[i]];
				if (binder) {
					if (binder.realTrMap[bld] !== undefined) {
						eval("a." + binder.realTrMap[bld] + " = a." + bld);
					}
					binder.onDataReceive(a, bindScopes[i], data);
				}
			} catch (e) {
				log(bindScopes[i] + e.message, "manager.onDataReceive", "ERROR");
			}
		}
	};

	this._showBinderMap = function() {
		var mapArray = new Array();
		for ( var i in _this.binderMap) {
			mapArray.push(i);
		}
		log(mapArray, "_showBinderMap", "MANAGER");
	};

	this._showFormCodeMap = function() {
		var mapArray = new Array();
		for ( var i in _this.formCodeMap) {
			mapArray.push(i + " [" + _this.formCodeMap[i] + "]");
		}
		log(mapArray, "_showFormCodeMap", "MANAGER");
	};

	this._showReceiveCodeMap = function() {
		for ( var i in _this.receiveCodeMap) {
			var bindIds = "";
			for ( var j in _this.receiveCodeMap[i].bindId) {
				bindIds += "#" + j;
			}
			log("[ code : " + i + " ] [ count : " + _this.receiveCodeMap[i].cnt + " ] [ bindIDs : " + bindIds + " ]", "_showReceiveCodeMap", "MANAGER");
		}
	};

	this._logs = function() {
		_this._showBinderMap();
		_this._showFormCodeMap();
		_this._showReceiveCodeMap();
	};

	this._logTypeToggle = function(checkbox, logTypeName) {
		_this._WtsDebugLogType[logTypeName] = checkbox.checked;
		console.log(checkbox.checked, _this._WtsDebugLogType);
	};

	return _this;
}

function Binder(manager) {
	// Array.isArray
	function isArray(o) {
		return o.constructor.toString() === [].constructor.toString();
	}

	// 내부 로직에 의한 설정
	var _this = this; // JQuery 문법 안에서도 Binder 를 참조 할수 있도록...
	if (!manager) { // Binder에서 Manager를 생성자 인자로 받아 참조, 변경 없는 경우 manager는 자신
		manager = this;
	}

	this.bindFormMap = new Object();// 사용안하는듯... 혹시 사용할까??
	this.bindMetaMap = new Object();
	this.trMap = new Object();
	this.realTrMap = new Object();
	this.funcMap = new Object();
	this.gridMap = new Object();
	this.formObjectId = "";
	this.bindScopeId = "";
	this.realCodeMap = new Object();// 수신받고 있는 실시간 코드값 저장(manager에서 사용)

	this.UP = 1;
	this.DOWN = -1; // 리스트 형태의 Table의 경우 추가된 <tr>이 아래쪽에 붙을것인지 위쪽에 붙을것인지를 결정
	this.SCROLLBAR_WIDTH = 0;
	this.maxRowSize = -1;

	// 테이블의 형태가 addRow와 같이 추가일때 테이블이 가질수 있는 최대 row 수를 설정한다. -1 인경우 제한 없음
	this.limitRowSizeInAddTable = 40;

	this.lastSyncTime = -1;

	this.reset = function() {
		_this.lastSyncTime = -1;
		_this.bindMetaMap = new Object();
		_this.trMap = new Object();
		_this.realTrMap = new Object();
		_this.funcMap = new Object();
		_this.gridMap = new Object();
	};

	this.setMaxRowSize = function(size) {
		_this.maxRowSize = size;
	};

	this.setServerSideFunc = function(key, express) {
		_this.funcMap[key] = express;
	};

	this._setAttr = function(map, attrVal, prefix) {
		var last = "";
		var p = attrVal.indexOf("(");
		if (p < 0) {
			attrVal = _this._setPrefixAttr(prefix, attrVal);
			map[attrVal] = attrVal;
			last = attrVal;
		} else {
			var e = attrVal.indexOf(")");
			attrVal = attrVal.substring(p + 1, e);
			var it = attrVal.split(',');
			for ( var i = 0; i < it.length; i++) {
				var atv = _this._setPrefixAttr(prefix, it[i]);
				map[atv] = atv;
				last = atv;
			}
		}
		p = last.indexOf(".");
		if (p > 0) {
			return last.substring(0, p);
		} else {
			return last;
		}
	};

	this._setPrefixAttr = function(prefix, attr) {
		var p = attr.indexOf('.');
		if (p < 0) {
			if (prefix) {
				return prefix + '.' + attr;
			}
		}

		return attr;
	};

	this.getSyncServerData = function() {
		var ids = '';
		var fields = null;
		$.each(_this.bindMetaMap, function(bindId, option) {
			ids = ids + bindId;
			$.each(option.attrArray, function(nm, val) {
				if (fields) {
					fields = fields + '|' + nm;
				} else {
					fields = nm;
				}
			});
		});

		var tr = null;
		$.each(_this.trMap, function(prefix, bld) {
			if (tr) {
				tr = tr + '|' + prefix + ':' + bld;
			} else {
				tr = prefix + ':' + bld;
			}
		});

		/*
		 * var realTr=null; $.each(_this.realTrMap, function(prefix,bld) {
		 * if(realTr) {realTr=realTr+'|'+prefix+':'+bld;} else
		 * {realTr=prefix+':'+bld;} });
		 */

		var func = null;
		$.each(_this.funcMap, function(prefix, fc) {
			if (func) {
				func = func + '|' + prefix + ':' + fc;
			} else {
				func = prefix + ':' + fc;
			}
		});

		var returnObj = {
			'_trcodes_' : tr,
			// '_realtrcodes_':realTr,
			'_fields_' : fields,
			'_funcs_' : func,
			'_id_' : ids,
			'_maxrowsize_' : _this.maxRowSize
		};

		log("[maxRowSize : " + _this.maxRowSize + "] [tr :" + tr + "] [fields :" + fields + " ] [func : " + func + "] syncServer[" + ids + "]", "getSyncServerData", "BINDER");

		return returnObj;
	};

	this.syncServer = function(isAlways) {
		var data = _this.getSyncServerData();
		var ids = data["_id_"];

		_this.lastSyncTime = manager.formCodeMap[ids];

		if (isAlways !== true) {// 인자가 없거나 false인경우
			if (_this.lastSyncTime && _this.lastSyncTime > 0) {
				var gap = ((new Date()).getTime() - _this.lastSyncTime);
				if (gap < 1000 * 60 * 5) {
					return;
				}
			}
		}

		var syncParam = "_trcodes_=" + encodeURIComponent(data["_trcodes_"]);
		syncParam += "&_fields_=" + encodeURIComponent(data["_fields_"]);
		syncParam += "&_funcs_=" + encodeURIComponent(data["_funcs_"]);
		syncParam += "&_id_=" + encodeURIComponent(data["_id_"]);
		syncParam += "&_maxrowsize_=" + encodeURIComponent(data["_maxrowsize_"]);

		$.ajax({
			url : '/WEB-APP/wts/data.jspx?cmd=regist',
			type : 'post',
			async : false,
			data : syncParam
		});

		_this.lastSyncTime = (new Date()).getTime();
		manager.formCodeMap[ids] = _this.lastSyncTime;

		try {
			log('lastSyncTime : ' + _this.lastSyncTime + ' , trcodes : ' + data._trcodes_ + ' , id : ' + data._id_, 'syncServer', "BINDER");
		} catch (E) {
		}
	};

	this.analyze = function(bindScopeId) {
		// _this.syncServer();
		var f = document.getElementById(bindScopeId);
		var $f = $(f);

		_this.bindScopeId = bindScopeId;
		var options = {
			bindId : bindScopeId,
			eventArray : new Array(),
			realTimeEventArray : new Array(),
			realTimeValueMap : new Object(),
			attrArray : new Object(),
			cacheMap : new Object(),
			bindElementMap : new Object(),
			subBindMap : new Object()
		};
		_this.bindMetaMap[bindScopeId] = options;

		var bldJson = eval("(" + f.getAttribute("data-bldinfo") + ")");
		for ( var j in bldJson) {
			if (bldJson.hasOwnProperty(j)) {
				_this.trMap[j] = bldJson[j];
			}
		}

		var realBldJson = f.getAttribute("data-realbldinfo");
		if (realBldJson !== null) {
			realBldJson = realBldJson.replace(/[}{"']/g, "");
			var bldArr = realBldJson.split(",");
			for ( var i = 0, ic = bldArr.length; i < ic; i++) {
				var list = bldArr[i].split(":");
				_this.realTrMap[list[1]] = list[0];
			}
		}

		// data-chach 기능 $a.name$와 같은식으로 폼에 설정
		var dataCache = f.getAttribute("data-cache");
		if (dataCache != null) {
			var dataCaches = dataCache.split(",");
			for ( var i = 0, ic = dataCaches.length; i < ic; i++) {
				var searchExp = dataCaches[i];
				_this._setAttr(options.attrArray, searchExp);
				options.eventArray.push(_this.makeCache(searchExp));// 검색 함수 할당
			}
		}

		var subbindFields = $({});
		$f.find("*[data-subbind]").each(function() {
			var subbind = this, $subbind = $(this);
			var subbindScopeId = subbind.getAttribute("data-subbind");
			var subOptions = {
				bindId : subbindScopeId,
				eventArray : new Array(),
				realTimeEventArray : new Array(),
				realTimeValueMap : new Object(),
				attrArray : new Object(),
				cacheMap : new Object(),
				bindElementMap : new Object()
			};

			subbindFields = $subbind.find("*[data-bind]");

			subbindFields.each(function() {
				var target = this;
				var expression = target.getAttribute('data-bind');

				log(target, bindScopeId + ":" + subbindScopeId + "_subBindFields:" + expression, "BINDER");

				if ("TBODY UL OL".indexOf(target.nodeName) != -1) {
					_this._loopEleBind(target, expression, subOptions);
				}

				if (target.getAttribute('data-bind-bypass') != "true") {
					var splitExp = expression.split("^");
					var searchExp = splitExp[0];
					_this._setAttr(subOptions.attrArray, searchExp);

					// 검색 이벤트 함수 할당
					var searchFunction = _this.makeFunc(searchExp);
					subOptions.eventArray.push(function(dataObj) {
						return searchFunction(dataObj, target, _this);
					});

					// 실시간 데이터 표현식이 존재 한다면
					if (splitExp.length > 1) {
						var realTimeExp = splitExp[1];
						var realTimeFunction = undefined;
						if (realTimeExp.indexOf("replaceItem") == -1) {
							realTimeFunction = _this.makeFunc(realTimeExp);
						} else {
							realTimeFunction = _this.makeFuncLive(realTimeExp);
						}

						subOptions.realTimeEventArray.push(function(dataObj) {
							return realTimeFunction(dataObj, target, _this);
						});
					}
				}
			});

			options.subBindMap[subbindScopeId] = subOptions;
		});

		var bindFields = $f.find("*[data-bind]");
		bindFields = bindFields.not(subbindFields);
		bindFields.each(function(i) {
			var target = this;
			var expression = target.getAttribute('data-bind');

			log(target, bindScopeId + "_bindFields:" + expression, "BINDER");

			if ("TBODY UL OL".indexOf(target.nodeName) != -1) {
				_this._loopEleBind(target, expression, options);
			}

			if (target.getAttribute('data-bind-bypass') != "true") {
				var splitExp = expression.split("^");
				var searchExp = splitExp[0];
				_this._setAttr(options.attrArray, searchExp);

				// 검색 이벤트 함수 할당
				var searchFunction = _this.makeFunc(searchExp);
				options.eventArray.push(function(dataObj) {
					return searchFunction(dataObj, target, _this);
				});

				// 실시간 데이터 표현식이 존재 한다면
				if (splitExp.length > 1) {
					var realTimeExp = splitExp[1];
					var realTimeFunction = undefined;
					if (realTimeExp.indexOf("replaceItem") == -1) {
						realTimeFunction = _this.makeFunc(realTimeExp);
					} else {
						realTimeFunction = _this.makeFuncLive(realTimeExp);
					}

					options.realTimeEventArray.push(function(dataObj) {
						return realTimeFunction(dataObj, target, _this);
					});
				}
			}
		});

		// Tbody에 data-gridHeight 가 설정되어 있다면 그리드 형태로 변경 (기능추가 필요)
		var tables = f.getElementsByTagName("TABLE");
		for ( var i = 0, ic = tables.length; i < ic; i++) {
			var table = tables[i];
			var gridOption = table.getAttribute("data-grid");
			if (gridOption !== null) {
				if (table.getAttribute("data-isGridInitialized") == "true") {
					continue;
				}

				table.setAttribute("data-isGridInitialized", "true");

				if ($.dataGrid) {
					var tableId = table.id;
					if (tableId === undefined || tableId == "") {
						tableId = bindScopeId + "_grid_" + (i + 1);
						table.setAttribute("id", tableId);
					}

					gridOption = eval("(" + gridOption + ")");

					if (gridOption["vscroll"] == "false" || getDevice() == "mobile") {
						_this.gridMap[tableId] = $.dataGridMini(table, gridOption);
					} else {
						_this.gridMap[tableId] = $.dataGrid(table, gridOption);
					}
				} else {
					// TO-DO
				}
			}
		}
	};

	this._loopEleBind = function(ob, expression, options) {
		if (ob.loopItemArray === undefined) {
			var targetChild = ob.nodeName == "TBODY" ? "TR" : "LI";
			ob.loopItemArray = $(ob).find(targetChild).removeClass('even');
		}

		if (ob.getAttribute("data-rowgroup") === null) {
			ob.setAttribute("data-rowgroup", "1");
		}

		ob.bindFnArray = [];
		ob.bindRcvFnArray = [];
		ob.replaceItemMapLength = 0;
		// element를 저장하려 하였으나 클론하여 child를 만들기 때문에 의미 없음..(실시간도 마찬가지)
		// ob.bindRcvEleArray = [];ob.bindEleArray = [];

		var trcode = _this._setAttr(options.attrArray, expression.split('^')[0]);

		$(ob.loopItemArray).find("*[data-bind]").each(function(j) {
			var target = this;
			var innerExp = target.getAttribute('data-bind'), splitExp = innerExp.split("^"), searchExp = splitExp[0];

			_this._setAttr(options.attrArray, searchExp, trcode);
			ob.bindFnArray.push(_this.makeFunc(searchExp));

			// 실시간 데이터 표현식이 존재 한다면
			if (splitExp.length > 1) {
				var receiveExp = splitExp[1];
				target.setAttribute('data-bindrcvxprss', receiveExp);
				if (expression.indexOf("replaceItem") == -1) {
					ob.bindRcvFnArray.push(_this.makeFunc(receiveExp));
				} else {
					ob.bindRcvFnArray.push(_this.makeFuncOnlyValue(receiveExp));
				}
			}

			// 커스텀 이벤트를 바인딩할필요가 없으므로 임의의 속성 추가한다.
			target.setAttribute('data-bind-bypass', 'true');
		});

		if (expression.indexOf("withItem") == -1) {// withItem 은 TR을 비우지 않음
			$(ob).empty();
		}
	};

	this.makeCache = function(text) {
		// 표현식이 function이라면 마지막 인자로 event대상객체를 넣어준다.
		// arguments[2]는 아래 리턴함수에서 target을 의미(compressMode)
		var execute = text.indexOf("(") == -1 ? text : text.substring(0, text.length - 1) + ",arguments[2])";
		return function(dataObj, cahce, target) {
			var resultValue = undefined;
			if (dataObj === undefined || dataObj === null)
				return;
			with (dataObj) {
				try {
					resultValue = eval(execute);
				} catch (e) {
					log(e + e.name + " : " + e.message + "[execute : " + execute + " ]", "ERROR_makeCache_" + _this.bindScopeId, "ERROR");
				}
			}

			_this.bindMetaMap[_this.bindScopeId].cacheMap["$" + execute + "$"] = resultValue;
		};
	};

	this._makeExecuteExpression = function(text, from) {
		// arguments[1] : target, arguments[2] : Binder객체(_this) [compressMode]
		var execute = text.indexOf("(") == -1 ? text : text.substring(0, text.length - 1) + ",arguments[1])";

		if (execute.indexOf("$") > -1) {// cahce에 대한 처리
			execute = "var cacheData=_this.bindMetaMap[\"" + _this.bindScopeId + "\"].cacheMap;" + execute;
			var result = execute.match(new RegExp(/\$[^,)]*\$/g));
			for ( var i = 0, ic = result.length; i < ic; i++) {
				execute = execute.replace(result[i], "cacheData[\"" + result[i] + "\"]");
			}
		}

		return "var _this = arguments[2];" + execute;// (compressMode)
	};

	// 호출된 결과값을 무조건 element에 적용 (조회 또는 appendItem, prependItem )
	this.makeFunc = function(text) {
		var execute = _this._makeExecuteExpression(text, "makeFunc");

		return function(dataObj, target) {
			if (dataObj === undefined || dataObj === null) {
				return;
			}

			var resultValue = undefined;
			with (dataObj) {
				try {
					resultValue = eval(execute);
				} catch (e) {
					log(dataObj, "ERROR_makeFunc[scope:" + _this.bindScopeId + "] [error : " + e.name + " : " + e.message + "] [execute : " + execute + "][nodeName : " + target.nodeName + "]", "ERROR");
				}
			}

			if (resultValue !== undefined) {
				_this.setBindValue(target, resultValue);
			}
			return resultValue;
		};
	};

	// 호출된 결과값을 캐쉬값과 비교하여 다른경우에만 적용한다. (일반적인 data-bind)
	this.makeFuncLive = function(text) {
		var execute = _this._makeExecuteExpression(text, "makeFuncLive");

		var realTimeValueMap = _this.bindMetaMap[_this.bindScopeId].realTimeValueMap;

		return function(dataObj, target) {
			if (dataObj === undefined || dataObj === null) {
				return;
			}
			
			var resultValue = undefined;
			with (dataObj) {
				try {
					resultValue = eval(execute);
				} catch (e) {
					log(dataObj, "ERROR_makeFuncLive[scope:" + _this.bindScopeId + "] [error : " + e.name + " : " + e.message + "] [execute : " + execute + "][nodeName : " + target.nodeName + "]", "ERROR");
				}
			}

			if (resultValue !== undefined) {
				if (realTimeValueMap[execute] == resultValue) {
					return resultValue;
				} else {
					realTimeValueMap[execute] = resultValue;
				}

				_this.setBindValue(target, resultValue);
			} else {
				// _replaceItem appendItem 등등
			}
			return resultValue;
		};
	};

	// 호출된 결과값을 element에 바로 적용하지 않고 값만을 리턴한다. (tbody, ul, li등 list element에 사용)
	this.makeFuncOnlyValue = function(text) {
		var execute = _this._makeExecuteExpression(text, "makeFuncOnlyValue");

		return function(dataObj, target) {
			if (dataObj === undefined || dataObj === null){
				return;
			}
			
			var resultValue = undefined;
			with (dataObj) {
				try {
					resultValue = eval(execute);
				} catch (e) {
					log(dataObj, "ERROR_makeFuncLive[scope:" + _this.bindScopeId + "] [error : " + e.name + " : " + e.message + "] [execute : " + execute + "][nodeName : " + target.nodeName + "]", "ERROR");
				}
			}
			return resultValue;
		};
	};

	this.submitAjax = function(formObj, settings) {
		try {
			_this.formObjectId = formObj.id;
			if (!_this.formObjectId) {
				_this.formObjectId = "F" + Math.random();
			}

			if (_this.lastSyncTime > 0) {
				var gap = ((new Date()).getTime() - _this.lastSyncTime);
				if (gap > 1000 * 60 * 5) {
					_this.syncServer();
				}
			}

			var data = "_id_=" + _this.formObjectId + "&_r_=" + Math.random() + "&";
			data += $(formObj).serialize();

			try {
				manager.removeReceiveCodeByForm(formObj.id);
			} catch (E) {
				log(_this.formObjectId, "removeReceiveCodeByForm fail", "ERROR");
			}

			var param = {
				url : formObj.action,
				cache : false,
				type : 'post',
				contentType : "application/x-www-form-urlencoded; charset=UTF-8",
				data : data,
				dataType : 'text',
				beforeSend : function(x) {
					if (x && x.overrideMimeType) {
						x.overrideMimeType("application/j-son;charset=UTF-8");
					}
				}
			};

			if (settings) {
				$.extend(param, settings);
			}

			this._ajax(param);
			return false;

		} catch (e) {
			log(e.name + " : " + e.message, "submitAjax", "ERROR");
			return false;
		}
	};

	this.xSubmitAjax = function(formObj, settings) {
		try {
			manager.removeReceiveCodeByForm(formObj.id);
		} catch (E) {
			log(_this.formObjectId, "removeReceiveCodeByForm fail", "ERROR");
		}

		var device = getDevice();

		_this.formObjectId = formObj.id;
		if (!_this.formObjectId) {
			_this.formObjectId = "F" + Math.random();
		}

		if (_this.lastSyncTime > 0) {
			var gap = ((new Date()).getTime() - _this.lastSyncTime);
			if (gap > 1000 * 60 * 5) {
				_this.syncServer();
			}
		}

		var data = "_id_=" + _this.formObjectId + "&_r_=" + Math.random() + "&";
		data += $(formObj).serialize();

		var ajaxOption = {
			url : formObj.action,
			cache : false,
			type : 'post',
			contentType : "application/x-www-form-urlencoded; charset=UTF-8",
			data : data,
			dataType : 'text',
			beforeSend : function(x) {
				if (x && x.overrideMimeType) {
					x.overrideMimeType("application/j-son;charset=UTF-8");
				}
			}
		};

		if (settings) {
			$.extend(ajaxOption, settings);
		}

		// ===============================가상키패드, E2E관련
		// 처리:S============================
		ajaxOption.data = __processSecurityInput(device, ajaxOption, settings, $(formObj));
		// ===============================가상키패드, E2E관련
		// 처리:E============================

		try {
			this._ajax(ajaxOption);
			return false;
		} catch (e) {
			log(e.name + " : " + e.message, "submitAjax", "ERROR");
			return false;
		}
	};

	this._ajax = function(param) {
		var ajaxOptions = new Object();

		if (param) {
			$.extend(ajaxOptions, param);
		}

		// 사용자가 지정한 callback함수를 저장한다. 내부 callback 함수를 수행후 사용자의 callback 함수를 호출
		ajaxOptions['success'] = param.success;
		ajaxOptions['error'] = param.error;
		ajaxOptions['complete'] = param.complete;

		// callback 함수를 내부 callback 함수로 변경
		param['success'] = function(data, textStatus, jqXHR) {
			_this._onSuccess(data, textStatus, jqXHR, ajaxOptions);
		};
		param['error'] = function(jqXHR, textStatus, errorThrown) {
			_this._onError(jqXHR, textStatus, errorThrown, ajaxOptions);
		};
		param['complete'] = function(jqXHR, textStatus) {
			_this._onComplete(jqXHR, textStatus, ajaxOptions);
		};

		$.ajax(param);
	};

	this._onSuccess = function(data, textStatus, jqXHR, ajaxOptions) {
		log(data, '_onSuccess', 'DATA');

		var result = null;
		try {
			result = $.parseJSON(data);
		} catch (e) {
			log(e.message, '_onSuccess_ERROR_parseJSON', "ERROR");
			return;
		}

		_this.bind(result);

		if (ajaxOptions['success']) {
			try {
				ajaxOptions['success'](result, _this.formObjectId, jqXHR);
			} catch (E) {
				log(E.message, '_onSuccess_ERROR', "ERROR");
			}
		}
	};
	this._onError = function(jqXHR, textStatus, errorThrown, ajaxOptions) {
		log(jqXHR, '_onError', 'DATA');
		// 공통 작업이 있다면 추가

		if (ajaxOptions['error']) {
			ajaxOptions['error'](jqXHR, textStatus, errorThrown, _this.formObjectId);
		}
	};
	this._onComplete = function(jqXHR, textStatus, ajaxOptions) {
		log(jqXHR, '_onComplete', 'DATA');
		// 공통 작업이 있다면 추가

		if (ajaxOptions['complete']) {
			ajaxOptions['complete'](jqXHR, textStatus, _this.formObjectId);
		}

		var gridCount = 0;
		for ( var i in _this.gridMap) {
			gridCount++;
			var grid = _this.gridMap[i];
			grid.resizing();
		}
		
		if(gridCount > 0 ){//IE10,IE11 버그로 그리드가 사이즈를 제대로 잡지 못함..
			var trident = navigator.userAgent.match(/Trident\/(\d.\d)/i);
			if(trident != null){
				var version = trident[1]+"";
				if(version == "6.0"||version == "7.0"){
					var li = $("#"+_this.formObjectId);
					if(li.size()>0){
						li.css({"visibility":"hidden"});
						setTimeout(function(){
							li.css({"visibility":"visible"});
						},1);
					}
				}
			}
		}
	};

	this.bind = function(jsonObject) {
		/*
		var metaMap = _this.bindMetaMap;
		for ( var i in metaMap) {
			if (metaMap.hasOwnProperty(i)) {
				var options = _this.bindMetaMap[i];
				var eventArray = options.eventArray;
				for ( var i = 0, ic = eventArray.length; i < ic; i++) {
					eventArray[i](jsonObject);
				}
			}
		}
		*/

		var options = _this.bindMetaMap[_this.bindScopeId];
		var eventArray = options.eventArray;
		for ( var i = 0, ic = eventArray.length; i < ic; i++) {
			eventArray[i](jsonObject);
		}
	};

	this.subBind = function(jsonObject, subBindId) {
		var options = _this.bindMetaMap[_this.bindScopeId]["subBindMap"][subBindId];
		if (options !== undefined) {
			var eventArray = options.eventArray;
			for ( var i = 0, ic = eventArray.length; i < ic; i++) {
				eventArray[i](jsonObject);
			}
		} else {
			alert(subBindId + "에 해당하는 정보가 없음\n[data-subbind=" + subBindId + "]를 설정하세요.");
		}
	};

	this.onDataReceive = function(jsonObject, bindScope, data) {
		if (jsonObject === undefined) {
			jsonObject = typeof data == "object" ? data : eval("(" + data + ")");
		}

		if (bindScope !== undefined) {
			var realTimeEventArray = _this.bindMetaMap[bindScope].realTimeEventArray;
			for ( var i = 0, ic = realTimeEventArray.length; i < ic; i++) {
				try {
					realTimeEventArray[i](jsonObject);
				} catch (e) {
					log(e.name + " : " + e.message + " in bindScope[ " + bindScope + " ]<br />" + data, "ERROR_onDataReceive", "ERROR");
				}
			}
		} else {
			$.each(_this.bindMetaMap, function(bindId, option) {
				var realTimeEventArray = option.realTimeEventArray;
				for ( var i = 0, ic = realTimeEventArray.length; i < ic; i++) {
					try {
						realTimeEventArray[i](jsonObject);
					} catch (e) {
						log(e.name + " : " + e.message, "ERROR_onDataReceive", "ERROR");
					}
				}
			});
		}
	};

	this.loop = function(val, obj) {
		this.listItem(val, obj);
	};

	this.listItem = function(val, obj) {
		$(obj).empty();
		obj.replaceItemMapLength = 0;
		_this._makeListItem(val, obj, -1, false);// _this.DOWN
	};

	this.prependItem = function(val, obj) {
		try {
			if (_this.limitRowSizeInAddTable > -1) {
				var listItem = obj.children;
				if (Number(listItem.length) > Number(_this.limitRowSizeInAddTable)) {
					obj.removeChild(obj.lastChild);
				}
			}
		} catch (e) {
			log(e.name + " : " + e.message, "ERROR_prependItem", "ERROR");
		}

		_this._makeListItem(val, obj, 1, true);// _this.UP
	};

	this.appendItem = function(val, obj) {
		try {
			if (_this.limitRowSizeInAddTable > -1) {
				var listItem = obj.children;
				if (Number(listItem.length) > Number(_this.limitRowSizeInAddTable)) {
					obj.removeChild(obj.firstChild);
				}
			}
		} catch (e) {
			log(e.name + " : " + e.message, "ERROR_appendItem", "ERROR");
		}

		_this._makeListItem(val, obj, -1, true);// _this.DOWN
	};

	this._makeListItem = function(val, obj, direction, realtime) {
		if (!isArray(val)) {
			val = [ val ];
		}

		var filter = $(obj).data("filter");
		if (typeof filter === 'string') {
			filter = window[filter];
			if (filter === undefined) {
				filter = new Function("data", "obj", "options", "return " + filter + "(data,obj,options);");
			}
		}

		var classCondit, selector, funcArray, arrIdx = 0, isPrepend = _this.UP == direction ? true : false;
		if (realtime) {
			funcArray = obj.bindRcvFnArray;
			if (isPrepend) {
				classCondit = $(obj.firstChild).hasClass("even");
			} else {
				classCondit = $(obj.lastChild).hasClass("even");
			}
			selector = "data-bindrcvxprss";
		} else {
			funcArray = obj.bindFnArray;
			classCondit = $(obj.lastChild).hasClass("even");
			selector = "data-bind";
		}

		var defaultItem = $(obj.loopItemArray), frag = document.createDocumentFragment();
		for ( var i = 0, ic = val.length; i < ic; i++) {
			var bindValue = val[i];
			try {
				var options = {
					seq : i,
					data : val
				};
				if (typeof filter == "function" && !filter(bindValue, obj, options)) {
					continue;
				}
			} catch (e) {
				log(e.message, "ERROR_makeListItem_filter", "ERROR");
			}

			var item = defaultItem.clone(), seq = 0;
			item.each(function() {
				var target = this;

				$(target).find("*[" + selector + "]").each(function() {
					funcArray[seq++](bindValue, this, _this);
				});

				var bindKey = target.getAttribute("data-bindkey");
				if (bindKey !== null) {
					var bindkeyvalue = bindValue[bindKey];

					var bindkeyindex = target.getAttribute("data-bindkeystartindex");
					if (bindkeyindex !== null) {
						bindkeyvalue = bindkeyvalue.substring(bindkeyindex);
					}
					target.setAttribute("data-bindkeyvalue", bindkeyvalue);
				}

				// 하나프로젝트에서 .data(key)형태로 데이터를 꺼내와서 처리 불가(setAttribute로 설정된
				// key값이 소문자 처리가 된다..)
				// var attrKey = target.getAttribute("data-attrkey");
				// if( attrKey !== null ){
				// var attrKeys = attrKey.split("|");
				// for( var k = 0, kc = attrKeys.length; k < kc; k++ ){
				// var targetKey = attrKeys[k];
				// target.setAttribute("data-"+targetKey,bindValue[targetKey]);
				// }
				// }
			});

			if (classCondit) {
				if (i % 2 != 0) {
					item.addClass("even");
				}
			} else {
				if (i % 2 == 0) {
					item.addClass("even");
				}
			}

			var attrKey = item.data("attrkey");
			if (attrKey !== undefined) {
				var attrKeys = attrKey.split("|");
				for ( var k = 0, kc = attrKeys.length; k < kc; k++) {
					var targetKey = attrKeys[k];
					item.data(targetKey, bindValue[targetKey]);
				}
			}

			item.each(function() {
				frag.appendChild(this);
			});

			arrIdx++;
		}

		if (arrIdx > 0) {
			if (isPrepend) {
				obj.insertBefore(frag, obj.firstChild);
			} else {
				obj.appendChild(frag);
			}

			this.updateScroll();
		}

		return obj;
	};

	this.withItem = function(val, realtime, obj) {
		var defaultItem = $(obj.loopItemArray);
		var funcArray;
		if (realtime) {
			funcArray = obj.bindRcvFnArray;
		} else {
			funcArray = obj.bindFnArray;
		}

		var seq = 0;
		defaultItem.each(function() {
			var item = $(this);

			var bindKey = item.data("bindkey");
			if (bindKey !== undefined) {
				item.attr("data-bindkeyvalue", eval("val." + bindKey));
			}

			item.find("*").andSelf().each(function() {
				if ($(this).data("bind") !== undefined) {
					funcArray[seq++](val, this, _this);
				}
			});
		});
	};

	this.replaceItem = function(val, uniqueKey, obj) {
		var itemList = obj.children;
		var itemLength = itemList.length;
		if (uniqueKey === undefined || itemLength == 0) {
			return;
		}

		if (!isArray(val)) {
			val = [ val ];
		}
		
		if (itemLength != obj.replaceItemMapLength) {
			log("[replaceItemMapLength : " + obj.replaceItemMapLength + "][itemLength : " + itemLength + "]", "replaceItem", "BINDER");

			// 초기화후 재 설정
			obj.replaceItemMap = {};
			obj.replaceItemValueMap = {};

			var rowGroupCount = Number(obj.getAttribute("data-rowgroup")), replaceItemMapLength = 0;
			var itemArray = _this.convertToArray(itemList);
			while (itemArray.length != 0) {
				var bindkeyvalue = itemArray[0].getAttribute("data-bindkeyvalue"), bindFields = [];
				$(itemArray.splice(0, rowGroupCount)).find("*").each(function() {
					if (this.getAttribute("data-bindrcvxprss") !== null) {
						bindFields.push(this);
					}
				});

				obj.replaceItemMap[bindkeyvalue] = bindFields;
				obj.replaceItemValueMap[bindkeyvalue] = {};
				replaceItemMapLength = replaceItemMapLength + rowGroupCount;
				log(bindFields, "replaceItemMap[" + bindkeyvalue + "]", "BINDER");
			}
			obj.replaceItemMapLength = replaceItemMapLength;
		}

		var bindEleArray = obj.replaceItemMap[uniqueKey];
		var bindEleValueMap = obj.replaceItemValueMap[uniqueKey];
		for ( var j = 0, jc = bindEleArray.length; j < jc; j++) {
			var bindElement = bindEleArray[j];
			var expression = bindElement.getAttribute("data-bindrcvxprss");
			var value = obj.bindRcvFnArray[j](val[0], bindElement);
			if (bindEleValueMap[expression] != value) {// 값이 다를경우만 적용
				bindEleValueMap[expression] = value;
				_this.setBindValue(bindElement, value);
			}
		}
	};

	this.setBindValue = function(obj, value) {
		var nodeName = obj.nodeName;

		if (/INPUT|SELECT/.test(nodeName)) {
			switch (nodeName) {
			case 'INPUT':
				obj.value = value;
				break;
			case 'SELECT':
				
				if (value.indexOf("<option") > -1) {
					//obj.innerHTML  = (value);//IE셀렉트 innerHTML 버그...
					_this.swapInnerHTML(obj,value,'option');
				} else {
					var options = obj.options;
					for ( var i = 0, ic = options.length; i < ic; i++) {
						if (options[i].value == value) {
							obj.selectedIndex = i;
							break;
						}
					}
				}

				break;
			default:
				obj.innerHTML = value;
				break;
			}
		} else {
			obj.innerHTML = _this.escapeHTMLCharacter(value);
		}
	};
	
	this.escapeHTMLCharacter = function(value){
		// List of HTML entities for escaping.
		/*var htmlEscapes = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '/': '&#x2F;'};
		return ('' + value).replace(/[&<>"'\/]/g, function(match) {
		    return htmlEscapes[match];
		});*/
		
		return value.replace(/&/g,"&amp;");//html이 들어오는 경우도 있으므로 (< , >) 제외
	};

	// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	this.updateScroll = function() {
		// return; //작업중..
		for ( var i in _this.gridMap) {
			var grid = _this.gridMap[i];
			if (grid.scrollBar) {
				grid.scrollBar.resize();
			}
		}
	};

	this.resizeGrid = function() {
		for ( var i in _this.gridMap) {
			var grid = _this.gridMap[i];
			if (grid) {
				grid.resizing();
			}
		}
	};

	this.convertToArray = function(obj, n) {
		// $.makeArray 랑 어느게 좋음?
		if (obj instanceof Array) {
			return obj;
		}

		if (!obj.length) {
			return [];
		} // length must be set on the object, or it is not iterable
		var a = [];

		try {
			a = Array.prototype.slice.call(obj, n);
		}
		// IE 6 and posssibly other browsers will throw an exception, so catch
		// it and use brute force
		catch (e) {
			for ( var i = 0, ic = obj.length; i < ic; i++) {
				a.push(obj[i]);
			}
		}

		return a;
	};
	
	//obj.innerHTML  = (value);//IE셀렉트 innerHTML 버그...
	this.swapInnerHTML = function(obj, newHTML, childTagName) {
		var outerHTML = obj.outerHTML;
		var expression = "<"+childTagName+"[^>]*>[^<]*(<(?!"+childTagName+")[^<]*)*.*?<\\/"+childTagName+">";
		outerHTML = outerHTML.replace(new RegExp(expression,'ig'),newHTML);
		obj.outerHTML = outerHTML;
	};

	return _this;
}

function defaultFormInitialize(formObject) {
	try {
		setSecurityInput(formObject);// E2E, 키패드 적용
	} catch (e) {
	}
}

function bindAndInitialize(showedForm, needInitForms) {
	var binderArray = new Array();
	showedForm.each(function(i) {
		var f = this, $f = $(f), fid = f.id;

		if (fid === undefined || fid == "") {
			return true;
		}

		var binder = manager.addBinder(fid);
		binder.analyze(fid);
		binderArray.push(binder);

		if ($f.data('object') === undefined) {
			defaultFormInitialize(f);
			if (typeof f.initialize == 'function') {
				f.initialize(fid);
			}
			$f.data("object", f);
		}
	});

	// @@@@@@@@@@@@@@@@기존의 binder.syncServer()를 모아서 한방에 : S
	var binderArrayLength = binderArray.length;
	if (binderArrayLength > 0) {
		var syncParam = "";
		for ( var i = 0; i < binderArrayLength; i++) {
			var obj = binderArray[i].getSyncServerData();
			syncParam += "&_trcodes_=" + encodeURIComponent(obj["_trcodes_"]);
			syncParam += "&_fields_=" + encodeURIComponent(obj["_fields_"]);
			syncParam += "&_funcs_=" + encodeURIComponent(obj["_funcs_"]);
			syncParam += "&_id_=" + encodeURIComponent(obj["_id_"]);
			syncParam += "&_maxrowsize_=" + encodeURIComponent(obj["_maxrowsize_"]);
		}

		if (syncParam.length > 0) {
			syncParam = syncParam.substring(1);
		}

		$.ajax({
			url : '/WEB-APP/wts/data.jspx?cmd=regist',
			async : false,// 동기 호출
			type : 'post',
			data : syncParam
		});
	}
	// @@@@@@@@@@@@@@@@기존의 binder.syncServer()를 모아서 한방에 : E

	if (needInitForms) { // 윈도우 내의 모든 form의 initialize는 호출(bind는 안하더라도..)
		needInitForms.not(showedForm).each(function() {
			var f = this, $f = $(f);
			if ($f.data('object') === undefined) {
				defaultFormInitialize(f);
				if (typeof f.initialize == 'function') {
					f.initialize(f.id);
				}
				$f.data("object", f);
			}
		});
	}

	showedForm.each(function(i) {
		var f = this, $f = $(f), fid = f.id;
		try {
			// 탭이 아니고 조건없이 submit되는 form이라면
			if ($f.attr('data-autosubmit') == 'true') {
				$f.submit();
			}
		} catch (e) {
			alert('[' + fid + ']bindAndInitialize auto submit error\n' + e.message);
		}
	});
}

// 이전버전과의 호환
function send(flag, jcode, formObjId, trNames) {
	manager.send(flag, jcode, formObjId, trNames);
}

// =====================================================================Util==========================================================
/**
 * 디버그 모드시 로그를 출력한다.
 * 
 * @param object
 *            obj 출력할 object
 * @param string
 *            tag tag 이름으로 출력( 로그간 구분을 위해)
 */
function log(obj, tag, logType) {
	if (logType === undefined) {
		logType = "ETC";
	}

	if (manager._WtsDebugMode) {
		if (manager._WtsDebugLogType[logType] !== true) {
			return;
		}

		if (manager._WtsDebugPosition == "console" && window.console) {
			window.console.log(tag, ' >>> ', obj);
			return;
		} else if (manager._WtsDebugPosition == "body") {
			var tr = tag + "" + obj + "<hr />";
			$(__wtsDebugWindow.document.getElementById("debugBody")).prepend(tr);
			return;
		} else {
			if(window.console){
				window.console.log(tag, ' >>> ', obj);
			}
			return;
		}
	}
}

function __d(pw, showLogAll) {
	var returnVal = "FAIL";
	$.ajax({
		async : false,
		url : "/WEB-APP/wts/main/checkAdminUser.cmd",
		data : 'pw=' + pw,
		success : function(data) {
			var flag = data.split("|");
			if (flag[0] == "success") {
				$(window).bind('beforeunload', function() {
					if (__wtsDebugWindow.close) {
						__wtsDebugWindow.close();
					}
				});
				var br = "<br/>";
				var bar = "&nbsp;&nbsp;";
				var clearBtn = "<button class='_clear' onclick='document.getElementById(\"debugBody\").innerHTML=\"\"'>clear</button>";
				var mapBtn = "<button onclick='opener.window.manager._logs();'>mapInfo</button>";
				var grepInput = "grep <input onkeydown='_search(this,event)' type='text' id='debug_input_text' style='width:150px;'/>";

				manager._WtsDebugMode = true;
				var stopCheck = '<span class="borderSpan" >로그 : ';
				stopCheck += '<input type="checkbox" name="wtsLogRadio" id="wtsLogRadio_on" onclick="opener.window.manager._WtsDebugMode=this.checked;" checked="checked" /><label for="wtsLogRadio_on">on</label>';
				stopCheck += '</span>';

				
				var positionRadio = '<span class="borderSpan" >위치 : ';
				positionRadio += '<input type="radio" name="wtsLogPosition" id="wtsLogPosition_console" onclick="opener.window.manager._WtsDebugPosition=\'console\';" checked="checked" /><label for="wtsLogPosition_console" title="parent console">con</label>';
				positionRadio += '<input type="radio" name="wtsLogPosition" id="wtsLogPosition_body" onclick="opener.window.manager._WtsDebugPosition=\'body\';"  /><label for="wtsLogPosition_body" title="body">body</label>';
				positionRadio += '</span>';
				
				
				
				var logCheck = '<span class="borderSpan" >타입 : ';
				var wtsDebugLogType = manager._WtsDebugLogType;
				for ( var i in wtsDebugLogType) {
					if (showLogAll === true) {
						wtsDebugLogType[i] = true;
					}
					var checked = wtsDebugLogType[i] === true ? " checked='checked' " : "";
					logCheck += "<input type='checkbox' " + checked + " id='logTypeCheck_" + i + "' onclick='opener.window.manager._logTypeToggle(this,\"" + i + "\");'/><label for ='logTypeCheck_" + i + "'>" + i + "</label>";
				}
				logCheck += '</span>';

				var script = '<script src="http://code.jquery.com/jquery-1.9.1.js"></script>' + '<script>' + 'function changeFont(target){' + 'document.getElementById("debugBody").className=\"f\"+target.value' + '}' + 'function _search(target,e){' + 'if(e.keyCode == 13){' + 'var txt = $(target).val();' + '$("#debugBody p").hide().filter(function(){return $(this).text().indexOf(txt) > -1}).show();' + '}' + '}' + '</script>';

				var bodyStyle = "background-color:black;color:#C0C0C0;line-height: 120%;";
				var debugCss = '<style type="text/css">';
				debugCss += "hr,body,div{margin:0px;}";
				debugCss += "html{height: 100%;overflow: hidden;}body{margin: 0;padding: 0;border: 0;height: 100%;}";
				debugCss += "div#input_div{background-color:white;color:black;width: 100%;height:50px;padding:10px;}";
				debugCss += "div#debugBody{position: absolute;width: 100%;overflow-y: auto;top: 70px;bottom: 0px;}";
				debugCss += "div#debugBody div,div#debugBody span{display:inline-block !important;}";
				debugCss += ".borderSpan{display:inline-block;margin-right:10px;border:2px solid #ededed}";
				debugCss += "</style>";

				eval(flag[1]);

				doc.write('<title>cyber-i |||| WTS DATA INFO </title>' + '<body style="' + bodyStyle + '">' + script + debugCss + '<div id="input_div">' + grepInput + clearBtn + bar + mapBtn + br + stopCheck +positionRadio+ logCheck + '</div>' + '<hr/>' + '<div id="debugBody"></div>' + '</body>');

				$(doc).ready(function() {
					eval(flag[2]);
					$(__wtsDebugWindow).bind('beforeunload', function() {
						manager._WtsDebugMode = false;
					});
				});
				returnVal = "SUCCESS";
			}
		}
	});
	return returnVal;
}