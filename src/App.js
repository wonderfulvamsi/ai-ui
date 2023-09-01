import React from "react";
import "./App.css";
import DrawingCanvas from "./DrawingCanvas";
import { useState } from "react";
import axios from 'axios'
// import { generateUploadURL } from './s3.js'
import AWS from 'aws-sdk';


const predictionLink = "https://bscwyqul11.execute-api.ap-south-1.amazonaws.com/Final-Stage" //takes input
const preprocessingLink = "https://ms393dhz4b.execute-api.ap-south-1.amazonaws.com/Final-Stage" //takes img_url
function App() {
  const [answer, setAnswer] = useState("")
  const [show, setShow] = useState("none")
  const [url, setUrl] = useState("");

  const handlePredict = async()=>{
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (file) {
      try {
        // Configure the AWS SDK with your access keys and desired region
        AWS.config.update({
          accessKeyId: 'AKIAZPSHAPPYKW4RKASK',
          secretAccessKey: "e+L4UHqeJCUpR9b2CLiPEsNb9P/VfGw7lgH9wlmU",
          region: 'ap-south-1',
        });

        const s3 = new AWS.S3();

        const params = {
          Bucket: "ai-doodle-classifier",
          Key: file.name,
          Body: file
        };

        await s3.upload(params).promise()
        console.log('Upload successful');

        const response = await axios.get(preprocessingLink,{
          "img_url": "https://ai-doodle-classifier.s3.ap-south-1.amazonaws.com/"+ file.name
        }) 

        console.log(response.data)

        const prediction = await axios.post(predictionLink,{
          "input" : response.data["Pre Processed Image"]
        })
        console.log(prediction.data)
        setAnswer(prediction.data)
        setShow("block")

      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  }
    

  return (
    <div className="App">
      <h1 style={{marginBottom: 0}}>AI Doodle Classifier</h1>
      <p style={{marginTop: "1px"}}>Try drawing an animal or a vehicle or a food item!</p>
      <DrawingCanvas />
      <input type="file" accept="image/*" onChange={handleFileUpload} />
      <h2 style={{display: show}}>{answer}</h2>
    </div>
  );
}

export default App;
