
function test(){
    alert("h");
}
var elem = document.getElementById("frame");

$(document).ready(function(){
    $("iframe").on("load", function(){
        $(this).contents().on("mousedown, mouseup, click", function(){
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
              } else if (elem.webkitRequestFullscreen) { /* Safari */
                elem.webkitRequestFullscreen();
              } else if (elem.msRequestFullscreen) { /* IE11 */
                elem.msRequestFullscreen();
              }
        });
    });
});

/* When the openFullscreen() function is executed, open the video in fullscreen.
Note that we must include prefixes for different browsers, as they don't support the requestFullscreen method yet */
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}