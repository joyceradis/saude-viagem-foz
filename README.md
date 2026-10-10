# Saúde pré-viagem · Foz do Iguaçu

**Formulário de informações de saúde para apoiar a consulta médica individual de participantes da viagem Tupperware a Foz do Iguaçu.**

**[Abrir formulário em uso](https://joyceradis.github.io/saude-viagem-foz/)** · [Versão estável v5.0.0](https://github.com/joyceradis/saude-viagem-foz/releases/tag/v5.0.0)

**Atendimento médico independente:** este formulário não é um serviço oficial da Tupperware, não representa a organização da viagem e não emite automaticamente atestados. A menção à Tupperware identifica apenas o grupo de viajantes atendido.

## Como funciona para a participante

1. Preencha **seus dados e endereço**, **histórico de saúde**, **condição atual** e **revisão/declaração**. Ao informar o CEP, a versão proposta busca rua, bairro, cidade e UF; número e complemento podem ser digitados. Nenhum desses campos impede a navegação.
2. Baixe o PDF com suas respostas. Em celulares compatíveis, a opção **Compartilhar PDF** também pode aparecer.
3. Envie o arquivo **somente na conversa individual com a médica**, pelo WhatsApp, antes da consulta ou conforme a orientação recebida.
4. A médica realiza a **avaliação individual**, define a conduta e, **quando houver indicação clínica**, emite o documento médico pertinente por sistema próprio.

> **O PDF do formulário não é atestado, laudo de aptidão nem substituto de consulta.** Ele organiza informações fornecidas pela própria viajante; a conclusão clínica é responsabilidade da médica.

**Responsável pelo atendimento:** Dra. Joyce Radis de Souza de Oliveira, médica, CRM-ES 21188. **Contato profissional:** contato@drajoyceradis.com.

## O que esta aplicação realmente faz

| Componente | Implementação |
| --- | --- |
| Quatro etapas | `index.html` e `assets/app.js` |
| Endereço por CEP, com edição e preenchimento manual | `assets/app.js` (ViaCEP; apenas o CEP é consultado) |
| Layout responsivo, impressão e acessibilidade básica | `assets/styles.css` e `index.html` |
| Geração local do PDF | `assets/app.js` + jsPDF 3.0.3 distribuído em `assets/vendor/` |
| Compartilhamento, quando suportado pelo navegador | API nativa de compartilhamento de arquivos, acionada pela participante |
| Créditos e licenças dos materiais visuais | [`assets/CREDITS.md`](assets/CREDITS.md) |

A aplicação é **estática**, sem servidor próprio, banco de dados ou conta de usuário. As respostas de saúde ficam na memória da página; elas não são transmitidas pelo formulário a um servidor de pacientes. **Nesta versão proposta, somente os oito dígitos do CEP são enviados ao [ViaCEP](https://viacep.com.br/) para obter rua, bairro, cidade e UF.** A consulta depende da conexão com um serviço externo, pode falhar e nunca bloqueia o preenchimento manual ou a navegação. **O PDF salvo e a mensagem enviada por WhatsApp passam a depender do aparelho, do aplicativo e dos cuidados de quem os recebe.** Não confundir ausência de banco da aplicação com ausência de obrigação de sigilo médico.

**Transparência:** o repositório e os arquivos do site são **públicos**, pois integram a publicação por GitHub Pages. Isso **não** torna públicas as respostas individuais: elas não fazem parte do código-fonte, e o sistema não deve receber dados reais de pacientes em commits, issues, testes ou capturas.

## Estado de produção e regra de manutenção

**Produção congelada em `v5.0.0`** · commit `74a288c9c72e213b89667c191bc2cd79ba3696d6` · publicado em [GitHub Pages](https://joyceradis.github.io/saude-viagem-foz/).

O endereço acima está sendo compartilhado entre as participantes. Enquanto houver formulários em circulação:

- **Não alterar `main`, o endereço, DNS, arquivos de interface ou bibliotecas em uso apenas para melhorar aparência ou organização.**
- Preparar alterações numa **branch separada**, revisar em PR e testar em ambiente isolado antes de propor publicação.
- Preservar o comportamento **preencher → revisar → baixar PDF → enviar individualmente → consulta médica → eventual documento**.
- Comparar toda mudança com a release `v5.0.0`. Para restaurar produção, partir do commit da release depois de analisar o histórico e o método de deploy.
- Não adicionar teleconsulta automática, upload remoto, rastreadores, autenticação, analytics ou armazenamento de saúde sem avaliação prévia de segurança, LGPD e responsabilidade profissional.

**Status da branch de revisão:** formulário, endereço e mensagem final modificados apenas no PR. A produção `main` continua intacta na release `v5.0.0`; não houve deploy da nova versão.

## Critérios mínimos para uma atualização futura

Usar **somente dados fictícios**, idealmente após validar numa cópia servida fora da produção:

- Testar o fluxo completo das quatro etapas, voltar/avançar, rádio, campos longos, acentos e revisão.
- Verificar PDF com respostas curtas, extensas e campos vazios; salvar e abrir o arquivo em leitor comum.
- Testar compartilhamento nativo quando disponível e alternativas **Baixar PDF** e **Imprimir** quando não estiver.
- Testar celular (incluindo Safari/iPhone), desktop, teclado e legibilidade/uso com zoom.
- Confirmar que **apenas o CEP** é transmitido ao ViaCEP durante o autocompletar, sem CPF, telefone ou informações clínicas, e que não há dados pessoais reais no repositório.
- Testar CEP válido/inválido/inexistente, indisponibilidade da rede, edição manual de rua e troca rápida de CEP, sem travar o avanço.
- Confirmar que nenhuma resposta é enviada automaticamente a terceiros e que não há dados pessoais no repositório.
- Verificar o endereço antigo depois de qualquer mudança de hospedagem, domínio ou redirecionamento; **não pressupor continuidade sem teste real**.

**Execução local:**

```sh
python3 -m http.server 4173
```

Abrir `http://localhost:4173/` e usar informações fictícias. Esse teste local não substitui validação em navegadores/dispositivos reais.

## Evolução com menor risco

1. **Prioridade clínica:** concluir consultas e documentos pendentes antes de refazer o formulário.
2. **Identificação profissional:** conferir exigências publicitárias/regulatórias e complementar dados de contato ou endereço profissional **apenas depois de validados pela médica**. Não publicar endereço residencial ou informações privadas.
3. **Confiabilidade:** introduzir uma pequena suíte de testes do formulário/PDF e revisão de regressão sem mudar a produção.
4. **Apresentação:** avaliar subdomínio profissional e identidade própria **em outra etapa**, testando HTTPS, resolução e continuidade dos links já compartilhados. Domínio personalizado não torna público código privado.
5. **Expansão comercial:** repetir o fluxo para outros grupos de viajantes somente depois de avaliar capacidade clínica, segurança, consentimento e demanda. **A venda é do atendimento profissional, não de um resultado clínico predeterminado.**

## Privacidade, licenças e responsabilidade

Não adicionar ao GitHub PDFs preenchidos, laudos, prontuários, telefones, dados de saúde, credenciais ou conversas com pacientes. Questões médicas reais devem permanecer nos canais profissionais adequados.

Os materiais de terceiros, incluindo fotografia e biblioteca PDF, têm créditos e licenças descritos em [`assets/CREDITS.md`](assets/CREDITS.md). O uso de elementos visuais associados à viagem não implica patrocínio, parceria formal nem autorização de uso da marca em produtos comerciais.

Documentação técnica e código-fonte deste repositório não substituem protocolos clínicos, avaliações individualizadas ou regras éticas aplicáveis à telemedicina e publicidade médica.
