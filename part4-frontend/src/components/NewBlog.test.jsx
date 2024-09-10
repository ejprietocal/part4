import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewBlog from './NewBlog'

describe('<NewBlog />' , () =>{

    let container
    const mockHandler = vi.fn()

    beforeEach( () =>{
        container = render(<NewBlog createdBlog={mockHandler} />).container
    })
    
    test('after submit a new blog we make a callback to the creator fn', async () =>{
        const user = userEvent.setup()
        const button = container.querySelector('#buttonSubmit')

        await user.click(button)
        expect(mockHandler.mock.calls).toHaveLength(1)

    })
})