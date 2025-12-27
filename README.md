# Ask Picasso - Your Empathetic AI Companion




## Description

Ask Picasso is an empathetic AI companion designed to provide supportive, understanding, and emotionally intelligent conversations. Powered by advanced AI, it acts as a thoughtful listener and responder, helping users process emotions, reflect on experiences, and engage in meaningful dialogue with a focus on empathy.

This web application offers a simple, intuitive chat interface where users can interact with an AI that prioritizes emotional awareness and compassionate responses.

## Features

- **Empathetic Responses**: The AI is tuned to recognize and respond to user emotions with understanding and care.
- **Real-time Chat Interface**: Seamless conversation flow in a clean, modern UI.
- **Privacy-Focused**: Conversations are handled client-side where possible, with no unnecessary data storage.
- **Powered by Cutting-Edge AI**: Likely leveraging models with strong emotional intelligence capabilities (e.g., integrations similar to Hume AI's Empathic Voice Interface or custom prompts for empathy).

## Technologies Used

- **Frontend**: Next.js (App Router) with React
- **Styling**: Tailwind CSS or similar modern CSS framework
- **AI Integration**: Vercel AI SDK, possibly with providers like OpenAI, Grok, Anthropic, or specialized empathic models
- **Deployment**: Vercel (serverless functions for streaming responses)
- **Other**: TypeScript, shadcn/ui components (common in Vercel AI templates)

## Installation & Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/ntiyisopicasso/ask-picasso.git
   cd ask-picasso
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:
   ```
   # Example for OpenAI (replace with your actual provider)
   OPENAI_API_KEY=your_openai_key_here

   # Or for other providers, e.g., ANTHROPIC_API_KEY, GROQ_API_KEY, etc.
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

The easiest way to deploy is on Vercel:

1. Push your repository to GitHub.
2. Import the project on [vercel.com](https://vercel.com).
3. Add your API keys as environment variables in the Vercel dashboard.
4. Deploy!

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests for bug fixes, features, or improvements.

- Fork the repository
- Create a feature branch
- Commit your changes
- Open a Pull Request

## License

This project is open-source and available under the [MIT License](LICENSE).

## Acknowledgments

- Inspired by advancements in empathic AI and humane technology.
- Built using Vercel's AI templates and ecosystem.

---

*Note: This README is based on the deployed application at empathy-ai-xi.vercel.app. If this repository is for the source code, update details as needed.*
