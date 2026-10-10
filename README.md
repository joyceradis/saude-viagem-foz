# Saúde pré-viagem · Foz do Iguaçu

**Uma preparação mais tranquila para viajar, com avaliação médica individual.**

Formulário de informações de saúde para participantes da viagem a Foz do Iguaçu, atendidas de forma independente pela **Dra. Joyce Radis de Souza de Oliveira, médica · CRM-ES 21188**. O serviço não representa atendimento oficial da Tupperware.

**[Abrir formulário de Foz](https://joyceradis.github.io/saude-viagem-foz/)** · **[Mapa do site e arquitetura futura](docs/MAPA_DO_SITE_E_EVOLUCAO.md)** · **[Evolução planejada · issue #2](https://github.com/joyceradis/saude-viagem-foz/issues/2)**

> **Em uso · versão estável [v5.0.0](https://github.com/joyceradis/saude-viagem-foz/releases/tag/v5.0.0).** O endereço já é compartilhado entre as viajantes. Esta documentação **não autoriza mudar a interface, a URL, o formulário nem o fluxo clínico**.

## Como funciona hoje

1. A participante informa seus dados, datas da viagem, histórico e estado atual de saúde em **quatro etapas**.
2. Revê as respostas, confirma a declaração e **baixa o PDF**. Em navegadores compatíveis, pode compartilhá-lo pelo menu nativo.
3. Envia o arquivo à médica **em conversa individual pelo WhatsApp**.
4. A avaliação médica é realizada separadamente. Um eventual atestado ou outro documento depende da **avaliação individual e indicação clínica**.

O PDF é um **resumo das respostas declaradas**, não um atestado e não uma declaração automática de aptidão para viajar.

## Onde está cada coisa

| Preciso encontrar | Fonte |
| --- | --- |
| Formulário publicado | [GitHub Pages · Foz](https://joyceradis.github.io/saude-viagem-foz/) |
| Página e quatro etapas | [`index.html`](index.html) |
| Navegação, revisão e PDF local | [`assets/app.js`](assets/app.js) |
| Estilos responsivos e impressão | [`assets/styles.css`](assets/styles.css) |
| Biblioteca PDF distribuída localmente | `assets/vendor/jspdf.umd.min.js` · jsPDF 3.0.3 (MIT) |
| Fotografia, autoria e licenças | [`assets/CREDITS.md`](assets/CREDITS.md) |
| **Mapa de páginas, SEO e futuro multi-viagens** | **[`docs/MAPA_DO_SITE_E_EVOLUCAO.md`](docs/MAPA_DO_SITE_E_EVOLUCAO.md)** |
| Escopo e critérios de futuras melhorias | [**Issue #2**](https://github.com/joyceradis/saude-viagem-foz/issues/2) |
| Futuro ponto de entrada profissional | [`joyceradis/JR`](https://github.com/joyceradis/JR) · produto independente |

## Direção de produto · não implementada

O que funcionou para **Foz** pode ser adaptado a outras excursões: cada viagem pode ter destino, fotografia e textos próprios, preservando o núcleo médico e a experiência rápida no celular.

A **fotografia do destino e a emoção da viagem** são partes centrais da apresentação; não substituir a página por um questionário genérico. Referências estéticas e de interfaces estão na [pasta Pinterest da autora](https://pin.it/f1wFJlAxY), a serem **selecionadas por contexto** antes de qualquer redesign.

Futuramente, a descoberta do serviço poderá acontecer pelo site profissional `drajoyceradis.com`, mantendo o **link antigo acessível** até que uma migração seja comprovadamente segura.

**SEO:** páginas públicas de serviço e de apresentação podem ser otimizadas para mecanismos de busca; **questionários que coletam dados de saúde não devem ser indexados**. O formulário atual já solicita `noindex, nofollow`. Um sitemap XML público, se criado, não deve listar páginas clínicas privadas.

Estas são decisões de arquitetura e direção editorial, **não recursos já disponíveis**. A [issue #2](https://github.com/joyceradis/saude-viagem-foz/issues/2) registra o escopo futuro sem iniciar a implementação.

## Privacidade e operação

Aplicação estática publicada via GitHub Pages, sem banco de dados, login, analytics ou envio automático das respostas para servidores. A geração do PDF ocorre no navegador. No código estável atual, a política de conteúdo impede requisições dos scripts a serviços externos. O WhatsApp e o armazenamento do PDF passam a depender da participante e do canal de atendimento.

**Não inserir no GitHub**: PDFs preenchidos, dados identificáveis, históricos clínicos, conversas com participantes, credenciais ou prontuários. Todos os testes devem usar informações fictícias. O repositório e seu código são públicos; os dados preenchidos pela participante não integram esse código.

Para desenvolvimento local: `python3 -m http.server 4173`; abrir `http://localhost:4173/`.

**Mudanças em produção:** revisão de escopo, teste mobile/PDF, aprovação da médica e preservação dos links já distribuídos. A prévia visual anterior do [PR #1](https://github.com/joyceradis/saude-viagem-foz/pull/1) **não foi aprovada** e não deve ser publicada como está.
