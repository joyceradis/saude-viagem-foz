# Saúde pré-viagem · Foz do Iguaçu

Formulário para participantes da viagem Tupperware, com avaliação médica individual pela Dra. Joyce Radis de Souza de Oliveira (CRM-ES 21188).

## Uso

1. Preencher os dados pessoais, as datas da viagem e as perguntas de saúde.
2. Revisar as respostas e confirmar a declaração.
3. Baixar o PDF e enviá-lo à médica pelo WhatsApp. Nos navegadores compatíveis, o botão **Compartilhar PDF** abre o compartilhamento de arquivos do celular.

O formulário gera um resumo das informações declaradas pela participante. A avaliação médica e a eventual emissão de atestado são realizadas separadamente.

## Arquivos

- `index.html`: conteúdo e quatro etapas do formulário.
- `assets/styles.css`: interface responsiva e impressão.
- `assets/app.js`: navegação, validação, revisão e geração local de PDF.
- `assets/vendor/jspdf.umd.min.js`: jsPDF 3.0.3, sob licença MIT, mantido localmente.
- `assets/iguacu.jpg`: fotografia das Cataratas com os créditos descritos em `assets/CREDITS.md`.

Aplicação estática, publicada pelo GitHub Pages. Para rodar localmente: `python -m http.server 4173`.

## Privacidade

As respostas permanecem na memória da página. Não há banco de dados, analytics, armazenamento local, envio automático nem requisições com os dados preenchidos. A política de conteúdo bloqueia conexões iniciadas pelos scripts. PDF e compartilhamento são acionados pela participante.

O compartilhamento nativo depende do navegador e não informa se a mensagem foi entregue pelo WhatsApp. O download e a impressão continuam disponíveis como alternativas.

Não adicionar PDFs preenchidos, informações pessoais ou dados de saúde a este repositório. Os testes utilizam apenas informações fictícias.
