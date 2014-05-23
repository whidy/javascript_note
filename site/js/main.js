/*
 * Auto-generated content from the Brackets New Project extension.
 */
/*!
 * jQuery Transit - CSS3 transitions and transformations
 * (c) 2011-2012 Rico Sta. Cruz <rico@ricostacruz.com>
 * MIT Licensed.
 *
 */

 /*
 * http://ricostacruz.com/jquery.transit
 * http://github.com/rstacruz/jquery.transit
 */
(function(k){k.transit={version:"0.9.9",propertyMap:{marginLeft:"margin",marginRight:"margin",marginBottom:"margin",marginTop:"margin",paddingLeft:"padding",paddingRight:"padding",paddingBottom:"padding",paddingTop:"padding"},enabled:true,useTransitionEnd:false};var d=document.createElement("div");var q={};function b(v){if(v in d.style){return v}var u=["Moz","Webkit","O","ms"];var r=v.charAt(0).toUpperCase()+v.substr(1);if(v in d.style){return v}for(var t=0;t<u.length;++t){var s=u[t]+r;if(s in d.style){return s}}}function e(){d.style[q.transform]="";d.style[q.transform]="rotateY(90deg)";return d.style[q.transform]!==""}var a=navigator.userAgent.toLowerCase().indexOf("chrome")>-1;q.transition=b("transition");q.transitionDelay=b("transitionDelay");q.transform=b("transform");q.transformOrigin=b("transformOrigin");q.transform3d=e();var i={transition:"transitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",WebkitTransition:"webkitTransitionEnd",msTransition:"MSTransitionEnd"};var f=q.transitionEnd=i[q.transition]||null;for(var p in q){if(q.hasOwnProperty(p)&&typeof k.support[p]==="undefined"){k.support[p]=q[p]}}d=null;k.cssEase={_default:"ease","in":"ease-in",out:"ease-out","in-out":"ease-in-out",snap:"cubic-bezier(0,1,.5,1)",easeOutCubic:"cubic-bezier(.215,.61,.355,1)",easeInOutCubic:"cubic-bezier(.645,.045,.355,1)",easeInCirc:"cubic-bezier(.6,.04,.98,.335)",easeOutCirc:"cubic-bezier(.075,.82,.165,1)",easeInOutCirc:"cubic-bezier(.785,.135,.15,.86)",easeInExpo:"cubic-bezier(.95,.05,.795,.035)",easeOutExpo:"cubic-bezier(.19,1,.22,1)",easeInOutExpo:"cubic-bezier(1,0,0,1)",easeInQuad:"cubic-bezier(.55,.085,.68,.53)",easeOutQuad:"cubic-bezier(.25,.46,.45,.94)",easeInOutQuad:"cubic-bezier(.455,.03,.515,.955)",easeInQuart:"cubic-bezier(.895,.03,.685,.22)",easeOutQuart:"cubic-bezier(.165,.84,.44,1)",easeInOutQuart:"cubic-bezier(.77,0,.175,1)",easeInQuint:"cubic-bezier(.755,.05,.855,.06)",easeOutQuint:"cubic-bezier(.23,1,.32,1)",easeInOutQuint:"cubic-bezier(.86,0,.07,1)",easeInSine:"cubic-bezier(.47,0,.745,.715)",easeOutSine:"cubic-bezier(.39,.575,.565,1)",easeInOutSine:"cubic-bezier(.445,.05,.55,.95)",easeInBack:"cubic-bezier(.6,-.28,.735,.045)",easeOutBack:"cubic-bezier(.175, .885,.32,1.275)",easeInOutBack:"cubic-bezier(.68,-.55,.265,1.55)"};k.cssHooks["transit:transform"]={get:function(r){return k(r).data("transform")||new j()},set:function(s,r){var t=r;if(!(t instanceof j)){t=new j(t)}if(q.transform==="WebkitTransform"&&!a){s.style[q.transform]=t.toString(true)}else{s.style[q.transform]=t.toString()}k(s).data("transform",t)}};k.cssHooks.transform={set:k.cssHooks["transit:transform"].set};if(k.fn.jquery<"1.8"){k.cssHooks.transformOrigin={get:function(r){return r.style[q.transformOrigin]},set:function(r,s){r.style[q.transformOrigin]=s}};k.cssHooks.transition={get:function(r){return r.style[q.transition]},set:function(r,s){r.style[q.transition]=s}}}n("scale");n("translate");n("rotate");n("rotateX");n("rotateY");n("rotate3d");n("perspective");n("skewX");n("skewY");n("x",true);n("y",true);function j(r){if(typeof r==="string"){this.parse(r)}return this}j.prototype={setFromString:function(t,s){var r=(typeof s==="string")?s.split(","):(s.constructor===Array)?s:[s];r.unshift(t);j.prototype.set.apply(this,r)},set:function(s){var r=Array.prototype.slice.apply(arguments,[1]);if(this.setter[s]){this.setter[s].apply(this,r)}else{this[s]=r.join(",")}},get:function(r){if(this.getter[r]){return this.getter[r].apply(this)}else{return this[r]||0}},setter:{rotate:function(r){this.rotate=o(r,"deg")},rotateX:function(r){this.rotateX=o(r,"deg")},rotateY:function(r){this.rotateY=o(r,"deg")},scale:function(r,s){if(s===undefined){s=r}this.scale=r+","+s},skewX:function(r){this.skewX=o(r,"deg")},skewY:function(r){this.skewY=o(r,"deg")},perspective:function(r){this.perspective=o(r,"px")},x:function(r){this.set("translate",r,null)},y:function(r){this.set("translate",null,r)},translate:function(r,s){if(this._translateX===undefined){this._translateX=0}if(this._translateY===undefined){this._translateY=0}if(r!==null&&r!==undefined){this._translateX=o(r,"px")}if(s!==null&&s!==undefined){this._translateY=o(s,"px")}this.translate=this._translateX+","+this._translateY}},getter:{x:function(){return this._translateX||0},y:function(){return this._translateY||0},scale:function(){var r=(this.scale||"1,1").split(",");if(r[0]){r[0]=parseFloat(r[0])}if(r[1]){r[1]=parseFloat(r[1])}return(r[0]===r[1])?r[0]:r},rotate3d:function(){var t=(this.rotate3d||"0,0,0,0deg").split(",");for(var r=0;r<=3;++r){if(t[r]){t[r]=parseFloat(t[r])}}if(t[3]){t[3]=o(t[3],"deg")}return t}},parse:function(s){var r=this;s.replace(/([a-zA-Z0-9]+)\((.*?)\)/g,function(t,v,u){r.setFromString(v,u)})},toString:function(t){var s=[];for(var r in this){if(this.hasOwnProperty(r)){if((!q.transform3d)&&((r==="rotateX")||(r==="rotateY")||(r==="perspective")||(r==="transformOrigin"))){continue}if(r[0]!=="_"){if(t&&(r==="scale")){s.push(r+"3d("+this[r]+",1)")}else{if(t&&(r==="translate")){s.push(r+"3d("+this[r]+",0)")}else{s.push(r+"("+this[r]+")")}}}}}return s.join(" ")}};function m(s,r,t){if(r===true){s.queue(t)}else{if(r){s.queue(r,t)}else{t()}}}function h(s){var r=[];k.each(s,function(t){t=k.camelCase(t);t=k.transit.propertyMap[t]||k.cssProps[t]||t;t=c(t);if(k.inArray(t,r)===-1){r.push(t)}});return r}function g(s,v,x,r){var t=h(s);if(k.cssEase[x]){x=k.cssEase[x]}var w=""+l(v)+" "+x;if(parseInt(r,10)>0){w+=" "+l(r)}var u=[];k.each(t,function(z,y){u.push(y+" "+w)});return u.join(", ")}k.fn.transition=k.fn.transit=function(z,s,y,C){var D=this;var u=0;var w=true;if(typeof s==="function"){C=s;s=undefined}if(typeof y==="function"){C=y;y=undefined}if(typeof z.easing!=="undefined"){y=z.easing;delete z.easing}if(typeof z.duration!=="undefined"){s=z.duration;delete z.duration}if(typeof z.complete!=="undefined"){C=z.complete;delete z.complete}if(typeof z.queue!=="undefined"){w=z.queue;delete z.queue}if(typeof z.delay!=="undefined"){u=z.delay;delete z.delay}if(typeof s==="undefined"){s=k.fx.speeds._default}if(typeof y==="undefined"){y=k.cssEase._default}s=l(s);var E=g(z,s,y,u);var B=k.transit.enabled&&q.transition;var t=B?(parseInt(s,10)+parseInt(u,10)):0;if(t===0){var A=function(F){D.css(z);if(C){C.apply(D)}if(F){F()}};m(D,w,A);return D}var x={};var r=function(H){var G=false;var F=function(){if(G){D.unbind(f,F)}if(t>0){D.each(function(){this.style[q.transition]=(x[this]||null)})}if(typeof C==="function"){C.apply(D)}if(typeof H==="function"){H()}};if((t>0)&&(f)&&(k.transit.useTransitionEnd)){G=true;D.bind(f,F)}else{window.setTimeout(F,t)}D.each(function(){if(t>0){this.style[q.transition]=E}k(this).css(z)})};var v=function(F){this.offsetWidth;r(F)};m(D,w,v);return this};function n(s,r){if(!r){k.cssNumber[s]=true}k.transit.propertyMap[s]=q.transform;k.cssHooks[s]={get:function(v){var u=k(v).css("transit:transform");return u.get(s)},set:function(v,w){var u=k(v).css("transit:transform");u.setFromString(s,w);k(v).css({"transit:transform":u})}}}function c(r){return r.replace(/([A-Z])/g,function(s){return"-"+s.toLowerCase()})}function o(s,r){if((typeof s==="string")&&(!s.match(/^[\-0-9\.]+$/))){return s}else{return""+s+r}}function l(s){var r=s;if(k.fx.speeds[r]){r=k.fx.speeds[r]}return o(r,"ms")}k.transit.getTransitionValue=g})(jQuery);
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global $, window, document */

// Simple jQuery event handler
$(document).ready(function () {


var wid=window.innerWidth;
var hei=window.innerHeight;

var deg = 0;
var deg2 = 0;
var deg3 = 0;
var deg4 = 0;
var deg5 = 0;
var deg6 = 0;

var degz = 0;
var degz2 = 0;
var degz3 = 0;
var degz4 = 0;
var degz5 = 0;
    
var sz = 0;
var sz2 = 0;
var sz3 = 0;
var sz4 = 0;
var sz5 = 0;
    
var roll = 0;
var rollver = 0;
var a1 = 0;
var a2 = 0.9;
var flag=0;
var flag2=0;
    
var d = new Date();

var month = d.getMonth()+1;
if(month<10){month = '0'+month;}
var day = d.getDate();
if(day<10){day = '0'+day;}
var year = d.getFullYear();


$("#cell1").click(function(){
            $("body,html").animate({scrollTop:1801}, 2500, 'easeInOutQuad' );
});
    
$("#cell2").click(function(){
            $("body,html").animate({scrollTop:3601}, 2500, 'easeInOutQuad' );
});
    
$("#cell3").click(function(){
            $("body,html").animate({scrollTop:5401}, 2500, 'easeInOutQuad' );
}); 
    
$("#cell4").click(function(){
            $("body,html").animate({scrollTop:7201}, 2500, 'easeInOutQuad' );
});   
    
$('#title1').append(month+'.'+day+'.'+year);

$('#scroll').click(function(){    
    $("body,html").animate({scrollTop:1800}, 2500, 'easeInOutQuad' );  
});

$("#li1").click(function(){
           $("body,html").animate({scrollTop:1801}, 2500, 'easeInOutQuad' );
    
                         $("#detcontain1").stop(true,true).animate({top:((hei+500)*-1)+'px'},1500);
                         $(".workhead").stop(true,true).animate({opacity:'0'},500);
                         $(".workhead2").stop(true,true).animate({opacity:'0'},500);
                         $(".workhead3").stop(true,true).animate({opacity:'0'},500);
    
                         $("#detcontain2").stop(true,true).animate({top:((hei+500)*-1)+'px'},1500);
                         $(".workhead").stop(true,true).animate({opacity:'0'},500);
                         $(".workhead2").stop(true,true).animate({opacity:'0'},500);
                         $(".workhead3").stop(true,true).animate({opacity:'0'},500);
    
                         $("#detcontain3").stop(true,true).animate({top:((hei+500)*-1)+'px'},1500);
                         $(".workhead").stop(true,true).animate({opacity:'0'},500);
                         $(".workhead2").stop(true,true).animate({opacity:'0'},500);
                         $(".workhead3").stop(true,true).animate({opacity:'0'},500);
    
                         $("#detcontain4").stop(true,true).animate({top:((hei+500)*-1)+'px'},1500);
                         $(".workhead").stop(true,true).animate({opacity:'0'},500);
                         $(".workhead2").stop(true,true).animate({opacity:'0'},500);
                         $(".workhead3").stop(true,true).animate({opacity:'0'},500);
    
                         $("body").css('overflow','auto');
       
});
    
$("#li2").click(function(){
          $("body,html").animate({scrollTop:10800}, 2500, 'easeInOutQuad' );
    
                         $("#detcontain1").stop(true,true).animate({top:((hei+500)*-1)+'px'},1500);
                         $(".workhead").stop(true,true).animate({opacity:'0'},500);
                         $(".workhead2").stop(true,true).animate({opacity:'0'},500);
                         $(".workhead3").stop(true,true).animate({opacity:'0'},500);
    
                         $("#detcontain2").stop(true,true).animate({top:((hei+500)*-1)+'px'},1500);
                         $(".workhead").stop(true,true).animate({opacity:'0'},500);
                         $(".workhead2").stop(true,true).animate({opacity:'0'},500);
                         $(".workhead3").stop(true,true).animate({opacity:'0'},500);
    
                         $("#detcontain3").stop(true,true).animate({top:((hei+500)*-1)+'px'},1500);
                         $(".workhead").stop(true,true).animate({opacity:'0'},500);
                         $(".workhead2").stop(true,true).animate({opacity:'0'},500);
                         $(".workhead3").stop(true,true).animate({opacity:'0'},500);
    
                         $("#detcontain4").stop(true,true).animate({top:((hei+500)*-1)+'px'},1500);
                         $(".workhead").stop(true,true).animate({opacity:'0'},500);
                         $(".workhead2").stop(true,true).animate({opacity:'0'},500);
                         $(".workhead3").stop(true,true).animate({opacity:'0'},500);
    
                         $("body").css('overflow','auto');
       
});

$("#li3").click(function(){
           $("body,html").animate({scrollTop:14400}, 2500, 'easeInOutQuad' );
    
                         $("#detcontain1").stop(true,true).animate({top:((hei+500)*-1)+'px'},1500);
                         $(".workhead").stop(true,true).animate({opacity:'0'},500);
                         $(".workhead2").stop(true,true).animate({opacity:'0'},500);
                         $(".workhead3").stop(true,true).animate({opacity:'0'},500);
    
                         $("#detcontain2").stop(true,true).animate({top:((hei+500)*-1)+'px'},1500);
                         $(".workhead").stop(true,true).animate({opacity:'0'},500);
                         $(".workhead2").stop(true,true).animate({opacity:'0'},500);
                         $(".workhead3").stop(true,true).animate({opacity:'0'},500);
    
                         $("#detcontain3").stop(true,true).animate({top:((hei+500)*-1)+'px'},1500);
                         $(".workhead").stop(true,true).animate({opacity:'0'},500);
                         $(".workhead2").stop(true,true).animate({opacity:'0'},500);
                         $(".workhead3").stop(true,true).animate({opacity:'0'},500);
    
                         $("#detcontain4").stop(true,true).animate({top:((hei+500)*-1)+'px'},1500);
                         $(".workhead").stop(true,true).animate({opacity:'0'},500);
                         $(".workhead2").stop(true,true).animate({opacity:'0'},500);
                         $(".workhead3").stop(true,true).animate({opacity:'0'},500);
    
            $("body").css('overflow','auto');
       
});

$("#logo").click(function(){
            $("body,html").animate({scrollTop:0}, 2500, 'easeInOutQuad' );
    
                         $("#detcontain1").stop(true,true).animate({top:((hei+500)*-1)+'px'},1500);
                         $(".workhead").stop(true,true).animate({opacity:'0'},500);
                         $(".workhead2").stop(true,true).animate({opacity:'0'},500);
                         $(".workhead3").stop(true,true).animate({opacity:'0'},500);
    
                         $("#detcontain2").stop(true,true).animate({top:((hei+500)*-1)+'px'},1500);
                         $(".workhead").stop(true,true).animate({opacity:'0'},500);
                         $(".workhead2").stop(true,true).animate({opacity:'0'},500);
                         $(".workhead3").stop(true,true).animate({opacity:'0'},500);
    
                         $("#detcontain3").stop(true,true).animate({top:((hei+500)*-1)+'px'},1500);
                         $(".workhead").stop(true,true).animate({opacity:'0'},500);
                         $(".workhead2").stop(true,true).animate({opacity:'0'},500);
                         $(".workhead3").stop(true,true).animate({opacity:'0'},500);
    
                         $("#detcontain4").stop(true,true).animate({top:((hei+500)*-1)+'px'},1500);
                         $(".workhead").stop(true,true).animate({opacity:'0'},500);
                         $(".workhead2").stop(true,true).animate({opacity:'0'},500);
                         $(".workhead3").stop(true,true).animate({opacity:'0'},500);
    
                         $("body").css('overflow','auto');
});


$('#menubarhover').click(function(){
    
    if(flag==0){
        $('#menuline').stop(true,true).transition({
              x: '800px'
        },700,'snap');
        flag=1;
    }
    
    else{
        $('#menuline').stop(true,true).transition({
              x: '-800px'
        },700,'ease');
        flag=0;
    }
        
});
    
$('#menubarhover').hover(function(){
          $('#menubar').stop(true,true).transition({
              perspective: '100px',
              rotateY: '180deg',
          });
          setTimeout(function(){ $('#menubar').css('background-color','#00debc');},100); 
          },
          function(){
          if(flag==0){
          $('#menubar').stop(true,true).transition({
              perspective: '100px',
              rotateY: '0deg'
          });
          setTimeout(function(){$('#menubar').css('background-color','#FFF');},100); 
          }
});
    

    
$('.zarebarhover').hover(function(){
          $('.zarebar').stop(true,true).transition({
              perspective: '100px',
              rotateY: '180deg',
          });
          setTimeout(function(){ $('.zarebar').css('background-color','#FFF');},100); 
          },
          function(){
          if(flag==0){
          $('.zarebar').stop(true,true).transition({
              perspective: '100px',
              rotateY: '0deg'
          });
          setTimeout(function(){$('.zarebar').css('background-color','#00debc');},100); 
          }
});
    

    
 $('#grad1').css('background-image','-webkit-gradient(linear,left top,left bottom,color-stop(1, rgba(85,48,66,'+a1+')),color-stop(0, rgba(255,255,255,'+a2+')))');
    $('#grad1').css('background-image','-o-linear-gradient(bottom, rgba(85,48,66,'+a1+') 0%, rgba(255,255,255,'+a2+') 100%)');
    $('#grad1').css('background-image','-moz-linear-gradient(bottom, rgba(85,48,66,'+a1+') 0%, rgba(255,255,255,'+a2+') 100%)');
    $('#grad1').css('background-image','-ms-linear-gradient(bottom, rgba(85,48,66,'+a1+') 0%, rgba(255,255,255,'+a2+') 100%)');
    $('#grad1').css('background-image','-webkit-linear-gradient(bottom, rgba(85,48,66,'+a1+') 0%, rgba(255,255,255,'+a2+') 100%)');
    $('#grad1').css('background-image','linear-gradient(bottom, rgba(85,48,66,'+a1+') 0%, rgba(255,255,255,'+a2+') 100%)');
    
$('body').css('height',hei+9000+3600+1800+'px');
    

$("#a1").click(function(){   $("#detcontain1").stop(true,true).animate({top:'0px'},1500);
                          
                             setTimeout(function(){  
                             $(".workhead").stop(true,true).animate({opacity:'1'},500);
                             $(".workhead2").stop(true,true).animate({opacity:'1'},500);
                             $(".workhead3").stop(true,true).animate({opacity:'1'},500);
                             },1000); 
                          
                             $("body").css('overflow','hidden');
                             flag2=1;
                         }); 
    
$("#detcontain1").click(function(){   $("#detcontain1").stop(true,true).animate({top:((hei+500)*-1)+'px'},1500);
                                       
                                      $(".workhead").stop(true,true).animate({opacity:'0'},500);
                                      $(".workhead2").stop(true,true).animate({opacity:'0'},500);
                                      $(".workhead3").stop(true,true).animate({opacity:'0'},500);
                                   
                                      $("body").css('overflow','auto');
                                      flag2=0;
                                  });
    
$("#a2").click(function(){   $("#detcontain2").stop(true,true).animate({top:'0px'},1500);  
                          
                             setTimeout(function(){  
                             $(".workhead").stop(true,true).animate({opacity:'1'},500);
                             $(".workhead2").stop(true,true).animate({opacity:'1'},500);
                             $(".workhead3").stop(true,true).animate({opacity:'1'},500);
                             },1000); 
                          
                          $("body").css('overflow','hidden');      flag2=2; });
                        
    
$("#detcontain2").click(function(){   $("#detcontain2").stop(true,true).animate({top:((hei+500)*-1)+'px'},1500);
                                   
                                   $(".workhead").stop(true,true).animate({opacity:'0'},500);
                                   $(".workhead2").stop(true,true).animate({opacity:'0'},500);
                                   $(".workhead3").stop(true,true).animate({opacity:'0'},500);
                                   
                                   $("body").css('overflow','auto');      flag2=0; });
    
$("#a3").click(function(){   $("#detcontain3").stop(true,true).animate({top:'0px'},1500);
                          
                          setTimeout(function(){  
                             $(".workhead").stop(true,true).animate({opacity:'1'},500);
                             $(".workhead2").stop(true,true).animate({opacity:'1'},500);
                             $(".workhead3").stop(true,true).animate({opacity:'1'},500);
                             },1000); 
                          
                          $("body").css('overflow','hidden');      flag2=3; }); 
    
    
$("#detcontain3").click(function(){   $("#detcontain3").stop(true,true).animate({top:((hei+500)*-1)+'px'},1500);
                                   
                                   $(".workhead").stop(true,true).animate({opacity:'0'},500);
                                   $(".workhead2").stop(true,true).animate({opacity:'0'},500);
                                   $(".workhead3").stop(true,true).animate({opacity:'0'},500);
                                   
                                   $("body").css('overflow','auto');      flag2=0; });
    
$("#a4").click(function(){   $("#detcontain4").stop(true,true).animate({top:'0px'},1500);
                          
                          setTimeout(function(){  
                             $(".workhead").stop(true,true).animate({opacity:'1'},500);
                             $(".workhead2").stop(true,true).animate({opacity:'1'},500);
                             $(".workhead3").stop(true,true).animate({opacity:'1'},500);
                             },1000);
                          
                          $("body").css('overflow','hidden');      flag2=4; }); 
    
$("#detcontain4").click(function(){   $("#detcontain4").stop(true,true).animate({top:((hei+500)*-1)+'px'},1500);
                                   
                                   $(".workhead").stop(true,true).animate({opacity:'0'},500);
                                   $(".workhead2").stop(true,true).animate({opacity:'0'},500);
                                   $(".workhead3").stop(true,true).animate({opacity:'0'},500);
                                   
                                   $("body").css('overflow','auto');      flag2=0; });
    
    
$("#a1").hover(function(){
          $("#zarebin1").stop(true,true).animate({bottom:'-60px'},300);
          },
          function(){
          $("#zarebin1").stop(true,true).animate({bottom: hei * -1 },500);
});
    
$("#a2").hover(function(){
          $("#zarebin2").stop(true,true).animate({bottom:'-60px'},300);
          },
          function(){
          $("#zarebin2").stop(true,true).animate({bottom: hei * -1 },500);
});
    
$("#a3").hover(function(){
          $("#zarebin3").stop(true,true).animate({bottom:'-60px'},300);
          },
          function(){
          $("#zarebin3").stop(true,true).animate({bottom: hei * -1 },500);
});
    
$("#a4").hover(function(){
          $("#zarebin4").stop(true,true).animate({bottom:'-60px'},300);
          },
          function(){
          $("#zarebin4").stop(true,true).animate({bottom: hei * -1 },500);
});
    
$("#alee").hover(function(){
          $("#workhover7").show();
            $("#boxslide3head").css('color','#00debc');
          },
          function(){
          $("#workhover7").hide();
              $("#boxslide3head").css('color','rgba(85,48,66,1)');
});

$("#work1").hover(function(){
          $("#workhover1").show();
          },
          function(){
          $("#workhover1").hide();
});
    
$("#work2").hover(function(){
          $("#workhover2").show();
          },
          function(){
          $("#workhover2").hide();
});
    
$("#work3").hover(function(){
          $("#workhover3").show();
          },
          function(){
          $("#workhover3").hide();
});
    
$("#work4").hover(function(){
          $("#workhover4").show();
          },
          function(){
          $("#workhover4").hide();
});
    
$("#work5").hover(function(){
          $("#workhover5").show();
          },
          function(){
          $("#workhover5").hide();
});
    
$("#work6").hover(function(){
          $("#workhover6").show();
          },
          function(){
          $("#workhover6").hide();
});
    
$(window).scroll(function() {
    
    deg = $(window).scrollTop() / 10;
    degz = deg * -1;
    deg2 = deg-180;
    degz2 = deg2 * -1;
    deg3 = deg2-180;
    degz3 = deg3 * -1;
    deg4 = deg3-180;
    degz4 = deg4 * -1;
    deg5 = deg4-180;
    degz5 = deg5 * -1;
    deg6 = deg5 - 180;
    var opa = 0.5 ;
    var opavers = 0 ;
    var opax = 0.5 - opa ;
    opavers = 0.9 - opax ;
    
    sz = 100 + (deg/20); 
    sz2 = 100 + ((deg2+90)/20);
    sz3 = 100 + ((deg3+90)/20);
    sz4 = 100 + ((deg4+90)/20);
    sz5 = 100 + ((deg5+90)/20);
    
    //------------------------------------------------------------//
    
    
    //----------------------------------------------------------//
    
    roll = (0.555555555555556) * deg * -1 ;
    rollver = (0.555555555555556) * deg6 * -1 ;
    $('#titlebar').css('left',+roll+'%');
    
    if(deg6>180 && deg6<360){
        opa = 0.45 + ( (deg6 - 180) * 0.0027778 );
        $('#varslidezir').css('background-color','rgba(180,180,180,'+opa+')');
    }
    
    
    if(deg6<0){
      $('#vertical').css('top','0%');
    }
    
    if(deg6>0){
      $('#vertical').css('top',+rollver+'%');
    }
    
    a2 = 0.9 - 0.012166 * deg ;
    a1 = 0.005 * deg ;
    
    a4 = 0.9 - 0.012166 * (deg2) ;
    a3 = 0.005 * (deg2) ;
    
    a6 = 0.9 - 0.012166 * (deg3) ;
    a5 = 0.005 * (deg3) ;
    
    a8 = 0.9 - 0.012166 * (deg4) ;
    a7 = 0.005 * (deg4) ;
    
    a10 = 0.9 - 0.012166 * (deg5) ;
    a9 = 0.005 * (deg5) ;
    
    $('#grad1').css('background-image','-webkit-gradient(linear,left top,left bottom,color-stop(1, rgba(85,48,66,'+a1+')),color-stop(0, rgba(255,255,255,'+a2+')))');
    $('#grad1').css('background-image','-o-linear-gradient(bottom, rgba(85,48,66,'+a1+') 0%, rgba(255,255,255,'+a2+') 100%)');
    $('#grad1').css('background-image','-moz-linear-gradient(bottom, rgba(85,48,66,'+a1+') 0%, rgba(255,255,255,'+a2+') 100%)');
    $('#grad1').css('background-image','-ms-linear-gradient(bottom, rgba(85,48,66,'+a1+') 0%, rgba(255,255,255,'+a2+') 100%)');
    $('#grad1').css('background-image','-webkit-linear-gradient(bottom, rgba(85,48,66,'+a1+') 0%, rgba(255,255,255,'+a2+') 100%)');
    $('#grad1').css('background-image','linear-gradient(bottom, rgba(85,48,66,'+a1+') 0%, rgba(255,255,255,'+a2+') 100%)');
    
     $('#grad2').css('background-image','-webkit-gradient(linear,left top,left bottom,color-stop(1, rgba(85,48,66,'+a1+')),color-stop(0, rgba(255,255,255,'+a2+')))');
    $('#grad2').css('background-image','-o-linear-gradient(bottom, rgba(85,48,66,'+a3+') 0%, rgba(255,255,255,'+a4+') 100%)');
    $('#grad2').css('background-image','-moz-linear-gradient(bottom, rgba(85,48,66,'+a3+') 0%, rgba(255,255,255,'+a4+') 100%)');
    $('#grad2').css('background-image','-ms-linear-gradient(bottom, rgba(85,48,66,'+a3+') 0%, rgba(255,255,255,'+a4+') 100%)');
    $('#grad2').css('background-image','-webkit-linear-gradient(bottom, rgba(85,48,66,'+a3+') 0%, rgba(255,255,255,'+a4+') 100%)');
    $('#grad2').css('background-image','linear-gradient(bottom, rgba(85,48,66,'+a3+') 0%, rgba(255,255,255,'+a4+') 100%)');
    
     $('#grad3').css('background-image','-webkit-gradient(linear,left top,left bottom,color-stop(1, rgba(85,48,66,'+a1+')),color-stop(0, rgba(255,255,255,'+a2+')))');
    $('#grad3').css('background-image','-o-linear-gradient(bottom, rgba(85,48,66,'+a5+') 0%, rgba(255,255,255,'+a6+') 100%)');
    $('#grad3').css('background-image','-moz-linear-gradient(bottom, rgba(85,48,66,'+a5+') 0%, rgba(255,255,255,'+a6+') 100%)');
    $('#grad3').css('background-image','-ms-linear-gradient(bottom, rgba(85,48,66,'+a5+') 0%, rgba(255,255,255,'+a6+') 100%)');
    $('#grad3').css('background-image','-webkit-linear-gradient(bottom, rgba(85,48,66,'+a5+') 25%, rgba(255,255,255,'+a6+') 100%)');
    $('#grad3').css('background-image','linear-gradient(bottom, rgba(85,48,66,'+a5+') 0%, rgba(255,255,255,'+a6+') 100%)');
    
     $('#grad4').css('background-image','-webkit-gradient(linear,left top,left bottom,color-stop(1, rgba(85,48,66,'+a1+')),color-stop(0, rgba(255,255,255,'+a2+')))');
    $('#grad4').css('background-image','-o-linear-gradient(bottom, rgba(85,48,66,'+a7+') 0%, rgba(255,255,255,'+a8+') 100%)');
    $('#grad4').css('background-image','-moz-linear-gradient(bottom, rgba(85,48,66,'+a7+') 0%, rgba(255,255,255,'+a8+') 100%)');
    $('#grad4').css('background-image','-ms-linear-gradient(bottom, rgba(85,48,66,'+a7+') 0%, rgba(255,255,255,'+a8+') 100%)');
    $('#grad4').css('background-image','-webkit-linear-gradient(bottom, rgba(85,48,66,'+a7+') 25%, rgba(255,255,255,'+a8+') 100%)');
    $('#grad4').css('background-image','linear-gradient(bottom, rgba(85,48,66,'+a7+') 0%, rgba(255,255,255,'+a8+') 100%)');
    
     $('#grad5').css('background-image','-webkit-gradient(linear,left top,left bottom,color-stop(1, rgba(85,48,66,'+a1+')),color-stop(0, rgba(255,255,255,'+a2+')))');
    $('#grad5').css('background-image','-o-linear-gradient(bottom, rgba(85,48,66,'+a9+') 0%, rgba(255,255,255,'+a10+') 100%)');
    $('#grad5 ').css('background-image','-moz-linear-gradient(bottom, rgba(85,48,66,'+a9+') 0%, rgba(255,255,255,'+a10+') 100%)');
    $('#grad5').css('background-image','-ms-linear-gradient(bottom, rgba(85,48,66,'+a9+') 0%, rgba(255,255,255,'+a10+') 100%)');
    $('#grad5').css('background-image','-webkit-linear-gradient(bottom, rgba(85,48,66,'+a9+') 0%, rgba(255,255,255,'+a10+') 100%)');
    $('#grad5').css('background-image','linear-gradient(bottom, rgba(85,48,66,'+a9+') 0%, rgba(255,255,255,'+a10+') 100%)');
    
    //----------------------------------------------------------//
    
   
    
    if(deg>180 && deg<1000){
        $('#li1').css('color','#00debc');
    }
    else{
        $('#li1').css('color','#777');
    }
    
    
    if(deg>1000 && deg<1400){
        $('#li2').css('color','#00debc');
    }
    else{
        $('#li2').css('color','#777');
    }
    
    if(deg>1400){
        $('#li3').css('color','#00debc');
    }
    else{
        $('#li3').css('color','#777');
    }
    
    if(deg<180){
        
        $('#circlebar').stop(true).animate({left:-50},600);
        
        rotate1();
        $('#slidein1').css('background-size', +sz+'%');
        $('#slide2').css('-webkit-transform', 'rotate(0deg)');
        $('#slidein2').css('-webkit-transform', 'rotate(0deg)');
        $('#slide2').css('-moz-transform', 'rotate(0deg)');
        $('#slidein2').css('-moz-transform', 'rotate(0deg)');
        $('#slide2').css('-o-transform', 'rotate(0deg)');
        $('#slidein2').css('-o-transform', 'rotate(0deg)');
        $('#slide2').css('-ms-transform', 'rotate(0deg)');
        $('#slidein2').css('-ms-transform', 'rotate(0deg)');
        
        $('#slide3').css('-webkit-transform', 'rotate(0deg)');
        $('#slidein3').css('-webkit-transform', 'rotate(0deg)');
        $('#slide3').css('-moz-transform', 'rotate(0deg)');
        $('#slidein3').css('-moz-transform', 'rotate(0deg)');
        $('#slide3').css('-o-transform', 'rotate(0deg)');
        $('#slidein3').css('-o-transform', 'rotate(0deg)');
        $('#slide3').css('-ms-transform', 'rotate(0deg)');
        $('#slidein3').css('-ms-transform', 'rotate(0deg)');
        
        $('#slide4').css('-webkit-transform', 'rotate(0deg)');
        $('#slidein4').css('-webkit-transform', 'rotate(0deg)');
        $('#slide4').css('-moz-transform', 'rotate(0deg)');
        $('#slidein4').css('-moz-transform', 'rotate(0deg)');
        $('#slide4').css('-o-transform', 'rotate(0deg)');
        $('#slidein4').css('-o-transform', 'rotate(0deg)');
        $('#slide4').css('-ms-transform', 'rotate(0deg)');
        $('#slidein4').css('-ms-transform', 'rotate(0deg)');
        
        $('#slide5').css('-webkit-transform', 'rotate(0deg)');
        $('#slidein5').css('-webkit-transform', 'rotate(0deg)');
        $('#slide5').css('-moz-transform', 'rotate(0deg)');
        $('#slidein5').css('-moz-transform', 'rotate(0deg)');
        $('#slide5').css('-o-transform', 'rotate(0deg)');
        $('#slidein5').css('-o-transform', 'rotate(0deg)');
        $('#slide5').css('-ms-transform', 'rotate(0deg)');
        $('#slidein5').css('-ms-transform', 'rotate(0deg)');
    }
    
    if(deg>180 && deg<360){
        
        $('#circlebar').stop(true).animate({left:20},300);
        $('#slider').stop(true).animate({top:1},200);
        
        $('#slide1').css('-webkit-transform', 'rotate(-180deg)');
        $('#slidein1').css('-webkit-transform', 'rotate(-180deg)');
        $('#slide1').css('-moz-transform', 'rotate(-180deg)');
        $('#slidein1').css('-moz-transform', 'rotate(-180deg)');
        $('#slide1').css('-o-transform', 'rotate(-180deg)');
        $('#slidein1').css('-o-transform', 'rotate(-180deg)');
        $('#slide1').css('-ms-transform', 'rotate(-180deg)');
        $('#slidein1').css('-ms-transform', 'rotate(-180deg)'); 
        rotate2();
        $('#slide3').css('-webkit-transform', 'rotate(0deg)');
        $('#slidein3').css('-webkit-transform', 'rotate(0deg)');
        $('#slide3').css('-moz-transform', 'rotate(0deg)');
        $('#slidein3').css('-moz-transform', 'rotate(0deg)');
        $('#slide3').css('-o-transform', 'rotate(0deg)');
        $('#slidein3').css('-o-transform', 'rotate(0deg)');
        $('#slide3').css('-ms-transform', 'rotate(0deg)');
        $('#slidein3').css('-ms-transform', 'rotate(0deg)');
        
        $('#slide4').css('-webkit-transform', 'rotate(0deg)');
        $('#slidein4').css('-webkit-transform', 'rotate(0deg)');
        $('#slide4').css('-moz-transform', 'rotate(0deg)');
        $('#slidein4').css('-moz-transform', 'rotate(0deg)');
        $('#slide4').css('-o-transform', 'rotate(0deg)');
        $('#slidein4').css('-o-transform', 'rotate(0deg)');
        $('#slide4').css('-ms-transform', 'rotate(0deg)');
        $('#slidein4').css('-ms-transform', 'rotate(0deg)');
        
        $('#slide5').css('-webkit-transform', 'rotate(0deg)');
        $('#slidein5').css('-webkit-transform', 'rotate(0deg)');
        $('#slide5').css('-moz-transform', 'rotate(0deg)');
        $('#slidein5').css('-moz-transform', 'rotate(0deg)');
        $('#slide5').css('-o-transform', 'rotate(0deg)');
        $('#slidein5').css('-o-transform', 'rotate(0deg)');
        $('#slide5').css('-ms-transform', 'rotate(0deg)');
        $('#slidein5').css('-ms-transform', 'rotate(0deg)');
    }
    
    if(deg>360 && deg<540){
    
        $('#circlebar').stop(true).animate({left:20},300);
        $('#slider').stop(true).animate({top:92},200);
        
        $('#slide1').css('-webkit-transform', 'rotate(-180deg)');
        $('#slidein1').css('-webkit-transform', 'rotate(-180deg)');
        $('#slide1').css('-moz-transform', 'rotate(-180deg)');
        $('#slidein1').css('-moz-transform', 'rotate(-180deg)');
        $('#slide1').css('-o-transform', 'rotate(-180deg)');
        $('#slidein1').css('-o-transform', 'rotate(-180deg)');
        $('#slide1').css('-ms-transform', 'rotate(-180deg)');
        $('#slidein1').css('-ms-transform', 'rotate(-180deg)'); 
        
        $('#slide2').css('-webkit-transform', 'rotate(-180deg)');
        $('#slidein2').css('-webkit-transform', 'rotate(-180deg)');
        $('#slide2').css('-moz-transform', 'rotate(-180deg)');
        $('#slidein2').css('-moz-transform', 'rotate(-180deg)');
        $('#slide2').css('-o-transform', 'rotate(-180deg)');
        $('#slidein2').css('-o-transform', 'rotate(-180deg)');
        $('#slide2').css('-ms-transform', 'rotate(-180deg)');
        $('#slidein2').css('-ms-transform', 'rotate(-180deg)'); 
        rotate3();
        $('#slide4').css('-webkit-transform', 'rotate(0deg)');
        $('#slidein4').css('-webkit-transform', 'rotate(0deg)');
        $('#slide4').css('-moz-transform', 'rotate(0deg)');
        $('#slidein4').css('-moz-transform', 'rotate(0deg)');
        $('#slide4').css('-o-transform', 'rotate(0deg)');
        $('#slidein4').css('-o-transform', 'rotate(0deg)');
        $('#slide4').css('-ms-transform', 'rotate(0deg)');
        $('#slidein4').css('-ms-transform', 'rotate(0deg)');
        
        $('#slide5').css('-webkit-transform', 'rotate(0deg)');
        $('#slidein5').css('-webkit-transform', 'rotate(0deg)');
        $('#slide5').css('-moz-transform', 'rotate(0deg)');
        $('#slidein5').css('-moz-transform', 'rotate(0deg)');
        $('#slide5').css('-o-transform', 'rotate(0deg)');
        $('#slidein5').css('-o-transform', 'rotate(0deg)');
        $('#slide5').css('-ms-transform', 'rotate(0deg)');
        $('#slidein5').css('-ms-transform', 'rotate(0deg)');
    }
     
    if(deg>540 && deg<720){
        
        $('#circlebar').stop(true).animate({left:20},300);
        $('#slider').stop(true).animate({top:183},200);
        
        $('#slide1').css('-webkit-transform', 'rotate(-180deg)');
        $('#slidein1').css('-webkit-transform', 'rotate(-180deg)');
        $('#slide1').css('-moz-transform', 'rotate(-180deg)');
        $('#slidein1').css('-moz-transform', 'rotate(-180deg)');
        $('#slide1').css('-o-transform', 'rotate(-180deg)');
        $('#slidein1').css('-o-transform', 'rotate(-180deg)');
        $('#slide1').css('-ms-transform', 'rotate(-180deg)');
        $('#slidein1').css('-ms-transform', 'rotate(-180deg)'); 
        
        $('#slide2').css('-webkit-transform', 'rotate(-180deg)');
        $('#slidein2').css('-webkit-transform', 'rotate(-180deg)');
        $('#slide2').css('-moz-transform', 'rotate(-180deg)');
        $('#slidein2').css('-moz-transform', 'rotate(-180deg)');
        $('#slide2').css('-o-transform', 'rotate(-180deg)');
        $('#slidein2').css('-o-transform', 'rotate(-180deg)');
        $('#slide2').css('-ms-transform', 'rotate(-180deg)');
        $('#slidein2').css('-ms-transform', 'rotate(-180deg)');
        
        $('#slide3').css('-webkit-transform', 'rotate(-180deg)');
        $('#slidein3').css('-webkit-transform', 'rotate(-180deg)');
        $('#slide3').css('-moz-transform', 'rotate(-180deg)');
        $('#slidein3').css('-moz-transform', 'rotate(-180deg)');
        $('#slide3').css('-o-transform', 'rotate(-180deg)');
        $('#slidein3').css('-o-transform', 'rotate(-180deg)');
        $('#slide3').css('-ms-transform', 'rotate(-180deg)');
        $('#slidein3').css('-ms-transform', 'rotate(-180deg)');
        rotate4();
        $('#slide5').css('-webkit-transform', 'rotate(0deg)');
        $('#slidein5').css('-webkit-transform', 'rotate(0deg)');
        $('#slide5').css('-moz-transform', 'rotate(0deg)');
        $('#slidein5').css('-moz-transform', 'rotate(0deg)');
        $('#slide5').css('-o-transform', 'rotate(0deg)');
        $('#slidein5').css('-o-transform', 'rotate(0deg)');
        $('#slide5').css('-ms-transform', 'rotate(0deg)');
        $('#slidein5').css('-ms-transform', 'rotate(0deg)');
    }
    
    if(deg>720 && deg<900){
        
        $('#circlebar').stop(true).animate({left:20},300);
        $('#slider').stop(true).animate({top:274},200);
        
        $('#slide1').css('-webkit-transform', 'rotate(-180deg)');
        $('#slidein1').css('-webkit-transform', 'rotate(-180deg)');
        $('#slide1').css('-moz-transform', 'rotate(-180deg)');
        $('#slidein1').css('-moz-transform', 'rotate(-180deg)');
        $('#slide1').css('-o-transform', 'rotate(-180deg)');
        $('#slidein1').css('-o-transform', 'rotate(-180deg)');
        $('#slide1').css('-ms-transform', 'rotate(-180deg)');
        $('#slidein1').css('-ms-transform', 'rotate(-180deg)'); 
        
        $('#slide2').css('-webkit-transform', 'rotate(-180deg)');
        $('#slidein2').css('-webkit-transform', 'rotate(-180deg)');
        $('#slide2').css('-moz-transform', 'rotate(-180deg)');
        $('#slidein2').css('-moz-transform', 'rotate(-180deg)');
        $('#slide2').css('-o-transform', 'rotate(-180deg)');
        $('#slidein2').css('-o-transform', 'rotate(-180deg)');
        $('#slide2').css('-ms-transform', 'rotate(-180deg)');
        $('#slidein2').css('-ms-transform', 'rotate(-180deg)');
        
        $('#slide3').css('-webkit-transform', 'rotate(-180deg)');
        $('#slidein3').css('-webkit-transform', 'rotate(-180deg)');
        $('#slide3').css('-moz-transform', 'rotate(-180deg)');
        $('#slidein3').css('-moz-transform', 'rotate(-180deg)');
        $('#slide3').css('-o-transform', 'rotate(-180deg)');
        $('#slidein3').css('-o-transform', 'rotate(-180deg)');
        $('#slide3').css('-ms-transform', 'rotate(-180deg)');
        $('#slidein3').css('-ms-transform', 'rotate(-180deg)');
        
        $('#slide4').css('-webkit-transform', 'rotate(-180deg)');
        $('#slidein4').css('-webkit-transform', 'rotate(-180deg)');
        $('#slide4').css('-moz-transform', 'rotate(-180deg)');
        $('#slidein4').css('-moz-transform', 'rotate(-180deg)');
        $('#slide4').css('-o-transform', 'rotate(-180deg)');
        $('#slidein4').css('-o-transform', 'rotate(-180deg)');
        $('#slide4').css('-ms-transform', 'rotate(-180deg)');
        $('#slidein4').css('-ms-transform', 'rotate(-180deg)');
        rotate5();
    }

    
       
       
    if(deg>900){
        
        
        $('#circlebar').stop(true).animate({left:-50},600);
        
        $('#slide5').css('-webkit-transform', 'rotate(-180deg)');
        $('#slidein5').css('-webkit-transform', 'rotate(-180deg)');
        $('#slide5').css('-moz-transform', 'rotate(-180deg)');
        $('#slidein5').css('-moz-transform', 'rotate(-180deg)');
        $('#slide5').css('-o-transform', 'rotate(-180deg)');
        $('#slidein5').css('-o-transform', 'rotate(-180deg)');
        $('#slide5').css('-ms-transform', 'rotate(-180deg)');
        $('#slidein5').css('-ms-transform', 'rotate(-180deg)');
        
        $('#slide1').css('-webkit-transform', 'rotate(-180deg)');
        $('#slidein1').css('-webkit-transform', 'rotate(-180deg)');
        $('#slide1').css('-moz-transform', 'rotate(-180deg)');
        $('#slidein1').css('-moz-transform', 'rotate(-180deg)');
        $('#slide1').css('-o-transform', 'rotate(-180deg)');
        $('#slidein1').css('-o-transform', 'rotate(-180deg)');
        $('#slide1').css('-ms-transform', 'rotate(-180deg)');
        $('#slidein1').css('-ms-transform', 'rotate(-180deg)'); 
        
        $('#slide2').css('-webkit-transform', 'rotate(-180deg)');
        $('#slidein2').css('-webkit-transform', 'rotate(-180deg)');
        $('#slide2').css('-moz-transform', 'rotate(-180deg)');
        $('#slidein2').css('-moz-transform', 'rotate(-180deg)');
        $('#slide2').css('-o-transform', 'rotate(-180deg)');
        $('#slidein2').css('-o-transform', 'rotate(-180deg)');
        $('#slide2').css('-ms-transform', 'rotate(-180deg)');
        $('#slidein2').css('-ms-transform', 'rotate(-180deg)');
        
        $('#slide3').css('-webkit-transform', 'rotate(-180deg)');
        $('#slidein3').css('-webkit-transform', 'rotate(-180deg)');
        $('#slide3').css('-moz-transform', 'rotate(-180deg)');
        $('#slidein3').css('-moz-transform', 'rotate(-180deg)');
        $('#slide3').css('-o-transform', 'rotate(-180deg)');
        $('#slidein3').css('-o-transform', 'rotate(-180deg)');
        $('#slide3').css('-ms-transform', 'rotate(-180deg)');
        $('#slidein3').css('-ms-transform', 'rotate(-180deg)');
        
        $('#slide4').css('-webkit-transform', 'rotate(-180deg)');
        $('#slidein4').css('-webkit-transform', 'rotate(-180deg)');
        $('#slide4').css('-moz-transform', 'rotate(-180deg)');
        $('#slidein4').css('-moz-transform', 'rotate(-180deg)');
        $('#slide4').css('-o-transform', 'rotate(-180deg)');
        $('#slidein4').css('-o-transform', 'rotate(-180deg)');
        $('#slide4').css('-ms-transform', 'rotate(-180deg)');
        $('#slidein4').css('-ms-transform', 'rotate(-180deg)');
    }
    
    
    //----------------------------------------------------------//
    
    if(deg>90 && deg<360){
    $('#slidein2').css('background-size', +sz2+'%');
    $('#updetail1').css('background-size', +sz2+'%');
    $('#det1').css('background-size', +sz2+'%');
    }
    
    if(deg>270 && deg<540){
    $('#slidein3').css('background-size', +sz3+'%');
    $('#updetail2').css('background-size', +sz3+'%');
    $('#det2').css('background-size', +sz3+'%');
    }
    
    if(deg>450 && deg<720){
    $('#slidein4').css('background-size', +sz4+'%');
    $('#updetail3').css('background-size', +sz4+'%');
    $('#det3').css('background-size', +sz4+'%');
    }
    
    if(deg>630 && deg<900){
    $('#slidein5').css('background-size', +sz5+'%');
    $('#updetail4').css('background-size', +sz5+'%');
    $('#det4').css('background-size', +sz5+'%');
    }
    
});
  
    
function rotate1() {   
    
    $('#slide1').css('-webkit-transform', 'rotate('+degz+'deg)');
    $('#slide1').css('-moz-transform', 'rotate('+degz+'deg)');
    $('#slide1').css('-ms-transform', 'rotate('+degz+'deg)');
    $('#slide1').css('-o-transform', 'rotate('+degz+'deg)');
    $('#slidein1').css('-webkit-transform', 'rotate('+deg+'deg)');
    $('#slidein1').css('-moz-transform', 'rotate('+deg+'deg)');
    $('#slidein1').css('-ms-transform', 'rotate('+deg+'deg)');
    $('#slidein1').css('-o-transform', 'rotate('+deg+'deg)');
    
}
    
function rotate2() {   
    
    $('#slide2').css('-webkit-transform', 'rotate('+degz2+'deg)');
    $('#slide2').css('-moz-transform', 'rotate('+degz2+'deg)');
    $('#slide2').css('-ms-transform', 'rotate('+degz2+'deg)');
    $('#slide2').css('-o-transform', 'rotate('+degz2+'deg)');
    $('#slidein2').css('-webkit-transform', 'rotate('+deg2+'deg)');
    $('#slidein2').css('-moz-transform', 'rotate('+deg2+'deg)');
    $('#slidein2').css('-ms-transform', 'rotate('+deg2+'deg)');
    $('#slidein2').css('-o-transform', 'rotate('+deg2+'deg)');
    
}
    
function rotate3() {   
    
    $('#slide3').css('-webkit-transform', 'rotate('+degz3+'deg)');
    $('#slide3').css('-moz-transform', 'rotate('+degz3+'deg)');
    $('#slide3').css('-ms-transform', 'rotate('+degz3+'deg)');
    $('#slide3').css('-o-transform', 'rotate('+degz3+'deg)');
    $('#slidein3').css('-webkit-transform', 'rotate('+deg3+'deg)');
    $('#slidein3').css('-moz-transform', 'rotate('+deg3+'deg)');
    $('#slidein3').css('-ms-transform', 'rotate('+deg3+'deg)');
    $('#slidein3').css('-o-transform', 'rotate('+deg3+'deg)');
    
}
    
function rotate4() {   
    
    $('#slide4').css('-webkit-transform', 'rotate('+degz4+'deg)');
    $('#slide4').css('-moz-transform', 'rotate('+degz4+'deg)');
    $('#slide4').css('-ms-transform', 'rotate('+degz4+'deg)');
    $('#slide4').css('-o-transform', 'rotate('+degz4+'deg)');
    $('#slidein4').css('-webkit-transform', 'rotate('+deg4+'deg)');
    $('#slidein4').css('-moz-transform', 'rotate('+deg4+'deg)');
    $('#slidein4').css('-ms-transform', 'rotate('+deg4+'deg)');
    $('#slidein4').css('-o-transform', 'rotate('+deg4+'deg)');
    
}
    
function rotate5() {   
    
    $('#slide5').css('-webkit-transform', 'rotate('+degz5+'deg)');
    $('#slide5').css('-moz-transform', 'rotate('+degz5+'deg)');
    $('#slide5').css('-ms-transform', 'rotate('+degz5+'deg)');
    $('#slide5').css('-o-transform', 'rotate('+degz5+'deg)');
    $('#slidein5').css('-webkit-transform', 'rotate('+deg5+'deg)');
    $('#slidein5').css('-moz-transform', 'rotate('+deg5+'deg)');
    $('#slidein5').css('-ms-transform', 'rotate('+deg5+'deg)');
    $('#slidein5').css('-o-transform', 'rotate('+deg5+'deg)');
    
}
});