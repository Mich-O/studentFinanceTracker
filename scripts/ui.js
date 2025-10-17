import { validators } from './validator.js';

// All UI interactions and rendering
export class UI {
    constructor(appState) {
        this.state = appState;
    }

    // Form handling
    setupFormHandlers() {
        const form = document.getElementById('transactionForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        const cancelEditBtn = document.getElementById('cancelEdit');
        if (cancelEditBtn) {
            cancelEditBtn.addEventListener('click', () => {
                this.resetFormToAddMode();
            });
        }

        const saveSettingsBtn = document.getElementById('saveSettings');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => {
                this.handleSettingsSave();
            });
        }

        // Add category button handler
        const addCategoryBtn = document.getElementById('addCategory');
        if (addCategoryBtn) {
            addCategoryBtn.addEventListener('click', () => {
                this.handleAddCategory();
            });
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const description = document.getElementById('description').value.trim();
        const category = document.getElementById('category').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const date = document.getElementById('date').value;

        if (!this.validateForm(description, category, amount, date)) return;

        const transactionData = { 
            description, 
            category,
            amount: -Math.abs(amount),
            date 
        };

        if (this.state.editingId) {
            this.state.updateTransaction(this.state.editingId, transactionData);
            this.showMessage('Transaction updated successfully');
        } else {
            this.state.addTransaction(transactionData);
            this.showMessage('Transaction added successfully');
        }

        this.resetFormToAddMode();
        this.renderTable();
        this.updateDashboard();
    }

    validateForm(description, category, amount, date) {
        this.clearErrorMessages();

        let isValid = true;

        if (!validators.validateDescription(description)) {
            this.showError('descriptionError', 'Description cannot have leading/trailing spaces or double spaces');
            isValid = false;
        }

        const duplicates = validators.findDuplicateWords(description);
        if (duplicates) {
            this.showError('descriptionError', `Found duplicate words: ${duplicates.join(', ')}`);
            isValid = false;
        }

        if (!validators.validateCategory(category)) {
            this.showError('categoryError', 'Category can only contain letters, spaces, and hyphens');
            isValid = false;
        }

        if (!validators.validateAmount(amount)) {
            this.showError('amountError', 'Amount must be a positive number with up to 2 decimal places');
            isValid = false;
        }

        if (!validators.validateDate(date)) {
            this.showError('dateError', 'Please enter a valid date in YYYY-MM-DD format');
            isValid = false;
        }

        return isValid;
    }

    // Table rendering
    renderTable(transactions = this.state.transactions) {
        const tbody = document.getElementById('transactionsTableBody');
        if (!tbody) return;

        let displayTransactions = [...transactions];
        
        if (this.state.currentSearch) {
            displayTransactions = this.state.searchTransactions(this.state.currentSearch);
        }
        
        displayTransactions = this.state.sortTransactions(displayTransactions, this.state.currentSort);

        if (displayTransactions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No transactions yet. Add your first transaction above!</td></tr>';
            return;
        }

        tbody.innerHTML = displayTransactions.map(transaction => {
            const description = this.state.currentSearch ? 
                this.highlightMatches(transaction.description, this.state.currentSearch) : 
                transaction.description;
            
            const category = this.state.currentSearch ? 
                this.highlightMatches(transaction.category, this.state.currentSearch) : 
                transaction.category;

            return `
                <tr>
                    <td>${new Date(transaction.date).toLocaleDateString()}</td>
                    <td>${description}</td>
                    <td>${category}</td>
                    <td>${this.state.formatCurrency(transaction.amount)}</td>
                    <td>
                        <button class="edit" data-id="${transaction.id}">Edit</button>
                        <button class="delete" data-id="${transaction.id}">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    highlightMatches(text, regex) {
        if (!regex) return text;
        const cleanRegex = validators.safeRegexCompile(regex);
        if (!cleanRegex) return text;
        return text.toString().replace(cleanRegex, match => 
            `<mark class="search-highlight">${match}</mark>`
        );
    }

    // Dashboard updates
    updateDashboard() {
        const stats = this.state.calculateBudgetStats();
        
        document.getElementById('totalBalance').textContent = 
            this.state.formatCurrency(stats.totalExpenses);
        document.getElementById('monthlyBudget').textContent = 
            this.state.formatCurrency(stats.monthlyBudget);
        document.getElementById('remainingBudget').textContent = 
            this.state.formatCurrency(stats.remaining);
        document.getElementById('totalTransactions').textContent = stats.totalTransactions;
        document.getElementById('topCategory').textContent = stats.topCategory;
        
        this.updateBudgetAlerts(stats.remaining);
    }

    updateBudgetAlerts(remaining) {
        const alertElement = document.getElementById('budgetAlert');
        const budgetLimit = this.state.settings.monthlyBudgetLimit;
        
        if (remaining < 0) {
            alertElement.textContent = `Budget exceeded by ${this.state.formatCurrency(Math.abs(remaining))}`;
            alertElement.className = 'budget-alert exceeded';
        } else if (remaining < (budgetLimit * 0.1)) {
            alertElement.textContent = `Low budget: ${this.state.formatCurrency(remaining)} remaining (${((remaining/budgetLimit)*100).toFixed(1)}%)`;
            alertElement.className = 'budget-alert warning';
        } else {
            alertElement.textContent = `Budget status: ${this.state.formatCurrency(remaining)} remaining (${((remaining/budgetLimit)*100).toFixed(1)}%)`;
            alertElement.className = 'budget-alert normal';
        }
    }

    // Form mode management
    setFormToEditMode(transaction) {
        document.getElementById('description').value = transaction.description;
        document.getElementById('category').value = transaction.category;
        document.getElementById('amount').value = Math.abs(transaction.amount);
        document.getElementById('date').value = transaction.date;
        
        document.querySelector('#edit h2').textContent = 'Edit Transaction';
        document.querySelector('#transactionForm button[type="submit"]').textContent = 'Update Transaction';
        document.getElementById('cancelEdit').style.display = 'inline-block';
    }

    resetFormToAddMode() {
        document.getElementById('transactionForm').reset();
        document.querySelector('#edit h2').textContent = 'Add Transaction';
        document.querySelector('#transactionForm button[type="submit"]').textContent = 'Add Transaction';
        document.getElementById('cancelEdit').style.display = 'none';
        this.clearErrorMessages();
        this.state.editingId = null;
    }

    // Settings handling
    handleSettingsSave() {
        const kesToRwf = parseFloat(document.getElementById('kesToRwf').value);
        const kesToUsd = parseFloat(document.getElementById('kesToUsd').value);
        
        if (!validators.validateExchangeRate(kesToRwf) || !validators.validateExchangeRate(kesToUsd)) {
            this.showMessage('Please enter valid exchange rates', 'error');
            return;
        }

        const newSettings = {
            baseCurrency: document.getElementById('baseCurrency').value,
            monthlyBudgetLimit: parseFloat(document.getElementById('monthlyBudgetLimit').value) || 0,
            exchangeRates: {
                RWF: kesToRwf,
                USD: kesToUsd
            }
        };

        this.state.updateSettings(newSettings);
        this.updateDashboard();
        this.renderTable();
        this.showMessage('Settings saved successfully!');
    }

    updateSettingsUI() {
        document.getElementById('baseCurrency').value = this.state.settings.baseCurrency;
        document.getElementById('monthlyBudgetLimit').value = this.state.settings.monthlyBudgetLimit;
        document.getElementById('kesToRwf').value = this.state.settings.exchangeRates.RWF;
        document.getElementById('kesToUsd').value = this.state.settings.exchangeRates.USD;
        
        // Update custom categories display
        this.updateCustomCategoriesDisplay();
    }

    // Custom categories management
    handleAddCategory() {
        const newCategoryInput = document.getElementById('newCategory');
        const categoryName = newCategoryInput.value.trim();
        
        if (!categoryName) {
            this.showMessage('Please enter a category name', 'error');
            return;
        }
        
        if (!validators.validateCategory(categoryName)) {
            this.showMessage('Category can only contain letters, spaces, and hyphens', 'error');
            return;
        }
        
        // Check for duplicates in default and custom categories
        const defaultCategories = ['Food', 'Books', 'Transport', 'Entertainment', 'Fees', 'Other'];
        const allCategories = [...defaultCategories, ...this.state.settings.customCategories];
        
        if (allCategories.includes(categoryName)) {
            this.showMessage('Category already exists', 'error');
            return;
        }
        
        // Add to custom categories
        this.state.settings.customCategories.push(categoryName);
        this.state.save();
        
        // Update category dropdown and display
        this.updateCategoryDropdown();
        this.updateCustomCategoriesDisplay();
        
        newCategoryInput.value = '';
        this.showMessage(`Category '${categoryName}' added successfully`);
    }

    updateCategoryDropdown() {
        const categorySelect = document.getElementById('category');
        const defaultCategories = ['Food', 'Books', 'Transport', 'Entertainment', 'Fees', 'Other'];
        const allCategories = [...defaultCategories, ...this.state.settings.customCategories];
        
        // Save current value
        const currentValue = categorySelect.value;
        
        // Rebuild dropdown
        categorySelect.innerHTML = '<option value="">Select category</option>' +
            allCategories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
        
        // Restore current value if it still exists
        if (allCategories.includes(currentValue)) {
            categorySelect.value = currentValue;
        }
    }

    updateCustomCategoriesDisplay() {
        const customCategoriesContainer = document.getElementById('customCategories');
        if (!customCategoriesContainer) return;
        
        if (this.state.settings.customCategories.length === 0) {
            customCategoriesContainer.innerHTML = '<p>No custom categories added yet.</p>';
        } else {
            customCategoriesContainer.innerHTML = 
                this.state.settings.customCategories.map(cat => 
                    `<div class="category-tag">${cat}</div>`
                ).join('');
        }
    }

    // Event handlers
    setupTableHandlers() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit')) {
                this.handleEdit(e.target.dataset.id);
            }
            if (e.target.classList.contains('delete')) {
                this.handleDelete(e.target.dataset.id);
            }
        });
    }

    handleEdit(id) {
        const transaction = this.state.transactions.find(t => t.id === id);
        if (transaction) {
            this.state.editingId = id;
            this.setFormToEditMode(transaction);
            document.getElementById('edit').scrollIntoView({ behavior: 'smooth' });
        }
    }

    handleDelete(id) {
        const transaction = this.state.transactions.find(t => t.id === id);
        if (transaction && confirm(`Delete "${transaction.description}"?`)) {
            this.state.deleteTransaction(id);
            this.showMessage('Transaction deleted successfully');
            this.renderTable();
            this.updateDashboard();
        }
    }

    setupSearchSortHandlers() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.state.currentSearch = e.target.value;
                this.renderTable();
            });
        }

        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.value = this.state.currentSort;
            sortSelect.addEventListener('change', (e) => {
                this.state.currentSort = e.target.value;
                this.renderTable();
            });
        }
    }

    setupDataManagementHandlers() {
        document.getElementById('exportData').addEventListener('click', () => this.exportData());
        document.getElementById('importData').addEventListener('click', () => {
            document.getElementById('importFile').click();
        });
        document.getElementById('importFile').addEventListener('change', (e) => {
            if (e.target.files[0]) this.importData(e.target.files[0]);
        });

        // Reset data button handler
        const resetDataBtn = document.getElementById('resetData');
        if (resetDataBtn) {
            resetDataBtn.addEventListener('click', () => {
                this.handleResetData();
            });
        }
    }

    // Data import/export
    exportData() {
        const data = {
            transactions: this.state.transactions,
            settings: this.state.settings,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `finance-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (!data.transactions || !Array.isArray(data.transactions)) {
                    throw new Error('Invalid data format');
                }
                
                this.state.transactions = data.transactions;
                if (data.settings) {
                    this.state.settings = { ...this.state.settings, ...data.settings };
                }
                
                this.state.save();
                this.renderTable();
                this.updateDashboard();
                this.updateSettingsUI();
                this.showMessage('Data imported successfully!');
                
            } catch (error) {
                this.showMessage('Import error: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    }

    // Reset all data
    handleResetData() {
        if (confirm('Are you sure you want to reset all data? This will delete all transactions and reset settings to defaults. This action cannot be undone.')) {
            // Clear transactions
            this.state.transactions = [];
            
            // Reset settings to defaults
            this.state.settings = {
                baseCurrency: 'KES',
                monthlyBudgetLimit: 20000,
                customCategories: [],
                exchangeRates: {
                    KES: 1,
                    RWF: 12.5,
                    USD: 0.0078
                }
            };
            
            this.state.save();
            this.renderTable();
            this.updateDashboard();
            this.updateSettingsUI();
            this.showMessage('All data has been reset successfully');
        }
    }

    // Sidebar and navigation
    setupSidebar() {
        const menuButton = document.querySelector('.menu-button');
        const closeButton = document.querySelector('.sidebar li:first-child');
        const sidebarLinks = document.querySelectorAll('.sidebar li:not(:first-child) a');
        
        if (menuButton) {
            menuButton.addEventListener('click', () => {
                document.querySelector('.sidebar').style.display = 'flex';
            });
        }
        
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                document.querySelector('.sidebar').style.display = 'none';
            });
        }
        
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                document.querySelector('.sidebar').style.display = 'none';
            });
        });
    }

    // Utility methods
    showMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.textContent = message;
        messageEl.setAttribute('aria-live', 'polite');
        document.body.appendChild(messageEl);
        setTimeout(() => messageEl.remove(), 3000);
    }

    showError(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
        }
    }

    clearErrorMessages() {
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });
    }

    // Initialize UI
    init() {
        console.log('UI initialization started');
        this.setupSidebar();
        this.setupFormHandlers();
        this.setupTableHandlers();
        this.setupSearchSortHandlers();
        this.setupDataManagementHandlers();
        
        this.renderTable();
        this.updateDashboard();
        this.updateSettingsUI();
        
        // Set today's date as default
        document.getElementById('date').value = new Date().toISOString().split('T')[0];
        this.showMessage('Finance Tracker loaded successfully!');
        console.log('UI initialization completed');
    }
}