'use strict';

const $ = id => document.getElementById(id);
const form = $('travelForm');
const panels = [...form.querySelectorAll('[data-panel]')];
const groups = [...form.querySelectorAll('[data-required-radio]')];
const stepButtons = [...document.querySelectorAll('[data-step]')];
let currentStep = 0;
let dirty = false;
let pdfFile = null;

function today() {
  const date = new Date();
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}
function selected(name) { return form.querySelector('input[name="' + name + '"]:checked'); }
function validCpf(value) {
  const n = value.replace(/\D/g, '');
  if (!/^\d{11}$/.test(n) || /^(\d)\1{10}$/.test(n)) return false;
  for (let len = 9; len <= 10; len++) {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += Number(n[i]) * (len + 1 - i);
    let digit = (sum * 10) % 11;
    if (digit === 10) digit = 0;
    if (digit !== Number(n[len])) return false;
  }
  return true;
}
function updateConditional(name) {
  const box = $(name + '_detail');
  if (!box) return;
  const show = selected(name)?.value === 'sim';
  box.classList.toggle('visible', show);
  const detail = box.querySelector('[data-detail-for]');
  detail.disabled = !show;
  detail.required = show;
  if (!show) {
    detail.value = '';
    detail.classList.remove('invalid');
    detail.removeAttribute('aria-invalid');
  }
  $('urgentNotice').hidden = selected('sintomas')?.value !== 'sim';
}
groups.forEach(group => {
  const name = group.dataset.requiredRadio;
  const question = group.closest('.form-group').querySelector('.question');
  question.id = 'question-' + name;
  group.setAttribute('role', 'radiogroup');
  group.setAttribute('aria-labelledby', question.id);
  group.setAttribute('aria-required', 'true');
  const label = document.createElement('label');
  label.className = 'radio-item';
  const radio = document.createElement('input');
  radio.type = 'radio'; radio.name = name; radio.value = 'nao_sei';
  label.append(radio, document.createTextNode('Não sei'));
  group.append(label);
  const detail = group.closest('.form-group').querySelector('[data-detail-for]');
  if (detail) {
    detail.id = name + '_texto';
    detail.name = name + '_detalhe';
    const detailLabel = document.createElement('label');
    detailLabel.className = 'detail-label';
    detailLabel.htmlFor = detail.id;
    detailLabel.textContent = detail.placeholder;
    detail.placeholder = '';
    detail.before(detailLabel);
  }
  group.addEventListener('change', () => updateConditional(name));
  updateConditional(name);
});

function showStep(step, focus = true) {
  currentStep = step;
  panels.forEach((panel, i) => { panel.hidden = i !== step; });
  stepButtons.forEach((button, i) => {
    if (i === step) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
    button.classList.toggle('is-done', i < step);
  });
  $('stepProgress').style.width = ((step + 1) * 25) + '%';
  $('stepCount').textContent = 'Etapa ' + (step + 1) + ' de 4';
  $('nextBtn').hidden = step === 3;
  $('nextBtn').textContent = step === 2 ? 'Revisar respostas' : 'Continuar';
  $('backBtn').hidden = step === 0;
  if (step === 3) buildReview();
  if (focus) {
    const heading = $('title-' + step);
    heading.focus({ preventScroll: true });
    heading.scrollIntoView({ block: 'start', behavior: 'instant' });
  }
}
function clearErrors() {
  form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
  form.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
  $('errorBox').hidden = true;
}
function validate(scope = form) {
  clearErrors();
  const errors = [];
  const includes = id => scope.contains($(id));
  function bad(el, message) {
    if (errors.some(error => error.el === el)) return;
    el.classList.add('invalid');
    el.setAttribute('aria-invalid', 'true');
    errors.push({ el, message });
  }
  [...scope.querySelectorAll('[required]')].filter(el => !el.disabled).forEach(el => {
    if (el.type === 'checkbox' ? !el.checked : !el.value.trim()) {
      const label = el.id ? form.querySelector('label[for="' + el.id + '"]') : null;
      bad(el, el.type === 'checkbox' ? 'Confirme a declaração para gerar o PDF.' : label ? 'Preencha: ' + label.textContent.trim() + '.' : 'Complete os detalhes da resposta “Sim”.');
    }
  });
  groups.filter(g => scope.contains(g)).forEach(g => {
    if (!selected(g.dataset.requiredRadio)) bad(g.querySelector('input'), 'Responda às perguntas de saúde. Se não souber, marque “Não sei”.');
  });
  if (includes('cpf') && $('cpf').value && !validCpf($('cpf').value)) bad($('cpf'), 'Confira os 11 dígitos do CPF.');
  const phone = $('telefone').value.replace(/\D/g, '');
  if (includes('telefone') && phone && !/^(?:55)?\d{10,11}$/.test(phone)) bad($('telefone'), 'Informe seu WhatsApp com DDD.');
  if (includes('telefone') && $('telefone').value && !phone) bad($('telefone'), 'Informe seu WhatsApp com DDD.');
  if (includes('nome') && $('nome').value.trim() && !/^\S+\s+\S+/.test($('nome').value.trim())) bad($('nome'), 'Informe seu nome completo.');
  if (includes('nascimento') && $('nascimento').value && ($('nascimento').value > today() || $('nascimento').value < '1900-01-01')) bad($('nascimento'), 'Confira a data de nascimento.');
  if (includes('partida') && $('partida').value && $('partida').value < today()) bad($('partida'), 'Confira a data de ida: ela deve ser hoje ou uma data futura.');
  if (includes('retorno') && $('retorno').value && $('retorno').value < $('partida').value) bad($('retorno'), 'A data de volta deve ser igual ou posterior à data de ida.');
  if (includes('data_hoje') && $('data_hoje').value && $('data_hoje').value !== today()) bad($('data_hoje'), 'Use a data de hoje no preenchimento.');
  if (errors.length) {
    const error = errors[0];
    const panel = error.el.closest('[data-panel]');
    if (panel && Number(panel.dataset.panel) !== currentStep) showStep(Number(panel.dataset.panel), false);
    $('errorBox').textContent = [...new Set(errors.map(e => e.message))].join(' ');
    $('errorBox').hidden = false;
    error.el.focus({ preventScroll: true });
    // Keep the error and the first field in view on mobile.
    $('errorBox').scrollIntoView({ block: 'center', behavior: 'instant' });
    return false;
  }
  return true;
}
function navigate(step) {
  if (step > currentStep) {
    for (let i = currentStep; i < step; i++) if (!validate(panels[i])) return;
  }
  clearErrors();
  showStep(step);
}
stepButtons.forEach(button => button.addEventListener('click', () => navigate(Number(button.dataset.step))));
$('nextBtn').addEventListener('click', () => navigate(currentStep + 1));
$('backBtn').addEventListener('click', () => navigate(currentStep - 1));

function pretty(el) {
  if (el.type === 'date' && el.value) return el.value.split('-').reverse().join('/');
  return el.value.trim() || 'Não informado';
}
function reportRows(includeDeclaration = true) {
  const rows = [];
  panels.forEach((panel, step) => {
    if (!includeDeclaration && step === 3) return;
    panel.querySelectorAll('.section-title,.subsection,.form-group').forEach(el => {
      if (el.classList.contains('section-title') || el.classList.contains('subsection')) {
        rows.push({ section: el.textContent.trim(), step });
        return;
      }
      const q = el.querySelector('.question');
      if (!q) return;
      const title = q.cloneNode(true);
      title.querySelectorAll('.hint,.optional').forEach(h => h.remove());
      const group = el.querySelector('[data-required-radio]');
      let answer;
      if (group) {
        const value = selected(group.dataset.requiredRadio)?.value;
        answer = { sim: 'Sim', nao: 'Não', nao_sei: 'Não sei' }[value] || 'Não respondido';
        if (value === 'sim') answer += '. ' + el.querySelector('[data-detail-for]').value.trim();
      } else {
        const field = el.querySelector('input,textarea,select');
        if (!field) return;
        answer = pretty(field);
      }
      rows.push({ label: title.textContent.trim().replace(/\s+/g, ' '), value: answer, step });
    });
  });
  if (includeDeclaration) rows.push({ label: 'Declaração da viajante', value: $('aceite').checked ? 'Confirmada. ' + form.querySelector('.declaration').textContent.trim() : 'Não confirmada.' });
  return rows;
}
function buildReview() {
  const root = $('reviewSummary');
  root.replaceChildren();
  let list;
  reportRows(false).forEach(row => {
    if (row.section) {
      const section = document.createElement('section');
      section.className = 'review-section';
      const header = document.createElement('div');
      header.className = 'review-section-header';
      const heading = document.createElement('h3'); heading.textContent = row.section;
      const edit = document.createElement('button');
      edit.type = 'button'; edit.className = 'edit-button'; edit.textContent = 'Editar';
      edit.setAttribute('aria-label', 'Editar ' + row.section.toLowerCase());
      edit.addEventListener('click', () => navigate(row.step));
      header.append(heading, edit);
      list = document.createElement('dl'); list.className = 'review-list';
      section.append(header, list); root.append(section);
    } else {
      const item = document.createElement('div'); item.className = 'review-row';
      const term = document.createElement('dt'); term.textContent = row.label;
      const value = document.createElement('dd'); value.textContent = row.value;
      item.append(term, value); list.append(item);
    }
  });
}

function buildPrintReport() {
  const root = $('printReport'); root.replaceChildren();
  const heading = document.createElement('h1'); heading.textContent = 'Informações de saúde pré-viagem'; root.append(heading);
  const intro = document.createElement('p'); intro.className = 'print-intro';
  intro.textContent = 'Viagem Tupperware · Foz do Iguaçu / PR\nDestinatária: Dra. Joyce Radis de Souza de Oliveira · CRM-ES 21188\nInformações declaradas pela viajante para avaliação médica. Este documento não é um atestado.';
  root.append(intro);
  reportRows().forEach(row => {
    if (row.section) { const h = document.createElement('h2'); h.textContent = row.section; root.append(h); }
    else {
      const p = document.createElement('p'); p.className = 'print-row';
      const strong = document.createElement('strong'); strong.textContent = row.label;
      p.append(strong, document.createTextNode(row.value)); root.append(p);
    }
  });
  const footer = document.createElement('p'); footer.className = 'print-footer';
  footer.textContent = 'Informações confidenciais de saúde. A avaliação médica e a eventual emissão de atestado são realizadas separadamente.';
  root.append(footer);
}

function createPdf() {
  if (pdfFile) return pdfFile;
  if (!window.jspdf?.jsPDF) throw new Error('PDF_UNAVAILABLE');
  const doc = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4', compress: true });
  doc.setProperties({ title: 'Informações de saúde pré-viagem', subject: 'Viagem Tupperware a Foz do Iguaçu', creator: 'Formulário de saúde pré-viagem' });
  const left = 18, width = 174, bottom = 272;
  let y = 0;
  function header() {
    doc.setFillColor(0, 82, 79); doc.rect(0, 0, 210, 3, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(0, 82, 79);
    doc.text('VIAGEM TUPPERWARE', left, 16);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(92, 113, 105);
    doc.text('Foz do Iguaçu / PR', 192, 16, { align: 'right' });
    doc.setDrawColor(214, 225, 219); doc.line(left, 21, 192, 21); y = 29;
  }
  function nextPage() { doc.addPage(); header(); }
  function room(height) { if (y + height > bottom) nextPage(); }
  function textBlock(text, { size = 10, bold = false, color = [35, 54, 49], gap = 3 } = {}) {
    doc.setFont('helvetica', bold ? 'bold' : 'normal'); doc.setFontSize(size); doc.setTextColor(...color);
    const lines = doc.splitTextToSize(String(text).normalize('NFC').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, ''), width);
    const lineHeight = size * .44;
    for (const line of lines) {
      if (y + lineHeight > bottom) {
        nextPage(); doc.setFont('helvetica', bold ? 'bold' : 'normal'); doc.setFontSize(size); doc.setTextColor(...color);
      }
      doc.text(line, left, y); y += lineHeight;
    }
    y += gap;
  }
  header();
  textBlock('Informações de saúde', { size: 23, bold: true, color: [0, 82, 79], gap: 1 });
  textBlock('Pré-viagem | Declaração da participante', { size: 12, color: [98, 117, 109], gap: 5 });
  textBlock('Para Dra. Joyce Radis de Souza de Oliveira · CRM-ES 21188', { size: 9, gap: 2 });
  textBlock('Este resumo reúne informações declaradas pela viajante. Não é um atestado médico.', { size: 9, color: [98, 117, 109], gap: 6 });
  for (const row of reportRows()) {
    if (row.section) {
      room(25); y += 3;
      doc.setFillColor(237, 244, 239); doc.roundedRect(left - 3, y - 5, width + 6, 10, 1, 1, 'F');
      textBlock(row.section, { size: 12, bold: true, color: [0, 82, 79], gap: 6 });
    } else {
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
      const labelHeight = doc.splitTextToSize(row.label, width).length * 9 * .44;
      room(labelHeight + 12);
      textBlock(row.label, { size: 9, bold: true, color: [81, 105, 95], gap: 1 });
      textBlock(row.value, { size: 10, gap: 5 });
    }
  }
  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page++) {
    doc.setPage(page); doc.setDrawColor(214, 225, 219); doc.line(left, 281, 192, 281);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(98, 117, 109);
    doc.text('Confidencial · Informações fornecidas pela participante', left, 287);
    doc.text(page + ' / ' + pages, 192, 287, { align: 'right' });
  }
  // Avoid identifying document numbers in the filename.
  const name = $('nome').value.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70);
  pdfFile = new File([doc.output('arraybuffer')], 'Saude-viagem-Foz-' + (name || 'participante') + '.pdf', { type: 'application/pdf' });
  return pdfFile;
}
function pdfError() {
  $('status').textContent = 'Não foi possível gerar o download. Use “Imprimir ou salvar pelo navegador” abaixo para salvar seu PDF.';
}
$('downloadBtn').addEventListener('click', () => {
  if (!validate()) return;
  try {
    const file = createPdf();
    const url = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = file.name; anchor.hidden = true;
    document.body.append(anchor); anchor.click(); anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    dirty = false;
    $('status').textContent = 'PDF pronto. Envie o arquivo para a Dra. Joyce pelo WhatsApp. Se ele abriu em uma nova tela, use o botão de compartilhar.';
  } catch { pdfError(); }
});
$('shareBtn').addEventListener('click', async () => {
  if (!validate()) return;
  try {
    const file = createPdf();
    await navigator.share({ files: [file], title: 'Informações de saúde pré-viagem' });
    dirty = false;
    $('status').textContent = 'Confira na conversa com a Dra. Joyce se o PDF foi enviado.';
  } catch (error) {
    if (error.name !== 'AbortError') $('status').textContent = 'Baixe o PDF e anexe o arquivo na sua conversa com a Dra. Joyce pelo WhatsApp.';
  }
});
$('printBtn').addEventListener('click', () => {
  if (!validate()) return;
  buildPrintReport(); window.print();
});
window.addEventListener('beforeprint', buildPrintReport);
try {
  const supportsSharing = navigator.share && navigator.canShare?.({ files: [new File(['%PDF-1.4'], 'teste.pdf', { type: 'application/pdf' })] });
  $('shareBtn').hidden = !supportsSharing;
  $('shareHint').hidden = !supportsSharing;
} catch { /* The direct download remains available. */ }

function reset() {
  form.reset(); pdfFile = null;
  $('printReport').replaceChildren(); $('reviewSummary').replaceChildren();
  groups.forEach(g => updateConditional(g.dataset.requiredRadio));
  clearErrors();
  $('data_hoje').value = today(); $('nascimento').max = today(); $('partida').min = today();
  $('status').textContent = ''; dirty = false;
  showStep(0, false);
}
$('resetBtn').addEventListener('click', () => {
  if (!confirm('Apagar as respostas deste formulário? Os PDFs que você já baixou não serão apagados.')) return;
  reset(); $('nome').focus();
});
$('cpf').addEventListener('input', e => {
  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
});
['input', 'change'].forEach(type => form.addEventListener(type, e => {
  dirty = true; pdfFile = null;
  e.target.classList.remove('invalid'); e.target.removeAttribute('aria-invalid');
  $('printReport').replaceChildren(); $('status').textContent = '';
}));
form.addEventListener('submit', event => {
  event.preventDefault();
  if (currentStep < 3) navigate(currentStep + 1);
});
window.addEventListener('beforeunload', event => {
  if (dirty) { event.preventDefault(); event.returnValue = ''; }
});
reset();
