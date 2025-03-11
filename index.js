const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai'); // OpenAI SDK

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/chat', async (req, res) => {
  const { land, industry, service, source } = req.body; // Neu: source (TED oder BUND)

  let userPrompt = '';

  // Je nach Auswahl anderes Prompt
  if (source === 'TED') {
    userPrompt = `
Ich suche nach aktuellen öffentlichen EU-Ausschreibungen (TED) für folgendes Land: ${land}.
Industrie: ${industry}
Gesuchte Leistung: ${service}

Bitte finde passende EU-Ausschreibungen auf TED (Tenders Electronic Daily).
Gib mir eine Liste von max. 5 relevanten Ausschreibungen. 
Keine Einleitung, nur die Liste mit Titel und Kurzbeschreibung.
    `;
  } else if (source === 'BUND') {
    userPrompt = `
Ich suche nach aktuellen öffentlichen nationalen Ausschreibungen in Deutschland (bund.de).
Branche: ${industry}
Gesuchte Leistung: ${service}

Bitte finde passende nationale Ausschreibungen auf bund.de.
Gib mir eine Liste von max. 5 relevanten Ausschreibungen.
Keine Einleitung, nur die Liste mit Titel und Kurzbeschreibung.
    `;
  } else {
    return res.status(400).json({ error: 'Ungültige Auswahl für Quelle (TED oder BUND).' });
  }

  try {
    const gptResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: userPrompt }],
    });

    const reply = gptResponse.choices[0].message.content;
    console.log('GPT Antwort:', reply);

    res.json({ reply });

  } catch (error) {
    console.error('Fehler bei GPT-Antwort:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Fehler bei GPT-Antwort.' });
  }
});

app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
