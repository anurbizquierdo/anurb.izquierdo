# Anurb Izquierdo — landing page

HTML, CSS e JavaScript puros, sem dependências. Estrutura inicial baseada na referência, com quatro looks alternados. As quatro fotos fornecidas em `midia/looks/` estão integradas e os textos das sete peças são exibidos ao lado das modelos.

## Visualizar

Na pasta do projeto, execute `python3 -m http.server 8000` e abra http://localhost:8000. Também é possível abrir `index.html` com duplo clique: essa prévia usa `looks-data.js`. Após editar o JSON, execute `node sync-data.cjs` para atualizar essa cópia. Pelo servidor local, o JSON é lido diretamente.

## Imagens

Coloque na pasta `midia/`:

- `imagem landing.png`: arte de abertura já integrada, com foto e lettering.
- `logo.png`: logo integrado no cabeçalho.
- `looks/`: fotos das quatro modelos. Os caminhos originais estão cadastrados em `looks.json`.
- `titulo.png`: lettering “Anurb Izquierdo” com fundo transparente, opcional. Substitui a tipografia provisória.
- `anjinhos.png`: faixa de anjinhos integrada na coluna esquerda. A imagem já contém as repetições e é exibida proporcionalmente, sem distorção.

Os caminhos e extensões podem ser alterados em `looks.json`. Imagens ausentes deixam espaços neutros; ornamento ausente fica oculto. A opção `midia.capaComLettering` preserva a arte completa e oculta o título tipográfico sobreposto.

## Editar os looks

`looks.json` é a fonte dos dados. Cada look contém:

- `numero`: identificação numérica do look.
- `foto.arquivo` e `foto.alt`: caminho da imagem e descrição acessível.
- `numeroDePecas`: quantidade de peças; mantenha igual ao tamanho de `pecas`.
- `pecas`: lista de peças, cada uma com `id`, `titulo`, `tipo` e `caracteristicaExtra`.

Use `"unica"` ou `"replicavel"` em `tipo`; `null` significa ainda não definido. Os números de peças iniciais (1, 3, 2, 1) seguem as peças identificáveis na referência e podem ser alterados. Cada item de `pecas` gera um bloco de texto com título, característica, indicação de peça única e tamanhos disponíveis.

Para criar outro look, acrescente um objeto à lista `looks`; a alternância de posição é automática. Ajustes de composição, tamanhos, transparência e responsividade ficam em `styles.css`.

ABOUT e CONTACT são rótulos reservados, sem links, até haver conteúdo e contato definidos. DROP 01 e PIECES navegam pela página.

## GitHub

Arquivos estáticos prontos para versionamento. Nenhum repositório foi criado e nada foi publicado. Para GitHub Pages, publique esta pasta na raiz da fonte escolhida; os caminhos são relativos e funcionam também em subdiretórios.

## Dados transcritos da referência

Os sete itens dos quatro looks foram preenchidos em inglês conforme `Frame 7.png`. `tamanhos` registra “All Sizes” quando informado; `null` indica ausência dessa informação. `tipoInferido: true` identifica peças classificadas provisoriamente como replicáveis a partir de “Original Design” e “All Sizes”. O texto solto “All Sizes” no look 03 está registrado em `observacaoReferencia`, sem inventar uma peça extra. Os textos agora são exibidos na página.
