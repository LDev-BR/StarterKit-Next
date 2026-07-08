import { expect, test, type Page } from '@playwright/test';

async function expectNoFrameworkOverlay(page: Page) {
  await expect(page.locator('[data-nextjs-dialog-overlay]')).toHaveCount(0);
  await expect(page.getByText(/Unhandled Runtime Error|Application error|Build Error/i)).toHaveCount(0);
}

async function expectPageAtTop(page: Page) {
  await expect.poll(async () => page.evaluate(() => window.scrollY)).toBe(0);
}

test('validates the main frontend flows without framework errors', async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });
  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });

  await page.goto('/');

  await expect(page).toHaveTitle(/Frontend Starter Kit/i);
  await expect(page.getByRole('heading', { name: /Kit de Partida Front-End/i })).toBeVisible();
  await expectNoFrameworkOverlay(page);

  await page.getByRole('button', { name: /alternar tema/i }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);

  await page.getByRole('button', { name: /Entrar Sessão Rápida/i }).click();
  await expect(page.getByText(/Bem-vindo de volta/i)).toBeVisible();
  await expectPageAtTop(page);
  await expectNoFrameworkOverlay(page);

  await page.getByRole('button', { name: /^Projetos$/i }).click();
  await expect(page.getByRole('heading', { name: /Gerenciamento de Projetos/i })).toBeVisible();
  await expectPageAtTop(page);
  await page.getByRole('button', { name: /Provisionar Projeto/i }).focus();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: /Gravar Projeto/i }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByText(/deve possuir no mínimo 3 caracteres/i)).toBeVisible();

  await page.getByRole('button', { name: /^Assinatura$/i }).click();
  await expect(page.getByRole('heading', { name: /Assinatura & Faturamento/i })).toBeVisible();
  await page.getByRole('button', { name: /Anual/i }).click();
  await expect(page.getByText('$8.00').first()).toBeVisible();
  await page.getByRole('button', { name: /Upgrade para Pro/i }).click();
  await expect(page.getByRole('button', { name: /Plano Ativo/i })).toBeVisible();

  await page.getByRole('button', { name: /^Configurações$/i }).click();
  await expect(page.getByRole('heading', { name: /Configurações Integradas/i })).toBeVisible();
  await expectNoFrameworkOverlay(page);

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
