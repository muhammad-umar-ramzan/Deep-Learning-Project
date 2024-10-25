document.getElementById("imageForm").addEventListener("submit", async function (event) {
    event.preventDefault();  // Prevent form from refreshing the page

    const imageUpload = document.getElementById("imageUpload").files[0];
    const predictionDiv = document.getElementById("prediction");
    const suggestionDiv = document.getElementById("suggestion");
    const uploadedImage = document.getElementById("uploadedImage");
    
    predictionDiv.textContent = "Detecting...";
    suggestionDiv.textContent = "";
    
    // Show the uploaded image
    const reader = new FileReader();
    reader.onload = function (e) {
        uploadedImage.src = e.target.result;
        uploadedImage.style.display = "block";
    };
    reader.readAsDataURL(imageUpload);
    
    // Prepare FormData for the image file
    const formData = new FormData();
    formData.append("image", imageUpload);

    // Send image to Flask server
    const response = await fetch("/predict", {
        method: "POST",
        body: formData
    });

    if (response.ok) {
        const data = await response.json();
        predictionDiv.textContent = "Result: " + data.result;
        suggestionDiv.textContent = "Suggestion: " + data.suggestion;
    } else {
        predictionDiv.textContent = "Error: Unable to get prediction. Please try again.";
    }
});
