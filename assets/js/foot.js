// Ensure profile dropdown works even if Bootstrap JS isn't initialized
$(document).ready(function () {
  var $trigger = $("#profileDropdown");
  var $menu = $trigger.closest(".dropdown").find(".dropdown-menu");
  // Fallback toggle if no Bootstrap dropdown plugin present
  if (typeof $.fn.dropdown !== "function") {
    $trigger.on("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      $(".dropdown-menu").not($menu).removeClass("show");
      $menu.toggleClass("show");
    });
    // Close on outside click
    $(document).on("click", function () {
      $menu.removeClass("show");
    });
  } else {
    // Initialize via Bootstrap if available
    $trigger.dropdown();
  }
});
var div = document.createElement("div");
div.innerHTML = "<p>" + "F" + "o" + "o" + "t" + "e" + "r" + "</p>";
// set style
div.style.color = "#000";
div.style.backgroundColor = "#fff";
div.style.textAlign = "center";
div.style.padding = "15px 0 0px";
div.style.position = "fixed";
div.style.bottom = "0";
div.style.left = "43px";
div.style.right = "0";
div.style.boxShadow = "0px 0px 9px #00000024";
// better to use CSS though - just set class
div.setAttribute("class", "myclass"); // and make sure myclass has some styles in css
document.body.appendChild(div);
