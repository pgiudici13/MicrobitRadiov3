<div align="center">
  <h1>MICROBIT RADIO V3</h1>
  <p><strong>Protocollo Avanzato di Sincronizzazione e Comunicazione Radio per sistemi embedded.</strong></p>
  
  <p>
    <a href="https://github.com/pgiudici13"><img src="https://img.shields.io/badge/Autore-pgiudici13-blue?style=for-the-badge&logo=github"></a>
    <img src="https://img.shields.io/badge/Hardware-micro:bit-brightgreen?style=for-the-badge&logo=microbit">
    <img src="https://img.shields.io/badge/Linguaggio-TypeScript-blue?style=for-the-badge&logo=typescript">
    <img src="https://img.shields.io/badge/Stato-Stabile-success?style=for-the-badge">
    <img src="https://img.shields.io/badge/Connessione-BLE_Protocol-purple?style=for-the-badge">
  </p>

  <br>

  <em>Scambio rapido di messaggi, identificazione visiva dei nodi e quantificazione HUD online.</em>
  
</div>

<br>

---

## Architettura di Rete

Il sistema basa le proprie fondamenta su una topologia di trasmissione broadcast-centrica. Nessun nodo è esclusivamente server; tutti agiscono come *peer* indipendenti all'interno dell'infrastruttura condivisa sul canale.

```mermaid
graph LR
    Mittente[Dispositivo Mittente] -->|Invia Impulso| Rete((Canale 137))
    Rete --> Riceventi[Nodi Connessi]
    Riceventi -->|Segnale di Presenza| Mittente
```

> [!TIP]
> **Lettura Semplificata:** Il mittente interroga il canale, i dispositivi adiacenti che ascoltano inviano un pacchetto di conferma, garantendo l'aggiornamento costante della conta utenti in tempo reale.

---

## Elaborazione dei Flussi

Quando il protocollo in background rileva una modulazione di frequenza, esegue un "routing" per indirizzare i bit ricevuti alle loro funzioni associate. Questo diagramma di flusso illustra la logica ramificata:

```mermaid
flowchart TD
    A([Segnale in Ingresso]) --> B{Analisi del Payload}
    B -- ID Profilo --> C[Check Identificativo]
    B -- Stringa Testuale --> D[Sospensione Attività Baseline]
    B -- Ping di Sync --> E[Incremento Ledger SYNC]
    
    C --> F{Whitelist?}
    F -- Si --> G[Routine Grafica Dedicata]
    F -- No --> H[Scarto Silenzioso del Pacchetto]
    
    D --> I[Forzatura Scrolling a Schermo]
    E --> J[Attesa Ricalcolo Variabile]
```

---

## Macchina a Stati del Dispositivo

Il comportamento del software è descrivibile tramite una macchina a stati finiti (FSM). Il micro_bit passa da stato passivo ("Attesa") a stati attivi solo tramite precise condizioni:

```mermaid
stateDiagram-v2
    [*] --> Attesa
    Attesa --> Trasmissione : Pressione Input (A / A+B)
    Trasmissione --> Attesa : Output Inviato
    Attesa --> Disegno_HUD : Interrogazione Grafica (Tasto B)
    Disegno_HUD --> Attesa : Timeout Interfaccia
    Attesa --> Ricezione : Interrupt Radio
    Ricezione --> Esecuzione_VIP : Rilevato Profilo Noto
    Ricezione --> Alert_Testuale : Dati Testo Generici
    Esecuzione_VIP --> Attesa : Termine Animazione
    Alert_Testuale --> Attesa : Fine Scorrimento Testo
```

---

## Panoramica a Mappa Mentale

Una sintesi radiale dei sotto-settori informatici toccati durante il disegno tecnico del software e delle limitazioni superate in fase di design:

```mermaid
mindmap
  root((RadioV3))
    Protocollo Rete
      Comunicazione Broadcast
      Canale Sicuro 137
      Massimale Tx 7
    Interfaccia Grafica
      Estensione Microturtle
      Piano Cartesiano X/Y
      Draw Rendering a Barre
    Sicurezza
      Gestione Identificativi
      Lock di Trasmissione
    Subroutine Audio
      Campionatura Frequenze
      Interrupt Prioritario
```

<details open>
<summary><b>Dettaglio Funzioni Essenziali</b></summary>
<br>

* **Heads-Up Display (HUD) a Barre**: Rendering a colonne dei LED per contare fisicamente i ritorni (fino a 20).
* **Profilazione e Audio VIP**: Logiche di eccezione per identificativi noti con riproduzione parallela di file `.MIDI` ed icone isolate.
* **Priorità Flusso Stringhe**: Gestione asincrona che costringe a schermo interi buffer testuali prevenendo omissioni di dati.

</details>

---

## Controlli Hardware

Mappatura dei pattern di inserimento tramite interattori fisici e relative conseguenze a display.

| Ingresso Fisico | Azione di Rete | Conseguenza sul Display |
| :---: | :--- | :--- |
| <kbd>A</kbd> | Invio Trasmissione Unilaterale | Risoluzione in fade-in dei loghi associati nelle board che accettano il nodo. |
| <kbd>A</kbd> + <kbd>B</kbd> | Interrogazione Broad Globale | Reset e ridisegno scalare della matrice alla conta dei ritorni positivi. |
| <kbd>B</kbd> | Accesso Interfaccia Dati | Rendering in tempo reale delle utenze aggregate via calcoli proporzionali per pixel. |

---

## Moduli MakeCode

Le configurazioni d'ambiente interne (`ptx.json`) si affidano a quattro core esterni.

1. `radio`: Connettività base ad antenna.
2. `microphone`: Interfacciamenti coi segnali input audio ambientali.
3. `radio-broadcast`: Ampliamento del comparto trasmissioni a pacchetto rapido.
4. `microturtle`: Algoritmo a griglia interpolata indispensabile per le funzioni HUD visive di questo protocollo.

---

## Prerequisiti Base per l'Uso

> [!WARNING]
> Condizione vincolante all'esecuzione corretta dell'infrastruttura è l'**abilitazione manuale nel codice sorgente**.

Per fare in modo che la scheda operi correttamente come nodo attivo e possa trasmettere messaggi all'interno del progetto, l'utente *deve* modificare manualmente una specifica variabile identificativa all'interno del codice sorgente di base (configurazione del block TypeScript). 
In mancanza di questo intervento editoriale, la board interpreterà parzialmente la direttiva ed eliminerà la propria interfaccia d'uscita dai cicli generici in radio frequenza.

---

> [!NOTE]
> Progetto compilato, scritto e architettato interamente da **[pgiudici13](https://github.com/pgiudici13)**. 
> Sviluppato per fini di test su interconnessioni hardware e limitazioni di protocollo custom basate su architetture standard e embedded.
