window.onload = () => {
  var socket = io();
}

function test(){
    alert("h");
}
var elem = document.getElementById("frame");

$(document).ready(function(){
    $("iframe").on("load", function(){
        $(this).contents().on("mousedown, mouseup, click", function(){
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
              } else if (elem.webkitRequestFullscreen) { 
                elem.webkitRequestFullscreen();
              } else if (elem.msRequestFullscreen) { 
                elem.msRequestFullscreen();
              }
        });
    });
});
