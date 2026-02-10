let students = JSON.parse(localStorage.getItem("students")) || [];

const rollInput = document.getElementById("rollInput");
const nameInput = document.getElementById("nameInput");
const addBtn = document.getElementById("addBtn");
const dateInput = document.getElementById("dateInput");
const searchInput = document.getElementById("searchInput");
const tableBody = document.getElementById("tableBody");

const totalStudents = document.getElementById("totalStudents");
const presentStudents = document.getElementById("presentStudents");
const absentStudents = document.getElementById("absentStudents");
const attendancePercent = document.getElementById("attendancePercent");

// Default date = today
const today = new Date().toISOString().split("T")[0];
dateInput.value = today;

function saveData() {
  localStorage.setItem("students", JSON.stringify(students));
}

function updateDashboard() {
  let total = students.length;
  let present = students.filter(s => s.status === "Present").length;
  let absent = students.filter(s => s.status === "Absent").length;

  totalStudents.innerText = total;
  presentStudents.innerText = present;
  absentStudents.innerText = absent;

  let percent = total === 0 ? 0 : (present / total) * 100;
  attendancePercent.innerText = percent.toFixed(2) + "%";
}

function renderTable() {
  tableBody.innerHTML = "";

  const searchText = searchInput.value.toLowerCase();

  students
    .filter(s => {
      return (
        s.roll.toLowerCase().includes(searchText) ||
        s.name.toLowerCase().includes(searchText)
      );
    })
    .forEach((student, index) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${student.roll}</td>
        <td>${student.name}</td>
        <td>${student.date || "undefined"}</td>
        <td class="${student.status === "Present" ? "status-present" : "status-absent"}">
          ${student.status}
        </td>
        <td>
          <button class="btn-present">Present</button>
          <button class="btn-absent">Absent</button>
        </td>
        <td>
          <button class="btn-delete">Delete</button>
        </td>
      `;

      // Present button
      tr.querySelector(".btn-present").addEventListener("click", () => {
        students[index].status = "Present";
        students[index].date = dateInput.value;
        saveData();
        renderTable();
        updateDashboard();
      });

      // Absent button
      tr.querySelector(".btn-absent").addEventListener("click", () => {
        students[index].status = "Absent";
        students[index].date = dateInput.value;
        saveData();
        renderTable();
        updateDashboard();
      });

      // Delete button
      tr.querySelector(".btn-delete").addEventListener("click", () => {
        students.splice(index, 1);
        saveData();
        renderTable();
        updateDashboard();
      });

      tableBody.appendChild(tr);
    });

  updateDashboard();
}

// Add Student
addBtn.addEventListener("click", () => {
  const roll = rollInput.value.trim();
  const name = nameInput.value.trim();

  if (roll === "" || name === "") {
    alert("Please enter both Roll No and Name!");
    return;
  }

  // Prevent duplicate roll number
  const exists = students.some(s => s.roll === roll);
  if (exists) {
    alert("This Roll Number already exists!");
    return;
  }

  students.push({
    roll: roll,
    name: name,
    date: dateInput.value,
    status: "Absent"
  });

  rollInput.value = "";
  nameInput.value = "";

  saveData();
  renderTable();
});

// Search
searchInput.addEventListener("input", renderTable);

// Date change
dateInput.addEventListener("change", () => {
  // Only changes marking date, not auto update
});

// Initial load
renderTable();
updateDashboard();
