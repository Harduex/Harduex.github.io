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

  const toastElement = document.getElementById("contact-toast");
  const toastHeader = document.getElementById("contact-toast-header");
  const toastTitle = document.getElementById("contact-toast-title");
  const toastMessage = document.getElementById("contact-toast-message");
  const form = document.querySelector(".form");

  const showContactToast = ({ title, message, theme = "success" }) => {
    if (!toastElement || !toastHeader || !toastTitle || !toastMessage) {
      return;
    }

    const nextTheme = theme === "danger" ? "danger" : "success";

    toastHeader.classList.remove("bg-success", "bg-danger");
    toastMessage.classList.remove("bg-success", "bg-danger");
    toastHeader.classList.add(`bg-${nextTheme}`);
    toastMessage.classList.add(`bg-${nextTheme}`);

    toastTitle.textContent = title;
    toastMessage.textContent = message;
    $(toastElement).toast("show");
  };

  const sendEmail = async (e) => {
    e.preventDefault();

    const submitButton = e.target.querySelector("button[type='submit']");
    const originalButtonText = submitButton ? submitButton.textContent : "Send";

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    const payload = Object.fromEntries(new FormData(e.target).entries());
    const requestUrl = e.target.dataset.ajaxAction || e.target.action;

    try {
      const response = await fetch(requestUrl, {
        method: e.target.method || "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false || result.success === "false" || result.error) {
        throw new Error(result.message || result.error || "Request failed.");
      }

      showContactToast({
        title: "Success!",
        message: "Your message was sent!",
      });
      e.target.reset();
    } catch (error) {
      console.error("FormSubmit error:", error);
      showContactToast({
        title: "Error",
        message: "Message failed. Please email me directly.",
        theme: "danger",
      });
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  };

  $(".close-message-toast").on("click", function () {
    if (toastElement) {
      $(toastElement).toast("hide");
    }
  });

  if (form) {
    form.addEventListener("submit", sendEmail);
  }

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
