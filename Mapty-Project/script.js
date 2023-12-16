"use strict";

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

class Workout {
  date = new Date();
  id = (Date.now() + "").slice(-10); // convert to string + cut the last ten number //
  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
  _description() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}

class Running extends Workout {
  type = "running";
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;

    this.calcPace();
    this._description();
  }
  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = "cycling";
  constructor(coords, distance, duration, ElevationGain) {
    super(coords, distance, duration);
    this.ElevationGain = ElevationGain;

    this.calcSpeed;
    this._description();
  }
  calcSpeed() {
    this.speed = this.distance / (this.duration / 60); //==> km/h <==//
    return this.speed;
  }
}

// a class holding our app functions //
class App {
  // private proprties //
  #map;
  #mapEvent;
  #workouts = [];
  constructor() {
    // get user postions //
    this._getPosition();
    // load workouts from local storge //
    this._getLocalStorge();
    form.addEventListener("submit", this._newWorkout.bind(this));
    inputType.addEventListener("change", this._togelElevationField.bind(this));
    containerWorkouts.addEventListener("click", this._moveToPopup.bind(this));
  }

  _getPosition() {
    // (in case of succes, in case of fail)
    navigator.geolocation.getCurrentPosition(
      // this in bind refer to the curent object //
      this._loadMap.bind(this),
      function () {
        alert("couldn't load your loaction");
      }
    );
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    this.#map = L.map("map").setView([latitude, longitude], 11);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
    // handle click on map //
    this.#map.on("click", this._showForm.bind(this));
    // display workouts marker we get from local storge //
    this.#workouts.forEach((item) => {
      this._displayWorkoutMarker(item);
    });
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    // render the form //
    form.classList.remove("hidden");
    inputDistance.focus();
  }

  _hideForm() {
    inputDistance.value =
      inputCadence.value =
      inputDuration.value =
      inputElevation.value =
        "";
    form.classList.add("hidden");
    form.style.display = "none";
    setTimeout(() => (form.style.display = "grid"), 1000);
  }

  _togelElevationField() {
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }
  // display workout marker on the map //
  _displayWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === "running" ? "🏃‍♂️" : "🚴‍♂️"} ${workout.description}`
      )
      .openPopup();
  }
  // display the workout on the list //
  _displayWorkout(workout) {
    const html = `<li class="workout workout--${workout.type}" data-id=${
      workout.id
    }>
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${
              workout.type === "running" ? "🏃‍♂️" : "🚴‍♂️"
            } </span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${
              workout.type === "running" ? workout.pace : workout.speed
            }</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">${
              workout.type === "running" ? "🦶" : "⛰"
            }</span>
            <span class="workout__value">${
              workout.type === "running"
                ? workout.cadence
                : workout.ElevationGain
            }</span>
            <span class="workout__unit">${
              workout.type === "running" ? "spm" : "m"
            }</span>
          </div>
        </li>`;
    form.insertAdjacentHTML("afterend", html);
  }
  // function moving us to the workout popup on the map //
  _moveToPopup(e) {
    const workoutEl = e.target.closest(".workout");
    if (!workoutEl) return;
    const curWorkout = this.#workouts.find(
      (index) => index.id === workoutEl.dataset.id
    );
    this.#map.setView(curWorkout.coords, 11, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }
  _newWorkout(e) {
    // prevent the form to reload //
    e.preventDefault();
    // validation function //
    const validData = (...inputs) =>
      inputs.every((inp) => Number.isFinite(inp));
    const positiveNumbers = (...inputs) => inputs.every((inp) => inp > 0);
    // get the data from the form //
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;
    // if workout runnig, create runing object //
    if (type === "running") {
      const cadence = +inputCadence.value;
      // check the data if valid //
      if (
        !validData(distance, duration, cadence) ||
        !positiveNumbers(distance, duration, cadence)
      ) {
        return alert("The Input Data Not Valid");
      }

      workout = new Running([lat, lng], distance, duration, cadence);
    }
    // if workout cycling, create cycling object //
    if (type === "cycling") {
      const elevation = +inputElevation.value;
      console.log(elevation);
      if (
        !validData(distance, duration, elevation) ||
        !positiveNumbers(distance, duration)
      ) {
        return alert("The Input Data Not Valid");
      }
      workout = new Cycling([lat, lng], distance, duration, elevation);
    }
    // console.log(workout);
    // add new property to the workouts array //
    this.#workouts.push(workout);
    //console.log(this); // ==> it will refer to the form if you didnit bind the _newWorkout//
    // display workout on the map as a marker //
    this._displayWorkoutMarker(workout);
    // display workout on the list (display it on the side bar) //
    this._displayWorkout(workout);
    // hide the form + clear form fields //
    this._hideForm();
    // set the local storge to all workouts //
    this._setLocalStorge();
  }
  _setLocalStorge() {
    localStorage.setItem("workouts", JSON.stringify(this.#workouts));
  }
  _getLocalStorge() {
    const data = JSON.parse(localStorage.getItem("workouts"));
    if (!data) return;
    this.#workouts = data;
    this.#workouts.forEach((item) => {
      this._displayWorkout(item);
    });
  }
}
const app = new App();
