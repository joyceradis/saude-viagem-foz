import assert from 'node:assert/strict';
import {mkdirSync, readFileSync} from 'node:fs';
import {chromium} from 'playwright';

// QA de revisão. Somente dados fictícios; não acessa serviços de saúde.
// A consulta de CEP é interceptada localmente e não envia CEP real à internet.
const base = process.env.PREVIEW_BASE || 'http://127.0.0.1:4173/';
const screenshots = process.env.PREVIEW_OUT || 'review-output';
mkdirSync(screenshots, {recursive:true});
const browser = await chromium.launch({headless: true, args: ['--no-sandbox']});
const page = await browser.newPage({viewport: {width: 390, height: 844}, deviceScaleFactor: 1});
const pageErrors = [];
page.on('pageerror', error => pageErrors.push(error.message));
await page.route('https://viacep.com.br/ws/**', async route => {
  const cep = route.request().url().match(/ws\/(\d{8})\//)?.[1];
  if (cep === '01001000') {
    await route.fulfill({status: 200, contentType:'application/json', headers:{'access-control-allow-origin':'*'},
      body:JSON.stringify({cep:'01001-000',logradouro:'Praça da Sé',bairro:'Sé',localidade:'São Paulo',uf:'SP'})});
  } else if (cep === '29050000') {
    await route.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},
      body:JSON.stringify({cep:'29050-000',logradouro:'Avenida Exemplo',bairro:'Centro',localidade:'Vitória',uf:'ES'})});
  } else if (cep === '11111111') {
    await route.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:'{"erro":true}'});
  } else {
    await route.abort('failed');
  }
});

try {
  await page.goto(base,{waitUntil:'networkidle'});
  assert.match(await page.title(),/Saúde pré-viagem/);
  // Fluxo permanece livre para pessoas apressadas, mesmo sem nenhum dado preenchido.
  await page.locator('#nextBtn').click();
  assert.equal(await page.locator('[data-panel="1"]').isVisible(),true,'avanço não pode bloquear');
  await page.locator('[data-step="0"]').click();
  await page.locator('#nome').fill('Paciente Fictícia de Teste');
  await page.locator('#cpf').fill('12345678900');
  await page.locator('#cep').fill('01001000');
  await page.waitForFunction(() => document.querySelector('#logradouro')?.value === 'Praça da Sé');
  assert.equal(await page.locator('#cep').inputValue(),'01001-000');
  assert.equal(await page.locator('#bairro').inputValue(),'Sé');
  assert.equal(await page.locator('#cidade').inputValue(),'São Paulo');
  assert.equal(await page.locator('#uf').inputValue(),'SP');
  await page.locator('#numero').fill('120');
  await page.locator('#complemento').fill('Apto. 11');
  // Informação corrigida manualmente tem precedência sobre a API.
  await page.locator('#logradouro').fill('Rua informada manualmente');
  await page.locator('#cep').fill('29050000');
  await page.waitForFunction(() => document.querySelector('#bairro')?.value === 'Centro');
  assert.equal(await page.locator('#logradouro').inputValue(),'Rua informada manualmente');
  assert.equal(await page.locator('#cidade').inputValue(),'Vitória');
  assert.equal(await page.locator('#uf').inputValue(),'ES');
  // Quando o CEP é desconhecido, permanece possível digitar e navegar.
  await page.locator('#cep').fill('11111111');
  await page.waitForFunction(() => document.querySelector('#cepStatus')?.textContent?.includes('não encontrado'));
  await page.locator('#cep').fill('29050000');
  await page.waitForFunction(() => document.querySelector('#cepStatus')?.dataset.state === 'success');
  await page.screenshot({path:screenshots+'/01-endereco-mobile.png',fullPage:true});
  await page.locator('[data-step="3"]').click();
  assert.equal(await page.locator('#reviewSummary').getByText('Rua informada manualmente').isVisible(),true);
  assert.equal(await page.locator('#reviewSummary').getByText('Apto. 11').isVisible(),true);
  await page.locator('#aceite').check();
  await page.screenshot({path:screenshots+'/02-final-mobile.png',fullPage:true});
  const downloadWait = page.waitForEvent('download',{timeout:12000});
  await page.locator('#downloadBtn').click();
  const download = await downloadWait;
  const pdfPath = await download.path();
  assert.equal(readFileSync(pdfPath).subarray(0,5).toString(),'%PDF-','arquivo PDF válido');
  assert.match(await page.locator('#status').textContent(),/aguarde meu contato/);
  // Reiniciar elimina valores e impede que consulta antiga restaure endereço.
  page.once('dialog',dialog=>dialog.accept());
  await page.locator('#resetBtn').click();
  assert.equal(await page.locator('#cep').inputValue(),'');
  assert.equal(await page.locator('#logradouro').inputValue(),'');
  assert.deepEqual(pageErrors,[], 'sem erros JavaScript no navegador');
  console.log('PASS: mobile, navigation, CEP lookup/fallback, manual override, PDF, reset');
} finally {
  await browser.close();
}
