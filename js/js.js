// JavaScript Document
 function change() {
 	var changes = document.getElementById('light');
	var git = document.getElementById('bg');
	if (changes.innerHTML.match('关灯')) {
		changes.innerHTML = '开灯';
		git.style.background = "#000";
		console.log(git)
	} else {
		changes.innerHTML = '关灯';
		git.style.background = "#fff";
		console.log(git)
	}
}

//正则表达式版，1-100，1出现的次数
window.onload = function() {
	var num = 100;
	var j = 0;
	for (var i = 1; i <= num; i++) {
		if ((/[1]/g).test(i.toString())) {
			j++;
			console.log(i);
		}
	}
	console.log(j);
}