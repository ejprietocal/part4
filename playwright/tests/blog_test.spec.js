const { test, expect, beforeEach, describe } = require('@playwright/test')
const {loginWith, createBlog} = require('./helper')

describe('Blog app', () => {

  beforeEach(async ({ page, request }) => {
    await request.post('/api/tests/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await request.post('/api/users', {
      data: {
        name: 'Eider Prieto',
        username: 'ejprieto',
        password: 'locarios'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
      const locator = await page.getByText('log in')
      await expect(locator).toBeVisible()
  })


  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged-in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'typedwrong')
      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('User or password incorrect')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })
  
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, {author: 'proff of author', title: 'the rainbow mistery', url: 'https://example.com'})
      const titleLocator = page.getByText('Title: the rainbow mistery');  // Localiza el texto directamente
      await expect(titleLocator).toBeVisible();
    })
  })

  describe('Edditing blog',  () =>{
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await createBlog(page, {author: 'proff of author', title: 'the rainbow mistery', url: 'https://example.com'})
      
    })

    test('Click on like', async({page})=>{
      await page.getByRole('button', {name: 'view'}).click(); 
      await page.getByRole('button', {name: 'Like'}).click(); 
      const likes = page.getByText('likes: 1');
      await expect(likes).toBeVisible();
    })
  })

  describe('Deleting blog',  () =>{
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await createBlog(page, {author: 'proff of author', title: 'the rainbow mistery', url: 'https://example.com'})
    })

    test('click on delete', async({page}) =>{
      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', {name: 'view'}).click(); 
      await page.getByRole('button', {name: 'delete'}).click();
      await expect(page.getByText('Title: the rainbow mistery')).toBeHidden()
    })
  })

  describe('Deleting button visibility',  () =>{
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await createBlog(page, {author: 'proff of author', title: 'the rainbow mistery', url: 'https://example.com'})
      await page.getByRole('button', {name: 'Log out'}).click(); 
      await loginWith(page, 'ejprieto', 'locarios')
    })

    test('searching delete button',  async({page}) =>{
      await page.getByRole('button', {name: 'view'}).click(); 
      await expect(page.getByRole('button', {name: 'delete'})).toBeHidden()
    })

  })
})