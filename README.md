<div align="center">

# Saúde pré-viagem

**FOZ DO IGUAÇU · FORMULÁRIO MÉDICO**

[**ABRIR FORMULÁRIO**](https://joyceradis.github.io/saude-viagem-foz/) · [**MAPA E ARQUITETURA**](docs/MAPA_DO_SITE_E_EVOLUCAO.md) · [**ROADMAP #2**](https://github.com/joyceradis/saude-viagem-foz/issues/2)

</div>

> [!CAUTION]
> **PRODUÇÃO CONGELADA · v5.0.0**  
> **Não alterar o formulário publicado até nova autorização expressa da médica.** Preservar integralmente HTML, CSS, JavaScript, PDF, etapas, imagem, comportamento e URL. Sem redesign, CEP, redirecionamento ou publicação de protótipos no fluxo das pacientes.

## O que funciona hoje

```mermaid
flowchart LR
  A["LINK DE FOZ<br/>Abre direto no formulário"] --> B["4 ETAPAS<br/>Rápidas · sem bloqueios"]
  B --> C["PDF LOCAL<br/>Resumo declarado"]
  C --> D["WHATSAPP<br/>Envio individual"]
  D --> E["CONSULTA MÉDICA<br/>Avaliação separada"]
  classDef entry fill:#ecf4ee,stroke:#366b52,color:#174a32,stroke-width:2px;
  classDef process fill:#f7f4e9,stroke:#c5b78b,color:#4b4b35;
  classDef care fill:#e9f1ef,stroke:#2e6861,color:#154a44,stroke-width:2px;
  class A entry;
  class B,C,D process;
  class E care;
```

O PDF **não é atestado**; a eventual documentação médica depende de avaliação individual. O código é público, mas **dados de saúde e PDFs preenchidos nunca devem entrar no repositório**.

## Depois, sem substituir o que já funciona

```mermaid
flowchart LR
  S["SITE PROFISSIONAL<br/>Apresentação · SEO público"] -. "futuro acesso" .-> F["FORMULÁRIO FOZ<br/>O mesmo link e fluxo"]
  S -. "futuras viagens" .-> N["OUTROS DESTINOS<br/>Configuração própria"]
  classDef portal fill:#163f35,stroke:#163f35,color:#ffffff,stroke-width:2px;
  classDef form fill:#eaf3e8,stroke:#649377,color:#234f3e;
  class S portal;
  class F,N form;
```

**Princípio:** Foz é um **formulário estático de entrada imediata**, não uma landing page. O site profissional será outra camada, ainda não integrada. SEO pertence às páginas institucionais; **formulários de saúde continuam `noindex`**.

**Histórico de decisão:** as propostas visuais [v6 / PR #1](https://github.com/joyceradis/saude-viagem-foz/pull/1) e [V2](https://github.com/joyceradis/saude-viagem-foz/issues/2) **foram rejeitadas**. O escopo futuro está na [issue #2](https://github.com/joyceradis/saude-viagem-foz/issues/2).

<sub>Atendimento médico individual e independente · Dra. Joyce Radis de Souza de Oliveira · CRM-ES 21188 · [Créditos e licenças](assets/CREDITS.md).</sub>
