Student Finance Tracker
A responsive, accessible web application for students to manage their finances with advanced regex validation, currency conversion, and local data persistence.

🚀 Features
Core Functionality
Transaction Management: Add, edit, delete financial transactions

Budget Tracking: Set monthly budget limits with visual alerts

Currency Support: KES (Kenya Shillings), RWF (Rwandan Francs), USD with manual exchange rates

Advanced Search: Regex-powered search with pattern highlighting

Data Persistence: LocalStorage with JSON import/export

Responsive Design: Mobile-first layout with sidebar navigation

Regex Validation & Search
Description: /^\S(?:.*\S)?$/ - No leading/trailing spaces

Amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/ - Positive numbers with 2 decimal places

Date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/ - YYYY-MM-DD format

Category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/ - Letters, spaces, hyphens

Advanced: /\b(\w+)\s+\1\b/ - Duplicate word detection

Search Patterns Examples
Find cents: /\.\d{2}\b/

Beverage keywords: /(coffee|tea)/i

Duplicate words: /\b(\w+)\s+\1\b/

📁 Project Structure
text
finance-tracker/
├── index.html              # Main HTML file
├── style.css               # Styles and responsive design
├── scripts/                # Modular JavaScript
│   ├── main.js            # App orchestration
│   ├── storage.js         # LocalStorage operations
│   ├── state.js           # Business logic & state management
│   ├── validator.js       # Regex validation & utilities
│   └── ui.js              # DOM manipulation & event handling
├── assets/
│   ├── images/
│   │   └── atlantic-money-9XrefmwkHCs-unsplash.jpg
│   ├── icons/             # SVG icons for UI
│   └── seed.json          # Sample transaction data
└── README.md
🛠️ Installation & Setup
Clone or download the project files

Serve locally using one of these methods:

bash
# Python 3
python -m http.server 3000

# Node.js (http-server)
npx http-server -p 3000

# PHP
php -S localhost:3000
Open http://localhost:3000 in your browser

⌨️ Keyboard Navigation
Tab: Navigate between interactive elements

Enter/Space: Activate buttons and form controls

Escape: Close sidebar (mobile)

Arrow keys: Navigate dropdown menus

♿ Accessibility Features
Semantic HTML: Proper heading structure and landmarks

ARIA Live Regions: Dynamic budget alerts and status messages

Keyboard Navigation: Full keyboard support

Focus Management: Visible focus indicators

Skip Links: "Skip to main content" for screen readers

Color Contrast: WCAG compliant color ratios

💰 Currency Configuration
Default Exchange Rates
KES: 1 (base currency)

RWF: 12.5 (1 KES = 12.5 RWF)

USD: 0.0078 (1 KES = 0.0078 USD)

Manual Configuration
Update exchange rates in Settings:

Navigate to Settings section

Enter current exchange rates

Click "Save Settings"

📊 Data Model
javascript
{
  "id": "txn_123456789",
  "description": "Lunch at cafeteria",
  "amount": -12.50,  // Negative for expenses
  "category": "Food",
  "date": "2025-01-15",
  "createdAt": "2025-01-15T10:00:00.000Z",
  "updatedAt": "2025-01-15T10:00:00.000Z"
}
🔧 Technical Implementation
Modular Architecture
storage.js: Data persistence layer

state.js: Business logic and application state

validator.js: Regex validation and utilities

ui.js: DOM manipulation and event handling

main.js: Application orchestration

Browser Compatibility
Modern browsers with ES6 module support

LocalStorage required for data persistence

CSS Grid and Flexbox for layout

🎯 Usage Guide
Adding Transactions
Navigate to "Add/Edit" section

Fill in description, category, amount, and date

Submit form (auto-validates with regex)

Managing Budget
Set monthly budget in Settings

Monitor "Remaining Budget" in Dashboard

Receive alerts when budget is low or exceeded

Searching Transactions
Use regex patterns in search box

Try example patterns provided

Matches are highlighted in results

Data Management
Export: Download JSON backup

Import: Upload valid JSON file

Validation: Imported data is validated for structure

🐛 Troubleshooting
Common Issues
"Finance Tracker not loading": Check browser console for module errors

"Invalid regex pattern": Use valid regex syntax or try example patterns

"Data not saving": Ensure LocalStorage is enabled in browser

"Currency conversion not working": Verify exchange rates in Settings

Debug Mode
Open browser console to see:

Module loading status

Form submission data

Error messages and warnings

📝 Development Notes
Regex Implementation
Safe regex compilation with error handling

Pattern highlighting without breaking accessibility

Client-side validation with immediate feedback

Responsive Breakpoints
Mobile: ≤ 768px (sidebar navigation)

Tablet: 769px - 1024px

Desktop: ≥ 1025px (horizontal navigation)

Performance Considerations
Debounced search input

Efficient DOM updates

Minimal re-renders with state management

📄 License
This project is for educational purposes as part of a web development curriculum.

👥 Developer
Michael Odhiambo

Email: m.odhiambo@alustudent.com

GitHub: https://github.com/Mich-O/studentFinanceTracker.git

Built with vanilla HTML, CSS, and JavaScript
No frameworks • Mobile-first • Accessible • Responsive