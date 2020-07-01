console.log('Script')

let weatherForm = document.getElementById("weatherForm");
let locationNameInput = document.getElementById("location_name");
let messageOne = document.getElementById("message-1");
let messageTwo = document.getElementById("message-2");

weatherForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const location = locationNameInput.value;
    fetchHandler(location);
});

const fetchHandler = (location) => {
    messageOne.textContent = "Loading....";
    messageTwo.textContent = "";
    const fetchUrl = `/weather?location=${location}`;

    fetch(fetchUrl).then((response) => {
        response.json().then((data) => {
            console.log(data);
            if (data.error) {
                messageOne.textContent = data.error.info;
                return;
            }
            messageOne.textContent = data.location;
            messageTwo.textContent = data.message;
        });
    });
};