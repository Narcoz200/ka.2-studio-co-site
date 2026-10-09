const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Memoria temporanea in-memory (sostituibile in seguito con un database reale tipo MongoDB/PostgreSQL)
let database = {
    chats: {}, // es. { "mario@email.com": [ {sender, text, time} ] }
    appointments: [] // es. [ {title, date, time} ]
};

// --- ROTTE API PER LE CHAT ---

// Ottieni tutte le chiavi/chat attive
app.get('/api/chats', (req, res) => {
    res.json(database.chats);
} );

// Ottieni i messaggi di una specifica chat
app.get('/api/chats/:email', (req, res) => {
    const email = req.params.email;
    res.json(database.chats[email] || []);
});

// Invia un messaggio (da cliente o staff)
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

// Ottieni tutti gli appuntamenti
app.get('/api/appointments', (req, res) => {
    res.json(database.appointments);
});

// Aggiungi un appuntamento
app.post('/api/appointments', (req, res) => {
    const { title, date, time } = req.body;
    if (!title || !date) {
        return res.status(400).json({ error: "Titolo e data obbligatori" });
    }

    const newAppt = { title, date, time: time || 'Flessibile' };
    database.appointments.push(newAppt);
    res.json({ success: true, appointments: database.appointments });
});

// Elimina un appuntamento
app.delete('/api/appointments/:index', (req, res) => {
    const index = parseInt(req.params.index);
    if (index >= 0 && index < database.appointments.length) {
        database.appointments.splice(index, 1);
        return res.json({ success: true, appointments: database.appointments });
    }
    res.status(404).json({ error: "Appuntamento non trovato" });
});

// Avvio del server
app.listen(PORT, () => {
    console.log(`Server KA.2 avviato sulla porta ${PORT}`);
});