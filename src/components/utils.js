import React from 'react';

export function AppLogo() {
  return (
    <h4>medicus</h4>
  );
}


export const checkErrors = (response) => {
  if (!response.ok) {
    try {
      return response.json().then(jsonData => {throw new Error(jsonData.message)});
    } catch (error) {
      throw new Error(response.statusText);
    }
  }
}
