# Attaboy - UTM Parameter Tracking Implementation for WordPress + WPForms

## Overview
This solution captures UTM parameters from incoming links, stores them in the user's browser, and automatically populates hidden form fields in WPForms for attribution tracking in ActiveCampaign.

## Implementation Steps

### Step 1: Add the JavaScript to Your WordPress Site

You have several options to add the UTM tracking script:

#### Option A: Add to theme's functions.php (Recommended)
Add this code to your theme's `functions.php` file:

```php
function enqueue_attaboy() {
	wp_enqueue_script(
		'attaboy',
		get_template_directory_uri() . '/js/attaboy.js',
		array(),
		'1.0.0',
		true
	);
}
add_action('wp_enqueue_scripts', 'enqueue_attaboy');
```

Then upload the `attaboy.js` file to your theme's `/js/` directory.

#### Option B: Using a Plugin (Code Snippets)
If you're using the "Code Snippets" plugin:
1. Go to Snippets → Add New
2. Title: "Attaboy - UTM Parameter Tracker"
3. Code Type: JavaScript Snippet
4. Paste the JavaScript code from `attaboy.js`
5. Location: Frontend
6. Save and activate

#### Option C: Add directly to theme files
Add this to your theme's `header.php` before the closing `</head>` tag:

```html
<script>
// Paste the entire contents of attaboy.js here
</script>
```

#### Option D: Google Tag Manager (Recommended for Marketing Teams)
If you're using Google Tag Manager, this is often the preferred method:

1. **Create a Custom HTML Tag:**
   - Go to your GTM container
   - Click "Tags" → "New"
   - Choose "Custom HTML" as the tag type
   - Name: "Attaboy - UTM Parameter Tracker"

2. **Add the Script:**
   ```html
   <script>
   // Paste the entire contents of attaboy.js here
   </script>
   ```

3. **Set Trigger:**
   - Trigger Type: "Page View"
   - Choose "All Pages" (or create a custom trigger if you only want it on specific pages)

4. **Advanced Settings (Optional but Recommended):**
   - Tag firing priority: Set to a higher number (e.g., 100) to ensure it loads early
   - Enable "Once per page" if you want to prevent duplicate executions

5. **Test and Publish:**
   - Use GTM Preview mode to test
   - Publish when ready

**GTM Advantages:**
- No code changes to WordPress
- Easy to enable/disable without touching the website
- Version control and rollback capabilities
- Can be managed by marketing teams without developer access
- Easy A/B testing of different configurations

### Step 2: Configure Your WPForms

1. **Create Hidden Fields in WPForms:**
   - Edit your form in WPForms
   - Add "Hidden Field" for each UTM parameter:
	 - Field Label: "UTM Source" → Field Name: `utm_source`
	 - Field Label: "UTM Medium" → Field Name: `utm_medium`
	 - Field Label: "UTM Campaign" → Field Name: `utm_campaign`
	 - Field Label: "UTM Term" → Field Name: `utm_term`
	 - Field Label: "UTM Content" → Field Name: `utm_content`

2. **Map Fields to ActiveCampaign:**
   - In WPForms → Settings → Integrations → ActiveCampaign
   - Map each UTM hidden field to corresponding custom fields in ActiveCampaign
   - Make sure the custom fields exist in ActiveCampaign first

### Step 3: Create Custom Fields in ActiveCampaign

1. Go to Settings → Fields in ActiveCampaign
2. Create custom fields:
   - `UTM Source` (Text field)
   - `UTM Medium` (Text field) 
   - `UTM Campaign` (Text field)
   - `UTM Term` (Text field)
   - `UTM Content` (Text field)

### Step 4: Test the Implementation

1. **Test UTM Capture:**
   - Visit: `https://seeztoday.com/?utm_medium=test&utm_source=testsource&utm_campaign=testcampaign`
   - Open browser console (F12)
   - You should see: "Attaboy: Stored UTM parameters: {utm_medium: 'test', utm_source: 'testsource', utm_campaign: 'testcampaign'}"

2. **Test Form Population:**
   - Navigate to a page with your WPForm
   - Check browser console for: "Attaboy: Populated utm_medium with value: test"
   - Inspect the hidden form fields to verify they contain the UTM values

3. **Test Form Submission:**
   - Submit the form
   - Check ActiveCampaign to see if the UTM data appears in the contact record

## How It Works

1. **UTM Capture:** When a user visits a page with UTM parameters, the script extracts them from the URL
2. **Storage:** UTM parameters are stored in localStorage (with cookie fallback) for 30 days
3. **Form Population:** When WPForms load, the script automatically finds and populates matching hidden fields
4. **Attribution:** When forms are submitted, the UTM data flows through to ActiveCampaign via WPForms integration

## Key Features

- **Persistent Storage:** UTM data persists for 30 days across browser sessions
- **Multiple Page Navigation:** Users can browse multiple pages and the UTM data is retained
- **Fallback Support:** Uses cookies if localStorage is unavailable
- **Dynamic Form Support:** Works with AJAX-loaded forms
- **Debug Tools:** Console logging and utility functions for troubleshooting

## Debugging

Use these browser console commands to debug:

```javascript
// Check stored UTM parameters
attaboy.getStored()

// Clear all stored UTM data
attaboy.clear()
```

## Troubleshooting

### Hidden fields not populating:
1. Check browser console for error messages
2. Verify hidden field names match exactly: `utm_source`, `utm_medium`, etc.
3. Inspect form HTML to confirm field names and selectors

### UTM data not reaching ActiveCampaign:
1. Verify WPForms → ActiveCampaign integration is configured
2. Check field mapping in WPForms settings
3. Ensure custom fields exist in ActiveCampaign
4. Test form submission and check ActiveCampaign contact records

### Script not loading:
1. Check browser console for JavaScript errors
2. Verify file paths are correct
3. Ensure script is enqueued properly in WordPress

## Security Notes

- The script only captures standard UTM parameters
- Data is stored client-side only
- No sensitive information is transmitted
- UTM data expires automatically after 30 days

## Browser Support

This solution works in all modern browsers including:
- Chrome 45+
- Firefox 34+
- Safari 10+
- Edge 12+
