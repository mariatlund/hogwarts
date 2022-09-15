"use strict";

// DATA LINK: https://petlatkea.dk/2021/hogwarts/students.json

window.addEventListener("DOMContentLoaded", init);

// global array
const allStudents = [];

// object prototype
const Student = {
  firstName: "",
  lastName: "",
  middleName: undefined,
  nickName: undefined,
  image: "",
  house: "",
};

function init() {
  console.log("ready");

  loadJSON();
}

function loadJSON() {
  fetch(`https://petlatkea.dk/2021/hogwarts/students.json`)
    .then((response) => response.json())
    .then((jsonData) => {
      // when loaded, prepare objects
      prepareObjects(jsonData);
    });
}

function prepareObjects(jsonData) {
  jsonData.forEach((jsonObject) => {
    let studentName, studentFirstName, studentLastName, studentMiddleName, studentGender, studentHouse, previousChar, currentChar, studentNickName;

    // CLEAN DATA
    // remove extra spaces
    studentName = jsonObject.fullname.trim();
    // remove quotation marks
    jsonObject.fullname.replaceAll('"', " ");

    // find first name
    studentFirstName = studentName.split(" ")[0];
    // find last name & middle name
    if (studentName.split(" ")[2] === undefined) {
      studentLastName = studentName.split(" ")[1];
      studentMiddleName = undefined;
    } else {
      studentLastName = studentName.split(" ")[2];
      studentMiddleName = studentName.split(" ")[1];
    }
    // find gender
    studentGender = jsonObject.gender;

    // find house
    studentHouse = jsonObject.house.trim();

    // CREATE OBJECT
    const student = Object.create(Student);

    // add values from JSON data to object properties + add correct capitalization
    // first name
    student.firstName = studentFirstName.substring(0, 1).toUpperCase() + studentFirstName.substring(1, studentFirstName.length).toLowerCase();
    // middle name
    if (studentMiddleName === undefined) {
      student.middleName = studentMiddleName;
    } else {
      if (studentMiddleName.includes('"')) {
        student.middleName = undefined;
      } else {
        student.middleName = studentMiddleName.substring(0, 1).toUpperCase() + studentMiddleName.substring(1, studentMiddleName.length).toLowerCase();
      }
    }
    // last name
    if (studentLastName === undefined) {
      // no last name
      student.lastName = studentLastName;
    } else if (studentLastName.includes("-")) {
      // hyphen last name
      // capitalize letters in hyphen last names
      for (let i = 0; i < studentLastName.length; i++) {
        previousChar = studentLastName[i - 1];
        if (previousChar === "-") {
          currentChar = studentLastName[i].toUpperCase();
        }
        currentChar = studentLastName[i];
        student.lastName += currentChar;
      }
    } else {
      // normal last name
      student.lastName = studentLastName.substring(0, 1).toUpperCase() + studentLastName.substring(1, studentLastName.length).toLowerCase();
    }

    // gender
    student.gender = studentGender.substring(0, 1).toUpperCase() + studentGender.substring(1, studentGender.length).toLowerCase();

    // house
    student.house = studentHouse.substring(0, 1).toUpperCase() + studentHouse.substring(1, studentHouse.length).toLowerCase();

    // nickname
    // find student nickname
    studentNickName = studentName.split(" ")[1];
    if (studentNickName === undefined) {
      student.nickName = undefined;
    } else {
      // previousChar = studentNickName.substring(0, 1);

      if (studentNickName.includes('"')) {
        student.nickName = studentNickName.replaceAll('"', "");
      }
    }

    // img file name

    // push object to global array
    allStudents.push(student);
  });

  displayData();
}

function displayData() {
  console.table(allStudents);
}
