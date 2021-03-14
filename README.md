# H-FARM Prova Pratica - Aron Winkler

Nome: Aron Winkler

Github Frontend: [Frontend](https://github.com/waron97/hfarm.front)

Github Backend: [Backend](https://github.com/waron97/hfarm.back)

Live Url: [Live](https://candidatura-winkler.herokuapp.com)

## Indice

- [Overview](#overview)
- [Infrastruttura](#infrastruttura)
- [Testing](#testing)
- [Autenticazione](#autenticazione)
- [Funzionalità](#funzionalità)
- [Limitazioni e Lacune](#limitazioni-e-lacune)
- [Estensioni future](#estensioni-future)

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
- Django è un framework maturo che permette una buona velocità di sviluppo. In questo caso molti altri framwork, come Laravel, sarebbero state scelte ugualmente adatte, ma Django presenta alcuni vantaggi, a mio avviso, in termini di organizzione e scalabilità del codice.
- Si sarebbe potuto utilizzare anche Flask o Express dato che il server fa quasi esclusivamente da API, ma l'ORM di Django rende le interazioni con il database più rapidi da implementare rispetto a questi framework.

### Frontend

Sul lato client ho impostato l'infrastruttura con React.

Motivazioni:

- Trovo che l'esperienza SPA aggiunga più interattività e maneggevolezza su un progetto di questo tipo.
- Trovo che il tooling a disposizione del developer usando TypeScript e ESlint sia superiore a quello fornito sul lato server, quindi inserire la logica sul client potrebbe proteggere maggiormente da errori e imprevisti in runtime rispetto all'equivalente sul server.
- Rispetto ad altri framework come Vue e Angular ho optato per React soprattutto perchè a mio avviso è il più adatto a realizzare progetti in cui i componenti sono fortemente interdipendenti.

### Database

A servire i dati richiesti dall'applicazione è un'istanza gratuita PostgreSQL, registrata su ElephantSQL. Avendo optato per Django sul server, la scelta più naturale è utilizzare un database relazionale per sfruttare l'ORM di Django. L'esatta tipologia di database all'interno della famiglia dei relazionali non fa grande differenza, si è trattato semplicemente di precedente esperienza con i servizi che offrono istanze PostgreSQL gratuite a scopi di testing.

## Testing

Una versione live del progetto può essere visualizzata e fruita a [questo url](https://candidatura-winkler.herokuapp.com). Essendo il progetto su un dyno gratuito di heroku e un'istanza postgres gratuita, i load-time saranno probabilmente medio-alti, specialmente a più di 4-5 connessioni simultanee.

### Frontend

Il frontend può essere testato localmente in autonomia dal server. Il codice sorgente è disponibile [qui](https://github.com/waron97/hfarm.front).

```bash
# assumendo che node sia installato
git clone https://github.com/waron97/hfarm.front.git
cd hfarm.front
npm install
npm start
```

I dati utente, le call, e le candidature in questo ambiente **non sono presi dal database**, ma vengono generati con faker.js. Di conseguenza, non tutte le funzionalità della versione live sono operative durante il testing del solo frontend (ad esempio non si può modificare lo stato di una candidatura).

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

Per il testing locale del database, basta lanciare il server locale con Django. Tuttavia, il server è impostato in maniera tale da prendere i parametri di connessione del database dagli `environment variables`. Localmente questi non sono (presumibilmente) disponibili. Alcune possibili soluzioni sono:

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

Ho scritto personalmente una rudimentale procedura di autenticazione, dato che React e Django-Auth sono compatibili. Username e Password non vengono validati, al di là della costrizione di avere `length >= 1`

In generale, il flow di autenticazione è il seguente:

### Login

Il client controlla se ha un token in localStorage.

- **Sì** > `POST /api/authenticateWithToken`
  - `200` > Oggetto Utente è ritornato dal server e impostato come Context sul client
  - `>=400` > Server ritorna errore e client lo gestisce in funzione del testo ritornato, mostrando un messaggio d'errore adeguato all'utente
- **No** > Client controlla se sono presenti username e password nella finestra di autenticazione, e che non sia già stato effettuato un tentativo di accesso con queste credenziali
  - **Sì** -> `POST /api/authenticateWithUsernameAndPassword`
    - `200` server ritorna un `token` di sessione, che il client mette in `localStorage` e ripete la procedura
    - `>=400` > Server ritorna errore e client lo gestisce in funzione del testo ritornato, mostrando un messaggio d'errore adeguato all'utente
  - **No** -> Client aspetta che delle credenziali vengano inserite

### Signup

L'utente invia un form al server: `POST /api/registerUserWithUsernameAndPassword`

- `200` > Server ritorna l'oggetto utente autenticato e il token. Client mette il token in localStorage e l'oggetto-utente in Context (= utente viene automaticamente autenticato dopo la registrazione)
- `>=400` > Server ritorna errore e client lo gestisce in funzione del testo ritornato, mostrando un messaggio d'errore adeguato all'utente

## Funzionalità

In aggiunta a quanto già specificato nell'_overview_, aggiungo solo che:

- Il tipo di account (interno/esterno) va specificato durante il signup. L'account creato potrà creare Call solo di quella tipologia, ma interagire con Call di ogni tipologia.
- Come da richiesta, le call vengono mostrate in ordine di creazione inverso. Questo ordine è mantenuto anche dopo la filtrazione delle call.
- In aggiunta alle richieste esplicite della consegna, ho aggiunto due schermate:
  - `/posts` visualizza le Call postate dall'utente autenticato
  - `/applications` visualizza le Candidature dell'utente autenticato
- L'intero progetto è mobile-friendly, anche se non completamente ottimizzato per i dispositivi mobili

## Limitazioni

Data la natura di prototipo del prodotto e i tempi di esecuzione ristretti, ho fatto la scelta operativa di concentrarmi sulle funzionalità anzichè l'estetica. Di conseguenza, è evidente che la cura grafica non è particolarmente accentuata, anche se ho cercato di fare il più possibile di renderlo quantomento utilizzabile su diverse risoluzioni e viewport.

Dal punto di vista delle funzionalità, non è implementato nessun grado di protezione delle credenziali dell'utente in termini di cifratura. Questo è certamente inammissibile in un vero ambiente di produzione.

In terzo luogo, non mi è stato possibile implementare la gestione degli errori, sia server che client, nella misura in cui mi sarebbe piaciuto. Si tratta qui di un processo piuttosto laborioso in cui si esamina ogni tipologia di errori lanciat, in modo da gestirli in maniera coerente con il sistema, dando il feedback corretto all'utente o allo sviluppatore su cosa è andato storto. Nonostante questo non sia presente in modo completo in questo prototipo, ho comunque impostato funzioni e metodi in maniera tale che la gestione di questi errori venga svolta in alcuni punti ben precisi dell'applicazione, senza disperderli e quindi rendere il prodotto poco scalabile.

Non ho implementato la gestione dei CV in forma di file. Per farlo sarebbe stato necessario associare un bucket (per esempio in AWS S3).

Infine, i dati anagrafici che vengono mostrati sulla candidatura (in `/posts`) sono generati da faker.js anche in produzione. Purtroppo non ho integrato questi campi durante il design iniziale del progetto, e aggiungerli ora richiederebbe più tempo di quanto ne abbia a disposizione.

## Estensioni future

### Supporto multilingua

Al momento, tutte le stringhe dell'applicazione sono 'hard-coded'. Per supportare diverse lingue, le stringhe testuali utilizzate dovrebbero quantomeno essere prese da un file esterno, ma idealmente da un CMS per migliore scalabilità e gestibilità. A quel punto basta inserire un wrapper che gestisca la fonte delle stringhe attorno all'applicazione.

### Scalabilità

Dal punto di vista della gestione del codice crescente di un progetto in continuo ampliamento, ho spesso preferito usare Django per la sua naturale capacità di organizzare codebase molto complessi in sottounità che possono anche esistere indipendentemente. Questo rende l'estensione del codice più gestibile grazie alla presenza di un ambiente composto da molti sottoelementi ben circoscritti. Questo progetto in effetti usa già questa proprietà di Django: c'è una sotto-applicazione dedicata all'API e una sotto-applicazione dedicata ai contenuti grafici fruiti dall'utente. Se lo si dovesse ampliare, in futuro, le basi infrastrutturali per farlo sono già in buona parte presenti.

Per quanto riguarda invece la crescita di utenza e carico sul server, ci sono diversi modi per gestire una tale espansione. Una opzione è ovviamente di assegnare al progetto macchine con più memoria e potenza computazionale. Anche dockerizzare un'app Django è una soluzione comune, e a quel punto un servizio come Kubernetes per la distribuzione è un'ottima strada da percorrere.

### Protezione e recupero dei dati

Sicuramente tutti i servizi che offorno Database-As-Service hanno anche un'opzione per creare un backup periodico dei dati. Se si esegue il server, invece, da macchina virtuale propria, ci sarebbe bisogno di uno script o un servizio che esegue la stessa operazione localmente. Nel caso dei relazionali, come anche di Firestore e sicuramente di Mongo, inoltre, ci sono i cosiddetti Trigger Functions. Questi possono essere impostati in maniera tale da creare una traccia del valore precedente e del valore aggiornato di un campo quando questo viene cambiato o cancellato. In questo modo, se i dati vengono corrotti, si può facilmente tornare a una versione precedente senza resettare l'intero database.

### Gestione pagamenti

Non avendo molta esperienza in questo campo, posso solo dire che se mi trovassi a dover implementare una funzionalità per gestire pagamenti, mi affiderei a una soluzione esterna, come il plugin Stripe per Firebase.

### Modalità di deployment

In questo momento il progetto è live su heroku, ma in linea di massima qualsiasi VM su servizi come AWS o Google Cloud potrebbero ospitare il server. Tuttavia, per un deployment più efficiente del progetto, i file statici (HTML, JS, CSS) dovrebbero o essere serviti da un server esterno da quello dell'API, o, ancora meglio, da CDN. Soluzioni serverless come Netlify o Firebase possono essere un'alternativa se si è disposti a rinunciare al Backend Framework e a riscrivere il progetto secondo il modello _serverless functions_. Credo però che applicazioni con server complessi come questo non scalino bene in modalità serverless.

### App Android / iOS

Dato che il progetto è scritto in React, il salto a React-Native è piccolo e tutto sommato indolore, specialmente in questo stadio in cui l'estetica è seconda alla funzionalità (CSS non funziona in react-native, mentre tutta la logica JS sì).
