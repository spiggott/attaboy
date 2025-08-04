# Attaboy 🎯

A lightweight JavaScript library for automatically capturing, storing, and managing UTM parameters across your website sessions.

## Features

- 🚀 **Automatic UTM capture** - Grabs UTM parameters from the URL on page load
- 💾 **Persistent storage** - Uses localStorage to maintain UTM data across sessions
- 📝 **Form auto-population** - Automatically fills hidden form fields with stored UTM values
- 🔧 **Simple API** - Easy-to-use JavaScript methods for accessing and managing UTM data
- 📦 **Zero dependencies** - Pure vanilla JavaScript, no external libraries required
- ⚡ **Lightweight** - Minimal footprint for fast page loads

## Installation

### Via jsDelivr CDN (Recommended)

Add this script tag to your HTML `<head>` or before the closing `</body>` tag:

```html
<script src="https://cdn.jsdelivr.net/gh/spiggott/attaboy@main/attaboy.js"></script>
```

### Via Google Tag Manager

1. Create a new **Custom HTML** tag
2. Add the script tag above
3. Set trigger to **All Pages** (or as needed)
4. Save and publish

## Tracked Parameters

Attaboy automatically tracks these UTM parameters:

- `utm_source`
- `utm_medium` 
- `utm_campaign`
- `utm_term`
- `utm_content`

## How It Works

1. **URL Detection**: When a user visits a page with UTM parameters (e.g., `yoursite.com?utm_source=google&utm_campaign=holiday`), Attaboy automatically captures them
2. **Storage**: Parameters are stored in the browser's localStorage for persistence across sessions
3. **Form Population**: On each page load, Attaboy looks for hidden form fields with names matching UTM parameters and auto-fills them
4. **API Access**: Use the JavaScript API to programmatically access stored values

## API Reference

### `attaboy.getStored()`

Get all stored UTM parameters as an object.

```javascript
// Returns object with all stored UTM parameters
const allParams = attaboy.getStored();
// Example result: { utm_source: 'google', utm_campaign: 'holiday', utm_medium: 'cpc' }
```

### `attaboy.getStored(parameter)`

Get a specific UTM parameter value.

```javascript
// Get specific parameter
const source = attaboy.getStored('utm_source');
// Example result: 'google'

const campaign = attaboy.getStored('utm_campaign');
// Example result: 'holiday'
```

### `attaboy.getAllParams()`

Get the list of all tracked parameter names.

```javascript
const trackedParams = attaboy.getAllParams();
// Returns: ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
```

### `attaboy.clearStored()`

Clear all stored UTM parameters.

```javascript
// Clear all stored UTM data
attaboy.clearStored();
```

### `attaboy.clearStored(parameter)`

Clear a specific UTM parameter.

```javascript
// Clear specific parameter
attaboy.clearStored('utm_source');
```

## Usage Examples

### Basic Form Integration

Create hidden form fields that will be automatically populated:

```html
<form action="/submit" method="post">
  <!-- Visible form fields -->
  <input type="email" name="email" placeholder="Your email" required>
  <textarea name="message" placeholder="Your message" required></textarea>
  
  <!-- Hidden UTM fields - automatically populated by Attaboy -->
  <input type="hidden" name="utm_source">
  <input type="hidden" name="utm_medium">
  <input type="hidden" name="utm_campaign">
  <input type="hidden" name="utm_term">
  <input type="hidden" name="utm_content">
  
  <button type="submit">Send Message</button>
</form>
```

### Programmatic Access

```javascript
// Check if user came from a specific source
if (attaboy.getStored('utm_source') === 'google') {
  console.log('User came from Google!');
}

// Get all UTM data for analytics
const utmData = attaboy.getStored();
console.log('UTM Data:', utmData);

// Send UTM data to your analytics
gtag('event', 'form_submit', {
  utm_source: attaboy.getStored('utm_source'),
  utm_campaign: attaboy.getStored('utm_campaign')
});
```

### Conditional Content

```javascript
// Show different content based on traffic source
const source = attaboy.getStored('utm_source');
const campaign = attaboy.getStored('utm_campaign');

if (source === 'facebook' && campaign === 'social_promo') {
  document.getElementById('special-offer').style.display = 'block';
}
```

### Google Tag Manager Integration

1. **Install Attaboy**: Create a Custom HTML tag with the CDN script
2. **Use in other tags**: Reference UTM data in your GTM tags

```javascript
// In a Custom JavaScript variable in GTM
function() {
  return attaboy.getStored('utm_source') || 'direct';
}

// In a Custom HTML tag
<script>
  var source = attaboy.getStored('utm_source');
  if (source) {
	dataLayer.push({
	  'event': 'utm_data_available',
	  'utm_source': source,
	  'utm_campaign': attaboy.getStored('utm_campaign')
	});
  }
</script>
```

### CRM Integration

```javascript
// Send UTM data to your CRM when user converts
function sendToCRM(userData) {
  const utmData = attaboy.getStored();
  
  fetch('/api/crm/contact', {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({
	  ...userData,
	  ...utmData, // Include all UTM parameters
	  attribution_source: utmData.utm_source || 'direct',
	  attribution_campaign: utmData.utm_campaign || 'none'
	})
  });
}
```

## Example Scenarios

### Scenario 1: User Journey Tracking
1. User clicks ad: `yoursite.com?utm_source=google&utm_medium=cpc&utm_campaign=holiday`
2. Attaboy stores: `{ utm_source: 'google', utm_medium: 'cpc', utm_campaign: 'holiday' }`
3. User browses multiple pages (UTM data persists)
4. User fills out contact form → UTM data automatically included
5. You can attribute the conversion to the Google Ads holiday campaign

### Scenario 2: A/B Testing
```javascript
// Different landing page experiences based on campaign
const campaign = attaboy.getStored('utm_campaign');

if (campaign === 'test_variant_a') {
  showVariantA();
} else if (campaign === 'test_variant_b') {
  showVariantB();
} else {
  showDefault();
}
```

## Browser Support

- ✅ Chrome (all versions)
- ✅ Firefox (all versions) 
- ✅ Safari (all versions)
- ✅ Edge (all versions)
- ✅ Internet Explorer 9+

## Privacy & GDPR

Attaboy stores data in the browser's localStorage, which:
- Stays on the user's device (not sent to external servers)
- Can be cleared by the user at any time
- Respects browser privacy settings
- Does not use cookies

For GDPR compliance, consider:
- Adding UTM tracking to your privacy policy
- Providing users a way to clear their stored data
- Respecting "Do Not Track" preferences if required

```javascript
// Example: Clear UTM data for privacy compliance
function clearAllTrackingData() {
  attaboy.clearStored();
  console.log('All UTM tracking data cleared');
}
```

## Troubleshooting

### UTM parameters not being captured
- Check that the script loads before your forms render
- Verify UTM parameters are in the URL when the page loads
- Check browser console for any JavaScript errors

### Form fields not auto-populating  
- Ensure hidden input fields have `name` attributes matching UTM parameter names exactly
- Verify the DOM is fully loaded (script waits for `DOMContentLoaded`)
- Check that field names match: `utm_source`, `utm_medium`, etc.

### API methods not available
- Confirm the script has loaded completely
- Check that `window.attaboy` exists in browser console
- Verify no JavaScript errors are preventing script execution

## Contributing

Found a bug or have a feature request? Please open an issue on GitHub!

## License

MIT License - feel free to use in your projects!

---

**Made with ❤️ for better attribution tracking**
