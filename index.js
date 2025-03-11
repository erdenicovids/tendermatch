const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai'); // Neue SDK von OpenAI

const app = express();
const PORT = process.env.PORT || 3000; // Fix: Fallback Port zu 3000

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Stelle sicher, dass das API Key in Render als Umgebungsvariable gesetzt ist
});

app.post('/chat', async (req, res) => {
  const { company, email, contact, phone, industry, description } = req.body;

  const userPrompt = `
Unternehmen: ${company}
E-Mail: ${email}
Kontaktperson: ${contact}
Telefon: ${phone}
Branche: ${industry}
Beschreibung: ${description}

Basierend auf diesen Daten, finde passende aktuelle öffentliche Ausschreibungen.
Antworte bitte nur mit einer Liste von Vergaben. Keine Einleitung.
`;

  try {
    const gptResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: userPrompt }],
    });

    const reply = gptResponse.choices[0].message.content;
    console.log('GPT Antwort:', reply); // Nur relevante Antwort loggen

    res.json({ reply });

  } catch (error) {
    console.error('Fehler bei GPT-Antwort:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Fehler bei GPT-Antwort.' });
  }
});

app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
