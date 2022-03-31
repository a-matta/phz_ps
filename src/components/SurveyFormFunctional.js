import React, { useEffect, useState } from "react";
import axios from "axios";

// Styling
import surveyFormStyles from "./surveyform.module.css";

// Icons
import { AiOutlineClose } from "react-icons/ai";
import { FaCircle } from "react-icons/fa";

export default function SurveyFormFunctional(props) {
  // Hooks
  const [choice, setChoice] = useState("");
  const [surveyResult, setSurveyResult] = useState("");
  const [message, setMessage] = useState("");
  const [country, setCountry] = useState("");
  const [ip, setIp] = useState("");
  const [browser, setBrowser] = useState("");
  const [platform, setPlatform] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [allData, setAllData] = useState({});

  // Functions

  const getData = async () => {
    if (ip === "") {
      // IP retrieval
      const res = await axios.get("https://geolocation-db.com/json/");
      // Browser Data
      const userAgentData = navigator.userAgentData;
      //
      const createdAt = new Date().toISOString();
      // Setting Data
      setIp(res.data.IPv4);
      setCountry(res.data.country_name);
      setBrowser(userAgentData.brands[2].brand);
      setPlatform(userAgentData.platform);
      setCreatedAt(createdAt);
    }
  };

  // Setting date 30 days from now for cookie expiration
  const futureDate = () => {
    let date = new Date();
    date.setDate(date.getDate() + 30);
    let expires = "expires=" + date.toUTCString();
    return expires;
  };

  const handleChoice = (option) => {
    setChoice(option);
    setRating(option);
    convertToScore(choice);
    let formDiv = document.getElementById("message");
    formDiv.style.display = "block";
    let formWrapperDiv = document.getElementById("formWrapper");
    formWrapperDiv.style.height = "40vh";
    getData();
    console.log("all handleChoice executed");
  };

  const handleClose = () => {
    let surveyFormDiv = document.getElementById("surveyform");
    surveyFormDiv.style.display = "none";
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleClose();
    // creating cookie
    document.cookie = `PromoterScore=${createdAt}; ${futureDate()}`;
    setAllData({
      choice: choice,
      surveyResult: surveyResult,
      message: message,
      country: country,
      ip: ip,
      browser: browser,
      platform: platform,
      createdAt: createdAt,
    });
    console.log("submit button working");
  };

  const convertToScore = (choice) => {
    let intChoice = parseInt(choice);
    let result = "";
    if (intChoice > 0 && intChoice <= 6) {
      result = "detractor";
    } else if (intChoice > 6 && intChoice <= 8) {
      result = "passive";
    } else {
      result = "promoter";
    }
    setSurveyResult(result);
  };
  // Checks for cookie existing on component loading
  const getCookie = (name) => {
    let dc = document.cookie;
    let prefix = name + "=";
    let begin = dc.indexOf("; " + prefix);
    let end;
    if (begin === -1) {
      begin = dc.indexOf(prefix);
      if (begin !== 0) return null;
    } else {
      begin += 2;
      end = document.cookie.indexOf(";", begin);
      if (end === -1) {
        end = dc.length;
      }
    }
    return decodeURI(dc.substring(begin + prefix.length, end));
  };

  useEffect(() => {
    if (getCookie("PromoterScore")) {
      handleClose();
    }
    setTimeout(() => {
      let surveyFormDiv = document.getElementById("surveyform");
      surveyFormDiv.style.transition = "all 1s";
      surveyFormDiv.style.opacity = 1;
    }, 1000);
    console.log(allData, hover, rating);
  }, [allData, hover, rating]);

  return (
    <div className={surveyFormStyles.container} id="surveyform">
      <h1 className={surveyFormStyles.notSupported}>Not Supported</h1>
      <div className={surveyFormStyles.surveyForm}>
        <button
          className={surveyFormStyles.closeButton}
          onClick={(event) => handleClose(event)}
        >
          <span className={surveyFormStyles.closeStyle}>
            <AiOutlineClose className={surveyFormStyles.closeIcon} />
          </span>
        </button>
        <div className={surveyFormStyles.mainHeading}>{props.question}</div>
        <div className={surveyFormStyles.gridContainer}>
          {[...Array(10)].map((circle, i) => {
            const ratingValue = i + 1;

            return (
              <div className="circle" key={ratingValue}>
                <button
                  className={surveyFormStyles.circle}
                  type="radio"
                  name="rating"
                  value={ratingValue}
                  onClick={(event) => handleChoice(ratingValue)}
                >
                  <p>{ratingValue}</p>

                  <FaCircle
                    color={
                      ratingValue <= (hover || rating) ? "#ed6930" : "skyblue"
                    }
                    size={50}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(null)}
                  />
                </button>
              </div>
            );
          })}
        </div>
        <div className={surveyFormStyles.formWrapper} id="formWrapper">
          <form className={surveyFormStyles.form} id="message">
            <textarea
              name="message"
              className={surveyFormStyles.message}
              placeholder="Please add some feedback"
              onChange={(event) => setMessage(event.target.value)}
            ></textarea>
            <button
              className={surveyFormStyles.submitButton}
              type="submit"
              onClick={(event) => handleSubmit(event)}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}