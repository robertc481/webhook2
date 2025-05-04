const express = require('express');
const app = express();
const axios = require('axios');

app.use(express.json());

app.post('/', async (req, res) => {
	const { input } = req.body;

	if (input?.startsWith('test')) {
		return res.json({ output: input });
	}

	try {
		const badaniaUrl = 'https://letsplay.ag3nts.org/data/badania.json?v=1743591162';
		const uczelnieUrl = 'https://letsplay.ag3nts.org/data/uczelnie.json?v=1743591162';

		const [badaniaRes, uczelnieRes] = await Promise.all([
			axios.get(badaniaUrl),
			axios.get(uczelnieUrl)
		]);

		const badania = badaniaRes.data;
		const uczelnie = uczelnieRes.data;

		const target = badania.find(b =>
			b.temat?.toLowerCase().includes('podróż') || b.temat?.toLowerCase().includes('czas')
		);

		if (!target) {
			return res.json({ output: 'Nie znaleziono badań dot. podróży w czasie' });
		}

		const uczelnia = uczelnie.find(u => u.id === target.uczelnia_id);
		const wynik = `${target.temat}, ${uczelnia?.nazwa}, ${target.sponsor}`;

		res.json({ output: wynik });
	} catch (err) {
		res.status(500).json({ output: 'Błąd serwera: ' + err.message });
	}
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`tool2 running on port ${PORT}`));