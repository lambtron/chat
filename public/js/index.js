'use strict';

$(document).ready(function() {
	// $('#new-user').dropdown();
	$('.dropdown-menu input').click(function(e) {
    e.stopPropagation();
	});
});