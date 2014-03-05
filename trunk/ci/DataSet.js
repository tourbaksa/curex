(function() {
	window['DataSet'] = function(initObj) {
		this.mp = new Object();
		this.keyArry = new Array();

		if (typeof initObj === 'object') {
			for ( var i in initObj) {
				if (initObj.hasOwnProperty(i)) {
					this.keyArry.push(i);
					if (initObj[i] instanceof Array) {
						this.mp[i] = initObj[i];
					} else {
						this.mp[i] = [ initObj[i] ];
					}
				}
			}
		}

	};

	DataSet.prototype.put = function(key, value, idx) {
		if (value === undefined || value === null) {
			value = '';
		}

		var arry = this.mp[key];
		if (!arry) {
			arry = new Array();
			this.mp[key] = arry;
			this.keyArry[this.keyArry.length] = key;
		}

		if (idx === undefined || idx == null) {
			idx = 0;
		}
		arry[idx] = value + '';

		return this;
	};

	DataSet.prototype.get = function(key, idx) {
		var arry = this.mp[key];
		if (!arry)
			return '';
		if (idx === undefined || idx == null) {
			idx = 0;
		}
		var val = arry[idx];

		if (!val)
			val = '';

		return val.toString().replace(/(^\s*)|(\s*$)/g, "");
	};

	DataSet.prototype.getInt = function(key, idx) {
		if (idx === undefined || idx == null) {
			idx = 0;
		}
		var intV = parseInt(this.get(key, idx).replace(/,/g, ''));
		return isNaN(intV) ? 0 : intV;
	};

	DataSet.prototype.add = function(key, value) {
		var arry = this.mp[key];
		if (!arry) {
			arry = new Array();
			this.mp[key] = arry;
			this.keyArry[this.keyArry.length] = key;
		}

		arry[arry.length] = value;

		return this;
	};

	DataSet.prototype.getCount = function(key) {
		var arry = this.mp[key];
		if (!arry)
			return 0;
		return arry.length;
	};

	DataSet.prototype.toString = function() {
		var str = '';
		for ( var i = 0; i < this.keyArry.length; i++) {
			var key = this.keyArry[i];
			var arr = this.mp[key];
			str += key + ' = ' + this.mp[key].length + '[';
			for ( var j = 0; j < arr.length; j++) {
				str += ((j != 0) ? ',' : '') + this.mp[key][j];
			}
			str += ']\n';
		}
		return str;
	};

	DataSet.prototype.getArray = function(key) {
		return this.mp[key];
	};

	DataSet.prototype.clear = function() {
		this.mp = new Object();
		this.keyArry = new Array();
	};

	DataSet.prototype.getParam = function(urlEncoding) {
		if (urlEncoding == null || urlEncoding == undefined || urlEncoding == true) {
			urlEncoding = true;
		} else {
			urlEncoding = false;
		}

		var str = '';
		var pCnt = 0;

		if (urlEncoding) {
			for ( var i = 0; i < this.keyArry.length; i++) {
				var key = this.keyArry[i];
				var arr = this.mp[key];
				for ( var j = 0; j < arr.length; j++) {
					str += ((pCnt != 0) ? '&' : '') + key + '=' + encodeURIComponent('' + $.trim(this.mp[key][j]));
					pCnt++;
				}
			}
		} else {
			for ( var i = 0; i < this.keyArry.length; i++) {
				var key = this.keyArry[i];
				var arr = this.mp[key];
				for ( var j = 0; j < arr.length; j++) {
					str += ((pCnt != 0) ? '&' : '') + key + '=' + $.trim(this.mp[key][j]);
					pCnt++;
				}
			}
		}
		return str;
	};

	DataSet.prototype.del = function(key, idx) {
		var arry = this.mp[key];
		if (!arry)
			return;
		arry.splice(idx, 1);
	};

	DataSet.prototype.delRow = function(idx) {
		for ( var i = 0; i < this.keyArry.length; i++) {
			var key = this.keyArry[i];
			var arry = this.mp[key];
			if (!arry)
				continue;
			arry.splice(idx, 1);
		}
	};

	DataSet.prototype.toXML = function() {
		var cnt = this.count();
		var buff = "<dataset><result>";

		for ( var i = 0; i < cnt; i++) {
			buff += "<data-block>";

			for ( var j = 0; j < this.keyArry.length; j++) {
				var key = this.keyArry[j];
				var arr = this.mp[key];

				buff += "<" + key + ">";

				var tmp = arr[i];
				if (tmp == null || tmp == undefined)
					tmp = "";

				buff += tmp;
				buff += "</" + key + ">";
			}

			buff += "</data-block>";
		}

		buff += "</result></dataset>";
		return buff;
	};

	DataSet.prototype.count = function() {
		var max = 0;
		for ( var i = 0; i < this.keyArry.length; i++) {
			var key = this.keyArry[i];
			var len = this.mp[key].length;

			if (max < len)
				max = len;
		}

		return max;
	};

	DataSet.prototype.toString = function() {
		var ret = '';
		for ( var i = 0, cnt = this.keyArry.length; i < cnt; i++) {
			var arry = this.mp[this.keyArry[i]];
			var value = '';
			if (arry) {
				for ( var q = 0, cnt2 = arry.length; q < cnt2; q++) {
					if (q != (cnt2 - 1)) {
						value += (arry[q] + ', ');
					} else {
						value += (arry[q]);
					}
				}
			}

			ret += (this.keyArry[i] + ' : ' + cnt2 + ' [ ' + value + ' ]\n');
		}

		return ret;
	};

	DataSet.prototype.append = function(another) {

		for ( var i = 0, cnt = another.keyArry.length; i < cnt; i++) {
			var key = another.keyArry[i];
			var arry = another.mp[key];
			if (!arry) {
				continue;
			} else {

				for ( var q = 0, cnt2 = arry.length; q < cnt2; q++) {
					this.add(key, arry[q]);
				}
			}
		}
	};

	DataSet.prototype.transForm = function(obj) {
		for ( var i in obj) {
			if (obj.hasOwnProperty(i)) {
				this.add(i, obj[i]);
			}
		}
	};

})();


