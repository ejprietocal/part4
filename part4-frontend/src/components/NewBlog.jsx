import { useState } from 'react'


const NewBlog = ({createdBlog}) =>{


    const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '', likes: 0 })

    const addNewBlog = (event) =>{
        event.preventDefault()
        createdBlog(newBlog)  
        setNewBlog({ title: '', author: '', url: '', likes: 0 })
    }


    return (
        <form onSubmit={addNewBlog}>
            <div>
                <label htmlFor="title">title:</label>
                <input 
                    type="text" 
                    name="title" 
                    id="title"
                    data-testid="title"
                    onChange={({target}) =>setNewBlog({...newBlog, title: target.value})} 
                    value={newBlog.title} 
                />
            </div>
            <div>
                <label htmlFor="author">author:</label>
                <input 
                    type="text" 
                    name="author" 
                    id="author"
                    data-testid="author"
                    onChange={({target}) => setNewBlog({ ...newBlog, author: target.value})} 
                    value={newBlog.author} 
                />
            </div>
            <div>
                <label htmlFor="url">url:</label>
                <input 
                    type="text" 
                    name="url" id="url"
                    data-testid="url"
                    onChange={({target}) => setNewBlog({...newBlog, url: target.value})}
                    value={newBlog.url} 
                />
            </div>

            <button type="submit" id='buttonSubmit'>Submit</button>
        </form>
    )
}

export default NewBlog