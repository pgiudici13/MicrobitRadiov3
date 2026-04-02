<div align="center">
  <h1>MICROBIT RADIO V3</h1>
  <p><strong>Un sistema semplice e avanzato per comunicare e sincronizzare vari micro:bit via Radio.</strong></p>
  
  <p>
    <a href="https://pgiudici13.github.io/MicrobitRadiov3/">
      <img src="https://img.shields.io/badge/Sito_Web-Pagina_Ufficiale-1081c2?style=for-the-badge">
    </a>
    <a href="https://makecode.microbit.org/#github:pgiudici13/MicrobitRadiov3">
      <img src="https://img.shields.io/badge/MakeCode-Importa_Progetto-23c210?style=for-the-badge">
    </a>
  </p>

  <p>
    <a href="https://github.com/pgiudici13"><img src="https://img.shields.io/badge/Autore-pgiudici13-blue?style=for-the-badge&logo=github"></a>
    <a href="https://github.com/pgiudici13/MicrobitRadiov3/releases"><img src="https://img.shields.io/github/v/release/pgiudici13/MicrobitRadiov3?style=for-the-badge&label=Release&color=orange"></a>
    <img src="https://img.shields.io/badge/Hardware-micro:bit-brightgreen?style=for-the-badge&logo=microbit">
    <img src="https://img.shields.io/badge/Linguaggio-TypeScript-blue?style=for-the-badge&logo=typescript">
    <img src="https://img.shields.io/badge/Stato-Stabile-success?style=for-the-badge">
    <img src="https://img.shields.io/badge/Connessione-Radio_Frequenza-purple?style=for-the-badge">
  </p>

  <br>

  <em>Scambio di messaggi, icone personalizzate per utente e un grafico in tempo reale dei dispositivi online.</em>
  
</div>

<br>

---

## Come Funziona la Rete

Il sistema funziona in modalità ad-hoc: tutti i micro:bit comunicano direttamente uno con l'altro. Non c'è un server, tutti possono trasmettere e ricevere messaggi direttamente sullo stesso canale radio.

```mermaid
graph LR
    Mittente[Il tuo micro:bit] -->|Invia un Ping| Rete((Canale 137))
    Rete --> Riceventi[Altri micro:bit]
    Riceventi -->|Rispondono Sono qui!| Mittente
```

> [!TIP]
> **Cosa significa?** Quando "interroghi" la rete, tutti gli altri dispositivi nelle vicinanze ti rispondono in automatico. Così il tuo schermo si aggiorna e ti mostra esattamente quante persone sono collegate!

---

## Gestione dei Messaggi

Quando il micro:bit riceve un segnale, analizza rapidamente di cosa si tratta e decide l'azione più giusta da compiere, come mostrato qui sotto:

```mermaid
flowchart TD
    A([Nuovo Messaggio Ricevuto]) --> B{Che cos'è?}
    B -- Nome Utente --> C[Controllo del Nome]
    B -- Molto Testo --> D[Mette In Pausa Le Animazioni]
    B -- Comando Conto Utenti --> E[Aggiunge +1 alle Statistiche]
    
    C --> F{Lo conosco?}
    F -- Si --> G[Mostro la sua Icona Speciale e Suono]
    F -- No --> H[Mostro un Diamante e Suono]
    
    D --> I[Faccio scorrere il testo sullo schermo]
    E --> J[Attendo altre risposte]
```

---

## Gli Stati del micro:bit

In ogni momento, la scheda si trova in una modalità specifica per evitare di bloccarsi o mostrare schermate sbagliate sulle luci LED:

```mermaid
stateDiagram-v2
    [*] --> InAttesa
    InAttesa --> InviaMessaggio : Premi A / A+B
    InviaMessaggio --> InAttesa : Finito
    InAttesa --> DisegnaGrafico : Premi B
    DisegnaGrafico --> InAttesa : Finito
    InAttesa --> RiceveSegnale : Ricezione Radio
    RiceveSegnale --> AnimazioneSpeciale : Amico Riconosciuto
    RiceveSegnale --> MostraTesto : Frase Ricevuta
    AnimazioneSpeciale --> InAttesa : Finito
    MostraTesto --> InAttesa : Finito
```

---

## Struttura del Progetto (Mappa delle Funzionalità)

Ecco uno schema semplice diviso per categorie che riassume tutto ciò di cui si occupa il codice di RadioV3:

```mermaid
flowchart LR
    Root((Progetto Radio)) --> Rete[Rete Radio]
    Root --> Vista[Disegni a Schermo]
    Root --> Sec[Sicurezza]
    Root --> Audio[Audio e Suoni]
    
    Rete --> R1(Canale Pubblico 137)
    Rete --> R2(Massima Portata)
    
    Vista --> V1(Barre Grafiche)
    Vista --> V2(Libreria Turtle)
    
    Sec --> S1(Nomi Speciali Ammessi)
    Sec --> S2(Blocco degli Intrusi)
    
    Audio --> A1(Allarmi Bleep)
    Audio --> A2(Canzoncine per Amici)
```

<details open>
<summary><b>Dettaglio delle Funzioni Più Belle</b></summary>
<br>

* **Grafico a Barre**: Accende i LED colonna per colonna per contare fisicamente i ritorni (fino a 20 schede collegate senza sovrapporsi).
* **Icone Personalizzate**: Se il sistema capisce che si è connesso un identificativo conosciuto, fa partire una sua animazione unica con tanto di colonna sonora in sottofondo.
* **Priorità al Testo**: Se ricevi un testo lungo, lo scorrimento ha la precedenza assoluta, disattivando qualsiasi altro disegno sulla lavagna LED per non farti perdere il messaggio.

</details>

---

## Uso dei Pulsanti

Cosa succede quando premi i bottoni fisici sulla scocca del micro:bit.

| Pulsante | Azione | Cosa succede sullo schermo |
| :---: | :--- | :--- |
| <kbd>A</kbd> | Invia Saluto | Invia un saluto alla rete. Tutti vedranno un diamante, o un'animazione speciale se sei un profilo VIP. |
| <kbd>A</kbd> + <kbd>B</kbd> | Conta Utenti | Azzera il display e lancia il controllo radio per vedere chi c'è in giro. |
| <kbd>B</kbd> | Aggiorna Schermo | Ridisegna il grafico dal vivo in base all'ultimo "Conta Utenti" effettuato. |

---

## Librerie Usate

Per far funzionare il codice (`ptx.json`) ci appoggiamo a librerie esterne molto comode:

1. `radio`: Che abilita l'antenna principale.
2. `radio-broadcast`: Per far viaggiare rapidi i messaggi a tutto il gruppo, non solo ad una persona.
3. `microturtle`: Una libreria speciale che permette di usare lo schermo dei LED come se fosse un piano da disegno per il nostro grafico a barre.

---

## Da fare prima di usarlo...

> [!NOTE]
> **Tutti possono partecipare!** A differenza delle versioni precedenti, ora chiunque può inviare e ricevere messaggi e far parte del conteggio HUD senza configurazioni.

Tuttavia, se vuoi sbloccare le **funzioni VIP** (un'icona speciale dedicata e una campanella d'avviso personalizzata quando ti connetti), puoi aprire una discussione su GitHub indicando il nome del tuo micro:bit e ti aggiungeremo alla lista ufficiale nel codice!

---

## Link Utili e Accesso Veloce

Se vuoi accedere istantaneamente al codice o visualizzare l'interfaccia dedicata: 

* [**Sito Web del Progetto**](https://pgiudici13.github.io/MicrobitRadiov3/) - Pagina ufficiale ospitata su GitHub Pages.
* [**Importa in MakeCode**](https://makecode.microbit.org/#github:pgiudici13/MicrobitRadiov3) - Clicca qui per aprire in automatico la mappa di blocchi logici del programma direttamente sul sito ufficiale di Microsoft MakeCode.

---

> [!NOTE]
> Progetto compilato, scritto e pensato interamente da **[pgiudici13](https://github.com/pgiudici13)**. 
> Sviluppato per fini didattici e per capire come far comunicare piccole schede intelligenti con la minor fatica possibile.
