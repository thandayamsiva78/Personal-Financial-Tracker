import { myPieChart, updatePieChart } from "./chart.js";

document.addEventListener("DOMContentLoaded", () => {

    const reset = document.getElementById("reset");
    reset.addEventListener("click" , function(){
        localStorage.removeItem("transactions");
        localStorage.removeItem("monthlyBudget");

        incomeCount = 0
        expensesCount = 0
        monthlyBudget = 0

        document.getElementById("incomeDisplay").innerText = `₹0.00`;
        document.getElementById("expensesDisplay").innerText = `₹0.00`;
        document.getElementById("monthlyBudgetDisplay").innerText = `₹0.00`;
        document.getElementById("balanceDisplay").innerText = `₹0.00`;
        document.getElementById("savingsDisplay").innerText = `₹0.00`;

        document.getElementById("entertainmentInPercentage").innerText = '0%';
        document.getElementById("rentInPercentage").innerText = '0%';
        document.getElementById("shoppingInPercentage").innerText = '0%';
        document.getElementById("foodAndHealthInPercentage").innerText = '0%';
        document.getElementById("othersinPercentage").innerText = '0%';

        updatePieChart([0, 0, 0, 0, 0]);
        document.getElementById("container").innerHTML = "";
        reset.style.display = "none";
        const indicator = document.getElementById("indicator");
        indicator.style.display = "none";
        

    });

    const toggleTheme = document.getElementById("toggleTheme");
    toggleTheme.addEventListener("click" , function(){
        document.body.classList.toggle("darkTheme");
        const incomeDark = document.getElementById("income");
        const expensesDark = document.getElementById("expences");
        const budgetDark = document.getElementById("budget");
        incomeDark.style.color = "black";
        expensesDark.style.color = "black";
        budgetDark.style.color = "black";
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.style.backgroundColor = "rgba(0, 0, 0, 0.10)";
            input.style.border = "1px solid gray";
        });
        const selects = document.querySelectorAll("select");
        selects.forEach(select =>{
            select.style.backgroundColor = "rgba(0, 0, 0, 0.10)";
            select.style.border = "1px solid gray";
        })
  
    })
  
    const login = document.getElementById("login");
    login.addEventListener("click", function() {
        location.href = "./src/login.html";
    });
  
  
    const getUserName = localStorage.getItem("User Name");
    const getUserEmail = localStorage.getItem("User Email");
  
    if (getUserName && getUserEmail) {
        const uName1 = document.getElementById("userName1");
        const uName2 = document.getElementById("userName2");
        const uEmail = document.getElementById("userEmail");
        uName1.innerText = getUserName;
        uName2.innerText = getUserName;
        uEmail.innerText = getUserEmail;
    }
  
  
    const greeting = document.getElementById("greeting");
    const today = new Date();
    const hours = today.getHours();
  
    if (hours < 12) {
        greeting.innerText = "Good Morning!";
    } else if (hours < 18) {
        greeting.innerText = "Good Afternoon!";
    } else {
        greeting.innerText = "Good Evening!";
    }
  
  
    let incomeCount = 0;
    let expensesCount = 0;
    let monthlyBudget = 0;
  
  
    const setMonthlyBudget = document.getElementById("setMonthly-budget");
    const monthlyBudgetDisplay = document.getElementById("monthlyBudgetDisplay");
    
    setMonthlyBudget.addEventListener("click", function() {
        const monthlyBudgetValue = parseFloat(document.getElementById("monthly-budget-input").value);
        const indicator = document.getElementById("indicator");
        if (!isNaN(monthlyBudgetValue) && monthlyBudgetValue > 0) {
            monthlyBudget = monthlyBudgetValue;
            localStorage.setItem("monthlyBudget", monthlyBudget); 
            let Mdisplay = monthlyBudgetDisplay.innerText = `₹${monthlyBudget.toFixed(2)}`;
            alert(`Your Budget ${Mdisplay} Added Successfully!`)
            indicator.style.display = "block";
            updateBalanceDisplay()
            indicatorUpdate(expensesCount , monthlyBudget)
        } else {
            alert("Please enter a valid positive number for the budget.");
        }
    });
    
  
  
    function updateBalanceDisplay() {
        const balanceDisplay = document.getElementById("balanceDisplay");
        const savingsDisplay = document.getElementById("savingsDisplay");
        const CurrentBalence = ( monthlyBudget + incomeCount) - expensesCount;
        balanceDisplay.innerText = `₹${CurrentBalence.toFixed(2)}`;
        savingsDisplay.innerText = `₹${CurrentBalence.toFixed(2)}`;
        const expensesDisplay = parseFloat(document.getElementById("expensesDisplay").innerText.replace("₹" , ''));
        const monthlyBudgetDisplay = parseFloat(document.getElementById("monthlyBudgetDisplay").innerText.replace("₹", ''));
        // console.log(monthlyBudgetDisplay);
        // console.log(expensesDisplay);
        const indicator = document.getElementById("indicator");
        const reset = document.getElementById("reset");
        if (expensesDisplay > monthlyBudgetDisplay){
            reset.style.display = "block"
            indicator.style.display = "block";
            indicator.innerText = "Over Budget";
            indicator.style.color = "red";
            indicator.style.fontWeight = "bold";
        }else{
            reset.style.display = "none"
            indicator.innerText = "On Budget";
            indicator.style.color = "green";
            indicator.style.fontWeight = "bold";
        }
    }
  
  
    const description1 = document.getElementById("description1");
    const description2 = document.getElementById("description2");
  
    description1.addEventListener("change", function() {
        if (description1.value === "Others") {
            description2.style.display = "block";
            description2.setAttribute("required", true);
        } else {
            description2.style.display = "none";
            description2.removeAttribute("required");
        }
    });
  
  
    const addTransaction = document.getElementById("addTransaction");
    addTransaction.addEventListener("submit", function(e) {
        e.preventDefault();
  
        let description = description1.value;
        if (description1.value === "Others") {
            description = description2.value;
        }
  
        const amount = parseFloat(document.getElementById("amount").value);
        const date = document.getElementById("date").value;
        const category = document.getElementById("category").value;
  
        if (isNaN(amount) || amount <= 0) {
            alert("Amount must be a positive number.");
            return;
        }
  
        const TRANSACTION = {
            description: description,
            amount: amount,
            date: date,
            category: category
        };
        
        saveToLocalStorage(TRANSACTION);
        handleTransaction(TRANSACTION);
        updateBalanceDisplay();
        calculateExpensePercentages(description, amount, category);
        // updatePieChart(percentages)
  
        const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
        allTransactionsBill(transactions);
        
        addTransaction.reset(); 
        description2.style.display = "none";
        description2.removeAttribute("required");
    });
  
  
    function saveToLocalStorage(transaction) {
        let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
        transactions.push(transaction);
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }
  
  
    function loadTransactions() {
        incomeCount = 0;
        expensesCount = 0;
  
        const storedMonthlyBudget = parseFloat(localStorage.getItem("monthlyBudget")) || 0;
        monthlyBudget = storedMonthlyBudget;
        monthlyBudgetDisplay.innerText = `₹${storedMonthlyBudget.toFixed(2)}`;
  
  
        let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
        transactions.forEach(transaction => {
            handleTransaction(transaction);
            calculateExpensePercentages(transaction.description, transaction.amount, transaction.category);
            // console.log(transactions);
        });
        updateBalanceDisplay();
        allTransactionsBill(transactions)
        
        
        
    }
  
    function handleTransaction(transaction) {
        const { description, amount, category , date } = transaction;
  
        if (category === "Income") {
            incomeCount += amount;
        } else if (category === "Expenses") {
            expensesCount += amount;
        }
  
        // Updating display for income, expenses, and balance
        const incomeDisplay = document.getElementById("incomeDisplay");
        const expensesDisplay = document.getElementById("expensesDisplay");
  
        incomeDisplay.innerText = `₹${incomeCount.toFixed(2)}`;
        expensesDisplay.innerText = `₹${expensesCount.toFixed(2)}`;
        
    }
  
  
    
  
    let Entertainment = 0;
    let Rent = 0;
    let Shopping = 0;
    let FoodandHealth = 0;
    let Others = 0;
    function calculateExpensePercentages(description, amount, category) {
        const entertainmentInPercentage = document.getElementById("entertainmentInPercentage");
        const rentInPercentage = document.getElementById("rentInPercentage");
        const shoppingInPercentage = document.getElementById("shoppingInPercentage");
        const foodAndHealthInPercentage = document.getElementById("foodAndHealthInPercentage");
        const othersinPercentage = document.getElementById("othersinPercentage");
  
        if (!isNaN(amount) && amount > 0 && category === "Expenses") {
            switch (description) {
                case "Entertainment":
                    Entertainment += amount;
                    break;
                case "Rent":
                    Rent += amount;
                    break;
                case "Shopping":
                    Shopping += amount;
                    break;
                case "Food & Health":
                    FoodandHealth += amount;
                    break;
                case "Others":
                default:
                    Others += amount;
                    break;
            }
        }
  
        if (monthlyBudget > 0) {
            const entertainmentPercent = ((Entertainment / monthlyBudget) * 100).toFixed(0);
            const rentPercent = ((Rent / monthlyBudget) * 100).toFixed(0);
            const shoppingPercent = ((Shopping / monthlyBudget) * 100).toFixed(0);
            const foodAndHealthPercent = ((FoodandHealth / monthlyBudget) * 100).toFixed(0);
            const othersPercent = ((Others / monthlyBudget) * 100).toFixed(0);
  
            entertainmentInPercentage.innerText = entertainmentPercent + '%';
            rentInPercentage.innerText = rentPercent + '%';
            shoppingInPercentage.innerText = shoppingPercent + '%';
            foodAndHealthInPercentage.innerText = foodAndHealthPercent + '%';
            othersinPercentage.innerText = othersPercent + '%';
  
            updatePieChart([entertainmentPercent, rentPercent, shoppingPercent, foodAndHealthPercent, othersPercent]);
  
        } else {
            alert("Please set a valid monthly budget first.");
        }
    }
    
  
    function updatePieChart(percentages) {
        myPieChart.data.datasets[0].data = percentages;
        myPieChart.update();
    }
  
  
  
    function allTransactionsBill(transactions) {
        const container = document.getElementById("container");
        container.innerHTML = "";
    
        const table = document.createElement("table");
        table.className = "transactionsTable";
        
        const thead = document.createElement("thead");
        const headingRow = document.createElement("tr");
    
        const headings = ["SL No", "Description", "Amount", "Category", "Date"];
        headings.forEach(headingText => {
            const th = document.createElement("th");
            th.innerText = headingText;
            headingRow.appendChild(th);
        });
    
        thead.appendChild(headingRow);
        table.appendChild(thead);
    
        const tbody = document.createElement("tbody");
        transactions.forEach((trans, index) => {
            const row = document.createElement("tr");
    
            const slNo = document.createElement("td");
            const description = document.createElement("td");
            const amount = document.createElement("td");
            const category = document.createElement("td");
            const date = document.createElement("td");
    
            slNo.innerText = index + 1;
            description.innerText = trans.description;
            amount.innerText = trans.amount;
            category.innerText = trans.category;
            date.innerText = trans.date;
    
            row.appendChild(slNo);
            row.appendChild(description);
            row.appendChild(amount);
            row.appendChild(category);
            row.appendChild(date);
    
            tbody.appendChild(row);
        });
    
        table.appendChild(tbody);
        container.appendChild(table);
    }
    loadTransactions();
  });
  