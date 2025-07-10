# PowerToys Chrome Extension

A collection of power tools for web browsing, designed to enhance your browsing experience with useful utilities.

## Features

- **Enable Inputs**: Enable all disabled input elements on the current page
- **Show Passwords**: Convert password fields to text fields to reveal hidden passwords
- **Design Mode**: Toggle the browser's design mode to edit any text on the page
- **Toggle JavaScript**: Disable or enable JavaScript functionality on the current page

## Installation

Since this is a local extension, you'll need to install it manually:

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" using the toggle in the top-right corner
4. Click "Load unpacked" and select the `powertoys` directory
5. The extension should now appear in your extensions list and in the toolbar

## Usage

1. Click on the PowerToys icon in your Chrome toolbar to open the popup
2. Select any of the available tools:
   - **Enable Inputs**: Click to enable all disabled form elements
   - **Show Passwords**: Click to reveal password fields
   - **Design Mode**: Click to toggle design mode (allows editing page content)
   - **Toggle JavaScript**: Click to disable/enable JavaScript (may require page reload)

## Dark Mode Support

PowerToys automatically adapts to your system's color scheme preferences. It will use:
- Light theme when your system is set to light mode
- Dark theme when your system is set to dark mode

## Notes

- The JavaScript toggle feature works by overriding key JavaScript functions. It may not completely disable all JavaScript functionality, and restoring JavaScript may require a page reload.
- Design mode allows you to edit text on the page, but changes are not saved when you navigate away or reload the page.
- This extension requires permission to access and modify the current tab's content.

## Development

To modify this extension:

1. Edit the HTML, CSS, and JavaScript files as needed
2. Reload the extension in `chrome://extensions/` by clicking the refresh icon
3. Test your changes

## Icons

The extension uses placeholder icons. Before publishing, replace the placeholder icons in the `icons` directory with custom icons following the guidelines in the icons README.
