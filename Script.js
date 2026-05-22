/* =========================
   BASIC NAVIGATION
========================= */

const pages = document.querySelectorAll(".page");

function showPage(pageId){
    pages.forEach(p => p.classList.remove("active"));
    document.getElementById(pageId).classList.add("active");
    document.getElementById("sidebar").classList.remove("show");
}

function toggleSidebar(){
    document.getElementById("sidebar").classList.toggle("show");
}

/* =========================
   THEME
========================= */

document.getElementById("themeBtn").addEventListener("click",()=>{
    document.body.classList.toggle("light-mode");
});

function toggleTheme(){
    document.body.classList.toggle("light-mode");
}

/* =========================
   CLOCK
========================= */

function updateClock(){
    const now = new Date();
    document.getElementById("time").innerText = now.toLocaleTimeString();
    document.getElementById("date").innerText = now.toDateString();
}

setInterval(updateClock,1000);
updateClock();

/* =========================
   SEARCH
========================= */

document.getElementById("searchInput").addEventListener("keyup",()=>{
    const val = document.getElementById("searchInput").value.toLowerCase();

    const pagesList = [
        {k:"dashboard", p:"dashboardPage"},
        {k:"task", p:"taskPage"},
        {k:"calendar", p:"calendarPage"},
        {k:"notes", p:"notesPage"},
        {k:"calculator", p:"calculatorPage"},
        {k:"pdf", p:"pdfPage"},
        {k:"pomodoro", p:"pomodoroPage"},
        {k:"settings", p:"settingsPage"}
    ];

    pagesList.forEach(item=>{
        if(val === item.k){
            showPage(item.p);
        }
    });
});

/* =========================
   TASK SYSTEM
========================= */

function updateProgress(){
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    if(tasks.length === 0){
        document.getElementById("progress").innerText = "0%";
        return;
    }

    let done = tasks.filter(t => t.completed).length;
    let percent = Math.round((done / tasks.length) * 100);

    document.getElementById("progress").innerText = percent + "%";
}

const addTaskBtn = document.getElementById("addTaskBtn");
const taskModal = document.getElementById("taskModal");
const saveTask = document.getElementById("saveTask");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const taskCount = document.getElementById("taskCount");

addTaskBtn.addEventListener("click",()=>{
    taskModal.style.display = "flex";
});

saveTask.addEventListener("click",()=>{

    const title = document.getElementById("taskInput").value;
    const desc = document.getElementById("taskDesc").value;
    const date = document.getElementById("taskDate").value;
    const time = document.getElementById("taskTime").value;
    const priority = document.getElementById("taskPriority").value;

    if(!title){
        alert("Enter Task Title");
        return;
    }

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({
    title,
    desc,
    date,
    time,
    priority,
    completed:false
});
    localStorage.setItem("tasks",JSON.stringify(tasks));

    taskModal.style.display = "none";

    document.getElementById("taskInput").value = "";
    document.getElementById("taskDesc").value = "";
    document.getElementById("taskDate").value = "";
    document.getElementById("taskTime").value = "";

    loadTasks();
});

function loadTasks(){

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    taskList.innerHTML = "";
    emptyMessage.style.display = tasks.length ? "none" : "block";

    tasks.forEach((t,i)=>{

        let div = document.createElement("div");
        div.classList.add("task");

        div.innerHTML = `
    <h3 style="${t.completed ? 'text-decoration:line-through;opacity:0.6' : ''}">
        ${t.title}
    </h3>
    <p>${t.desc}</p>
    <small>${t.date} ${t.time}</small>
    <br><br>
    <span class="${t.priority}">${t.priority}</span>
    <br><br>

    <button onclick="toggleComplete(${i})">
        ${t.completed ? "Undo" : "Complete"}
    </button>

    <button onclick="deleteTask(${i})">Delete</button>
`;

        taskList.appendChild(div);
    });

    taskCount.innerText = tasks.length;

    updateProgress();
}


function toggleComplete(i){
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks[i].completed = !tasks[i].completed;

    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
}

function deleteTask(i){
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.splice(i,1);
    localStorage.setItem("tasks",JSON.stringify(tasks));
    loadTasks();
}

/* =========================
   NOTES SYSTEM
========================= */

function saveNotes(){

    let text = document.getElementById("notesInput").value;
    let date = document.getElementById("noteDate").value;

    if(!text){
        alert("Write note first");
        return;
    }

    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.push({text,date});

    localStorage.setItem("notes",JSON.stringify(notes));

    document.getElementById("notesInput").value = "";
    document.getElementById("noteDate").value = "";

    loadNotes();
}

function loadNotes(){

    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    let list = document.getElementById("notesList");

    list.innerHTML = "";

    notes.forEach((n,i)=>{

        let div = document.createElement("div");
        div.classList.add("task");

        div.innerHTML = `
            <h3>${n.text}</h3>
            <p>${n.date}</p>
            <button onclick="deleteNote(${i})">Delete</button>
        `;

        list.appendChild(div);
    });

    document.getElementById("noteCount").innerText = notes.length;
}

function deleteNote(i){
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.splice(i,1);
    localStorage.setItem("notes",JSON.stringify(notes));
    loadNotes();
}

/* =========================
   EVENTS + CALENDAR
========================= */

let currentDate = new Date();

const holidays = {
"2026-02-21":"Language Movement Day",
"2026-03-26":"Independence Day",
"2026-04-14":"Pohela Boishakh",
"2026-05-01":"Buddha Purnima + May Day",
"2026-12-16":"Victory Day",
"2026-04-10":"Eid ul Fitr",
"2026-05-28":"Eid ul Adha",
"2026-06-26":"Ashura",
"2026-08-05":"July Gono-ovutthan",
};

/* =========================
   CALENDAR RENDER
========================= */

function renderCalendar(){

    let monthYear = document.getElementById("monthYear");
    let calendarDates = document.getElementById("calendarDates");

    if(!calendarDates) return;

    calendarDates.innerHTML = "";

    let year = currentDate.getFullYear();
    let month = currentDate.getMonth();

    let firstDay = new Date(year,month,1).getDay();
    let lastDate = new Date(year,month+1,0).getDate();

    const months = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
    ];

    monthYear.innerText = `${months[month]} ${year}`;

    let events = JSON.parse(localStorage.getItem("events")) || [];

    for(let i=0;i<firstDay;i++){
        calendarDates.appendChild(document.createElement("div"));
    }

    for(let d=1; d<=lastDate; d++){

        let box = document.createElement("div");

        let fullDate =
            `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

        let dayName = new Date(year, month, d).getDay();

        if(dayName === 5){
            box.classList.add("friday");
        }
        else if(dayName === 6){
            box.classList.add("saturday");
        }
        else{
            box.classList.add("normal-day");
        }

        box.innerHTML = `<span>${d}</span>`;

        let event = events.find(e => e.date === fullDate);

        if(event){

        let icon = "";

        if(event.type === "exam") icon = "🔴";

        else if(event.type === "holiday") icon = "🔵";
        
        else icon = "🟢";

            box.innerHTML += `<small>${icon} ${event.title}</small>`;
        }

        if(holidays[fullDate]){
            box.innerHTML += `<small>🎉 ${holidays[fullDate]}</small>`;
        }

        let today = new Date();

        if(
            d === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ){
            box.classList.add("today");
        }

        /* =========================
           POPUP CLICK
        ========================= */

        box.addEventListener("click",()=>{
            openPopup(fullDate);
        });

        calendarDates.appendChild(box);
    }
}

function prevMonth(){
    currentDate.setMonth(currentDate.getMonth()-1);
    renderCalendar();
}

function nextMonth(){
    currentDate.setMonth(currentDate.getMonth()+1);
    renderCalendar();
}

/* =========================
   EVENT SYSTEM
========================= */

function addEvent(){

    let date = document.getElementById("eventDate").value;
    let title = document.getElementById("eventTitle").value;
    let type = document.getElementById("eventType").value;

    if(!date || !title){
        alert("Fill all fields");
        return;
    }

    let events = JSON.parse(localStorage.getItem("events")) || [];
    events.push({date,title,type});

    localStorage.setItem("events",JSON.stringify(events));

    document.getElementById("eventDate").value = "";
    document.getElementById("eventTitle").value = "";

    loadEvents();
    loadEventsCount();
    renderCalendar();
}

function loadEvents(){

    let events = JSON.parse(localStorage.getItem("events")) || [];
    let list = document.getElementById("eventList");

    if(!list) return;

    list.innerHTML = "";

    events.forEach((e,i)=>{

        let div = document.createElement("div");
        div.classList.add("event-item");

        div.innerHTML = `
            <h4>${e.title}</h4>
            <p>${e.date}</p>
            <button onclick="deleteEvent(${i})">Delete</button>
        `;

        list.appendChild(div);
    });
}

function deleteEvent(i){
    let events = JSON.parse(localStorage.getItem("events")) || [];
    events.splice(i,1);
    localStorage.setItem("events",JSON.stringify(events));

    loadEvents();
    loadEventsCount();
    renderCalendar();
}

function loadEventsCount(){
    let events = JSON.parse(localStorage.getItem("events")) || [];
    document.getElementById("eventCount").innerText = events.length;
}

/* =========================
   POPUP SYSTEM (NEW)
========================= */

let selectedDate = "";

function openPopup(date){

    selectedDate = date;

    document.getElementById("eventPopup").style.display = "flex";
    document.getElementById("popupDate").innerText = date;

    loadPopupEvents(date);
}

function closePopup(){
    document.getElementById("eventPopup").style.display = "none";
}

function loadPopupEvents(date){

    let events = JSON.parse(localStorage.getItem("events")) || [];

    let filtered = events.filter(e => e.date === date);

    let box = document.getElementById("popupEvents");
    box.innerHTML = "";

    if(filtered.length === 0){
        box.innerHTML = "<p>No events</p>";
        return;
    }

    filtered.forEach((e,i)=>{
        box.innerHTML += `
            <div style="margin:10px 0;padding:10px;background:#0f172a;border-radius:10px;">
                <b>${e.title}</b>
                <p>${e.type}</p>
                <button onclick="deleteEvent(${i})">Delete</button>
            </div>
        `;
    });
}

/* =========================
   CALCULATOR
========================= */

function calcValue(v){
    document.getElementById("calcDisplay").value += v;
}

function calculate(){
    try{
        let expr = document.getElementById("calcDisplay").value;
        let result = Function("return " + expr)();
        document.getElementById("calcDisplay").value = result;
    }catch{
        document.getElementById("calcDisplay").value = "Error";
    }
}

function clearCalc(){
    document.getElementById("calcDisplay").value = "";
}

function deleteLast(){
    let d = document.getElementById("calcDisplay");
    d.value = d.value.slice(0,-1);
}

/* =========================
   PDF
========================= */

document.getElementById("pdfUpload").addEventListener("change",(e)=>{
    let file = e.target.files[0];
    if(file){
        document.getElementById("pdfViewer").src = URL.createObjectURL(file);
    }
});

/* =========================
   POMODORO
========================= */

let timer;
let totalTime = 1500;

function startPomodoro(){

    clearInterval(timer);

    let input = document.getElementById("pomodoroInput").value;
    if(input) totalTime = input * 60;

    timer = setInterval(()=>{

        let m = Math.floor(totalTime / 60);
        let s = totalTime % 60;

        s = s < 10 ? "0"+s : s;

        document.getElementById("pomodoroTime").innerText = `${m}:${s}`;

        totalTime--;

        if(totalTime < 0){
            clearInterval(timer);
            alert("Done!");
        }

    },1000);
}

function stopPomodoro(){
    clearInterval(timer);
}

function resetPomodoro(){
    clearInterval(timer);
    totalTime = 1500;
    document.getElementById("pomodoroTime").innerText = "25:00";
}

function toggleComplete(i){
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks[i].completed = !tasks[i].completed;

    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
}

/* =========================
   INIT
========================= */

loadTasks();
loadNotes();
loadEvents();
loadEventsCount();
renderCalendar();