!function(){if(!Animator.isSupported())return void alert("no support for you!");var n,a=document.querySelector(".gallery .inner"),t={};a.addEventListener("mouseover",function(){Animator.pause()},!1),a.addEventListener("mouseout",function(){Animator.play()},!1),t[Animator.getPrefix("animation-name")]="galleryAnimation",t[Animator.getPrefix("animation-duration")]="8s",t[Animator.getPrefix("animation-iteration-count")]=5,Animator.createAnimation({name:"galleryAnimation",animation:{"0%":{transform:"translate3d(0%, 0, 1px)"},"30%":{transform:"translate3d(0%, 0, 1px)"},"50%":{transform:"translate3d(-100%, 0, 1px)"},"80%":{transform:"translate3d(-100%, 0, 1px)"},"100%":{transform:"translate3d(0%, 0, 1px)"}},animationClass:{name:"galleryAnimation",rules:t}}),n=Animator.animation({element:a,addClass:{before:"galleryAnimation"}}),n.then(function(){console.log("all done!")})["catch"](function(){console.log("error!")})}();