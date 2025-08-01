# Attaboy.js

`attaboy.js` is a lightweight JavaScript utility that captures UTM parameters from the URL and stores them in the browser's `localStorage`. It then populates hidden fields in a form (such as a WPForms form) with those values, enabling accurate campaign tracking even if the user navigates to different pages before submitting the form.

---

## 📌 Purpose

This script is designed to:
- Capture marketing attribution data (e.g., `utm_source`, `utm_medium`) from the URL.
- Store that data in the browser using `localStorage`.
- Automatically pre-fill hidden form fields with the stored UTM values on page load.

---

## 🔧 How It Works

1. **UTM Extraction**  
   When the page loads, the script checks the current URL for standard UTM parameters:
   - `utm_source`
   - `utm_medium`
   - `utm_campaign`
   - `utm_term`
   - `utm_content`

2. **Storage**  
   If any of the parameters are found, they are saved to the browser's `localStorage`, which allows the values to persist even as the user navigates to other pages.

3. **Form Pre-Fill**  
   On `DOMContentLoaded`, the script looks for `<input>` fields with names matching the UTM parameter names. If found, the values from `localStorage` are inserted into these fields automatically.

---

## ✅ Requirements

- A form (e.g., WPForms) with hidden input fields named exactly as the UTM parameters (`utm_source`, `utm_medium`, etc.).
- The script should be included on all pages where:
  - You expect UTM parameters to be captured
  - The form that needs to be pre-filled is located

---

## 🚫 Limitations

- `localStorage` is **device- and browser-specific**: UTM data won’t persist across devices or different browsers.
- No expiration control: data will persist until the user clears their browser storage.
- Not a replacement for server-side or cross-device tracking.

---

## 🧪 Testing Tips

To test if the script works:
1. Visit a URL like:  
   `https://yourdomain.com/?utm_source=google&utm_medium=cpc&utm_campaign=test`
2. Inspect the form’s hidden fields to see if the UTM values were correctly populated.
3. Submit the form and confirm that UTM data is captured in your form tool's entry system (e.g., WPForms entries dashboard).

---

## 📂 Deployment

You can include this script:
- Directly in your site’s HTML
- Via a tag manager like Google Tag Manager (note: use ES5-compatible syntax for GTM)

---

## 🔒 Privacy Considerations

Even though this script does not use cookies, storing user-identifiable data in localStorage may still require disclosure or consent under privacy regulations (e.g., GDPR, CCPA). Always ensure compliance with applicable laws.

---

## 📄 License

MIT License — free to use and modify for personal or commercial projects.