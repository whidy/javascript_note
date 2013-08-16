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

$(document).ready(function() {
    // 清除提示框信息
    $("#j_username").focus(function(){
        $("#errormessage").css("display","none");
    });
    // 表单事件
   $("#formlogin").submit(function(){
       var userName = $("#j_username").val();
       var passWord = $("#j_password").val(); 
	   //如果登录框为空，密码框不为空
       if(userName == "" && passWord!= ""){
            $("#errormessage").css("display","block");
            $("#errormessage").html("错误1");
            shakeTheRoom();
		//如果登录框不为空，密码框为空
       }else if(userName!= "" && passWord == ""){
            $("#errormessage").css("display","block");
            $("#errormessage").html("错误2");       
            shakeTheRoom();
		//如果登录框和密码框都为空
       }else if(userName =="" && passWord ==""){
            $("#errormessage").css("display","block");
            $("#errormessage").html("错误3");       
            shakeTheRoom();
       }
       return false;
   });
});

function shakeTheRoom(){
    $('#login').effect("shake", { distance:20,times:5 }, 50); //distance抖动幅度，times抖动次数,100抖动时间(毫秒)
}