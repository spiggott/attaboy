<script>
(function() {
  const params = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  const urlParams = new URLSearchParams(window.location.search);

  // Store UTM params in localStorage
  params.forEach(param => {
	const value = urlParams.get(param);
	if (value) {
	  localStorage.setItem(param, value);
	}
  });

  // Populate hidden fields on DOM ready
  document.addEventListener('DOMContentLoaded', function() {
	params.forEach(param => {
	  const field = document.querySelector(`input[name="${param}"]`);
	  const storedValue = localStorage.getItem(param);
	  if (field && storedValue) {
		field.value = storedValue;
	  }
	});
  });
})();
</script>