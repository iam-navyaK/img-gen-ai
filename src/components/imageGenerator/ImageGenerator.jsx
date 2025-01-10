import React, { useRef, useState } from "react";
import axios from "axios";
import "./ImageGenerator.css";
import default_image from "../assets/default_image.svg";

export const ImageGenerator = () => {
  const [image_url, setImage_url] = useState("/");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Error state for displaying error messages
  let inputRef = useRef(null);

  const imageGenerator = async () => {
    const query = inputRef.current.value.trim();
    if (!query) {
      alert("Please enter a valid prompt!");
      return;
    }

    try {
      setLoading(true); // Start loading spinner
      setError(""); // Clear previous error

      // Fetch image from Unsplash API
      const response = await axios.get("https://api.unsplash.com/photos/random", {
        params: {
          query: query, // User query as search term
          client_id: process.env.REACT_APP_UNSPLASH_ACCESS_KEY, // Replace with your Unsplash Access Key
        },
      });

      console.log("API Response:", response.data); // Log the full response to inspect

      // Check if response data has images
      if (response.data && response.data.length > 0) {
        // Set image URL from the API response (use .urls.regular for better quality)
        setImage_url(response.data[0].urls.regular); // Or use .urls.small for smaller images
      } else {
        setError("No images found for your query.");
        setImage_url(default_image); // Fallback to default image if no image found
      }
    } catch (error) {
      console.error("Error fetching image:", error);
      setError("An error occurred while fetching the image.");
      setImage_url(default_image); // Fallback to default image on error
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <div className="ai-image-generator">
      <div className="header">
        AI Image <span>Generator</span>
      </div>

      <div className="img-loading">
        {loading ? (
          <div className="loading">Generating image...</div>
        ) : (
          <div className="image">
            {error ? (
              <div className="error-message">{error}</div>
            ) : (
              // Display the image based on the URL or default image
              <img
                src={image_url === "/" ? default_image : image_url}
                height="210px"
                alt="Generated"
                style={{ width: "100%", maxWidth: "500px", objectFit: "cover" }}
              />
            )}
          </div>
        )}
      </div>

      <div className="search-box">
        <input
          type="text"
          ref={inputRef}
          className="search-input"
          placeholder="Tell me what you want to generate"
        />
        <div className="generate-btn" onClick={imageGenerator}>
          Generate
        </div>
      </div>
    </div>
  );
};
