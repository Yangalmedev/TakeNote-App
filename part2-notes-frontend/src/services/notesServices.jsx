//Separate module for axios services

import axios from "axios"; 

const baseUrl = '/api/notes';

const getAll = () => {
  const request = axios.get(baseUrl)
  // This object varable is just an example for debuging errors. A hardcoded object rendering to the UI.
  const unsave = {
    id: 'jjdg',
    content: 'This is not save to server',
    important: true
  }
  return request.then(response => response.data.concat(unsave))
}

const create = note => {
  const request = axios.post(baseUrl, note)
  return request.then(response => response.data)
}

const update = (id, changedNote) => {
  const request = axios.put(`${baseUrl}/${id}`, changedNote)
  return request.then(response => response.data)
}

const remove = (id) => {
  return axios.delete(`http://localhost:3001/api/notes/${id}`)
}

export default { getAll, create, update, remove }