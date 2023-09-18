import React from "react";
import "./App.css";
import DrawingCanvas from "./DrawingCanvas";
import { useState } from "react";
import axios from 'axios'
import AWS from 'aws-sdk';

import {FaCat} from 'react-icons/fa'
import {PiFlowerFill} from 'react-icons/pi'
import {BsFillCupHotFill} from 'react-icons/bs'
import {FaCarSide} from 'react-icons/fa'
import {BsFillSunFill} from 'react-icons/bs'
import {BsFillMoonFill} from 'react-icons/bs'
import {FaStar} from 'react-icons/fa'
import {PiButterflyFill} from 'react-icons/pi' 
import {BiSolidCake} from 'react-icons/bi'
import {FaAppleWhole} from 'react-icons/fa6'

import car from './car.jpeg'
import apple from './apple.jpeg'
import cat from './cat.jpeg'
import flower from './flower.jpeg'
import cup from './cup.jpeg'
import fly from './fly.jpeg'
import sun from './sun.jpeg'
import star from './star.jpeg'
import moon from './moon.jpeg'
import cake from './cake.jpeg'
 
const predictionLink = "https://6r2hri1bqj.execute-api.ap-south-1.amazonaws.com/Final-Stage" //takes input
const preprocessingLink = "https://i9am95hi8b.execute-api.ap-south-1.amazonaws.com/Final-Stage" //takes img_url
function App() {
  const [answer, setAnswer] = useState("")
  const [show, setShow] = useState("none")

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (file) {
      try {
        // Configure the AWS SDK with your access keys and desired region
        AWS.config.update({
          accessKeyId: "AKIAQ7QIZFXUSKB2NOI7", 
          secretAccessKey: "VXXZwA3G4uEXzIaKfOzkXoVsn4thxs8aKVWd3rGs",
          region: 'ap-south-1',
        });

        const s3 = new AWS.S3();

        const params = {
          Bucket: "doodlez",//"ai-doodle-classifier",
          Key: file.name,
          Body: file
        };

        await s3.upload(params).promise()
        console.log('Upload successful');

        const response = await axios.post(preprocessingLink,{
          img_url: "https://doodlez.s3.ap-south-1.amazonaws.com/"+ file.name
        }) 

    
        const processedImg = JSON.parse(response.data.body)

        console.log(processedImg["Pre Processed Image"])
        const prediction = await axios.post(predictionLink,{
          input : processedImg["Pre Processed Image"]
        })
        console.log(prediction.data.prediction)
        setAnswer(prediction.data.prediction)
        setShow("block")

      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  }

  const iconStyle = {
    marginLeft: '10px', // Adjust the margin as needed
  };
    

  return (
    <div className="App">
      <h1 style={{marginBottom: 0, marginTop:"5px"}}>AI Doodle Classifier</h1>
      <p style={{marginTop: "1px"}}>Try drawing any of the following & upload the image</p>
      <div>
      <p style={{margin:0}}> 
        <span style={iconStyle}><BsFillSunFill /></span> Sun,
        <span style={iconStyle}><BsFillMoonFill /></span> Moon,
        <span style={iconStyle}><FaStar /></span> Star,
        <span style={iconStyle}><PiFlowerFill /></span> Flower,
        <span style={iconStyle}><FaCat /></span> Cat,
        <span style={iconStyle}><PiButterflyFill /></span> Butterfly,
        <span style={iconStyle}><FaCarSide /></span> Car,
        <span style={iconStyle}><BsFillCupHotFill /></span> Cup,
        <span style={iconStyle}><BiSolidCake /></span> Cake,
        <span style={iconStyle}><FaAppleWhole /></span> Apple
        <br/>
        (Note: Draw as big as possible to fill the box)
      </p>
    </div>
      <div className="horizontal-container">
      <div className="img-col">
        <img src={star}/>
        <img src={car}/>
        <img src={moon}/>
        <img src={fly}/>
      </div>
      <DrawingCanvas />
      <div className="img-col">
        <img src={cake}/>
        <img src={flower}/>
        <img src={cat}/>
        <img src={sun}/>
      </div>
      </div>
      <input type="file" accept="image/*" onChange={handleFileUpload} />
      {
        answer?<h2>Is that a {answer}?</h2>:<h2>Lemme Guess..</h2>
      }
    </div>
  );
}

export default App;
