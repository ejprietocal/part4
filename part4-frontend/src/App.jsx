import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Login from './components/Login'
import NewBlog from './components/NewBlog'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Toggable'
import { jwtDecode } from "jwt-decode";


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState({})
  const [user, setUser] = useState(null)
  const [userInfo, setUserInfo] = useState(null);
  const blogFormRef = useRef()
  const loginFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a,b) => { return a.likes - b.likes}) )
    )
  }, [])

  // console.log(blogs)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogger')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const getUserlogged = () => {
    const token = localStorage.getItem('loggedBlogger');
  
    if (!token) {
      console.error('No token found in localStorage.');
      return null;
    }
    try {

      return jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };


  const handleLogOut = () => {
    window.localStorage.removeItem('loggedBlogger')
    setUser(null)
  }

  const handleNewBlog = async (blogObject) => {
    const newBlogResponse = await blogService.create(blogObject)

    const message = {
      message: `a new blog ${blogObject.title} by ${blogObject.author} was created`,
      className: 'success'
    }

    setBlogs(blogs.concat(newBlogResponse))
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, 5000)

  }

  const handleUpdating = async(blogObject) => {
    const newBlog = { ...blogObject, likes: blogObject.likes + 1 }
    console.log(newBlog)
    const blogForUpdate = await blogService.update(blogObject.id,newBlog)
    const blogsUpdates = blogs.map(blog => blog.id === blogForUpdate.id ? { ...blog, likes: blogForUpdate.likes } : blog)
    setBlogs(blogsUpdates.sort((a,b) => { return a.likes - b.likes}))
  }

  const handleDelete = async(blogObject) => {

    const confirm = window.confirm(`remove blog ${blogObject.title} by ${blogObject.author}`)

    if(confirm){
      const blogDeleted = await blogService.deleted(blogObject.id)
      setBlogs(blogs.filter(blog => blog.id !== blogDeleted.id))
    }

  }
  const handleLogin = async ({ username,password }) => {
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogger', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      const message = {
        message: 'User or password incorrect',
        className: 'error'
      }
      setNotification(message)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }


  const loginForm  = () => (
    <Togglable buttonLabel='log in' ref={loginFormRef} >
      <Notification message={notification} />
      <Login loginEntered={handleLogin}/>
    </Togglable>
  )

  const dataForm = () => (
    <>
      <h2>blogs</h2>
      <div>{user.name} logged-in <button onClick={() => handleLogOut()}> Log out</button> </div>
      <Notification message={notification} />
      <h2>Create a new</h2>

      <Togglable buttonLabel='Create' ref={blogFormRef}>
        <NewBlog createdBlog={handleNewBlog} />
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} updatedBlog={handleUpdating} getUser={getUserlogged()} deletedBlog={handleDelete} />
      )}
    </>
  )

  return (
    <div>
      {user === null ? loginForm() : dataForm()}
    </div>
  )
}

export default App