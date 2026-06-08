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
