import axios from 'axios'
const baseUrl = '/api/blogs'


let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (newObject) => {
  console.log(baseUrl)
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, newObject) => {
  const formatedObject = {...newObject, user: newObject.user.id}
  let request = await axios.put(baseUrl + '/' + id, formatedObject)
  return request.data
}

const deleted = async(id) => {
  const config = {
    headers: { Authorization: token },
  }
  const deletedObject = await axios.delete(`${baseUrl}/${id}`, config)
  return deletedObject.data

}

export default {
  getAll, create, update, setToken, deleted
}