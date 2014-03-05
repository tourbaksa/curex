(function(ci) {

	var self = {};

	/**
	 * PRIVATE
	 */

	function isJQueryObj(obj) {
		if (window.jQuery && obj instanceof jQuery) {
			return true;
		} else {
			return false;
		}
	}

	function isString(obj) {
		return typeof obj === 'string';
	}

	function isElement(obj) {
		try {
			// Using W3 DOM2 (works for FF, Opera and Chrom)
			return obj instanceof HTMLElement;
		} catch (e) {
			// Browsers not supporting W3 DOM2 don't have HTMLElement and
			// an exception is thrown and we end up here. Testing some
			// properties that all elements have. (works on IE7)
			return (typeof obj === "object") && (obj.nodeType === 1) && (typeof obj.style === "object") && (typeof obj.ownerDocument === "object");
		}
	}

	/**
	 * PUBLICS
	 */

	self.isChecked = function(obj) {

		if (isString(obj)) {
			return document.getElementById(obj).checked;
		}

		if (isJQueryObj(obj)) {
			return obj.is(':checked');
		}

		if (isElement(obj)) {
			return obj.checked;
		}

	};

	self.setChecked = function(obj, bool) {

		if (isString(obj)) {
			document.getElementById(obj).checked = bool;
		}

		if (isJQueryObj(obj)) {
			obj.prop('checked', bool);
		}

		if (isElement(obj)) {
			obj.checked = bool;
		}
	};

	/**
	 * 선택된 option의 index를 반환
	 * 
	 * @param obj
	 * @returns
	 */
	self.getSelectedIndex = function(obj) {

		if (isJQueryObj(obj)) {
			return obj.find('option').index(obj.find(':selected'));
		}

		return -1;
	};

	/**
	 * 선택된 option의 text를 반환
	 * 
	 * @param obj
	 * @returns
	 */
	self.getSelectedText = function(obj) {

		if (isJQueryObj(obj)) {
			return obj.find('option:selected').text();
		} else {
			return obj.options[obj.selectedIndex].text;
		}
	};

	/**
	 * 주어진 value 값에 해당하는 option선택
	 * 
	 * @param obj
	 * @param val
	 *            option의 value 또는 text
	 * @param type
	 *            type이 undefined이거나 'value'이면 value기준 'text'이면 text기준
	 * @returns
	 */
	self.setSelectBox = function(selectBox, val, type) {
		var options = selectBox.options;
		if (type == "text") {
			for ( var i = 0, ic = options.length; i < ic; i++) {
				if (options[i].text == val) {
					selectBox.selectedIndex = i;
				}
			}
		} else {
			for ( var i = 0, ic = options.length; i < ic; i++) {
				if (options[i].value == val) {
					selectBox.selectedIndex = i;
				}
			}
		}
	};

	self.setSelectedIndex = function(obj, idx) {

		if (!idx) {
			idx = 0;
		}

		if (isJQueryObj(obj)) {
			obj.find('option').eq(idx).prop('selected', true);
		}

	};

	/**
	 * 선택된 option의 label과 attribute들을 자바스크립객체로 반환
	 * 
	 * @param selectObj
	 * @returns {object}
	 */
	self.getSelectedObj = function(selectObj) {

		if (isJQueryObj(selectObj)) {
			var selectedItem = selectObj.find(':selected');
			var ret = {
				'label' : selectedItem.text()
			};

			selectedItem = selectedItem[0];
			for ( var attr, i = 0, attrs = selectedItem.attributes, l = attrs.length; i < l; i++) {
				attr = attrs.item(i);
				ret[attr.nodeName] = attr.nodeValue;
			}

			return ret;
		}

	};

	/**
	 * @param opsDataArr -
	 *            option의 속성에 들어갈 데이터 Object를 담고있는 배열
	 * 
	 * ({'label' : '레이블', 'value' : 'true', 'attr_1' : 'a', 'attr_2' : 'b' });
	 * 
	 * label은 화면에 보여질 값이며 나머지는 attribute로 들어간다.
	 * 
	 * @param selectObj -
	 *            select 노드
	 */

	self.setSelectOptions = function(opsDataArr, selectObj) {

		var opsHTML = "";
		for ( var i = 0; i < opsDataArr.length; i++) {
			var obj = opsDataArr[i];
			var label = "";
			opsHTML += "<option ";
			for ( var prop in obj) {
				if (prop == 'label') {
					label = obj[prop];
				} else {
					opsHTML += (prop + "='");
					opsHTML += (obj[prop] + "' ");
				}
			}

			opsHTML += ">";
			opsHTML += label;
			opsHTML += "</option>";
		}

		if (isJQueryObj(selectObj)) {
			selectObj.html(opsHTML);
		} else if (isString(selectObj)) {
			selectObj = document.getElementById(selectObj);
			selectObj.innerHTML = opsHTML;
		} else if (isElement(selectObj)) {
			selectObj.innerHTML = opsHTML;
		}
	};

	self.setOnlyNumber = function(obj, option) {

		option = option || {};

		var format = option['format'];
		var callback = option['callback'];
		//var toFixed = option['toFixed'] || 1;

		obj.on('keydown', function(e) {
			var code = e.keyCode;
			
			var onlyNum = (code > 34 && code < 41) || (code > 47 && code < 58) || (code > 95 && code < 106) || code == 8 || code == 9 || code == 13 || code == 46 || code == 110|| code == 56 || code == 190;
			
			if (!onlyNum) {
				e.preventDefault();
			}


		}).on('keyup', function(e) {
			var value = ci.util.removeCommas(this.value);
			value = Number(value);
			
			if(!isNaN(option['max'])) {
				var m = Number(option['max']);
				
				if(value > m) {
					alert(option['max']+' 까지 정수만 입력가능합니다.');
					this.value = '';
					return;
				}
				
			}
			
			
			if (isNaN(Number(value))) {
				this.value = '';
			} else {
				if (format === true) {
					this.value = ci.util.addCommas(value);
				}
			}
			
			if (callback) {
				callback.apply(this, [ value ]);
			}

		}).attr('onpaste', 'javascript:return false;');
	};

	self.setOnlyKor = function(obj) {
		obj.on('keydown', function(e) {
			var code = e.keyCode;
			var onlyKorean = code == 229 || code == 8 || code == 9 || code == 13 || code == 46;
			if (!onlyKorean) {
				e.preventDefault();
			}
		});
	};
	
	self.setOnlyNumEng = function(obj) {
		obj.css('imeMode','disabled'); 
		obj.on('keydown', function(e) {
			var code = e.keyCode;
			var onlyNumEng = (code > 64 && code < 91) || (code > 34 && code < 41) || (code > 47 && code < 58) || (code > 95 && code < 106) || code == 8 || code == 9 || code == 13 || code == 46 || code == 110|| code == 56 || code == 190;
			if (!onlyNumEng) {
				e.preventDefault();
			}
		});
	};

	self.emptyFieldData = function(obj) {
		if (isJQueryObj(obj) && obj.size() > 0) {
			if (obj[0].nodeName == 'INPUT') {
				obj.val('');
			} else if (obj[0].nodeName == 'SELECT') {
				ci.ui.setSelectedIndex(obj, 0);
			} else {
				obj.html('');
			}
		}
	};

	self.setFieldData = function(obj, data) {
		if (isJQueryObj(obj) && obj.size() > 0) {
			if (obj[0].nodeName == 'INPUT' || obj[0].nodeName == 'SELECT') {
				obj.val(data);
			} else {
				obj.html(data);
			}
		}
	};

	self.getFieldData = function(obj) {
		if (isJQueryObj(obj) && obj.size() > 0) {
			if (obj[0].nodeName == 'INPUT' || obj[0].nodeName == 'SELECT') {
				return obj.val();
			} else {
				return obj.html();
			}
		}
	};

	self.getNumberData = function(obj) {
		if (isJQueryObj(obj) && obj.size() > 0) {
			var ret = parseInt(ci.util.removeCommas(ci.ui.getFieldData(obj)), 10);
			if (isNaN(ret)) {
				ret = 0;
			}
			return ret;
		}
	};

	self.transformTable = function(table, transType) {
		if (transType == "type1") {
			var trs = table.find("thead tr");
			var rowgroup = trs.size();

			if (rowgroup == 1) {
				var ths = trs.children();
				table.find("tbody tr").each(function() {
					$(this).children().each(function(i) {
						$(this).attr("data-title", ths.eq(i).text());
					});
				});

				table.addClass("transform-type1");
				table.find("colgroup").remove();
			}
		} else if (transType == "type2") {
			var trs = table.find("thead tr");
			var rowgroup = trs.size();

			if (rowgroup == 1) {
				var ths = trs.children();
				table.find("tbody tr").each(function() {
					$(this).children().each(function(i) {
						$(this).attr("data-title", ths.eq(i).text());
					});
				});

				table.addClass("transform-type2");
				table.find("colgroup").remove();
			}
		}

	};

	self.checkFieldData = function(obj, name) {
		var value = '';
		if (isJQueryObj(obj) && obj.size() > 0) {
			if (obj[0].nodeName == 'INPUT') {
				value = obj.val();
			} else {
				value = obj.html();
			}

			if (ci.util.isNull(value)) {
				alert(name + '을(를) 입력해주세요');
				obj.select().focus();
				return false;
			}
			return true;
		}
		return false;
	};

	self.checkByteKeyup = function(obj) {
		if (!isJQueryObj(obj)) {
			obj = $(obj);
		}
		obj.each(function() {
			$(this).on('keyup', function() {
				ci.util.checkByte($(this), $(this).data('maxbyte'));
			});
		});
	};

	self.makeElement = function(param) {

		if (!param || !param.nodeType) {
			throw '파라미터가 올바르지 않습니다. 필수 [nodeType]';
		}

		var ret = '<' + param.nodeType;
		for ( var i in param) {
			if (i == 'nodeType') {
				continue;
			}
			ret += ' ' + i + '="' + param[i] + '"';
		}

		ret += '></' + param.nodeType + '>';

		return ret;
	};
	
	self.showElementEvent = function(elem){
		elem = $(elem);
		return $._data( elem[0], 'events' );
	};
	
	self.bindEnterEvent = function(elem,event) {
		elem = $(elem);
		elem.on('keydown',function(e){
			if(e.keyCode == 13) {
				e.preventDefault();
				if(typeof event == 'function') {
					event();
				}
			}
		});
	};

	/**
	 * REGIST
	 */
	if (!ci) {
		window.ci = ci = {};
	}
	ci.ui = self;

})(window.ci);
