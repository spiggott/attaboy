<script>
(function() {
  var params = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  var urlParams = (function() {
	var result = {};
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
	  var pair = vars[i].split("=");
	  if (pair.length === 2) {
		result[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
	  }
	}
	return result;
  })();

  // Store UTM params in localStorage
  for (var i = 0; i < params.length; i++) {
	var param = params[i];
	var value = urlParams[param];
	if (value) {
	  try {
		localStorage.setItem(param, value);
	  } catch (e) {
		// fail silently
	  }
	}
  }

  // Populate hidden fields on DOM ready
  document.addEventListener('DOMContentLoaded', function() {
	for (var j = 0; j < params.length; j++) {
	  var p = params[j];
	  var stored = localStorage.getItem(p);
	  var field = document.querySelector('input[name="' + p + '"]');
	  if (field && stored) {
		field.value = stored;
	  }
	}
  });
})();
</script>