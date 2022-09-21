"use strict";

window.addEventListener("DOMContentLoaded", start);

// ---------- DECLARE GLOBAL VARIABLES & SETTINGS ----------
const url = "https://petlatkea.dk/2021/hogwarts/students.json";
const bloodURL = "https://petlatkea.dk/2021/hogwarts/families.json";

// array of all students
let allStudents = [];

// create prototype for student objects
const Student = {
  firstName: "",
  middleName: "",
  lastName: "",
  nickName: "",
  house: "",
  gender: "",
  image: "",
  inquisitor: false,
  prefect: false,
  bloodStatus: "",
  expelled: false,
};

// array of settings for filtering, sorting, search
const settings = {
  filterBy: "all",
  sortBy: "firstName",
  sortDir: "asc",
  searchBy: "",
};

function start() {
  console.log("ready");

  // call functions to prepare next steps
  loadJSON();

  // add event listeners to buttons - filtering, sorting, search
  registerButtons();
}

// ---------- LOAD STUDENT JSON DATA & ADD TO ARRAY AS OBJECTS ----------

async function loadJSON() {
  fetch(url)
    .then((response) => response.json())
    .then((jsonData) => {
      // when loaded, prepare data objects
      prepareObjects(jsonData);
    });
}

function prepareObjects(jsonData) {
  // add data into array containing all students
  allStudents = jsonData.map(createStudent);

  buildList(allStudents);
}

function createStudent(jsonObject) {
  // create a student object with the json data
  const student = Object.create(Student);

  // -- NAMES --
  // create name array
  const fullNameArr = jsonObject.fullname.trim().split(" ");
  // first name
  student.firstName = fullNameArr[0].charAt(0).toUpperCase() + fullNameArr[0].substring(1).toLowerCase();
  // last name
  student.lastName = fullNameArr.at(-1).charAt(0).toUpperCase() + fullNameArr.at(-1).substring(1).toLowerCase();
  // middle name - check if student has one
  if (jsonObject.fullname.trim().indexOf(" ") === jsonObject.fullname.trim().lastIndexOf(" ")) {
    student.middleName = "";
  } else {
    student.middleName = jsonObject.fullname.trim().substring(jsonObject.fullname.trim().indexOf(" ") + 1, jsonObject.fullname.trim().lastIndexOf(" "));
  }
  // middle name - capitalize
  student.middleName = student.middleName.charAt(0).toUpperCase() + student.middleName.substring(1).toLowerCase();
  // nickname
  student.nickName = jsonObject.fullname.substring(jsonObject.fullname.indexOf('"') + 1, jsonObject.fullname.lastIndexOf('"'));
  // problem with ernie, his nickname gets set as his middle name

  // -- HOUSE --
  student.house = jsonObject.house.trim();
  student.house = student.house.charAt(0).toUpperCase() + student.house.substring(1).toLowerCase();

  // -- GENDER --
  student.gender = jsonObject.gender;

  // -- IMAGES --
  if (student.lastName === "Patil") {
    student.image = `images/${student.lastName.toLowerCase()}_${student.firstName.toLowerCase()}.png`;
  } else if (student.lastName === "Finch-fletchley") {
    const finchFletch = student.lastName.split("-");
    student.image = `images/${finchFletch[1].toLowerCase()}_${student.firstName.charAt(0).toLowerCase()}.png`;
    // student.lastName = finchFletch[1].charAt(0).toUpperCase() + finchFletch[1].substring(1).toLowerCase();
    // student.middleName = finchFletch[0];
  } else {
    student.image = `images/${student.lastName.toLowerCase()}_${student.firstName.charAt(0).toLowerCase()}.png`;
  }

  console.log("Student Object:", student);

  return student;
}

//  ---------- DISPLAYING STUDENTS ----------

function buildList() {
  // display list with selected students - change this later with filtering and sorting?
  displayList(allStudents);
  // display list stats in side menu - add later
}

function displayList(students) {
  // make sure list is empty
  document.querySelector(".list").innerHTML = "";
  // build a new list
  students.forEach(displayStudent);
}

function displayStudent(student) {
  // clone template
  const clone = document.querySelector(".studentTemplate").content.cloneNode(true);

  // add data to the correct clone fields
  // name
  clone.querySelector(".name").textContent = `${student.firstName} ${student.middleName} ${student.lastName}`;
  // image
  clone.querySelector(".student-img").src = student.image;
  clone.querySelector(".student-img").alt = `${student.firstName} ${student.lastName}`;
  // house
  clone.querySelector(".house").textContent = student.house;
  clone.querySelector(".house-img").src = `assets/${student.house.toLowerCase()}-crest.jpg`;
  clone.querySelector(".house-img").alt = student.house;
  // roles (use if statements)
  // add event listeners to student containers (?)
  clone.querySelector(".student-container").addEventListener("click", () => {
    openStudentModal(student);
  });
  // append to student list
  document.querySelector(".list").appendChild(clone);
}

// ---------- MODALS - STUDENT DETAILS, WARNINGS, ETC. ----------
function openStudentModal(student) {
  console.log("open modal");
  // clear modal info
  // document.querySelector(".student-modal").innerHTML = "";
  // add student info to modal
  document.querySelector(".modal-img").src = student.image;
  document.querySelector(".student-name").textContent = `${student.firstName} ${student.middleName} ${student.lastName}`;
  document.querySelector(".nickname").textContent = student.nickName;
  document.querySelector(".house-name").textContent = student.house;
  document.querySelector(".modal-house-img").src = `assets/${student.house.toLowerCase()}-crest.jpg`;
  document.querySelector(".modal-house-img").alt = student.house;
  // show prefect status
  // show inquisitor status
  // add eventlistener to close button
  document.querySelector(".close").addEventListener("click", closeStudentModal);
  // make modal visible
  document.querySelector(".student-modal").classList.remove("hidden");
}

function closeStudentModal() {
  console.log("close modal");
  document.querySelector(".student-modal").classList.toggle("hidden");
}

//  ---------- ACTIONS MENU - FILTERING, SORTING, SEARCHING ----------
function registerButtons() {
  // add eventlisteners to: filter by options, sort options, search (use keydown/keyup event)
}

// function search() {
//   // make variable for input value in search field
//   const searchTerm = document.querySelector("#searchInput").value;
//   settings.searchBy = searchTerm.toLowerCase();

//   const searchResults = allStudents.filter(studentSearch);
//   // use closure(?) with a function that checks if the student last or first name match the searchBy value
//   function studentSearch(student) {
//     if (student.firstName.toLowerCase().includes(settings.searchBy) || student.lastName.toLowerCase().includes(settings.searchBy)) return student;
//   }
//   displayList(searchResults);
// }
