# Hörprofile Woche 37 – Stimmen und Quellen

Die vier Profile sind erfundene Unterrichtsbeispiele. Die französischen Texte wurden für dieses Lernatelier erstellt. Sie beschreiben keine tatsächlichen Lernenden. Textfassung: `public/assets/listening-profiles.js`.

## Nora und Yanis

- Nora: `fr-FR-DeniseNeural`, weiblich, Microsoft Edge Read Aloud, Sprechtempo −15 %, `nora.mp3`.
- Yanis: `fr-FR-HenriNeural`, männlich, Microsoft Edge Read Aloud, Sprechtempo −15 %, `yanis.mp3`.
- Die beiden Dateien wurden mit edge-tts 7.2.8 erstellt; das Modellpaket gehört nicht zum Website-Download.

## Leila und Luca

Diese beiden Dateien wurden vollständig auf dem lokalen Rechner mit Piper 1.8.0 und heruntergeladenen ONNX-Stimmen erzeugt. Dafür wurden keine Unterrichtstexte an einen externen Sprachdienst geschickt.

- Leila: `fr_FR-siwis-medium`, weibliche Stimme, `leila.mp3`.
- Luca: `fr_FR-upmc-medium`, Sprecher `pierre`, ID `1`, männliche Stimme, `luca.mp3`.
- Tempo: Piper `length_scale=1.45`. Audios: MP3, 22.05 kHz, mono, 96 kbit/s.

### SIWIS

Yamagishi, Junichi; Honnet, Pierre-Edouard; Garner, Philip; Lazaridis, Alexandros (2017): *The SIWIS French Speech Synthesis Database*. University of Edinburgh, Centre for Speech Technology Research. [Datensatz](https://doi.org/10.7488/ds/1705). Datenlizenz: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Piper-Stimmenmodell bereitgestellt von Michael Hansen / Rhasspy: [SIWIS medium Modellkarte](https://huggingface.co/rhasspy/piper-voices/blob/main/fr/fr_FR/siwis/medium/MODEL_CARD). Für dieses Projekt wurde daraus die neue Aufnahme `leila.mp3` synthetisiert.

### UPMC Pierre

Pierre Chauvin / Institut des Systèmes Intelligents et de Robotique (ISIR), Université Pierre et Marie Curie (UPMC), Aufnahme 2013: *UPMC Pierre Voice Data*. [Datensatz und ausdrückliche Beschreibung der männlichen Stimme](https://github.com/marytts/upmc-pierre-data). Datenlizenz: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Piper-Stimmenmodell bereitgestellt von Michael Hansen / Rhasspy: [UPMC medium Modellkarte](https://huggingface.co/rhasspy/piper-voices/blob/main/fr/fr_FR/upmc/medium/MODEL_CARD). Für dieses Projekt wurde daraus die neue Aufnahme `luca.mp3` synthetisiert. Diese neue Audiodatei wird mit Namensnennung unter CC BY-SA 4.0 bereitgestellt.

Modelle und Python-Pakete müssen nicht in die Website-ZIP aufgenommen werden. Die MP3-Dateien sowie dieser Herkunftsnachweis reichen zur Wiedergabe aus. Die Skripte bleiben ausserhalb des Site-Checkouts.
