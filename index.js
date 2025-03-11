const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai'); // Neue SDK von OpenAI

const app = express(); // ✅ This defines app correctly

const PORT = process.env.PORT || 3000; // Use Render's port or fallback to 3000

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Make sure to set this in Render environment variables
});

app.post('/chat', async (req, res) => {
  const { land, industry, service } = req.body; // Use the corrected input fields

  const userPrompt = `
Ich suche nach aktuellen öffentlichen Ausschreibungen in folgendem Land: ${land}.
Industrie: ${industry}
Gesuchte Leistung: ${service}

Bitte finde dazu passende öffentliche Ausschreibungen und gib mir eine Liste zurück.
Bitte keine Einleitung, nur die Liste.
`;

  try {
    const gptResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: userPrompt }],
    });

    const reply = gptResponse.choices[0].message.content;
    console.log('GPT Antwort:', reply); // For debugging

    res.json({ reply });

  } catch (error) {
    console.error('Fehler bei GPT-Antwort:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Fehler bei GPT-Antwort.' });
  }
});

// ✅ Start the server
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
