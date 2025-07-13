# 📖 Easy Learning

Easy Learning é uma plataforma de e-learning desenvolvida com Next.js, o projeto oferecer uma experiência de aprendizado online fluida e envolvente, com foco em ensino à distância e venda de cursos online, reminiscente da Udemy. Com foco na performance, escalabilidade e na experiência do usuário, o Easy Learning conecta estudantes a instrutores em diversas áreas do conhecimento.

## ⚙️ Recursos Principais

* Experiência do Usuário Otimizada: Utilizando o poder do Next.js para Server-Side Rendering (SSR) e Static Site Generation (SSG), o Easy Learning oferece carregamento de página ultrarrápido e uma navegação suave, garantindo que os usuários tenham uma experiência sem interrupções.

* Gestão Abrangente de Cursos:

    * Criação de Cursos Intuitiva: Instrutores podem facilmente criar e gerenciar cursos, fazer upload de vídeos, adicionar descrições detalhadas, currículos e materiais complementares através de uma interface amigável.

    * Organização por Categorias: Cursos categorizados para facilitar a descoberta, permitindo que os alunos explorem tópicos de seu interesse, desde programação e design até artes e negócios.

* Funcionalidades para Alunos:

    * Painel Personalizado: Cada aluno possui um painel personalizado onde pode acompanhar seu progresso e acessar cursos inscritos.

    * Sistema de Avaliação e Comentários: Os alunos podem avaliar e comentar cursos, fornecendo feedback valioso para outros usuários e instrutores.

* Busca Avançada e Filtros: Ferramentas de busca e filtros poderosos que permitem aos alunos encontrar cursos específicos com base em palavras-chave, categorias, níveis de dificuldade e instrutores.

* Autenticação Segura e Gerenciamento de Usuários: Implementação de um sistema de autenticação robusto (via NextAuth.js ou similar) para garantir a segurança dos dados dos usuários e acesso baseado em funções (alunos, instrutores, administradores).

* Design Responsivo: O layout do Easy Learning é totalmente responsivo, garantindo uma experiência de usuário consistente e agradável em qualquer dispositivo, seja desktop, tablet ou celular.

* Integração de Pagamentos: Integração com Stripe para pagamentos online e controle de inscrições.

### 🛠️ Tecnologias Utilizadas

* [Next.js](https://nextjs.org/)
* [React](https://react.dev/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Tanstack](https://tanstack.com/)
* [Shadcn](https://ui.shadcn.com/)
* [Stripe](https://stripe.com/br)
* [pdf-lib](https://pdf-lib.js.org/)
* [Resend](https://resend.com/emails)
* [MongoDB](https://www.mongodb.com/)

## 📄 Dependências e Versões Necessárias

* next - Versão: 15.3.4
* react - Versão: 19.0.0
* tailwindcss  - Versão: 4.1.10
* tailwindcss-animate - Versão: 1.0.7
* mongoose - Versão: 8.16.0
* next-auth - Versão: 5.0.0-beta.29
* bcryptjs - Versão: 3.0.2
* stripe - Versão: 18.2.1
* resend - Versão: 4.6.0
* hello-pangea/dnd - Versão: 18.0.1
* tanstack/react-table - Versão: 8.21.3
* react-dropzone - Versão: 14.3.8
* react-quill - Versão: 2.0.0
* react-player - Versão: 3.1.0
* pdf-lib - Versão: 1.17.1
* pdf-lib/fontkit - Versão: 1.1.1

## Como rodar o projeto ✅
Antes de começar, certifique-se de ter o seguinte instalado em sua máquina:

* Node.js: Versão 18 ou superior. Você pode baixá-lo em nodejs.org.

* Git: Para clonar o repositório.

* MongoDB: Instale localmente ou use um serviço em nuvem como MongoDB Atlas.

* Contas em serviços externos (opcional, mas recomendado):

    * Stripe: Para processamento de pagamentos.

    * Resend: Para evios de emails.

Para executar a aplicação corretamente, é necessário seguir os seguintes passos:

1. Instale as dependências:
    ```
    npm install
    # ou
    yarn install
    ```
2. Crie e configure o arquivo de variáveis de ambiente (.env.local):
    * Na pasta frontend, crie um arquivo chamado .env.local. Para projetos Next.js, as variáveis de ambiente do lado do cliente precisam ser prefixadas com NEXT_PUBLIC_.
    * Preencha-o com as informações necessárias, como:
        ```
        MONGODB_CONNECTION_STRING=mongodb://localhost:27017/lms
        AUTH_SECRET=

        # Stripe Keys
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
        STRIPE_SECRET_KEY=

        # Resend Keys
        RESEND_API_KEY=

        NEXT_PUBLIC_BASE_URL=http://localhost:3000
        ```
3. Inicie o servidor de desenvolvimento do frontend:
    * Com tudo configurado, você pode iniciar o aplicativo Next.js:
        ```
        npm run dev
        # ou
        yarn dev
        ```
    * O Next.js geralmente inicia em http://localhost:3000 (ou outra porta disponível).

    ![Screenshot](/public/assets/images/Screenshot.png)

## ⏭️ Próximos passos

* Integração com login via Google (OAuth) para facilitar o acesso dos usuários com contas Google e aumentar a conversão de cadastros.

* Suporte ao PayPal como novo método de pagamento, ampliando as opções além do Stripe e atendendo um público maior.

* Sistema de perguntas e respostas dentro da página do curso, permitindo que alunos interajam diretamente com instrutores e outros estudantes.

* Avaliações e comentários dinâmicos na própria página de aula, incentivando o feedback contínuo e tornando a experiência mais interativa.

* Implementação de carrinho de compras, possibilitando a compra de múltiplos cursos em uma única transação.

* Lista de desejos (wishlist) para que usuários possam salvar cursos e comprar no futuro.

* Sistema de notificações (por e-mail e dentro da plataforma) para alertar sobre novos cursos, progresso, respostas em perguntas, e promoções.