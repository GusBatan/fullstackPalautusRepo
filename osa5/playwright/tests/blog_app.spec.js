const { test, expect, beforeEach, describe } = require('@playwright/test');
const { after } = require('node:test');

let token;

test.describe.serial('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3003/api/testing/reset');
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen',
      },
    });

    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Simo Häyhä',
        username: 'peruna',
        password: 'peruna',
      },
    });
    await page.goto('http://localhost:5173');
  });

  test('Login form is shown', async ({ page }) => {
    const loginButton = page.getByText('Login');
    await expect(loginButton).toBeVisible();
  });
  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('mluukkai');
      await page.getByRole('textbox').last().fill('salainen');
      await page.getByRole('button', { name: 'login' }).click();

      await expect(
        page.getByText('Matti Luukkainen has logged in')
      ).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('mluukai');
      await page.getByRole('textbox').last().fill('salanen');
      await page.getByRole('button', { name: 'login' }).click();

      await expect(
        page.getByText('Matti Luukkainen has logged in')
      ).not.toBeVisible();
      await expect(
        page.getByText('Error: No username or password')
      ).not.toBeVisible();
    });
  });
  describe('When logged in', () => {
    test('a new blog can be created, liked and deleted', async ({ page }) => {
      await page.getByRole('textbox').first().fill('mluukkai');
      await page.getByRole('textbox').last().fill('salainen');
      await page.getByRole('button', { name: 'login' }).click();
      await page.getByRole('button', { name: 'new blog' }).click();
      await page.getByRole('textbox').nth(0).fill('Test Title');
      await page.getByRole('textbox').nth(1).fill('Test Author');
      await page.getByRole('textbox').nth(2).fill('Test URL');
      await page.getByRole('button', { name: 'create' }).click();
      await expect(page.getByText('Test Title by Test Author')).toBeVisible();
      await expect(
        page.getByText(
          'A new blog "Test Title" by Test Author added with url Test URL'
        )
      ).toBeVisible();
      await page.getByText('Test Title by Test Author').click();
      await expect(page.getByText('Blog URL: Test URL')).toBeVisible();
      await expect(page.getByText('Likes: 0')).toBeVisible();
      await page.getByRole('button', { name: 'like' }).click();
      await expect(page.getByText('Likes: 1')).toBeVisible();
      await page.getByRole('button', { name: 'delete' }).click();

      page.on('dialog', async (dialog) => {
        await dialog.accept();
      });
      await page.getByRole('button', { name: 'delete' }).click();
      await expect(
        page.getByText('Test Title by Test Author')
      ).not.toBeVisible();
    });

    test('Delete button is not visible to Simo Häyhä', async ({ page }) => {
      await page.getByRole('textbox').first().fill('mluukkai');
      await page.getByRole('textbox').last().fill('salainen');
      await page.getByRole('button', { name: 'login' }).click();
      await expect(
        page.getByText('Matti Luukkainen has logged in')
      ).toBeVisible();
      await page.getByRole('button', { name: 'new blog' }).click();
      await page.getByRole('textbox').nth(0).fill('Test Title');
      await page.getByRole('textbox').nth(1).fill('Test Author');
      await page.getByRole('textbox').nth(2).fill('Test URL');
      await page.getByRole('button', { name: 'create' }).click();
      await expect(page.getByText('Test Title by Test Author')).toBeVisible();
      await expect(
        page.getByText(
          'A new blog "Test Title" by Test Author added with url Test URL'
        )
      ).toBeVisible();
      await page.getByText('Test Title by Test Author').click();
      await expect(page.getByText('delete')).toBeVisible();
      await page.getByRole('button', { name: 'logout' }).click();
      await expect(page.getByText('Login')).toBeVisible();
      await page.getByRole('textbox').first().fill('peruna');
      await page.getByRole('textbox').last().fill('peruna');
      await page.getByRole('button', { name: 'login' }).click();
      await page.getByText('Test Title by Test Author').click();
      await expect(
        page.getByRole('button', { name: 'delete' })
      ).not.toBeVisible();
    });
    test('Blogs are sorted by number of likes', async ({ page }) => {
      await page.getByRole('textbox').first().fill('mluukkai');
      await page.getByRole('textbox').last().fill('salainen');
      await page.getByRole('button', { name: 'login' }).click();
    });
  });
});

test.describe.serial('Testing blog app sorting', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3003/api/testing/reset');

    await page.goto('http://localhost:5173');
  });
  test('Blogs are sorted by number of likes', async ({ page, request }) => {
    const response = await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Bloggi blogilainen',
        username: 'simo',
        password: 'salainen',
      },
    });

    const token = (await response.json()).token;
    expect(token).toBeDefined();
    
    const createBlogResponse = async (likes) =>
      await request.post('http://localhost:3003/api/blogs', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          title: `Test blog ${likes}`,
          author: `Test author ${likes}`,
          url: `Test url ${likes}`,
          likes: likes,
        },
      });

    createBlogResponse(68);

    for (let index = 0; index < 10; index++) {
      createBlogResponse(index);
    }
    
    await page.getByRole('textbox').first().fill('simo');
    await page.getByRole('textbox').last().fill('salainen');
    await page.getByRole('button', { name: 'login' }).click();
    await expect(
      page.getByText('Bloggi blogilainen has logged in')
    ).toBeVisible();

    const blogTitles = await page.$$eval('.toggleVisibility', (elements) =>
      elements.map((el) => el.textContent)
    );

    for (let i = 0; i < blogTitles.length - 1; i++) {
      const currentLikes = parseInt(blogTitles[i].match(/Test blog (\d+)/)[1]);
      const nextLikes = parseInt(blogTitles[i + 1].match(/Test blog (\d+)/)[1]);
      expect(currentLikes).toBeGreaterThanOrEqual(nextLikes);
    }
  });
});
