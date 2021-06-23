import React, { useState, useEffect } from 'react';
import axios from 'axios';
import app from '../utils/Firebase';
import { useQuery } from 'react-query';
import Spinner from './Spinner/Spinner';

const PokemonCard = ({ number, dateCaught, first }) => {
  const [firstType, setFirstType] = useState('');
  const [secondType, setSecondType] = useState('');
  const [pokemonImage, setPokemonImage] = useState(null);

  const { isLoading, error, data } = useQuery('queryDetails', () =>
    axios.get(`https://pokeapi.co/api/v2/pokemon/${number}`)
  );

  let pictureID;
  if (number < 10) {
    pictureID = `00${number}`;
  } else if (number > 9 && number < 100) {
    pictureID = `0${number}`;
  } else {
    pictureID = `${number}`;
  }

  const getDetails = async () => {
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${number}`
    );
    console.log(response.data.forms[0].name);
    if (response.data.types.length === 1) {
      setFirstType(response.data.types[0].type.name);
    } else {
      setFirstType(response.data.types[0].type.name);
      setSecondType(response.data.types[1].type.name);
    }
  };

  const getPokemonImage = async () => {
    const url = await app
      .storage()
      .ref()
      .child(`pokemonImages/${pictureID}.png`)
      .getDownloadURL();

    setPokemonImage(url);
  };

  useEffect(() => {
    getPokemonImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return <h1>Error: {error.message}</h1>;
  }
  if (isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      {first ? <p>Latest catch</p> : <p>Previous Catch</p>}
      {firstType && <p>{firstType}</p>}
      {secondType && <p>{secondType}</p>}
      <img
        width={20}
        src={pokemonImage}
        // src={process.env.PUBLIC_URL + `/images/${routeID}.png`}
        alt={`Pokemon Number: ${pictureID}`}
      />
      <p>number: #{pictureID}</p>
      <p>
        I was caught at:
        {dateCaught.toDate().toString().substring(4, 15)}
      </p>
      <button onClick={getDetails}>get Details</button>
    </div>
  );
};

export default PokemonCard;
