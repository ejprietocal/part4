import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'


describe('<Blog />', () =>{
    let container

    const mockHandler1 = vi.fn()
    const mockHandler2 = vi.fn()

    const blog = {
        title: 'this is title proff',
        author: 'ej prieto',
        url: 'ejprieto.com',
        likes: 0,
        user: 0
    }

    beforeEach( () => {
          container  = render(<Blog blog={blog} updatedBlog={mockHandler1} deletedBlog={mockHandler2} />).container
    }) 
    
    test('At start all info is not showed', () =>{
        const allInfo = container.querySelector('#allInfo')
        expect(allInfo).toHaveStyle('display: none')
    })
    test('after clicking the button, allInfo div is showed', async () =>{
        const user = userEvent.setup()
        const button = container.querySelector('#buttonShow')
        await user.click(button)

        const allInfo = container.querySelector('#allInfo')
        expect(allInfo).not.toHaveStyle('display: none')
    })
    test('after clicking 2 times it called the like fn 2 times' , async () =>{
        const user = userEvent.setup()
        const button = container.querySelector('#likeButton')
        
        await user.click(button)
        await user.click(button)

        expect(mockHandler1.mock.calls).toHaveLength(2)
    })

})
