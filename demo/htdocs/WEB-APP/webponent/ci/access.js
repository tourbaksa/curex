/**
 * ci.access
 *
 * JS Library for Accessibility
 *
 * requires jQuery
 * 
 * Author : Cyber Imagination
 *
 */

var HOMEPAGE_NAME = '하나대투증권';

(function () {


	var self = {};


	/**
	 * 
	 */
	function setTitle () {


		var titleDepth2 = $('h2').text();

		var titleDepth3 = $('h3').text();

		var title = titleDepth3 + ' ' + titleDepth2 + ' : ' + HOMEPAGE_NAME;

		document.title = title;
	}


	/**
	 * 
	 */
	/*$(document).ready(function () {


		//setTitle();


	});*/


	if (typeof ci == 'undefined') {
		window.ci = {};
	}

	ci.access = self;

})();