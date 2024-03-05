// React component
import React, { useState } from 'react';
import axios from 'axios';

function MapComponent() {
  const [originInput, setOriginInput] = useState('');
  const [destinationInput, setDestinationInput] = useState('');
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [distance, setDistance] = useState('');
  const [petrolPrice, setPetrolPrice] = useState(null);
  const [dieselPrice, setDieselPrice] = useState(null);

  const calculateDistance = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/directions', {
        params: {
          origin: originInput,
          destination: destinationInput
        }
      });
      setDistance(response.data.distance);
    } catch (error) {
      console.error('Error calculating distance:', error);
    }
  };

  const fetchFuelPrices = async (cityId) => {
    try {
      const response = await axios.get('http://localhost:3000/api/fuel/prices', {
        params: {
          cityId
        }
      });
      setPetrolPrice(response.data.data.fuelPrice.petrol);
      setDieselPrice(response.data.data.fuelPrice.diesel);
    } catch (error) {
      console.error('Error fetching fuel prices:', error);
    }
  };


  const handleOriginChange = async event => {
    const value = event.target.value;
    setOriginInput(value);

    try {
      const response = await axios.get('http://localhost:3000/api/places/origin', {
        params: {
          input: value
        }
      });
      setOriginSuggestions(response.data.predictions);
    } catch (error) {
      console.error('Error fetching suggestions for origin:', error);
    }
  };

  const handleDestinationChange = async event => {
    const value = event.target.value;
    setDestinationInput(value);

    try {
      const response = await axios.get('http://localhost:3000/api/places/destination', {
        params: {
          input: value
        }
      });
      setDestinationSuggestions(response.data.predictions);
    } catch (error) {
      console.error('Error fetching suggestions for destination:', error);
    }
  };

  const handleOriginSelect = suggestion => {
    setOriginInput(suggestion.description);
    setOriginSuggestions([]); // Clear suggestions

    // Now you can access the city ID from suggestion.cityId
    const cityId = suggestion.cityId;
    console.log('Selected origin city ID:', cityId);

    // Fetch fuel prices based on the selected city ID
    fetchFuelPrices(cityId);
  };
  const handleDestinationSelect = suggestion => {
    setDestinationInput(suggestion.description);
    setDestinationSuggestions([]); // Clear suggestions
  };

  return (
    <div>
      <label>Origin: 
        <input
          type="text"
          value={originInput}
          onChange={handleOriginChange}
          placeholder="Enter origin"
        />
      </label>
      <ul>
        {originSuggestions.map((suggestion, index) => (
          <li key={index} onClick={() => handleOriginSelect(suggestion)}>
            {suggestion.description}
          </li>
        ))}
      </ul>
      <label>Destination: 
        <input
          type="text"
          value={destinationInput}
          onChange={handleDestinationChange}
          placeholder="Enter destination"
        />
      </label>
      <ul>
        {destinationSuggestions.map((suggestion, index) => (
          <li key={index} onClick={() => handleDestinationSelect(suggestion)}>
            {suggestion.description}
          </li>
        ))}
      </ul>
      <br />
      <button onClick={calculateDistance}>Calculate Distance</button>
      {distance && <p>Distance: {distance}</p>}
      {petrolPrice && <p>Petrol Price: {petrolPrice}</p>}
      {dieselPrice && <p>Diesel Price: {dieselPrice}</p>}
    </div>
  );
}

export default MapComponent;
