# Student Finance Tracker

 A clean, responsive web application for students to track expenses, manage budgets, and monitor spending habits. Built with vanilla JavaScript, featuring advanced regex      validation and multi-currency support.

## Live Demo:

https://mich-o.github.io/studentFinanceTracker/

## Wireframes

I used figma to make a low fidelity wireframe and published it on their site
You can access it at https://save-duck-53582665.figma.site/

## Demo Video
A live testing of the website using loom
url: https://www.loom.com/share/b9c6276240464ca68003cc5210e33835?sid=d247de80-eddf-45c0-aaf0-1b7b47eb9cba




# Features

Expense Tracking: Add, edit, and delete transactions with categories

Budget Management: Set monthly limits with visual alerts

Multi-Currency: Support for KES, RWF, and USD with manual exchange rates

Advanced Search: Regex-powered search with pattern highlighting

Data Persistence: Local storage with JSON import/export

Mobile-First: Responsive design with sidebar navigation

Accessibility: Full keyboard navigation and screen reader support


## Quick Start

1. Visit the live demo

2. Add your first transaction using the form

3. Set your monthly budget in Settings

4. Monitor your spending in the Dashboard

   
## Project Structure


    studentFinanceTracker/
    ├── index.html
    ├── style.css
    ├── scripts/
    │   ├── main.js
    │   ├── storage.js
    │   ├── state.js
    │   ├── validator.js
    │   └── ui.js
    ├── assets/
    │   ├── images/
    │   ├── icons/
    │   
    └── README.md
    └── seed.json

## Usage

### Adding Transactions
Fill out the form with:

Description (text input)

Category (select from predefined options)

Amount (positive number)

Date (YYYY-MM-DD format)


## Budget Alerts
Green: Budget is healthy

Yellow: Less than 10% remaining

Red: Budget exceeded


## Currency Conversion
Set exchange rates in Settings:

1 KES = ? RWF

1 KES = ? USD

All amounts are stored in KES and converted for display.


## Search Features
Use regex patterns to search transactions:

/coffee|tea/i - Find coffee or tea expenses

/\.\d{2}$/ - Find transactions with cents

/\b(\w+)\s+\1\b/ - Find duplicate words in descriptions


## Technical Details
Validation Rules
Description: No leading/trailing spaces

Amount: Positive numbers with up to 2 decimal places

Date: Valid YYYY-MM-DD format

Category: Letters, spaces, and hyphens only


## Browser Support

Works in modern browsers with:

ES6 module support

LocalStorage API

CSS Grid/Flexbox


## Development
To run locally:


# bash

### Using Python
    python -m http.server 3000

### Using Node.js
    npx http-server -p 3000
Then open http://localhost:3000 in your browser.


## Data Model

Transactions are stored in JSON files as:
    
    {
     "transactions": [
       {
        id: "txn_timestamp",
        description: "Transaction description",
        amount: -12.50, // Negative for expenses to ensure the budget function works properly
        category: "Food",
        date: "2025-01-15",
        createdAt: "ISO timestamp",
        updatedAt: "ISO timestamp"
        }
      ]
     "settings": {
       "baseCurrency": "KES",
       "monthlyBudgetLimit": 20000,
       "customCategories": [],
       "exchangeRates": {
         "KES": 1,
         "RWF": 12.5,
         "USD": 0.0078
        }
       },
    "exportDate": "2025-01-15T10:00:00.000Z"
    }

If you want to import custom data, make sure your sample seed.json files should also follow the same format
A sample seed.json file is available in the repository base folder.

## License

Educational project - feel free to use as reference.

## Contact

Michael Odhiambo

m.odhiambo@alustudent.com

https://github.com/Mich-O
