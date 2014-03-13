
/*==========================
  스마트crm
============================*/

	/* 검색조건저장 */
	$('.d4_btn1').on('click', function () {
		var dia1 = ci.dialog.open({
			id : 'd4_layer1', // id 지정
			title : '검색조건저장', // title 지정
			dom : $('.d4_layer1'), // 내용으로 들어갈 마크업 지정
			focus : $(this), // 다이알로그 닫친뒤 포커스를 주고싶은 요소 지정
			modal : true,
			width:400
		});
	});


	/* 고객분류(태그)저장 */
	$('.d4_btn2').on('click', function () {
		var dia1 = ci.dialog.open({
			id : 'd4_layer2', // id 지정
			title : '고객분류(태그)저장', // title 지정
			dom : $('.d4_layer2'), // 내용으로 들어갈 마크업 지정
			focus : $(this), // 다이알로그 닫친뒤 포커스를 주고싶은 요소 지정
			modal : true,
			width:400,
			afterAppend : function () {
				var btn = $(this).find('.open-modal-btn');
				btn.on('click', function () {
				
					var dia2 = ci.dialog.open({
						id : 'd4_layer3', // id 지정
						title : '고객분류(태그)관리', // title 지정
						dom : $('.d4_layer3'), // 내용으로 들어갈 마크업 지정
						focus : $(this), // 다이알로그 닫친뒤 포커스를 주고싶은 요소 지정
						modal : true,
						width:400,
					});
					return false;
				});
			}
		});
		return false;
	});

	/* 호칭저장 */
	$('.d4_btn4').on('click', function () {
		var dia1 = ci.dialog.open({
			id : 'd4_layer4', // id 지정
			title : '호칭저장', // title 지정
			dom : $('.d4_layer4'), // 내용으로 들어갈 마크업 지정
			focus : $(this), // 다이알로그 닫친뒤 포커스를 주고싶은 요소 지정
			modal : true,
			width:400
		});
		return false;
	});


	/* 라벨지출력 팝업 */
	$('.d4_btn5').on('click', function () {
		var dia1 = ci.dialog.open({
			id : 'd4_layer5', // id 지정
			title : '라벨지출력', // title 지정
			dom : $('.d4_layer5'), // 내용으로 들어갈 마크업 지정
			focus : $(this), // 다이알로그 닫친뒤 포커스를 주고싶은 요소 지정
			modal : true,
			width:400
		});
		return false;
	});