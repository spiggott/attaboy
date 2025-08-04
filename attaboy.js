/**
 * Attaboy - UTM Parameter Tracker for WordPress + WPForms
 * Captures UTM parameters from URLs and stores them for form population
 */

(function() {
	'use strict';

	// Configuration
	const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
	const STORAGE_PREFIX = 'utm_';
	const NEVER_EXPIRE = true; // Set to false if you want expiration
	const STORAGE_EXPIRY_DAYS = 30; // Only used if NEVER_EXPIRE is false

	/**
	 * Get URL parameters from current page
	 */
	function getUrlParams() {
		const urlParams = new URLSearchParams(window.location.search);
		const params = {};
		
		UTM_PARAMS.forEach(param => {
			const value = urlParams.get(param);
			if (value) {
				params[param] = value;
			}
		});
		
		return params;
	}

	/**
	 * Store UTM parameters in localStorage with optional expiry
	 */
	function storeUtmParams(params) {
		Object.keys(params).forEach(param => {
			if (NEVER_EXPIRE) {
				// Store without expiry
				const data = {
					value: params[param],
					timestamp: new Date().getTime(),
					permanent: true
				};
				
				try {
					localStorage.setItem(STORAGE_PREFIX + param, JSON.stringify(data));
				} catch (e) {
					// Fallback to cookies if localStorage fails (cookies will expire, but that's the limitation)
					setCookie(STORAGE_PREFIX + param, params[param], 365 * 10); // 10 years as "permanent"
				}
			} else {
				// Store with expiry
				const expiry = new Date();
				expiry.setDate(expiry.getDate() + STORAGE_EXPIRY_DAYS);
				
				const data = {
					value: params[param],
					expiry: expiry.getTime(),
					timestamp: new Date().getTime()
				};
				
				try {
					localStorage.setItem(STORAGE_PREFIX + param, JSON.stringify(data));
				} catch (e) {
					// Fallback to cookies if localStorage fails
					setCookie(STORAGE_PREFIX + param, params[param], STORAGE_EXPIRY_DAYS);
				}
			}
		});
	}

	/**
	 * Get stored UTM parameters from localStorage
	 */
	function getStoredUtmParams() {
		const params = {};
		
		UTM_PARAMS.forEach(param => {
			try {
				const stored = localStorage.getItem(STORAGE_PREFIX + param);
				if (stored) {
					const data = JSON.parse(stored);
					
					// Check if permanent or not expired
					if (data.permanent || (data.expiry && new Date().getTime() < data.expiry)) {
						params[param] = data.value;
					} else if (data.expiry && new Date().getTime() >= data.expiry) {
						// Remove expired data
						localStorage.removeItem(STORAGE_PREFIX + param);
					}
				}
			} catch (e) {
				// Fallback to cookies
				const cookieValue = getCookie(STORAGE_PREFIX + param);
				if (cookieValue) {
					params[param] = cookieValue;
				}
			}
		});
		
		return params;
	}

	/**
	 * Cookie fallback functions
	 */
	function setCookie(name, value, days) {
		const expires = new Date();
		expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
		document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
	}

	function getCookie(name) {
		const nameEQ = name + "=";
		const ca = document.cookie.split(';');
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) === ' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
		}
		return null;
	}

	/**
	 * Populate WPForms hidden fields with UTM data
	 */
	function populateWpForms() {
		const storedParams = getStoredUtmParams();
		
		// Wait for WPForms to be ready
		const populateFields = () => {
			UTM_PARAMS.forEach(param => {
				if (storedParams[param]) {
					// Try different possible field name formats
					const selectors = [
						`input[name="${param}"]`,
						`input[name="wpforms[fields][${param}]"]`,
						`input[id*="${param}"]`,
						`input[class*="${param}"]`
					];
					
					let field = null;
					for (const selector of selectors) {
						field = document.querySelector(selector);
						if (field) break;
					}
					
					if (field && field.type === 'hidden') {
						field.value = storedParams[param];
						console.log(`Attaboy: Populated ${param} with value: ${storedParams[param]}`);
					}
				}
			});
		};

		// Try to populate immediately
		populateFields();
		
		// Also try after DOM is fully loaded
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', populateFields);
		}
		
		// And try again after a short delay for dynamic forms
		setTimeout(populateFields, 1000);
	}

	/**
	 * Initialize UTM tracking
	 */
	function init() {
		// Capture UTM parameters from current URL
		const currentUtmParams = getUrlParams();
		
		// Store them if any are found
		if (Object.keys(currentUtmParams).length > 0) {
			storeUtmParams(currentUtmParams);
			console.log('Attaboy: Stored UTM parameters:', currentUtmParams);
		}
		
		// Populate forms with stored UTM data
		populateWpForms();
		
		// Also listen for dynamic form loading (AJAX, etc.)
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.addedNodes.length) {
					mutation.addedNodes.forEach((node) => {
						if (node.nodeType === 1 && (
							node.classList.contains('wpforms-form') ||
							node.querySelector('.wpforms-form')
						)) {
							setTimeout(populateWpForms, 100);
						}
					});
				}
			});
		});
		
		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	}

	// Initialize when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}

	// Expose utility functions for debugging
	window.attaboy = {
		getStored: getStoredUtmParams,
		clear: () => {
			UTM_PARAMS.forEach(param => {
				localStorage.removeItem(STORAGE_PREFIX + param);
				document.cookie = `${STORAGE_PREFIX + param}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
			});
			console.log('Attaboy: Cleared all stored UTM data');
		}
	};

})();
