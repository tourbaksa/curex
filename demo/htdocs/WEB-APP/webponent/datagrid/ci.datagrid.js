/**
 	ci.datagrid.js (jquery.dataTables.js wrapper)
 	
 	@copyright CyberImagination [All rights reserved]
 	@author  Sangwon Oh

 */
(function(ci){

	var self = {};

	//=========================================================================================================
	//=========================================================================================================
	//=========================================================================================================
	//=========================================================================================================
	//=========================================================================================================
	//=========================================================================================================

	var COLUMN_NAMES = 'COLUMN_NAMES';
	var BLD_NAME = 'BLD_NAME';
	var BLD_PREFIX = 'bld:';
	var PAGE = 'PAGE';
	var SORTED_COLUMN = 'SORTED_COLUMN';
	var SORT_TYPE = 'SORT_TYPE';
	var USE_SERVER_SIDE_SORTING = 'USE_SERVER_SIDE_SORTING';
	var USE_SERVER_SIDE_CACHING = 'USE_SERVER_SIDE_CACHING';
	var GRID_CONTROLLER_URL = '/WEB-APP/webponent/datagrid/gridController/';

	//=========================================================================================================
	//=========================================================================================================
	//=========================================================================================================
	//=========================================================================================================
	//=========================================================================================================
	//=========================================================================================================

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

	/**
		서버에 request parameter를 HTML폼을이용해서 보내는지, 
		데이터셋을 이용해서 보내는지 체크
	*/
	function getParamType (param) {

		if (window.DataSet && param instanceof DataSet) {

			return 'DataSet';

		} else if (param instanceof jQuery) {

			if (param.is('form')) {
				return 'form';
			}

		} else if (typeof param === 'string') {

			return 'selector';

		}	
	}
	

	/**
		그리드의 최상단 요소를 반환
	*/
	function getDataGridWrapper (dataTable) {

		return dataTable.closest('.dataTables_wrapper');
	}

	/**
		param에 추가 변수를 붙힌다.
	*/
	function addExtraParameter (param, paramName, value) {

		var paramType = getParamType(param);

		if (paramType == 'DataSet') {
			param.put(paramName, value);

		} else if (paramType == 'form') {

			param.find('[name="'+paramName+'"]').remove();
			var hiddenInput = $('<input type="hidden" name="'+paramName+'">');
			hiddenInput.val(value);
			param.append(hiddenInput);

		} else if (paramType == 'selector') {

			param = $(param);
			param.find('[name="'+paramName+'"]').remove();
			var hiddenInput = $('<input type="hidden" name="'+paramName+'">');
			hiddenInput.val(paramName);
			param.append(hiddenInput);

		} else {
			parameter = '';
		}
		return param;

	}

	//=========================================================================================================
	//=========================================================================================================
	//=========================================================================================================
	//=========================================================================================================
	//=========================================================================================================
	//=========================================================================================================

	/**
		마크업 초기화
	*/
	function initializeDataTable (dataGrid, tableElement, option) {

		var gridInfo = analyzeGridInfo(tableElement);
		dataGrid.gridInfo = gridInfo;

		var dataTable = applyDataTables(tableElement, gridInfo, option);

		//dataTable = setGridExtralayout(tableElement, gridInfo, option);

		dataGrid.dataTable = dataTable;

		return dataGrid;
	}

	/**
		tbody내에 정의되어있는 컬럼들의 가로길이 소팅여부덩의 정보를 정리한다.
	*/
	function analyzeGridInfo (table) {

		var gridInfo = {};

		gridInfo.width = '100%';
		gridInfo.height = '200px';

		gridInfo.fixedColumns = 0;
		gridInfo.hasCheckbox = false;
		gridInfo.columnList = [];
		gridInfo.hiddenColumns = [];

		gridInfo.aoColumns = [];
		
		var gridWidth = table.attr('data-width');

		if (gridWidth) {
			gridInfo.width = gridWidth;
		}

		var gridHeight = table.attr('data-height');

		if (gridWidth) {
			gridInfo.height = gridHeight;
		}

		var infoRow = table.find('tbody tr:eq(0)');
		var columns = infoRow.find('td');

		var header = table.find('thead tr');
		var ths = header.find('th');

		columns.each(function (i) {

			var column = $(this);

			var dataBind = column.attr('data-bind');

			if (dataBind) {
				gridInfo.columnList.push(dataBind);
				ths.eq(i).attr('data-bind', dataBind);
			}

			
			if (column.attr('fixed') == 'fixed') {
				gridInfo.fixedColumns ++;
			}

			// aoColumn설정
			var oColumn = {};

			var width = column.attr('width');

			var autoWidth = false;
			if (width) {
				oColumn.sWidth = width;
			} else {
				autoWidth = true;
				var headerText = ths.eq(i).text();
				oColumn.sWidth = headerText.length * 22 + 40 + 'px';;
			}

			//console.log(i, ':', oColumn.sWidth, ':', autoWidth);

			if (column.attr('hidden') == 'hidden') {

				gridInfo.hiddenColumns.push(i);
				oColumn.bVisible = false;
			} else {

				oColumn.bVisible = true;
			}

			var align = column.attr('align');

			if (align && align.length > 0) {
				oColumn.sClass = 'grid-align-' + align;
			} else {
				oColumn.sClass = '';
			}

			if (dataBind == 'CHECK_BOX' || dataBind == 'CHECK_BOX_ALL' ) {

				gridInfo.hasCheckbox = true;

				oColumn.sClass = 'grid-align-center';

				oColumn.fnRender = function ( oObj ) {
					
					var checkbox = '<input type=\"checkbox\" class="data-grid-checkbox" value="'+ oObj.aData[0] +'"> ';

					return checkbox;
				};

				oColumn.bSortable = false;


				if (dataBind == 'CHECK_BOX_ALL') {

					var checkAllCheckBox = $('<input type="checkbox">');
					
					ths.eq(i).append(checkAllCheckBox);
				}


			}

			gridInfo.aoColumns.push(oColumn);

		});


		if (gridInfo.columnList.length !== columns.length) {
			//alert('에러! data-bind속성이 지정되지 않은 컬럼이 있습니다.');
		}

		infoRow.remove();

		gridInfo.columnMapping = {};

		$.each(gridInfo.columnList, function (i, val) {

			gridInfo.columnMapping[val] = i;

		});

		return gridInfo;
	}

	/**

	*/
	function setGridExtralayout(tableElement, gridInfo, option) {

	}

	/**
		그리드 정보와 옵션을 기반으로 그리드를 초기화 시킨다.
	*/
	function applyDataTables(table, gridInfo, option) {

		var aoColumns = gridInfo.aoColumns;

		if (option.width) {
			gridInfo.width = option.width;
		}

		if (option.height) {
			gridInfo.height = option.height;
		}

		var dataTableOption = {
			sScrollX : '100%',
			sScrollXInner : gridInfo.width,
			sScrollY : gridInfo.height,
			sDom: 'trS',
			bDeferRender: false,
			aaSorting : [],
			bAutoWidth : false,
			aoColumns : aoColumns,
			
			oLanguage: {
				sEmptyTable: ' ',
				sInfoEmpty: ' '
			}
		};

		if (gridInfo.hasCheckbox) {
			dataTableOption.oScroller = {
				displayBuffer: 99999999
			}
		}

		if (option.showInfo === true) {
			dataTableOption.sDom += 'i';
		}

		if (option.rowDrawCallback) {

			dataTableOption.fnCreatedRow = function (nRow, aData, iDataIndex ) {

				nRow.get = function (columnName) {

					var idx = gridInfo.columnMapping[columnName];

					var hiddenColumnCount = 0;

					var aoColumns = table.dataTable().fnSettings().aoColumns;

					for (var i = 0; i < idx; i ++) {
						if (aoColumns[i].bVisible === false) {
							hiddenColumnCount ++;
						}
					}

					var cellIdx = idx - hiddenColumnCount;

					return $(nRow).find('td').eq(cellIdx)[0];
					
				};

				aData.get = function (columnName) {

					return aData[gridInfo.columnMapping[columnName]];
					
				};

				option.rowDrawCallback(nRow, aData, iDataIndex );
			};
		}

		if (option.paging === true) {
			dataTableOption.bSort = false;
		}

		if (option.serverSideSorting === true) {
			dataTableOption.bSort = false;
		}

		var dataTable = table.dataTable(dataTableOption);

		if (gridInfo.fixedColumns > 0) {

			var leftWidth = 0;

			for (var i = 0; i < gridInfo.fixedColumns ; i ++) {
				leftWidth += parseInt(gridInfo.aoColumns[i].sWidth);
			}

			if (isNaN(leftWidth)) {
				leftWidth = 200;
			}

			var fixedColumnOption = {
				iLeftColumns : gridInfo.fixedColumns,
				iLeftWidth: leftWidth
			}

			if (option.fixedRowDrawCallback) {
				fixedColumnOption.fnDrawCallback = function (lInfo) {
					
					var body = $(lInfo.body).find('tbody');

					var trs = body.find('tr');

					trs.each(function (i, tr) {

						tr.get = function (columnName) {

							var idx = gridInfo.columnMapping[columnName];

							var hiddenColumnCount = 0;

							var aoColumns = table.dataTable().fnSettings().aoColumns;

							for (var i = 0; i < idx; i ++) {
								if (aoColumns[i].bVisible === false && i >= gridInfo.fixedColumns ) {
									hiddenColumnCount ++;
								}
							}

							var cellIdx = idx - hiddenColumnCount;

							if (cellIdx >= gridInfo.fixedColumns) {
								throw new Error ('FIXED된 컬럼이 아닌경우는 rowDrawCallback을 이용해 주세요.');
							}

							return $(tr).find('td').eq(cellIdx)[0];
						}
						
						option.fixedRowDrawCallback(tr, i);
					});

					
				}
			}

			new FixedColumns( dataTable, fixedColumnOption);

		}

		if (option.paging) {

			var wrapper = getDataGridWrapper(dataTable);
			var pagingArea = $('<div class="grid-paging-area">');
			wrapper.after(pagingArea);

			dataTable.pagingArea = pagingArea;
		}

		var colspanedThs = getDataGridWrapper(dataTable).find('th').filter(function () {
			return $(this).attr('colspan') > 1;
		});

		var colspanInfoArray = [];

		$.each(colspanedThs, function (i, v) {
			var th = $(v);
			var colspan = th.attr('colspan') * 1;
			for (var i = 0; i < colspan; i ++) {
				colspanInfoArray.push(th);
			}
		});

		var columns = $.grep(dataTable.fnSettings().aoColumns, function (column, i) {
			return column.bVisible;
		});


		$.each(columns, function (i, column) {

			var th = $(column.nTh);

			th.width(column.sWidth);

			var row = th.closest('tr');
			var thead = row.closest('thead');

			var rows = thead.find('tr');
			var rowIdx = rows.index(row);

			if (rowIdx > 0) {

				var thsInSameRow = row.find('th');
				var thIdxInSameRow = thsInSameRow.index(th);
				var parentTh = colspanInfoArray[thIdxInSameRow];

				th[0].colspanParent = parentTh;

				if (!parentTh.data('width')) {
					parentTh.data('width', 0);
				}

				parentTh.data('width', parentTh.data('width') + parseInt(column.sWidth));
				parentTh.width(parentTh.data('width'));
			}
		});

		dataTable.fnAdjustColumnSizing();
		
		return dataTable;
	}

	//=========================================================================================================
	//=========================================================================================================
	//=========================================================================================================
	//=========================================================================================================
	//=========================================================================================================
	//=========================================================================================================

	/**
		서버통신을 위한 로직을 정의한다.
	*/
	function bindServerInteractions (dataGrid, table, option) {

		// bind함수 등록
		dataGrid.bind = function (bindOption) {

			dataGrid.trigger('beforebind');

			if (!bindOption) {
				bindOption = {};
			}

			$.extend(option, bindOption);
		
			/*
				데이터소스 타잎 설정
			*/
			var ds = option.dataSource;

			var dsType = null;

			if (typeof ds === 'string') {

				if (ds.indexOf(BLD_PREFIX) > -1) {;
					dsType = 'bld';
				} else {
					dsType = 'url';
				}

			} else if (typeof ds === 'object') {
				dsType = 'ao';
			}

			if (dsType == null) {
				//alert('지정된 데이터 타입이 아닙니다.');
				return;
			}

			
			/*
				인풋 파라메터 설정
			*/
			if (dsType !== 'ao') {
				var parameter = null;

				var param = option.param;
				var paramType = getParamType(param);

				if (paramType == 'DataSet') {

					parameter = param.getParam();

				} else if (paramType == 'form') {
					parameter = param.serialize();

				} else if (paramType == 'selector') {

					param = $(param);
					parameter = param.serialize();

				} else {
					parameter = '';
				}	
			}

			var gridInfo = dataGrid.gridInfo;

			/*
				bld : bld실행결과를 이용한 자동 바인딩
				url : 해당 url의 response를 이용한 바인딩
				ao : array object를 이용한 바인딩
			*/

			

			var requestParameters = {};

			// 가져올 컬럼 세팅
			requestParameters[COLUMN_NAMES] = gridInfo.columnList;

			// 첫 페이징일때 처리
			if (option.paging) {
				if (parameter.indexOf(PAGE) < 0) {
					requestParameters[PAGE] = 1;
				}
			}

			if (option.serverSideSorting) {
				if (parameter.indexOf(USE_SERVER_SIDE_SORTING) < 0) {
					resetServerSideSortingStatus(dataGrid);
					requestParameters[USE_SERVER_SIDE_SORTING] = true;
					requestParameters[USE_SERVER_SIDE_CACHING] = false;

				} else {
					requestParameters[USE_SERVER_SIDE_CACHING] = true;
				}
			}

			if (dsType === 'bld') {

				requestParameters[BLD_NAME] = ds.replace(BLD_PREFIX, '');

				parameter += '&' + $.param(requestParameters);

				getDataFromBld(dataGrid, ds, parameter, gridInfo, option);

			} else if (dsType === 'url') {

				parameter += '&' + $.param(requestParameters);

				getDataFromController(dataGrid, ds, parameter, gridInfo, option);

			} else if (dsType === 'ao') {

			}
		}


		return dataGrid;
	}

	/**
		URL을 통해서 데이터를 가저올때 통신포인트
	*/
	function getDataFromController (dataGrid, dataSource, parameter, gridInfo, option) {

		$.ajax({
			url : dataSource,
			type : 'post',
			dataType : 'json',
			data : parameter,
			success : function (data) {				
				ajaxCallback(dataGrid, option, data);
			}
		});

	}

	/**
		BLD를 이용해 데이터를 가져올때 통신 포인트
	*/
	function getDataFromBld(dataGrid, dataSource, parameter, gridInfo, option) {

		$.ajax({
			url : GRID_CONTROLLER_URL + 'getGridData.cmd',
			type : 'post',
			dataType : 'json',
			data : parameter,
			success : function (data) {
				ajaxCallback(dataGrid, option, data);
			}
		});
	}

	/**
		서버에서 그리드 데이터를 가저온 후 프로세싱
	*/
	function ajaxCallback (dataGrid, option, data) {

		// 그리드를 지워주다.
		dataGrid.dataTable.fnClearTable();

		var gridData = data.gridData;

		if (!gridData) {
			gridData = data.aaData;
		}

		if (typeof option.success == 'function') {
			option.success(data);
		}

		dataGrid.dataTable.fnAddData(gridData);

		if (option.paging) {
			processPaging(dataGrid, data, option);
		}

		dataGrid.trigger('afterbind');

	}


	/**
		페이징모드일때 페이지네비게이션을 그리기전에 변수 정리
	*/
	function processPaging (dataGrid, data, option) {

		var pagingInfo = {

			dataSource : option.dataSource,
			param : option.param,

			currPage : data.PAGE,
			totalNum : data.TOTAL_CNT,
			totalPageNum : data.TOTAL_PAGE_CNT,
			pageCount : 10,

			box : dataGrid.dataTable.pagingArea
		};

		drawPaging(dataGrid, pagingInfo);
	}

	/**
		paging : true 일때 그리드 하단에 페이징 네이비게이션을 그려준다.
	*/
	function drawPaging (dataGrid, pagingInfo) {

		var dataSource = pagingInfo.dataSource;
		var param = pagingInfo.param;

		pagingInfo.method = function (pagingNumber) {

			
			param = addExtraParameter(param, PAGE, pagingNumber);
			

			dataGrid.bind({
				dataSource : dataSource,
				param : param
			});

			if (param.is('form')) {
				param.find('[name=PAGE]').remove();
			}
		};

		ci.util.setNavigator(pagingInfo); 
	}

	/**
		서버사이드 소팅
	*/
	function bindServerSideSortingEvents(dataGrid, option) {
		/*
			sorting
			sorting_asc
			sorting_desc
		*/
		var dataTable = dataGrid.dataTable;
		var scrollContainer = dataTable.closest('.dataTables_scroll');
		var scrollHeadInner = scrollContainer.find('.dataTables_scrollHeadInner');
		var ths = scrollHeadInner.find('thead tr:last th');
		
		ths.on('click', function (e) {

			var th = $(this);
			var idx = ths.index(th);

			var sortedColumn = th.attr('data-bind');
			var sortType;

			if (!th.hasClass('sorting_asc') && !th.hasClass('sorting_desc')) {
				ths.removeClass('sorting_asc sorting_desc');
				th.addClass('sorting_asc');
				sortType = 'ASC';

			} else if (th.hasClass('sorting_asc')) {
				th.removeClass('sorting_asc');
				th.addClass('sorting_desc');
				sortType = 'DESC';

			} else if (th.hasClass('sorting_desc')) {
				th.removeClass('sorting_desc');
				th.addClass('sorting_asc');
				sortType = 'ASC';

			}

			var param = option.param;

			param = addExtraParameter(param, USE_SERVER_SIDE_SORTING, true);
			param = addExtraParameter(param, SORTED_COLUMN, sortedColumn);
			param = addExtraParameter(param, SORT_TYPE, sortType);

			dataGrid.bind({
				dataSource : option.dataSource,
				param : param
			});

			if (param && param.is('form')) {
				param.find('[name='+USE_SERVER_SIDE_SORTING+']').remove();
				param.find('[name='+SORTED_COLUMN+']').remove();
				param.find('[name='+SORT_TYPE+']').remove();
			}

		});
	}

	/**
		서버사이트 소팅 상태 초기화
	*/
	function resetServerSideSortingStatus (dataGrid) {

		var dataTable = dataGrid.dataTable;
		var scrollContainer = dataTable.closest('.dataTables_scroll');
		var scrollHeadInner = scrollContainer.find('.dataTables_scrollHeadInner');
		var ths = scrollHeadInner.find('thead tr:last th');

		ths.removeClass('sorting_asc sorting_desc');
	}

	//=========================================================================================================
	//=========================================================================================================
	//=========================================================================================================
	//=========================================================================================================
	//=========================================================================================================
	//=========================================================================================================

	/**
		그리드 UI에 관련된 인터렉션을 부여한다.
	*/
	function bindUiInteractions (dataGrid, tableElement, option) {

		var dataTable = dataGrid.dataTable;
		var scrollContainer = dataTable.closest('.dataTables_scroll');
		var scrollHead = scrollContainer.find('.dataTables_scrollHead');
		var scrollHeadInner = scrollContainer.find('.dataTables_scrollHeadInner');

		/**
			로더
		*/
		var wrapper = getDataGridWrapper(dataTable);
		var loader = $('<div class="data-grid-loader">');

		loader.css({
			'display' : 'none',
			'position' : 'absolute',
			'top' : 0,
			'left' : 0,
			'z-index' : 3,
			'width' : '100%',
			'height' : '100%',
			'background' : 'url(/img/common/loading_small.gif) center no-repeat'
			//'opacity' : '0.3'
		});

		wrapper.append(loader);
		dataGrid.loader = loader;

		loader.open = function () {
			loader.hide();
			loader.show();
		};

		loader.close = function () {
			loader.hide();
		};

		dataGrid.on('beforebind', function () {
			loader.open();
		});

		dataGrid.on('afterbind', function () {
			loader.close();
		});

		/**
			마우스 드래그로 컬럼width 리사이징 할 수 있게하는 로직
		*/
		if (option.resizable !== false) {

			var ths = scrollHeadInner.find('th');

			bindColumnResizing(dataTable, scrollContainer, scrollHead, scrollHeadInner);

		}

		/**
			동적으로 컬럼을 보였다 안보였다 할 수 있게하는 로직
		*/
		dataGrid.toggleColumn = function (col, visible) {

			if (typeof col == 'number') {

				dataTable.fnSetColumnVis(col, visible);

			} else if (typeof col == 'string') {

				dataTable.fnSetColumnVis(dataGrid.gridInfo.columnMapping[col], visible);

			}
			

			if (option.resizable !== false) {

				unBindColumnResizing(scrollContainer);

				var ths = scrollHeadInner.find('th');
				bindColumnResizing(dataTable, scrollContainer, scrollHead, scrollHeadInner);

			}

		};

		if (option.toggleColumn === true) {

			
		}
				
		/**
			TR요소 선택 가능하게 하기
		*/
		if (option.trSelectable === true) {

			tableElement.addClass('trSelectable');
			
			tableElement.on('click', 'tbody tr', function () {
				 $(this).toggleClass('grid-selected-row');
				 $(this).toggleClass('grid-selected-row-style');
			});
		}

		/**
			TR요소 이벤트
		*/
		if (option.trEvent) {

			$.each(option.trEvent, function (eventName, callBack) {
				tableElement.on(eventName, 'tbody tr', function () {
					 var tr = $(this);
					 var array = [];
					 tr.find('td').each(function () {
					 	array.push($.trim($(this).text()));
					 });
					 callBack(tr, array);
				});
			});
		}

		/**
			전체 선택 체크박스 컨트롤
		*/
		if (dataGrid.gridInfo.hasCheckbox) {

			var checkBox = getDataGridWrapper(dataGrid.dataTable).find('thead :checkbox');
			
			checkBox.on('change', function () {

				var gridCheckBoxes = getDataGridWrapper(dataGrid.dataTable).find('tbody .data-grid-checkbox');
		
				if ($(this).is(':checked')) {
					gridCheckBoxes.attr('checked', 'checked');
				} else {
					gridCheckBoxes.removeAttr('checked');
				}

			});

			dataGrid.on('beforebind', function () {
				checkBox.removeAttr('checked');
			});

		}


		/**
			TD요소 이벤트
		*/
		if (option.tdEvent) {
			$.each(option.tdEvent, function (eventName, callBack) {
				tableElement.on(eventName, 'tbody td', function () {
					callBack(this, $.trim($(this).text()));
				});
			});
		}


		/**
			서버사이드 소팅
		*/
		if (option.serverSideSorting === true) {
			bindServerSideSortingEvents(dataGrid, option);
		}

		/*
			클라이언트 엑셀 다운로드
		*/
		if (option.excel == 'client') {
			var oTableTools = new TableTools( dataGrid.dataTable, {
				"aButtons": [
					{ 
						"sExtends": "xls",
						"sButtonText": "엑셀",
						"mColumns": "visible"
					}
				],
				"sSwfPath": "/WEB-APP/webponent/thirdParty/DataTables/extras/TableTools/media/swf/copy_csv_xls.swf"
			});

			getDataGridWrapper(dataGrid.dataTable).before(oTableTools.dom.container);
		}

		/*
			서버 엑셀 다운로드
		*/
		if (option.excel == 'server') {

			//화면을 이동시키지 않으려고 iframe을 이용
			if ($('.data-grid-iframe-for-excel').length === 0) {
				var iframe = $('<iframe class="data-grid-iframe-for-excel" frameborder="0">');
				iframe.attr('name', 'data-grid-iframe-for-excel');
				iframe.attr('src', GRID_CONTROLLER_URL + 'downLoadExcel.cmd');
				$('#contents').append(iframe);
			}

			//서버에 전송시킬 폼생성
			var dataForm = $('<form class="data-grid-form-for-excel">');

			dataForm.attr('method', 'post');
			dataForm.attr('action', GRID_CONTROLLER_URL + 'downLoadExcel.cmd');
			dataForm.attr('target', 'data-grid-iframe-for-excel');

			dataForm.append('<input type="hidden" name="data">')

			getDataGridWrapper(dataGrid.dataTable).after(dataForm);

			//엑셀 다운로드 버튼
			var excelButton = $('<input type="button" class="data-grid-excel-download-btn" value="엑셀">');

			//엑셀 다운로드 버튼 이벤트 부여
			excelButton.on('click', function () {

				var gridData = dataGrid.dataTable.fnGetData();
		
				var dataInput = dataForm.find('[name=data]');

				var data = [];

				var headerSetting = dataGrid.dataTable.fnSettings().aoColumns;

				var headerData = [];

				/*
					테이블 헤더정보 수집
					기본적으로 체크박스와 보이지 않는 컬럼은 제외한다.
				*/
				$.each(headerSetting, function (j, st) {

					if (dataGrid.gridInfo.hasCheckbox && j === 0) {
						return;
					}

					if (j < dataGrid.gridInfo.fixedColumns || st.bVisible) {
						headerData.push(st.sTitle);
					}
				});

				data.push(headerData);

				/*
					테이블 데이터 수집
					기본적으로 체크박스와 보이지 않는 컬럼은 제외한다.
				*/
				$.each(gridData, function (i, row) {
					
					var rowData = [];

					$.each(headerSetting, function (j, st) {

						if (dataGrid.gridInfo.hasCheckbox && j === 0) {
							return;
						}

						if (j < dataGrid.gridInfo.fixedColumns || st.bVisible) {
							rowData.push(row[j]);
						}
					});

					data.push(rowData);
					
				});

				var gridDataString = stringify(data);

				dataInput.val(gridDataString);

				//서버전송
				dataForm.submit();
			});

			getDataGridWrapper(dataGrid.dataTable).before(excelButton);
		}
		
		//선택된 row list 반환
		dataGrid.getSelectedRow = function () {
			
			return tableElement.$('.grid-selected-row');
		}

		//선택된 row의 데이터만 ao로 반환
		dataGrid.getSelectedRowData = function () {

			var selectedTr = tableElement.$('.grid-selected-row');

			var returnArray = [];

			$.each(selectedTr, function (i, v) {

				var aData = dataGrid.dataTable.fnGetData(v);

				
				aData.get = function (columnName) {

					return aData[dataGrid.gridInfo.columnMapping[columnName]];
					
				}

				returnArray.push(aData);

			});

			return returnArray;
		}

		//선택된 row list 반환
		dataGrid.getCheckedRow = function () {
			return getDataGridWrapper(dataGrid.dataTable).find('tbody tr').has('.data-grid-checkbox:checked');
		}

		//선택된 row의 데이터만 ao로 반환
		dataGrid.getCheckedRowData = function () {

			var trs = getDataGridWrapper(dataGrid.dataTable).find('tbody tr').has(':checkbox');
			var selectedTr = getDataGridWrapper(dataGrid.dataTable).find('tbody tr').has('.data-grid-checkbox:checked');

			var returnArray = [];

			$.each(selectedTr, function (i, v) {

				var idx = trs.index(v);

				var aData = dataGrid.dataTable.fnGetData(idx);

				// 공통처리 !
				aData.get = function (columnName) {

					return aData[dataGrid.gridInfo.columnMapping[columnName]];
					
				};

				returnArray.push(aData);

			});

			return returnArray;
		};

		//전체 row의 데이터만 aa로 반환
		dataGrid.getAllRowData = function () {

			var rows = dataGrid.dataTable.fnGetNodes();

			var returnArray = [];

			$.each(rows, function (i, v) {

				var aData = dataGrid.dataTable.fnGetData(v);

				// 공통처리 !
				aData.get = function (columnName) {

					return aData[dataGrid.gridInfo.columnMapping[columnName]];
					
				};

				returnArray.push(aData);

			});

			return returnArray;
		};

		//전체 row의 데이터만 aa로 반환
		dataGrid.getAllRow = function () {
			return rows = dataGrid.dataTable.fnGetNodes();

		};


		// 그리드 제일 마지막에 한행 또는 단일row 추가 (배열형식이 아니구 map형식으로 확장?)
		dataGrid.addRow = function (data) {
			dataGrid.loader.open();

			setTimeout(function () {
				dataGrid.dataTable.fnAddData(data);
				dataGrid.loader.close();
			}, 100);
			
		};

		// ROW를 지운다
		dataGrid.removeRow = function (rows, callback) {

			dataGrid.loader.open();

			setTimeout(function () {

				$.each(rows, function (i, row) {
					
					if (row instanceof jQuery) {
						row = row[0];
					}

					dataGrid.dataTable.fnDeleteRow(row, null, false);
				});

				dataGrid.dataTable.fnDraw();

				if (typeof callback == 'function') {
					callback();
				}

				dataGrid.loader.close();
			}, 100);
		};

		// 그리드를 구성하는 최상단 요소 반환
		dataGrid.getWrapper = function () {

			return getDataGridWrapper(dataGrid.dataTable);

		};

		// 그리드 숨기기
		dataGrid.hide = function () {

			var wrapper = getDataGridWrapper(dataGrid.dataTable);
			wrapper.hide();

		};

		// 그리드 보이기
		dataGrid.show = function () {

			var wrapper = getDataGridWrapper(dataGrid.dataTable);
			wrapper.show();
			
		};
		

		return dataGrid;
	}

	/**
		컬럼width 리사이징 로직을 붙인다
	*/
	function bindColumnResizing (dataTable, scrollContainer, scrollHead, scrollHeadInner) {

		var dragHelpers = [];


		var columns = $.grep(dataTable.fnSettings().aoColumns, function (column, i) {
			return column.bVisible;
		});

		var ths = [];

		$.each(columns, function (i, column) {
			ths.push($(column.nTh));
		});


		$.each(columns, function (i, column) {
			
			var th = $(column.nTh);

			var dragHelper = $('<div class="grid-drag-helper">');
			
			dragHelper.append($('<div>').css({
				position: 'absolute',
				left : 2,
				top : 0,
				width: 3,
				bottom : 0,
			}));


			dragHelper.css({
				position : 'absolute',
				top : 0,
				bottom : 0,
				width : 9,
				'background-color' : 'transparent',
				cursor : 'w-resize',
				'z-index' : 10
			});

			//dragHelper.text(i);
			dragHelpers.push(dragHelper);
			scrollHeadInner.append(dragHelper);
		});

		adJustHelperPosition(scrollHead, ths, dragHelpers);

		$.each(dragHelpers, function (i, dragHelper) {
			
			dragHelper.draggable({

				axis : 'x',

				start : function () {

					$(this).addClass('datagrid-dragging');
					$(this).data('x0', $(this).position().left);
				},

				stop : function (event, ui) {
					
					var diff = $(this).position().left - $(this).data('x0');

					var colspanParent = ths[i][0].colspanParent;

					var updatedWidth = ths[i].outerWidth(true) + diff;

					if (updatedWidth < 20) {
						updatedWidth = 20;
					}

					if (colspanParent) {
						var updatedColspanParentWidth = colspanParent.data('width') + diff;
						if (updatedWidth == 20) {
							updatedColspanParentWidth = 40;
						}
						colspanParent.data('width', updatedColspanParentWidth);
						colspanParent.width(colspanParent.data('width'));
					}

					ths[i].outerWidth(updatedWidth, true);

					dataTable.fnAdjustColumnSizing();
					adJustHelperPosition (scrollHead, ths, dragHelpers);

					$(this).removeClass('datagrid-dragging');
				}
			});
		});
	}

	/**
		마우스 드래그로 컬럼사이즈 조정이 끈난 후 dragHelper들의 위치를
		새로 변경된 컬럼에 맞춰준다.
	*/
	function adJustHelperPosition (scrollHead, ths, dragHelpers) {
		
		$.each(ths, function (i, th) {

			var scrollLeft = scrollHead.scrollLeft();

			var thLeft = th.position().left;
			
			dragHelpers[i].css({
				left : thLeft + th.outerWidth(true) + scrollLeft - 4
			});
		});
	}

	/**
		컬럼width 리사이징 로직을 뗀다
	*/
	function unBindColumnResizing (scrollContainer) {
		scrollContainer.find('.grid-drag-helper').remove();
	}

	//=========================================================================================================
	//=========================================================================================================
	//=========================================================================================================
	//=========================================================================================================
	//=========================================================================================================
	//=========================================================================================================

	/**
		그리드 초기화 포인트
		유효성검사
	*/
	self.init = function (elem, option) {

		var dataGrid = $({});

		if (!option) {
			option = {};
		}

		var tableElement = null;

		if (elem instanceof jQuery) {
			tableElement = elem;
		} else {
			tableElement = $(elem);
		}
		
		if (tableElement == null || tableElement.length === 0) {
			alert('테이블이 지정되지 않았습니다.');
			return;
		}

		dataGrid = initializeDataTable(dataGrid, tableElement, option);
		dataGrid = bindServerInteractions(dataGrid, tableElement, option);
		dataGrid = bindUiInteractions(dataGrid, tableElement, option);

		return dataGrid;

	};


	//전역스코프 부여
	if(!ci) window.ci = ci = {};
	ci.datagrid = self;

})(window.ci);