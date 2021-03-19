(function (birthday) {
    function calculateAge(birthday) { // birthday is a date 
        var ageDifMs = Date.now() - birthday.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        var age = Math.abs(ageDate.getUTCFullYear() - 1970);
        var ele = document.getElementById('years');
        ele.innerHTML += age;
        console.log(age);
    }
    calculateAge(birthday);
})(birthday);