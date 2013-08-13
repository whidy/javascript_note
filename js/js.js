// JavaScript Document

git = document.getElementById('bg')
git.onclick = function change() {
	if (git.innerHTML.match('关灯')) {
		git.innerHTML = '开灯';
		git.style.color = '#fff';
		git.style.background = "#000";
		console.log(git)
	} else {
		git.innerHTML = '关灯';
		git.style.color = '#000';
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