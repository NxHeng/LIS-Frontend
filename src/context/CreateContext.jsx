import React, { createContext, useContext, useState } from 'react';

const CreateContext = createContext();

export const CreateContextProvider = ({ children }) => {
  const [view, setView] = useState('newCase');

  // Side navigation
  const toNewCase = () => {
    console.log(view)
    setView('newCase');
  };

  const toTemplates = () => {
    setView('templates');
    console.log(view)
  };

  const toCategories = () => {
    setView('categories');
    console.log(view)
  };

  // TemplateList
  const toNewTemplate = () => {
    setView('newTemplate');
    console.log(view)
  };

  const toTemplateUpdate = () => {
    setView('templateUpdate');
    console.log(view)
  }

  // CategoryList
  const toNewCategory = () => {
    setView('newCategory');
    console.log(view)
  };

  const toCategoryUpdate = () => {
    setView('categoryUpdate');
    console.log(view)
  };

  return (
    <CreateContext.Provider value={{ view, toNewCase, toTemplates, toCategories, toNewTemplate, toTemplateUpdate, toNewCategory, toCategoryUpdate }}>
      {children}
    </CreateContext.Provider>
  );
};

export const useCreateContext = () => useContext(CreateContext);
