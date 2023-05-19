// Animations
AOS.init({
  anchorPlacement: "top-left",
  duration: 1000,
});

window.addEventListener("load", function () {
  // Add your javascript here
  function calculateAge(birthday) {
    // birthday as a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    var age = Math.abs(ageDate.getUTCFullYear() - 1970);
    var el = document.getElementById("years");
    el.innerHTML = age;
  }

  function calculateYear() {
    var year = new Date().getFullYear();
    var el = document.getElementById("year");
    el.innerHTML = year;
  }

  var birthday = new Date("1999-11-07");
  calculateAge(birthday);
  calculateYear();

  particlesJS.load('particles-js', 'assets/particles.json', function() {
  });

  emailjs.init("user_PrPI8a8v730dTh7Csb0Bd");

  function sendEmail(e) {
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
  }

  $(".close-message-toast").on("click", function () {
    $(".toast").toast("hide");
  });

  const form = document.querySelector(".form");
  form.addEventListener("submit", sendEmail);

  function calculateWorkPeriod() {
    const cards = document.getElementsByClassName('timeline-card');
    
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const dateTextElement = card.querySelector('.text-muted.text-small.mb-3');
      const dateText = dateTextElement.textContent;
      const dates = dateText.split(' - ');
      const startDate = new Date(dates[0].trim());
      const endDate = dates[1].trim() === 'Present' ? new Date() : new Date(dates[1].trim());
      const workPeriod = calculateDuration(startDate, endDate);
      
      const periodElement = document.createElement('span');
      periodElement.classList.add('work-period');
      periodElement.textContent = workPeriod ? ` (${workPeriod})` : '';
      dateTextElement.appendChild(periodElement);
    }
  }
  
  function calculateDuration(startDate, endDate) {
    const diff = Math.abs(endDate - startDate);
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    
    let duration = '';
    if (years > 0) {
      duration += years + (years === 1 ? ' year' : ' years');
    }
    if (months > 0) {
      duration += (years > 0 ? ' ' : '') + months + (months === 1 ? ' month' : ' months');
    }
    return duration;
  }
  
  calculateWorkPeriod();
  
});
