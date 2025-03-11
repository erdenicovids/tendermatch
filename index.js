app.post('/chat', async (req, res) => {
  const { land, industry, service } = req.body;

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
    console.log('GPT Antwort:', reply); // Nur relevante Antwort loggen

    res.json({ reply });

  } catch (error) {
    console.error('Fehler bei GPT-Antwort:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Fehler bei GPT-Antwort.' });
  }
});
