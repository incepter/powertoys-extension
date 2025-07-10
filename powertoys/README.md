# PowerToys Chrome Extension

A collection of power tools for web browsing, designed to enhance your browsing experience with useful utilities.

## Features

- **Enable Inputs**: Enable all disabled input elements on the current page
- **Show Passwords**: Convert password fields to text fields to reveal hidden passwords
- **Design Mode**: Toggle the browser's design mode to edit any text on the page
- **Reveal Hidden**: Show inputs or elements with display:none or visibility:hidden
- **Highlighter**: Allow highlighting and marking sections on any webpage
- **Export as PDF**: Export the current page as a clean PDF without ads or distractions
- **Remove Overlays**: Remove annoying overlays, modals, and popups from the page

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
   - **Reveal Hidden**: Click to show elements that are hidden with display:none or visibility:hidden
   - **Highlighter**: Click to toggle the highlighter tool (click or drag on page elements to highlight them)
   - **Export as PDF**: Click to create a clean version of the page and open the print dialog for PDF export
   - **Remove Overlays**: Click to remove annoying overlays, modals, and popups from the current page

## Dark Mode Support

PowerToys automatically adapts to your system's color scheme preferences. It will use:
- Light theme when your system is set to light mode
- Dark theme when your system is set to dark mode

## Notes

- **Design Mode**: Allows you to edit text on the page, but changes are not saved when you navigate away or reload the page.
- **Reveal Hidden**: Makes hidden elements visible and adds a red dashed outline to help identify them.
- **Highlighter**: Remains active until toggled off, allowing you to highlight multiple elements across the page.
- **Export as PDF**: Creates a clean version of the page by removing ads, navigation, and other distractions before opening the print dialog.
- **Remove Overlays**: Intelligently identifies and removes elements that are likely to be overlays, modals, or popups based on their styling and position.
- This extension requires permission to access and modify the current tab's content.

## Development

To modify this extension:

1. Edit the HTML, CSS, and JavaScript files as needed
2. Reload the extension in `chrome://extensions/` by clicking the refresh icon
3. Test your changes

## Icons

The extension uses placeholder icons. Before publishing, replace the placeholder icons in the `icons` directory with custom icons following the guidelines in the icons README.
