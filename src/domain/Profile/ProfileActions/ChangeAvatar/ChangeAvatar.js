import React, { useContext, useRef } from 'react';
import { AuthContext } from '../../../../contexts/AuthContext';
import { ModalContext } from '../../../../contexts/ModalContext';
import app from '../../../../utils/Firebase';
import { ActionWrapper, Wrapper, FileInput, Button } from './styles/styles';

function ChangeAvatar() {
  const { currentUser } = useContext(AuthContext);
  const { setModalContent, setShowModal } = useContext(ModalContext);
  const hiddenFileInput = useRef(null);

  const handleClick = (e) => {
    hiddenFileInput.current.click();
  };

  const onFileInput = async (e) => {
    try {
      const file = e.target.files[0];
      const storageRef = app.storage().ref().child('userImages');
      const fileRef = storageRef.child(file.name);
      await fileRef.put(file);

      const url = await fileRef.getDownloadURL();

      await currentUser.updateProfile({
        photoURL: url,
      });
      setModalContent(<>Your Avatar Image has been updated!</>);
      setShowModal(true);
    } catch {
      setModalContent(
        <>
          There has been an issue with the Avatar change. Please relog and try
          again.
        </>
      );
      setShowModal(true);
    }
  };

  const restoreDefaultImage = async () => {
    try {
      await currentUser.updateProfile({
        photoURL: null,
      });

      setModalContent(<>Your Avatar Image has been updated to the default!</>);
      setShowModal(true);
    } catch (error) {
      setModalContent(
        <>
          There has been an issue with the Avatar change. Please relog and try
          again.
        </>
      );
      setShowModal(true);
    }
  };
  return (
    <Wrapper>
      <ActionWrapper>
        <FileInput ref={hiddenFileInput} type="file" onChange={onFileInput} />
        <Button onClick={handleClick}>Choose File</Button>
        <Button isBottom="true" onClick={restoreDefaultImage}>
          Delete My Picture
        </Button>
      </ActionWrapper>
    </Wrapper>
  );
}

export default ChangeAvatar;
