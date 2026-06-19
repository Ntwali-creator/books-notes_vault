let books = [];
console.log("Book Vault Started");

function save() {
    localStorage.setItem('books', JSON.stringify(books));
    console.log("saved", books.length, "books");
}
function load() {
    let saved = localStorage.getItem('books');
    if (saved) {
        books = JSON.parse(saved);
        console.log("loaded", books.length, "books from  the storage");
    } else {
        books = [
            {id:"1", title:"The Great Gatsby", author:"Fitzgerald", pages:180, tag:"Fiction", date:"2025-06-01"},
            {id:"2", title:"Atomic Habits", author:"James Clear", pages:320, tag:"Self-Help", date:"2025-06-03"},
            {id:"3", title:"Harry Potter", author:"J.K. Rowling", pages:309, tag:"Fiction", date:"2025-05-28"}
        ];
        save();
        console.log("data loaded");
    }
    showTable();
    updateStats();
}
function showTable() {
    let html = "";
    for (let i = 0; i < books.length; i++) {
        let b = books[i];
        html += "<tr>";
        html += "<td>" + b.title + "</td>";
        html += "<td>" + b.author + "</td>";
        html += "<td>" + b.pages + "</td>";
        html += "<td>" + b.tag + "</td>";
        html += "<td>" + b.date + "</td>";
        html += "<td><button onclick='edit(\"" + b.id + "\")'>Edit</button> ";
        html += "<button onclick='del(\"" + b.id + "\")' style='background:#dc3545'>Del</button></td>";
        html += "</tr>";
    }
    if (books.length === 0) {
        html = "<tr><td colspan='6'>No books found</td><tr>";
    }
    document.getElementById("bookTableBody").innerHTML = html;
    console.log("the table updated with", books.length, "books");
}
function updateStats() {
    let total = books.length;
    let totalPages = 0;
    for (let i = 0; i < books.length; i++) {
        totalPages += books[i].pages;
    }
    let avg = total > 0 ? Math.round(totalPages / total) : 0;
    
    document.getElementById("totalBooks").innerHTML = total;
    document.getElementById("totalPages").innerHTML = totalPages;
    document.getElementById("avgPages").innerHTML = avg;
    
    let recentHtml = "";
    let start = books.length - 3;
    if (start < 0) start = 0;
    for (let i = books.length - 1; i >= start; i--) {
        recentHtml += "<div class='stat-card'> " + books[i].title + " by " + books[i].author + " (" + books[i].pages + " pages)</div>";
    }
    document.getElementById("recentBooks").innerHTML = recentHtml;
    
    let goal = localStorage.getItem("readingGoal") || 1000;
    let percent = (totalPages / goal) * 100;
    if (percent > 100) percent = 100;
    document.getElementById("progressFill").style.width = percent + "%";
    document.getElementById("progressFill").innerHTML = Math.round(percent) + "%";
    
    let msg = document.getElementById("goalMessage");
    if (totalPages >= goal) {
        msg.innerHTML = "Goal achieved!";
    } else {
        msg.innerHTML = (goal - totalPages) + " pages left";
    }
    console.log("the stats updated - total pages:", totalPages);
}
function addBook() {
    let title = document.getElementById("title").value;
    let author = document.getElementById("author").value;
    let pages = document.getElementById("pages").value;
    let tag = document.getElementById("tag").value;
    let date = document.getElementById("date").value;
    
    let newBook = {
        id: Date.now() + "",
        title: title,
        author: author,
        pages: parseInt(pages),
        tag: tag,
        date: date
    };
    books.push(newBook);
    save();
    showTable();
    updateStats();
    showPage("books");
    document.getElementById("bookForm").reset();
    console.log("added book:", title);
}
function del(id) {
    if (confirm("Delete this book?")) {
        let newBooks = [];
        for (let i = 0; i < books.length; i++) {
            if (books[i].id !== id) {
                newBooks.push(books[i]);
            }
        }
        books = newBooks;
        save();
        showTable();
        updateStats();
        console.log("deleted book id:", id);
    }
}
function edit(id) {
    let book = null;
    for (let i = 0; i < books.length; i++) {
        if (books[i].id === id) {
            book = books[i];
            break;
        }
    }
    if (book) {
        document.getElementById("bookid").value = book.id;
        document.getElementById("title").value = book.title;
        document.getElementById("author").value = book.author;
        document.getElementById("pages").value = book.pages;
        document.getElementById("tag").value = book.tag;
        document.getElementById("date").value = book.date;
        document.getElementById("formTitle").innerHTML = "Edit Book";
        showPage("add");
        console.log("editing books:", book.title);
    }
}
function updateBook() {
    let id = document.getElementById("bookid").value;
    let title = document.getElementById("title").value;
    let author = document.getElementById("author").value;
    let pages = document.getElementById("pages").value;
    let tag = document.getElementById("tag").value;
    let date = document.getElementById("date").value;
    
    for (let i = 0; i < books.length; i++) {
        if (books[i].id === id) {
            books[i].title = title;
            books[i].author = author;
            books[i].pages = parseInt(pages);
            books[i].tag = tag;
            books[i].date = date;
            break;
        }
    }
    save();
    showTable();
    updateStats();
    showPage("books");
    document.getElementById("bookForm").reset();
    document.getElementById("bookid").value = "";
    document.getElementById("formTitle").innerHTML = "Add New Book";
    console.log("updated book:", title);
}
function cancelEdit() {
    document.getElementById("bookForm").reset();
    document.getElementById("bookid").value = "";
    document.getElementById("formTitle").innerHTML = "Add New Book";
    showPage("books");
    console.log("edit canceled");
}
function handleSubmit(e) {
    e.preventDefault();
    let id = document.getElementById("bookid").value;
    if (id === "") {
        addBook();
    } else {
        updateBook();
    }
}
function setupSearch() {
    let input = document.getElementById("searchInput");
    input.addEventListener("input", function() {
        let pattern = input.value;
        if (pattern === "") {
            showTable();
            return;
        }
        try {
            let cleanPattern = pattern.replace(/\//g, "");
            let regex = new RegExp(cleanPattern, "i");
            let filtered = [];
            for (let i = 0; i < books.length; i++) {
                let text = books[i].title + " " + books[i].author;
                if (regex.test(text)) {
                    filtered.push(books[i]);
                }
            }
            let html = "";
            for (let i = 0; i < filtered.length; i++) {
                let b = filtered[i];
                html += "<tr>";
                html += "<td>" + b.title + "</td>";
                html += "<td>" + b.author + "</td>";
                html += "<td>" + b.pages + "</td>";
                html += "<td>" + b.tag + "</td>";
                html += "<td>" + b.date + "</td>";
                html += "<td><button onclick='edit(\"" + b.id + "\")'>Edit</button> ";
                html += "<button onclick='del(\"" + b.id + "\")' style='background:#dc3545'>Del</button></td>";
                html += "</tr>";
            }
            if (filtered.length === 0) {
                html = "<tr><td colspan='6'>No matches</td><tr>";
            }
            document.getElementById("bookTableBody").innerHTML = html;
            input.style.borderColor = "green";
            console.log("search found", filtered.length, "books");
        } catch(e) {
            input.style.borderColor = "red";
            console.log("invalid regex:", pattern);
        }
    });
}
function setupSort() {
    let select = document.getElementById("sortSelect");
    select.addEventListener("change", function() {
        let type = select.value;
        if (type === "date") {
            books.sort(function(a, b) {
                return new Date(b.date) - new Date(a.date);
            });
        } else if (type === "pages") {
            books.sort(function(a, b) {
                return b.pages - a.pages;
            });
        } else if (type === "title") {
            books.sort(function(a, b) {
                if (a.title < b.title) return -1;
                if (a.title > b.title) return 1;
                return 0;
            });
        }
        showTable();
        console.log("sorted by:", type);
    });
}
function setGoal() {
    let goal = parseInt(document.getElementById("goalInput").value);
    if (goal > 0) {
        localStorage.setItem("readingGoal", goal);
        updateStats();
        console.log("Goal set to", goal);
    }
}
function convertToHours() {
    let pages = document.getElementById("pagesConvert").value;
    if (pages) {
        let hours = pages / 50;
        document.getElementById("hoursResult").innerHTML = hours.toFixed(1) + " hours";
        console.log("converted", pages, "pages to", hours.toFixed(1), "hours");
    }
}
function convertToPages() {
    let hours = document.getElementById("hoursConvert").value;
    if (hours) {
        let pages = hours * 50;
        document.getElementById("pagesResult").innerHTML = pages + " pages";
        console.log("Cconverted", hours, "hours to", pages, "pages");
    }
}
function toggleDarkMode() {
    document.body.classList.toggle("dark");
    console.log("dark mode pressed");
}
function exportData() {
    let data = JSON.stringify(books, null, 2);
    let blob = new Blob([data], {type: "application/json"});
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "books.json";
    a.click();
    URL.revokeObjectURL(url);
    console.log("exported", books.length, "books");
}
function setupImport() {
    let fileInput = document.getElementById("importFile");
    fileInput.addEventListener("change", function(e) {
        let file = e.target.files[0];
        if (file) {
            let reader = new FileReader();
            reader.onload = function(event) {
                try {
                    let imported = JSON.parse(event.target.result);
                    if (Array.isArray(imported)) {
                        books = imported;
                        save();
                        showTable();
                        updateStats();
                        alert("Imported " + imported.length + " books!");
                        console.log("imported", imported.length, "books");
                    } else {
                        alert("Invalid file format");
                    }
                } catch(err) {
                    alert("Error reading file");
                    console.log("import error:", err);
                }
            };
            reader.readAsText(file);
        }
    });
}
function clearAllData() {
    if (confirm("delet all the books ?")) {
        books = [];
        save();
        showTable();
        updateStats();
        console.log("all the data cleared");
    }
}
function loadSampleData() {
    books = [];
    load();
    showPage("books");
    console.log("data loaded");
}
function showPage(pageName) {
    let pages = document.querySelectorAll(".page");
    for (let i = 0; i < pages.length; i++) {
        pages[i].classList.remove("active");
    }
    document.getElementById(pageName).classList.add("active");
    console.log("showing the page:", pageName);
}
function setupNav() {
    let buttons = document.querySelectorAll(".nav-btn");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].onclick = function() {
            showPage(this.getAttribute("data-page"));
        };
    }
}
function init() {
    console.log("Initializing the book vault....");
    load();
    setupNav();
    setupSearch();
    setupSort();
    setupImport();
    document.getElementById("bookForm").onsubmit = handleSubmit;
    showPage("dashboard");
    console.log("now book vault is ready!");
}
init();