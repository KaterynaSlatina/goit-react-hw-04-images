import React, { useEffect, useState, useCallback } from 'react';
import { SearchBar } from './SearchBar/SearchBar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { fetchImage } from 'FetchApi';
import { Loader } from './Loader/Loader';
import { Button } from './Button/Button';
import { Modal } from './Modal/Modal';

export const App = () => {
  const [inputData, setInputData] = useState('');
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [error, setError] = useState('');

  const getImages = useCallback(async () => {
    if (!inputData) {
      return;
    }
    setIsLoading(true);
    try {
      const { hits, total } = await fetchImage(inputData, page);
      if (total) {
        setItems(prevState => [...prevState, ...hits]);
      }
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [inputData, page]);

  const formSubmit = newInputData => {
    if (newInputData !== inputData) {
      setInputData(newInputData);
      setPage(1);
      setItems([]);
    }
  };

  useEffect(() => {
    if (inputData) {
      getImages();
    }
  }, [inputData, page, getImages]);

  const handleClick = () => {
    setPage(prev => prev.page + 1);
  };

  const handleImageClick = imageUrl => {
    setModalImage(imageUrl);
    setIsShowModal(true);
  };

  const handleCloseModal = () => {
    setIsShowModal(false);
    setModalImage('');
  };

  return (
    <>
      <SearchBar onSubmit={formSubmit} />
      <ImageGallery items={items} onImageClick={handleImageClick} />

      {isLoading && <Loader />}
      {error && <h1>{error}</h1>}
      {items.length > 0 && !isLoading && <Button onClick={handleClick} />}
      {isShowModal && (
        <Modal
          isOpenModal={isShowModal}
          item={modalImage}
          onCloseModal={handleCloseModal}
        />
      )}
    </>
  );
};
