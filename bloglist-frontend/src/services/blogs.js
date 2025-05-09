import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
  console.log('I set a token!')
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (newObject) => {
  const config = {
    headers: {Authorization: token }
  }
  const response = await axios.post(baseUrl, newObject, config)
  console.log('I posted!')
  return response.data
}

const likeBlog = async (id, blogObject) => {
  const url = `${baseUrl}/${id}`

  const config = {
    headers: {Authorization: token }
  }

  const response = await axios.put(url, blogObject, config)
  return response.data
}

const remove = async (id) => {
  const url = `${baseUrl}/${id}`

  const config = {
    headers: {Authorization: token }
  }

  const response = await axios.delete(url, config)
  return response.data

  
  }

export default { getAll, create, setToken, likeBlog, remove }