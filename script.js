"use strict";

window.addEventListener("DOMContentLoaded", start);

// DECLARE GLOBAL VARIABLES & SETTINGS
// array of all students
let allStudents = [];

// create prototype for student objects
const Student = {
  // firstname
  // middlename
  // lastname
  // nickname
  // house
  // gender
  // inquisitor
  // prefect
  // bloodstatus
};

// array of settings for filtering, sorting, search (?)
const settings = {
  // filterBy
  // sortBy
  // sortDir
};

function start() {
  console.log("ready");

  // call functions to prepare next steps
  // loadJSON();

  // add event listeners to buttons - filtering, sorting, search
  // prepareFilter();
  // prepareSort();

  // add event listeners to student containers
  //   prepareStudents();
}

// LOAD STUDENT JSON DATA & ADD TO ARRAY AS OBJECTS

async function loadJSON() {
  const response = await fetch("hogwarts-data/hogwartsdata.js");
  const jsonData = await response.json();

  // when loaded, prepare data objects
}

function prepareObjects(jsonData) {
  // add data into array containing all students
  allStudents = jsonData.map(createStudent);

  displayList(allStudents);
}

function createStudent(jsonObject) {
  // create a student object with the json data
  const student = Object.create(Student);

  // set the student properties, e.g.:
  // let firstName = getFirstName();
  // student.firstName = firstName;

  // do this for all properties, call helper functions that extract the information from the json data

  return student;
}

// DISPLAYING STUDENTS

function displayList(students) {
  // make sure list is empty
  // document.queryselector.("student-list").innerHTML = "";
  // build a new list
  // students.forEach(displayStudent);
}

function displayStudent(student) {
  // clone template
  // add data to the correct clone fields
  // append to student list
}
