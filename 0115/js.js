	// var uShow = document.getElementById('userShow');
	// var Event = {
	//     addHandler: function (oElement, sEvent, fnHandler) {
	//         oElement.addEventListener ? oElement.addEventListener(sEvent, fnHandler, false) : oElement.attachEvent("on" + sEvent, fnHandler)    
	//     },
	//     removeHandler: function (oElement, sEvent, fnHandler) {
	//         oElement.removeEventListener ? oElement.removeEventListener(sEvent, fnHandler, false) : oElement.detachEvent("on" + sEvent, fnHandler)
	//     }
	// };

	// function status() {
	// 	var uShow_length = uShow.getElementsByTagName('dd');
	// 	var uShow_length_last = uShow_length[uShow_length.length - 1];
	// 	function show_hide() {
	// 		for (var i = 0; i < uShow_length.length - 1; i++) {
	// 			Event.addHandler(uShow_length[i], 'mouseover', fnover); 
	// 			Event.addHandler(uShow_length[i], 'mouseout', fnout); 
	// 		};
	// 	};show_hide();

	// 	uShow_length_last.onclick = function () {
	// 		if (uShow_length_last.className === 'open') {
	// 			this.className = 'end';
	// 			for (var i = 0; i < uShow_length.length - 1; i++) {
	// 				uShow_length[i].className = 'end';
	// 				Event.removeHandler(uShow_length[i], 'mouseover',fnover); 
	// 				Event.removeHandler(uShow_length[i], 'mouseout',fnout); 
	// 			};
	// 		} else {
	// 			this.className = 'open';
	// 			for (var i = 0; i < uShow_length.length - 1; i++) {
	// 				uShow_length[i].className = 'open';
	// 				Event.addHandler(uShow_length[i], 'mouseover', fnover); 
	// 				Event.addHandler(uShow_length[i], 'mouseout', fnout); 
	// 			};
	// 		};
	// 	};
	// 	function fnover (){
	// 			this.className = 'show';
				
	// 	};
	// 	function fnout (){
	// 			this.className = '';
	// 	};
	// };
	// if (uShow) status();
