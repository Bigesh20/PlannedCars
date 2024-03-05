import React, { useState } from "react";
import axios from "axios";

function CopyMapComp () {
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const handleChange = async (event) => {
        const value = event.target.value;
        setInput(value);

        try{
        const response = await axios.get('http://localhost:3000/api/places', {
            params: {
                input: value
            }
        });
        setSuggestions(response.data.predictions)
        }
        catch(error) {
            console.error('Error fetching suggestions', error)
        }
    };
        const handleSelect = (suggestion) => {
            setInput(suggestion.description);
            setSuggestions([]);
        }
    return(
    <div>
        <h1>Places</h1>
        <label>Current Location: 
        <input 
        type="text" 
        value={input} 
        onChange={handleChange}
        placeholder="type current location" />
        </label>
        <ul>
            {suggestions.map((suggestion, index) => (
                <li key={index} onClick={() => handleSelect(suggestion)}>
                {suggestion.description}
                </li>
            ))}
        </ul>
    </div>
    )
};

export default CopyMapComp;