# Sistema PAI - Plano de Atendimento Individualizado

Sistema web escolar para criação, edição, visualização, impressão e exportação em PDF de Planos de Atendimento Individualizado - PAI.

## Correções desta versão

- Corrigido o erro de permissões exibido em `/professor/turmas` com regras do Firestore mais compatíveis com consultas `array-contains`.
- Todas as telas críticas do professor agora tratam erros do Firebase sem quebrar a aplicação em tela vermelha de runtime.
- Tailwind fixado na versão 3.4.17 para evitar conflito do plugin PostCSS do Tailwind v4.
- Interface redesenhada com sidebar premium, fundo aurora, cards em vidro, botões com gradiente, estados vazios e mensagens de erro amigáveis.
- Layout preparado para desktop e telas menores.

## Instalação

```bash
npm install
npm run dev
```

Acesse:

```txt
http://localhost:3000/login
```

## Firebase Authentication

No Firebase Console do projeto `planoindat`:

1. Abra Authentication.
2. Ative o provedor Google.
3. Confira se `localhost` está em Authorized domains.
4. Em produção, adicione também o domínio do Vercel/Firebase Hosting.

## Publicar regras de segurança

O erro `Missing or insufficient permissions` aparece quando as regras ainda não foram publicadas ou quando o professor não foi vinculado à turma.

Rode:

```bash
npm install -g firebase-tools
firebase login
firebase use planoindat
firebase deploy --only firestore:rules,storage
```

## Administradores principais

```txt
itaopovos@gmail.com
colavaliacao@gmail.com
```

Esses e-mails são validados também nas regras do Firestore, não apenas no frontend.

## Fluxo de uso

1. O administrador entra com `itaopovos@gmail.com` ou `colavaliacao@gmail.com`.
2. Cadastra turmas.
3. Cadastra ou confirma professores.
4. Vincula professores às turmas.
5. Cadastra disciplinas e associa professor/turma.
6. Cadastra estudantes e vincula à turma.
7. O professor entra com Google e verá apenas as turmas vinculadas.
8. O professor cria ou edita o PAI dos estudantes permitidos.
9. O PAI pode ser visualizado, impresso e exportado em PDF.

## Deploy na Vercel

```bash
npm run build
vercel
```

## Deploy no Firebase Hosting

```bash
firebase init hosting
firebase deploy
```

## Observação importante

Depois de alterar `firebase.rules` ou `storage.rules`, sempre publique novamente as regras. O frontend atualizado sozinho não altera permissões do banco.

## Correção do erro de permissão em /professor/turmas

Se aparecer `Missing or insufficient permissions`, faça estes passos:

1. Confirme que o e-mail do administrador é exatamente `itaopovos@gmail.com / colavaliacao@gmail.com`.
2. Publique novamente as regras:

```bash
firebase deploy --only firestore:rules,storage
```

3. O professor precisa ter feito login pelo Google pelo menos uma vez, para que exista o documento `users/{uid}`.
4. Em **Administração > Professores**, vincule a turma ao UID real do professor. O UID não é o e-mail; é o identificador gerado pelo Firebase Authentication.
5. Esta versão lê as turmas do professor primeiro pelo campo `users/{uid}.turmasIds`, evitando a consulta bloqueada por regras em `turmas`.

As regras agora permitem `get` de uma turma quando o ID da turma está no documento do próprio professor, mas não liberam listagem geral de todas as turmas para professor.


## Ajustes recentes do PAI

- O campo de foto no formulário do PAI agora permite upload direto para Firebase Storage.
- O quadro de foto do documento é preenchido pela imagem enviada.
- Potencialidades e dificuldades agora são campos livres. Os textos são apenas exemplos no placeholder e não aparecem automaticamente no documento.
- Removido Regente 2.
- Campo/assinatura ajustado para Ensino Religioso.
- Documento e PDF continuam em orientação paisagem.


## Ajustes de encaminhamento e impressão

- O PAI agora possui o status `encaminhado_visto`.
- Ao clicar em **Encaminhar para visto**, o rascunho existente é atualizado; não é criado outro PAI repetido.
- As listas exibem as colunas **Professor** e **Horário de encaminhamento**.
- A tela da turma abre o PAI existente do estudante quando já houver rascunho/encaminhamento.
- O PDF foi compactado para A4 paisagem com margens menores, fonte reduzida e foto enquadrada no campo delimitado.
- A exportação evita grandes espaços em branco e reduz a quantidade de páginas geradas.


## Ajustes adicionais - visto, exclusão e assinaturas digitais

- Adicionado botão **Excluir** na listagem administrativa de PAIs.
- Adicionado botão **Dar visto** para documentos com status **Encaminhado para visto**.
- Ao **encaminhar para visto**, o sistema registra automaticamente as assinaturas digitais dos professores responsáveis.
- Ao clicar em **Dar visto**, a **Coordenação** recebe a assinatura digital e o documento passa para o status **Visto**.
- O upload de foto tenta salvar em `pais/fotos/...` e, se necessário, faz fallback para `estudantes/fotos-pai/...` para evitar erros de permissão.


## Correção de disciplinas

- Corrigido erro `No document to update` ao criar disciplinas quando havia turma/professor antigo ou inexistente.
- A tela de disciplinas agora valida turma e professor antes de salvar.
- Disciplinas órfãs mostram "Turma não encontrada" ou "Professor não encontrado" e podem ser excluídas sem quebrar o sistema.
- A criação/edição de disciplina só atualiza arrays de turma/professor quando os documentos realmente existem.


## Ajuste visual dos campos de seleção

- Removido o ícone triangular padrão dos campos `select`.
- Adicionado indicador lateral em formato de barra de rolagem.
- Adicionado estilo de scrollbar discreto para listas de seleção compatíveis com o navegador.


## Ajuste de acesso por turma

- Ao vincular uma turma ao professor, o sistema libera automaticamente o acesso à turma, estudantes, disciplinas e PAIs daquela turma.
- O professor vinculado à turma pode preencher todo o PAI, inclusive objetivos por disciplina, até encaminhar o documento para visto.
- Depois de encaminhar para visto, a edição pelo professor fica bloqueada.
- As regras do Firestore também foram ajustadas para aplicar essa segurança no backend, não apenas no frontend.
- Ao vincular uma turma, as disciplinas já cadastradas na turma também são adicionadas ao cadastro do professor.


## Correção final de exportação, imagem e assinaturas individuais

- Adicionado proxy local `/api/image-proxy` para carregar fotos do Firebase Storage sem erro de CORS durante impressão/exportação.
- O PDF foi recompactado com fonte menor, margens reduzidas e blocos protegidos contra quebra no meio do texto.
- A imagem do estudante usa o proxy local no documento final, evitando falha do `html2canvas`.
- As assinaturas digitais dos professores agora são individuais: cada professor só aparece no final depois de acessar o PAI e encaminhar/registrar sua própria assinatura.
- Após o primeiro encaminhamento, outros professores vinculados podem registrar somente a assinatura, sem editar o conteúdo.
- A coordenação assina digitalmente apenas ao dar o visto.


## Ajuste de ordem das disciplinas, registro processual e fonte

- A ordem das disciplinas no PAI agora é:
  1. Língua Portuguesa
  2. Matemática
  3. Competências Digitais
  4. Ciências
  5. Geografia
  6. História
- Disciplinas extras continuam aparecendo depois dessa sequência padrão.
- O registro de aprendizagem processual agora aparece dentro de cada componente curricular, junto dos objetivos.
- A seção 5 virou uma legenda explicativa do registro processual.
- A fonte do documento impresso/exportado foi ajustada para Calibri, tamanho 10pt, com alternativas Carlito/Segoe UI/Arial quando Calibri não estiver disponível.


## Ajuste de acesso por turma e disciplina

- O professor só acessa turmas em que foi vinculado.
- O professor só visualiza/preenche disciplinas em que foi vinculado.
- Vincular uma turma ao professor não libera automaticamente todas as disciplinas da turma.
- A liberação de disciplina acontece no cadastro de disciplinas, ao escolher a turma e o professor responsável.
- No formulário do PAI, o professor vê e edita somente os componentes curriculares vinculados ao seu usuário.
- Na visualização do PAI, professores veem apenas suas disciplinas; o administrador/coordenação vê o documento completo.
- As regras do Firestore foram ajustadas para impedir leitura de disciplinas não vinculadas ao professor.


## Administradores do sistema

O sistema agora reconhece dois e-mails como administradores:

- itaopovos@gmail.com
- colavaliacao@gmail.com

Essa validação foi aplicada no frontend, na criação/atualização do usuário, nas Firestore Rules e nas Storage Rules.


## Permissões finais de turmas e disciplinas

- Administradores acessam todas as turmas, estudantes, disciplinas e PAIs.
- Professores acessam somente as turmas vinculadas ao documento `users/{uid}.turmasIds`.
- Professores podem visualizar PAIs e disciplinas das turmas em que estão vinculados.
- A edição de objetivos e registro processual é permitida somente ao professor responsável pela disciplina.
- Professores não responsáveis pela disciplina visualizam o conteúdo, mas os campos ficam bloqueados.
- Campos gerais do PAI, como identificação, foto, mapeamento e ação colaborativa, ficam editáveis apenas para administrador/coordenação.


## Design premium e função do professor

- Interface redesenhada com visual mais sofisticado, glassmorphism refinado, sidebar mobile responsiva e cards premium.
- Tabelas agora possuem melhor rolagem horizontal em telas pequenas.
- O cadastro do professor passou a ter o campo **Função**.
- As funções disponíveis são:
  - Regente
  - Ensino Religioso
  - Educação Física
  - Arte
- A função fica salva em `users/{uid}.funcao`.
- A assinatura digital do professor passa a usar a função cadastrada quando disponível.

## Correção de autenticação

- Restaurada a exportação `ensureUser` em `src/services/usersService.ts`.
- Corrigido o erro `ensureUser is not exported from @/services/usersService`.
- O login com Google foi alterado de popup para redirect, reduzindo avisos de `Cross-Origin-Opener-Policy` no navegador.
- O `AuthContext` agora redireciona automaticamente para `/admin` ou `/professor` após o retorno do Google.
- O login de professores com documentos antigos não tenta alterar campos protegidos como `role`, `funcao`, `turmasIds` e `disciplinasIds`, evitando erro de permissão.


## Correção de permissão nas turmas do professor

- Corrigido erro `Missing or insufficient permissions` ao abrir turmas/professor.
- O serviço `listarTurmasProfessor` agora lê primeiro `users/{uid}.turmasIds` e depois abre cada turma por ID.
- As regras do Firestore foram ajustadas para permitir leitura de turmas vinculadas ao professor.
- Depois de atualizar, publique as regras com `firebase deploy --only firestore:rules,storage`.
