import { useState } from "react"
import PropTypes from 'prop-types'


const Blog = ({ blog, updatedBlog, deletedBlog, getUser }) => {

  const [visible, setVisible] = useState(false)
  const showWhenVisible = { display: visible ? '' : 'none' }


  const updateBlog = () =>{
    updatedBlog(blog)
  }

  const deleteBlog = () =>{
    deletedBlog(blog)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  console.log(blog)
  const proper = blog.user.id === getUser.id ? true : false

  return (
    <div style={blogStyle}>
      <div>
        <span>Title: {blog.title}</span><button id="buttonShow" testid='buttonShow' onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      <div style={showWhenVisible} id="allInfo">
        <p>likes: {blog.likes} <button  id="likeButton" onClick={updateBlog}>Like</button></p>
        <p>Author: {blog.author}</p>
        <p>Url: {blog.url}</p>
        {proper && <button onClick={deleteBlog}>delete</button>}
      </div>
    </div>  
  )
}

Blog.PropTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.string,
    url: PropTypes.string
  }).isRequired,
  updateBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired
}

export default Blog