# H-FARM Prova Pratica - Aron Winkler

Nome: Aron Winkler

Github Frontend: [Frontend](https://github.com/waron97/hfarm.front)

Github Backend: [Backend](https://github.com/waron97/hfarm.back)

Live Url: [Live](https://candidatura-winkler.herokuapp.com)

## Overview

Il progetto presentato è un prototipo primitivo ma funzionante della consegna ricevuta.
L'end user può:

- Creare un account
- Accedere con il proprio account
- Mantenere la sessione ad ogni riapertura del browser
- Creare una Call
- Visualizzare le Call disponibili
- Filtrare le Call per titolo, tipo o clientId
- Salvare una call tra i preferiti e mantenere i preferiti di sessione in sessione
- Visualizzare i dettagli relativi a una Call
- Candidarsi a una Call
- Vedere la lista delle sue Call e delle sue Candidature
- Controllare lo stato di una propria candidatura
- Modificare lo stato di una candidatura fatta a una delle sue Call

## Infrastruttura

### Backend

Sul lato server ho impostato l'infrastruttura con Django (Python).

Motivazioni:

- Essendo i tempi di sviluppo richiesti piuttosto ristretti, ho optato per un framework con cui ho già buona esperienza.
- Velocità di sviluppo data da un framework maturo. In questo caso molti altri framwork, come Laravel, sarebbero state scelte ugualmente adatto. Il punto precedente qui ha fatto da discriminante.
- Si sarebbe potuto utilizzare anche Flask o Express dato che il server fa quasi esclusivamente da API, ma l'ORM di Django rende le interazioni con il database più rapidi da implementare rispetto a questi framework.

### Frontend

Sul lato client ho impostato l'infrastruttura con React.

Motivazioni:

- Trovo che l'esperienza SPA aggiunga più interattività e maneggevolezza su un progetto di questo tipo.
- Trovo che il tooling a disposizione del developer usando TypeScript e ESlint siano superiori a quelli forniti sul lato server, quindi inserire la logica sul client protegge maggiormente da errori e imprevisti in runtime rispetto all'equivalente sul server.
- Rispetto ad altri framework come Vue e Angular ho optato per React soprattutto perchè lo conosco bene e mi permetteva di soddifare le richieste della consegna entro i tempi previsti.

### Database

A servire i dati richiesti dall'applicazione è un'istanza gratuita PostgreSQL, registrata su ElephantSQL. Avendo optato per Django sul server, utilizzare un database relazionale per sfruttare l'ORM di Django è la scelta più naturale. L'esatta tipologia di database all'interno della famiglia dei relazionali non fa grande differenza, si è trattato semplicemente di conoscenza da parte mia di servizi che offrono istanze PostgreSQL gratuite a scopi di testing.

## Testing

Una versione live del progetto può essere visualizzato e fruito a [questo url](https://candidatura-winkler.herokuapp.com). Essendo il progetto su un dyno gratuito di heroku e un'istanza postgres gratuita, non ci si deve aspettare load-time bassi, specialmente a più di 4-5 connessioni simultanee.

### Frontend

Il frontend può essere testato localmente in autonomia dal server. Il codice sorgente è disponibile [qui](https://github.com/waron97/hfarm.front).

```bash
# assumendo che node sia installato
git clone https://github.com/waron97/hfarm.front.git
cd hfarm.front
npm install
npm start
```

I dati utente, call, candidature in questo ambiente **non sono presi dal database**, ma vengono generati con faker.js. Di conseguenza, non tutte le funzionalità della versione live sono operativi durante il testing del solo frontend (ad esempio non si può modificare lo stato di una candidatura).

### Backend

Per ricreare localmente il progetto:

```bash
# assumendo che python >= 3.8.5 e venv (o python3-venv su linux) siano installati
git clone https://github.com/waron97/hfarm.back
cd hfarm.back
python3 -m venv django_env # windows: python -m venv env


source django_env/bin/activate # windows: django_env\Scripts\activate



pip install -r requirements.txt
python manage.py runserver
```

_Il backend contiene già una versione precostruita del frontend_

Per il testing locale del database, basta lanciare il server locale con Django. Tuttavia:
Il server è impostato in maniera tale da prendere i parametri di connessione dal database dagli `environment variables`. Localmente questi non sono disponibili. Soluzioni:

1. Creare una istanza **postgres** e inserire i parametri in `hfarm.back/backend/settings.py` nella sezione `DATABASES`, e poi eseguire:

   ```python
   # hfarm.back/backed/settings.py
   DATABASES = {
   'default': {
       'ENGINE': 'django.db.backends.postgresql_psycopg2', # se postgres

       'NAME': '<your-database-name>',

       'USER': '<your-database-user>'),

       'PASSWORD': '<your-database-password>',

       'HOST': '<your-database-host>',

       'PORT': '<your-database-port>',
       }
   }
   ```

   ```bash
   # terminale
   python manage.py makemigrations
   python manage.py migrate
   ```

2. In riferimento alla mail inviata per questa candidatura, inserire i parametri ivi contenuti tra gli `environment variables`.

## Autenticazione

Ho scritto personalmente una rozza procedura di autenticazione, dato che React e Django-Auth non si sposano molto bene. Username e Password non vengono validati, al di là della costrizione di avere `length >= 1`

In generale, il flow di autenticazione è il seguente:

### Login

Il client controlla se ha un token in localStorage.

- **Sì** > `POST /api/authenticateWithToken`
  - `200` > Oggetto Utente è ritornato dal server e impostato come Context sul client
  - `>=400` > Server ritorna errore e client lo gestisce in funzione del testo ritornato, mostrando un messaggio d'errore corretto all'utente
- **No** > Client controlla se sono presenti username e password nella finestra di autenticazione, e che non sia già stato effettuato un tentativo di accesso con queste credenziali
  - **Sì** -> `POST /api/authenticateWithUsernameAndPassword`
    - `200` server ritorna un `token` di sessione, che il client mette in `localStorage` e ripete la procedura
    - `>=400` > Server ritorna errore e client lo gestisce in funzione del testo ritornato, mostrando un messaggio d'errore corretto all'utente
  - **No** -> Client aspetta che delle credenziali vengano inserite

### Signup

L'utente invia un form al server: `POST /api/registerUserWithUsernameAndPassword`

- `200` > Server ritorna l'oggetto utente autenticato e il token. Client mette il token in localStorage e l'oggetto-utente in Context (= utente viene automaticamente autenticato dopo la registrazione)
- `>=400` > Server ritorna errore e client lo gestisce in funzione del testo ritornato, mostrando un messaggio d'errore corretto all'utente

## Funzionalità

In aggiunta a quanto già specificato nell'_overview_, aggiungo solo che:

- Il tipo di account (interno/esterno) va specificato durante il signup. L'account creato potrà creare Call solo di quella tipologia, ma interagire con Call di ogni tipologia.
- Come da richiesta, le call vengono mostrate in ordine di creazione inverso. Questo ordine è mantenuto anche dopo la filtrazione delle call.
- In aggiunta alle richieste esplicite della consegna, ho aggiunto due schermate:
  - `/posts` visualizza le Call postate dall'untente autenticato
  - `/applications` visualizza le Candidature dell'utente autenticato
- L'intero progetto è mobile-friendly, anche se non completamente ottimizzato per i dispositivi mobili

## Limitazioni e Lacune
