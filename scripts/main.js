// Initialize AOS library for animations
AOS.init({
  anchorPlacement: "top-left",
  duration: 1000,
});

// Execute the code when the window has finished loading
window.addEventListener("load", function () {

  const calculateAge = (birthday) => {
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    document.getElementById("years").innerHTML = age;
  };

  const calculateYear = () => {
    document.getElementById("year").innerHTML = new Date().getFullYear();
  };

  const birthday = new Date("1999-11-07");
  calculateAge(birthday);
  calculateYear();

  particlesJS.load("particles-js", "assets/particles.json", function () { });

  emailjs.init("user_PrPI8a8v730dTh7Csb0Bd");

  const sendEmail = (e) => {
    e.preventDefault();

    const templateParams = {
      name: e.target.name.value,
      email: e.target.email.value,
      message: e.target.message.value,
    };

    emailjs
      .send(
        "service_m7y2lg4",
        "template_n615z9g",
        templateParams,
        "user_PrPI8a8v730dTh7Csb0Bd"
      )
      .then(
        (result) => {
          $(".toast").toast("show");
          $(".form").trigger("reset");
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  $(".close-message-toast").on("click", function () {
    $(".toast").toast("hide");
  });

  const form = document.querySelector(".form");
  form.addEventListener("submit", sendEmail);

  const calculateWorkPeriod = () => {
    const dateTextElements = Array.from(this.document.querySelectorAll(".time-period"));
    dateTextElements.forEach(dateTextElement => {
      const dateText = dateTextElement.textContent;
      const [startDateText, endDateText] = dateText.split(" - ").map(text => text.trim());
      const startDate = new Date(startDateText);
      const endDate = endDateText === "Present" ? new Date() : new Date(endDateText);
      const workPeriod = calculateDuration(startDate, endDate);

      const periodElement = document.createElement("span");
      periodElement.classList.add("work-period");
      periodElement.textContent = workPeriod ? ` (${workPeriod})` : "";
      dateTextElement.appendChild(periodElement);
    });
  };

  const calculateDuration = (startDate, endDate) => {
    const diff = Math.abs(endDate - startDate);
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30) + 1;

    let duration = "";
    if (years > 0) {
      duration += years + (years === 1 ? " year" : " years");
    }
    if (months > 0) {
      duration += (years > 0 ? " " : "") + months + (months === 1 ? " month" : " months");
    }
    return duration;
  };

  calculateWorkPeriod();
});
