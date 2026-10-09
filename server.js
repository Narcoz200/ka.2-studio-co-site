const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve tutti i file statici (HTML, CSS, immagini) dalla cartella corrente
app.use(express.static(path.join(__dirname)));

// Memoria temporanea in-memory per chat e appuntamenti
let database = {
    chats: {}, 
    appointments: [] 
};

// --- ROTTE API PER LE CHAT ---

app.get('/api/chats', (req, res) => {
    res.json(database.chats);
});

app.get('/api/chats/:email', (req, res) => {
    const email = req.params.email;
    res.json(database.chats[email] || []);
});

app.post('/api/chats/:email', (req, res) => {
    const email = req.params.email;
    const { sender, text, time } = req.body;

    if (!database.chats[email]) {
        database.chats[email] = [];
    }

    database.chats[email].push({ sender, text, time });
    res.json({ success: true, messages: database.chats[email] });
});

// --- ROTTE API PER GLI APPUNTAMENTI ---

app.get('/api/appointments', (req, res) => {
    res.json(database.appointments);
});

app.post('/api/appointments', (req, res) => {
    const { title, date, time } = req.body;
    if (!title || !date) {
        return res.status(400).json({ error: "Titolo e data obbligatori" });
    }

    const newAppt = { title, date, time: time || 'Flessibile' };
    database.appointments.push(newAppt);
    res.json({ success: true, appointments: database.appointments });
});

app.delete('/api/appointments/:index', (req, res) => {
    const index = parseInt(req.params.index);
    if (index >= 0 && index < database.appointments.length) {
        database.appointments.splice(index, 1);
        return res.json({ success: true, appointments: database.appointments });
    }
    res.status(404).json({ error: "Appuntamento non trovato" });
});

// --- GESTIONE PAGINE HTML ---
// Se qualcuno apre la home, mostra index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Avvio del server
app.listen(PORT, () => {
    console.log(`Server KA.2 avviato sulla porta ${PORT}`);
});
