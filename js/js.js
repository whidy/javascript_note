// JavaScript Document

git = document.getElementById('bg')
bg.onclick = function change() {
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