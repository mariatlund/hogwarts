"use strict";

window.addEventListener("DOMContentLoaded", start);

// ---------- DECLARE GLOBAL VARIABLES & SETTINGS ----------
const studentsURL = "https://petlatkea.dk/2021/hogwarts/students.json";
const bloodURL = "https://petlatkea.dk/2021/hogwarts/families.json";

// array of all students
let allStudents = [];
// array of expelled students
let expelledStudents = [];
// blood data arrays
let pureBloods = [];
let halfBloods = [];
let muggles = [];

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

// array of settings for filtering, sorting, search, active student array
const settings = {
  filterBy: "all",
  sortBy: "none",
  searchBy: "",
  activeArray: [allStudents],
};

async function start() {
  console.log("ready");

  // call functions to prepare next steps
  const studentJSON = await loadJSON();
  const studentBlood = await loadBlood();
  // when loaded, prepare data objects
  prepareBlood(studentBlood);
  prepareObjects(studentJSON);

  // add event listeners to buttons - filtering, sorting, search
  registerInputFields();
}

// ---------- LOAD STUDENT JSON DATA & ADD TO ARRAY AS OBJECTS ----------

// load student information json
async function loadJSON() {
  const response = await fetch(studentsURL);
  const jsonData = await response.json();

  return jsonData;
}

// load blood json
async function loadBlood() {
  const response = await fetch(bloodURL);
  const bloodData = await response.json();

  return bloodData;
}

function prepareObjects(jsonData) {
  // add data into array containing all students
  allStudents = jsonData.map(createStudent);
  settings.activeArray = allStudents;

  displayList(settings.activeArray, pureBloods, halfBloods);
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

  // console.log("Student Object:", student);

  return student;
}

//  ---------- DISPLAYING STUDENTS ----------

function displayList(students, pureBloods, halfBloods) {
  console.log("display list");
  // make sure list is empty
  document.querySelector(".list").innerHTML = "";
  // build a new list
  students.forEach(displayStudent);
  students.forEach(determineBloodStatus);
  // settings.activeArray = students;
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
  // roles
  if (student.prefect === true) {
    clone.querySelector(".prefect").classList.remove("hidden");
  }
  if (student.inquisitor === true) {
    clone.querySelector(".inquisitor").classList.remove("hidden");
  }
  // add event listeners to student containers (?)
  clone.querySelector(".student-container").addEventListener("click", () => {
    openStudentModal(student);
  });
  // append to student list
  document.querySelector(".list").appendChild(clone);
}

// ---------- MODALS - STUDENT DETAILS, WARNINGS, ETC. ----------
function openStudentModal(student) {
  // console.log("open modal");
  // add student info to modal
  document.querySelector(".modal-img").src = student.image;
  document.querySelector(".student-name").textContent = `${student.firstName} ${student.middleName} ${student.lastName}`;
  document.querySelector(".nickname").textContent = student.nickName;
  document.querySelector(".house-name").textContent = student.house;
  document.querySelector(".modal-house-img").src = `assets/${student.house.toLowerCase()}-crest.jpg`;
  document.querySelector(".modal-house-img").alt = student.house;
  // show house styling
  document.querySelector(".student-modal").classList.add(`${student.house.toLowerCase()}`);

  // show prefect status
  if (student.prefect === true) {
    document.querySelector(".modal-prefect").classList.remove("hidden");
  }
  // show inquisitor status
  if (student.inquisitor === true) {
    document.querySelector(".modal-inquisitor").classList.remove("hidden");
  }
  // show blood status
  document.querySelector(".blood-status").textContent = student.bloodStatus;
  // add eventlistener to close button
  document.querySelector(".close").addEventListener("click", closeStudentModal);
  // make modal visible
  document.querySelector(".modal-wrapper").classList.remove("hidden");
}

function closeStudentModal() {
  // console.log("close modal");
  document.querySelector(".modal-wrapper").classList.toggle("hidden");
  document.querySelector(".student-modal").classList.remove("gryffindor", "slytherin", "ravenclaw", "hufflepuff");
}

//  ---------- ACTIONS MENU - FILTERING, SORTING, SEARCHING ----------
function registerInputFields() {
  // add eventlisteners to: filter by options, sort options, search (use keydown/keyup event)
  document.querySelector("#filter-options").addEventListener("change", setFilter);
  document.querySelector("#sort-options").addEventListener("change", setSort);
  document.querySelector("#searchInput").addEventListener("input", search);
}

function setFilter(event) {
  // select filter with input value & update in settings
  const filter = event.target.value;
  settings.filterBy = filter;

  console.log("setFilter:", filter);
  buildList();
}

function setSort(event) {
  // select sort option with input value & update in settings
  const sort = event.target.value;
  settings.sortBy = sort;

  console.log("setSorting:", sort);
  buildList();
}

function buildList() {
  // console.log("buildList");
  // create filtered array
  const currentList = filterList(allStudents);
  const sortedList = sortList(currentList);

  // displayList(sortedList);
  displayList(sortedList);
}

// -- FILTERING --

function filterList(filteredList) {
  // console.log("filterList");
  settings.activeArray = filteredList;
  // filtering by houses
  if (settings.filterBy === "gryffindor") {
    settings.activeArray = allStudents.filter(isGryffindor);
  }
  if (settings.filterBy === "slytherin") {
    settings.activeArray = allStudents.filter(isSlytherin);
  }
  if (settings.filterBy === "hufflepuff") {
    settings.activeArray = allStudents.filter(isHufflepuff);
  }
  if (settings.filterBy === "ravenclaw") {
    settings.activeArray = allStudents.filter(isRavenclaw);
  }
  // filtering by roles
  if (settings.filterBy === "inquisitor") {
    settings.activeArray = allStudents.filter(isInquisitor);
  }
  if (settings.filterBy === "prefect") {
    settings.activeArray = allStudents.filter(isPrefect);
  }
  // filtering by expelled students / non-expelled students
  if (settings.filterBy === "expelled") {
    settings.activeArray = allStudents.filter(isExpelled);
  }
  if (settings.filterBy === "notExpelled") {
    settings.activeArray = allStudents.filter(isNotExpelled);
  }

  return settings.activeArray;
}

// filter functions
function isGryffindor(student) {
  if (student.house === "Gryffindor") {
    return true;
  }
  return false;
}
function isSlytherin(student) {
  if (student.house === "Slytherin") {
    return true;
  }
  return false;
}
function isHufflepuff(student) {
  if (student.house === "Hufflepuff") {
    return true;
  }
  return false;
}
function isRavenclaw(student) {
  if (student.house === "Ravenclaw") {
    return true;
  }
  return false;
}

function isInquisitor(student) {
  if (student.inquisitor === true) {
    return true;
  }
  return false;
}
function isPrefect(student) {
  if (student.prefect === true) {
    return true;
  }
  return false;
}
function isExpelled(student) {
  if (student.expelled === true) {
    return true;
  }
  return false;
}
function isNotExpelled(student) {
  if (student.expelled === false) {
    return true;
  }
  return false;
}

// -- SORTING --

function sortList(currentList) {
  // console.log("sortList");
  if (settings.sortBy === "firstNameAZ") {
    currentList = currentList.sort(sortFirstNameAZ);
  }
  if (settings.sortBy === "lastNameAZ") {
    currentList = currentList.sort(sortLastNameAZ);
  }
  if (settings.sortBy === "firstNameZA") {
    currentList = currentList.sort(sortFirstNameZA);
  }
  if (settings.sortBy === "lastNameZA") {
    currentList = currentList.sort(sortLastNameZA);
  }
  if (settings.sortBy === "house") {
    currentList = currentList.sort(sortHouse);
  }

  settings.activeArray = currentList;
  return settings.activeArray;
}

// sort functions
function sortFirstNameAZ(studentA, studentB) {
  if (studentA.firstName > studentB.firstName) {
    return 1;
  }
  return -1;
}
function sortLastNameAZ(studentA, studentB) {
  if (studentA.lastName > studentB.lastName) {
    return 1;
  }
  return -1;
}
function sortFirstNameZA(studentA, studentB) {
  if (studentA.firstName < studentB.firstName) {
    return 1;
  }
  return -1;
}
function sortLastNameZA(studentA, studentB) {
  if (studentA.lastName < studentB.lastName) {
    return 1;
  }
  return -1;
}
function sortHouse(studentA, studentB) {
  if (studentA.house > studentB.house) {
    return 1;
  }
  return -1;
}
// sort by last name

// -- SEARCH --

function search() {
  // make variable for input value in search field
  const searchTerm = document.querySelector("#searchInput").value;
  settings.searchBy = searchTerm.toLowerCase();

  const searchResults = settings.activeArray.filter(studentSearch);
  // use closure with a function that checks if the student last or first name match the searchBy value
  function studentSearch(student) {
    if (student.firstName.toLowerCase().includes(settings.searchBy) || student.lastName.toLowerCase().includes(settings.searchBy)) return student;
  }
  displayList(searchResults);
}

//  ---------- BLOOD STATUS ----------

function prepareBlood(bloodData) {
  // update blood arrays
  pureBloods = bloodData.pure;
  halfBloods = bloodData.half;

  console.log("purebloods:", pureBloods);
  console.log("halfbloods:", halfBloods);
}

function determineBloodStatus(student) {
  // check if last name is in half/pure list and set bloodStatus, if not in either, set to muggle, if in both, decide whether to set as half or pure
  if (pureBloods.includes(student.lastName)) {
    student.bloodStatus = "Pure Blood";
  }
  if (pureBloods.includes(student.lastName) && halfBloods.includes(student.lastName)) {
    student.bloodStatus = "Pure Blood";
  }
  if (halfBloods.includes(student.lastName)) {
    student.bloodStatus = "Half Blood";
  }
  if (!pureBloods.includes(student.lastName) && !halfBloods.includes(student.lastName)) {
    student.bloodStatus = "Muggleborn";
  }
}

// ---------- STUDENT ADMINISTRATOR ACTIONS ----------
// PREFECTS
// make a student a prefect (only one girl and one boy) - provide warning message when overriding existing prefect

// INQUISITORS
// make a student an inquisitor (based on given conditions - full blood or slytherin)

// EXPELLING
// check animal winners exercise
// use flags/toggle
// maybe have three arrays: allStudents, activeArray (use this for filtering), expelledStudents
// could also use filtering

// ---------- HACKING ----------
// INSERT YOURSELF INTO THE LIST
// create student object for yourself, then use .push() to add yourself into the array of students
// when expelling, check if student.name === your name and show a warning that you cannot be expelled

// BREAK BLOOD STATUS
// pop through the students, modify blood status with condition (check flag?) and if flagged call loop to mess up blood status
// BREAK INQUISITOR SQUAD
