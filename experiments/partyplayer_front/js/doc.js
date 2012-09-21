var $j = jQuery.noConflict();

$j(document).ready(function(){
	$j("#main ul li.top a").click(function(){
		event.preventDefault();
		var x = $j(this).parent().children(".sub").toggle();
	});
});
