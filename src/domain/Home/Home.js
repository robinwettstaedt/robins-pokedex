import React, { useContext, useEffect, useState } from 'react';
import app from '../../utils/Firebase';
import { AuthContext } from '../../contexts/AuthContext';
import PokemonCard from './PokemonCard/PokemonCard';
import {
  Wrapper,
  CardWrapper,
  Heading,
  Button,
  BottomSpacer,
  SpacerDot,
  EmptyWrapper,
} from './styles/styles';
import { ModalContext } from '../../contexts/ModalContext';

const Home = () => {
  const { currentUser } = useContext(AuthContext);
  const [initialCards, setInitialCards] = useState(null);
  const [additionalCards, setAdditionalCards] = useState(null);
  const [renderAdditional, setRenderAdditional] = useState(false);
  const { setModalContent, setShowModal } = useContext(ModalContext);

  const createPokemonList = () => {
    let numbersObj = {};
    for (let i = 1; i < 152; i++) {
      numbersObj[`${i}`] = { caught: false };
    }
    return numbersObj;
  };

  const loadAdditionalCards = () => {
    setRenderAdditional(true);
  };

  useEffect(() => {
    const addNewUserFirestoreEntry = async () => {
      try {
        const db = app.firestore();
        let dbRef = db.collection('caughtPokemon').doc(currentUser.uid);

        const doc = await dbRef.get();
        const data = doc.data();

        // creating the firestore entry if the user does not have one already
        if (!data) {
          let list = createPokemonList();
          let pokemonRef = app.firestore().collection('caughtPokemon');
          pokemonRef.doc(currentUser.uid).set({
            uid: currentUser.uid,
            caughtPokemonList: list,
          });
          setModalContent(
            <>
              Hello and welcome! Please install this Progressive Web App on your
              mobile device via the installation prompt for the best experience!
              <br />
              <br />
              You can change your Username and Avatar Image in the profile
              section and mark Pokémon as caught. Have fun!
            </>
          );
          setShowModal(true);
        }

        // logic for the displaying of caught pokemon by date
        let catchesArray = [];

        for (let entry in data.caughtPokemonList) {
          if (data.caughtPokemonList[entry].caught === true) {
            let obj = {};
            obj['number'] = parseInt(entry);
            obj['caughtAt'] = data.caughtPokemonList[entry].caughtAt;
            catchesArray.push(obj);
          }
        }

        catchesArray.sort((a, b) => {
          return b.caughtAt.toDate() - a.caughtAt.toDate();
        });

        let firstSixComponents = [];
        let additionalComponents = [];

        for (let i = 0; i < catchesArray.length; i++) {
          if (i === 0) {
            firstSixComponents.push(
              <PokemonCard
                number={catchesArray[i].number}
                dateCaught={catchesArray[i].caughtAt}
                first={true}
              />
            );
          } else if (i < 6) {
            firstSixComponents.push(
              <PokemonCard
                number={catchesArray[i].number}
                dateCaught={catchesArray[i].caughtAt}
                first={false}
              />
            );
          } else {
            additionalComponents.push(
              <PokemonCard
                number={catchesArray[i].number}
                dateCaught={catchesArray[i].caughtAt}
                first={false}
              />
            );
          }
        }
        setInitialCards(firstSixComponents);
        setAdditionalCards(additionalComponents);
      } catch (error) {
        console.log('There has been an error: ', error);
      }
    };

    addNewUserFirestoreEntry();
  }, [currentUser.uid, setShowModal, setModalContent]);

  return (
    <Wrapper>
      <Heading>Your Catches</Heading>
      <CardWrapper>
        {initialCards && initialCards.length === 0 && (
          <EmptyWrapper>You haven't caught any Pokemon yet!</EmptyWrapper>
        )}
        {!initialCards && (
          <EmptyWrapper>You haven't caught any Pokemon yet!</EmptyWrapper>
        )}

        {initialCards &&
          initialCards.map((Component, key) => (
            <div key={key}>{Component}</div>
          ))}

        {renderAdditional &&
          additionalCards &&
          additionalCards.map((Component, key) => (
            <div key={key}>{Component}</div>
          ))}

        {additionalCards &&
          additionalCards.length !== 0 &&
          !renderAdditional && (
            <Button onClick={loadAdditionalCards}>Load More</Button>
          )}

        {initialCards && initialCards.length !== 0 && (
          <BottomSpacer>
            <SpacerDot />
          </BottomSpacer>
        )}
      </CardWrapper>
    </Wrapper>
  );
};

export default Home;
