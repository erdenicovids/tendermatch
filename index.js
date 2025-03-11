const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai'); // nur die neue SDK

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
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

    console.log('GPT Antwort:', gptResponse); // für Debugging

    const reply = gptResponse.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error('Fehler bei GPT-Antwort:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Fehler bei GPT-Antwort.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
