console.log("Expense Tracker App Loaded!");

const budgetInput = document.getElementById("budget-input");
const setBudgetBtn = document.getElementById("set-budget-btn");
const totalBudgetElem = document.getElementById("total-budget");
const totalExpensesElem = document.getElementById("total-expenses");
const remainingBudgetElem = document.getElementById("remaining-budget");

const expenseNameInput = document.getElementById("expense-name");
const expenseAmountInput = document.getElementById("expense-amount");
const expenseCategoryInput = document.getElementById("expense-category");
const addExpenseBtn = document.getElementById("add-expense-btn");

const incomeInput = document.getElementById("income-input");
const calculateTaxBtn = document.getElementById("calculate-tax-btn");
const taxAmountElem = document.getElementById("tax-amount");

const expenseList = document.getElementById("expense-list");
const pieChartCanvas = document.getElementById("pie-chart");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let pieChart;

// Set Budget
setBudgetBtn.addEventListener("click", () => {
    const budget = parseFloat(budgetInput.value);
    if (!isNaN(budget) && budget > 0) {
        localStorage.setItem("budget", budget);
        totalBudgetElem.textContent = `₹${budget}`;
        remainingBudgetElem.textContent = `₹${budget}`;
        alert("Budget Set Successfully!");
        budgetInput.value = "";
    } else {
        alert("Please enter a valid budget!");
    }
});

// Add Expense
addExpenseBtn.addEventListener("click", () => {
    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value);
    const category = expenseCategoryInput.value;
    const date = new Date().toLocaleDateString();

    if (!name || isNaN(amount) || amount <= 0) {
        alert("Please enter valid expense details!");
        return;
    }

    const expense = { name, amount, category, date };
    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    updateExpenseList();
    updateBudget();
    updatePieChart();
    expenseNameInput.value = "";
    expenseAmountInput.value = "";
    expenseCategoryInput.value = "Food";
});

// Calculate Tax
calculateTaxBtn.addEventListener("click", () => {
    const income = parseFloat(incomeInput.value);
    if (isNaN(income) || income <= 0) {
        alert("Please enter a valid income!");
        return;
    }

    let tax = 0;
    if (income <= 1000) {
        tax = 0;
    } else if (income <= 5000) {
        tax = (income - 1000) * 0.05;
    } else if (income <= 10000) {
        tax = (1000 * 0.05) + ((income - 5000) * 0.2);
    } else {
        tax = (1000 * 0.05) + (5000 * 0.2) + ((income - 10000) * 0.3);
    }

    taxAmountElem.textContent = `₹${tax.toFixed(2)}`;
    const expense = { name: "Income Tax", amount: tax, category: "Tax", date: new Date().toLocaleDateString() };
    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    updateExpenseList();
    updateBudget();
    updatePieChart();
});

// Update Expense List
function updateExpenseList() {
    expenseList.innerHTML = "";
    expenses.forEach((expense, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${expense.name}</td>
            <td>₹${expense.amount}</td>
            <td>${expense.category}</td>
            <td>${expense.date}</td>
            <td><button class="delete-btn" data-index="${index}">Delete</button></td>
        `;
        expenseList.appendChild(row);
    });

    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            const index = e.target.getAttribute("data-index");
            expenses.splice(index, 1);
            localStorage.setItem("expenses", JSON.stringify(expenses));
            updateExpenseList();
            updateBudget();
            updatePieChart();
        });
    });

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    totalExpensesElem.textContent = `₹${totalExpenses}`;
}

// Update Budget
function updateBudget() {
    const totalBudget = parseFloat(localStorage.getItem("budget")) || 0;
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remainingBudget = totalBudget - totalExpenses;

    remainingBudgetElem.textContent = `₹${remainingBudget}`;
}

// Initialize Pie Chart
function initPieChart() {
    const ctx = pieChartCanvas.getContext("2d");
    pieChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "bottom",
                }
            }
        }
    });
}

// Update Pie Chart
function updatePieChart() {
    const categoryTotals = {};
    expenses.forEach(expense => {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    pieChart.data.labels = Object.keys(categoryTotals);
    pieChart.data.datasets[0].data = Object.values(categoryTotals);
    pieChart.update();
}

// Initialize App
function init() {
    updateExpenseList();
    updateBudget();
    initPieChart();
    updatePieChart();
}

init();
