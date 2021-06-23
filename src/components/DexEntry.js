import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import app from '../utils/Firebase';
import firebase from 'firebase';
import { AuthContext } from '../contexts/AuthContext';
import CatchButton from './DexEntryElements/CatchButton';
import Name from './DexEntryElements/Name';
import Type from './DexEntryElements/Type';

function DexEntry() {
  // Firestore query states
  const [caughtList, setCaughtList] = useState({});
  const [pokemonImage, setPokemonImage] = useState('');
  const [isCaught, setIsCaught] = useState(false);
  const [apiData, setAPIData] = useState(null);
  const [firstType, setFirstType] = useState('');
  const [secondType, setSecondType] = useState('');

  // getting the route's parameter
  // routeID for getting the pictures out of public
  const { id } = useParams();
  let routeID = 0;
  if (id < 10) {
    routeID = `00${id}`;
  } else if (id > 9 && id < 100) {
    routeID = `0${id}`;
  } else {
    routeID = `${id}`;
  }

  // getting the current logged in user from the Context
  const { currentUser } = useContext(AuthContext);

  const fetchFirestoreData = async () => {
    try {
      const db = app.firestore();
      let dbRef = db.collection('caughtPokemon').doc(currentUser.uid);

      const doc = await dbRef.get();
      const data = doc.data();
      const caughtList = data.caughtPokemonList;

      setCaughtList(caughtList);
      setIsCaught(caughtList[id].caught);
    } catch (error) {
      console.log('There has been an error: ', error);
    }
  };

  const getPokemonImage = async () => {
    const url = await app
      .storage()
      .ref()
      .child(`pokemonImages/${routeID}.png`)
      .getDownloadURL();

    setPokemonImage(url);
  };

  const getDetails = async () => {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
    setAPIData(response.data);
    if (response.data.types.length === 1) {
      setFirstType(response.data.types[0].type.name);
    } else {
      setFirstType(response.data.types[0].type.name);
      setSecondType(response.data.types[1].type.name);
    }
  };

  useEffect(() => {
    getPokemonImage();
    fetchFirestoreData();
    getDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.uid, id, routeID]);

  // // for api queries
  // if (isLoading) {
  //   return <h1>is Loading....</h1>;
  // }
  // if (isError) {
  //   return <h1>Errrrrooorrr</h1>;
  // }

  return (
    <div>
      {apiData && (
        <Name pokemonName={apiData.forms[0].name} number={routeID}>
          This will be pokemon number: {id}
        </Name>
      )}

      {isCaught === true ? <p>CAUGHT</p> : <p>NOT CAUGHT</p>}
      {firstType && <Type type={firstType} />}
      {secondType && <Type type={secondType} />}

      <img
        src={pokemonImage}
        // src={process.env.PUBLIC_URL + `/images/${routeID}.png`}
        alt={`Pokemon Number: ${id}`}
      />
      <CatchButton
        isCaught={isCaught}
        setIsCaught={setIsCaught}
        caughtList={caughtList}
        fetchFirestoreData={fetchFirestoreData}
        id={id}
      />
    </div>
  );
}

export default DexEntry;
