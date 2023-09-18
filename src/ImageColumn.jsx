import React from 'react';
import './ImageColumn.css'; // Create a CSS file for styling (ImageColumn.css)

const ImageColumn = () => {
  return (
    <div className="image-column">
      <img src={require('./image1.jpg')} alt="Image 1" className="image" />
      <img src={require('./image2.jpg')} alt="Image 2" className="image" />
      <img src={require('./image3.jpg')} alt="Image 3" className="image" />
      <img src={require('./image4.jpg')} alt="Image 4" className="image" />
      <img src={require('./image5.jpg')} alt="Image 5" className="image" />
    </div>
  );
};

export default ImageColumn;
