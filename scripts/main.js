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
});
