!function(){var e=io();if(e.on("userid",function(e){console.log("socket id",e)}),!Animator.isSupported())return void alert("no support for you!");var n=document.querySelector(".pause"),t=document.querySelector(".play");n.addEventListener("click",function(){Animator.pause()},!1),t.addEventListener("click",function(){Animator.play()},!1);var o=document.querySelector(".text"),r=Animator.combo([Animator.transition({element:o,properties:"font-size",addClass:{before:"tran"}}),Animator.animation({element:o,addClass:{before:"anim"}})]);r.then(function(){return Animator.transition({element:o,properties:"font-size",addClass:{before:"tran2"}})}).then(function(){console.log("done")})["catch"](function(){})}();