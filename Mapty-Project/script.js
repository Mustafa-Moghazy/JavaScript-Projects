"use strict";

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");
// global variables //
let map, mapEvent;

// (in case of succes, in case of fail)
navigator.geolocation.getCurrentPosition(
  function (postion) {
    const { latitude } = postion.coords;
    const { longitude } = postion.coords;

    map = L.map("map").setView([latitude, longitude], 11);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    // handle click on map //
    map.on("click", function (mapE) {
      mapEvent = mapE;
      // render the form //
      form.classList.remove("hidden");
      inputDistance.focus();
    });
  },
  function () {
    alert("couldn't load your loaction");
  }
);
// handle form sumbition //
form.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log(mapEvent);
  const { lat, lng } = mapEvent.latlng;
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: "running-popup",
      })
    )
    .setPopupContent("workout")
    .openPopup();
});
// listen to the input type change (running, cycling)
inputType.addEventListener("change", function () {
  inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
  inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
});
