import { test, expect } from '@playwright/test'

test.describe('Lumidot', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('default render', () => {
    test('renders the component', async ({ page }) => {
      await expect(page.getByTestId('default')).toBeVisible()
    })

    test('has correct data attributes', async ({ page }) => {
      const el = page.getByTestId('default')
      await expect(el).toHaveAttribute('data-lumidot', '')
      await expect(el).toHaveAttribute('data-lumidot-pattern', 'all')
      await expect(el).toHaveAttribute('data-lumidot-variant', 'blue')
      await expect(el).toHaveAttribute('data-lumidot-direction', 'ltr')
      await expect(el).toHaveAttribute('data-lumidot-mode', 'wave')
    })

    test('has accessibility attributes', async ({ page }) => {
      const el = page.getByTestId('default')
      await expect(el).toHaveAttribute('role', 'status')
      await expect(el).toHaveAttribute('aria-label', 'Loading')
    })

    test('renders exactly 9 dots', async ({ page }) => {
      const dots = page.getByTestId('default').locator('[data-lumidot-dot]')
      await expect(dots).toHaveCount(9)
    })

    test('all 9 dots are active for the "all" pattern', async ({ page }) => {
      const activeDots = page.getByTestId('default').locator('[data-lumidot-dot-active="true"]')
      await expect(activeDots).toHaveCount(9)
    })
  })

  test.describe('variant', () => {
    test('sets the variant attribute', async ({ page }) => {
      await expect(page.getByTestId('variant-amber')).toHaveAttribute('data-lumidot-variant', 'amber')
    })
  })

  test.describe('pattern', () => {
    test('sets the pattern attribute', async ({ page }) => {
      await expect(page.getByTestId('pattern-spiral')).toHaveAttribute('data-lumidot-pattern', 'spiral')
    })

    test('multi-frame patterns use sequence mode', async ({ page }) => {
      await expect(page.getByTestId('pattern-spiral')).toHaveAttribute('data-lumidot-mode', 'sequence')
      await expect(page.getByTestId('pattern-corners-only')).toHaveAttribute('data-lumidot-mode', 'sequence')
    })

    test('single-frame patterns use wave mode', async ({ page }) => {
      await expect(page.getByTestId('default')).toHaveAttribute('data-lumidot-mode', 'wave')
    })

    test('line-h-top activates 3 dots', async ({ page }) => {
      const activeDots = page.getByTestId('pattern-line-h-top').locator('[data-lumidot-dot-active="true"]')
      await expect(activeDots).toHaveCount(3)
    })
  })

  test.describe('direction', () => {
    test('sets the direction attribute', async ({ page }) => {
      await expect(page.getByTestId('direction-rtl')).toHaveAttribute('data-lumidot-direction', 'rtl')
    })
  })

  test.describe('scale', () => {
    test('default scale renders at 20px', async ({ page }) => {
      const box = await page.getByTestId('default').boundingBox()
      expect(box?.width).toBeCloseTo(20, 0)
      expect(box?.height).toBeCloseTo(20, 0)
    })

    test('scale=2 doubles the size to 40px', async ({ page }) => {
      const box = await page.getByTestId('scale-2').boundingBox()
      expect(box?.width).toBeCloseTo(40, 0)
      expect(box?.height).toBeCloseTo(40, 0)
    })
  })
})
