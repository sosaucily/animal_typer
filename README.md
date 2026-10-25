# Alphabet Zoo

A playful A–Z typing game with animal photographs and a parent voice recorder.

Run it locally:

```sh
npm install
npm run dev
```

Open the localhost link printed by Vite. Click **Voice studio** in the top left.
Each letter has one full-sentence prompt (say “A is for Aardvark!”). Allow
microphone access, hold **Space** or the
microphone button, speak when the button says **Recording**, and release to save.
Listen back, record a new take if needed, then choose **Next sentence**. The A–Z
buttons let you jump to any letter; arrow keys move between individual prompts.
Each take can be up to 15 seconds. Recording stops if you leave the window.

When you run the app locally, each take is saved as an audio file under
`public/audio/voice/`, and `manifest.json` lists the current takes. The game uses
these project files when **Use my recordings in the game** is enabled. Commit and
publish the updated project to include the voices on other devices. A published
copy can play and export them; edit the files through the local app. Missing
recordings use the original MP3 files in `public/audio`, then browser speech.
The published Voice Studio explains that recording requires a local build and
disables recording there while keeping listening and backup export available.
On a correct key, the game speaks your recorded sentence while showing its
animal. Personal takes finish playing before the game advances. Gameplay pauses
while Voice studio is open. The A–Z buttons jump straight to each sentence.

If you made recordings with the earlier browser-only version, Voice studio shows
**Copy earlier browser recordings into project**. This copies any takes that
aren't already in the project. It leaves the earlier browser copies in place. If
those recordings are on an older published site, use **Download earlier browser
recordings** there and **Import backup** in the local project app.

Use **Export backup** to download a JSON voice pack. **Import backup** restores
it into another local copy of the project. Import replaces only matching prompts;
other takes stay in place. Recordings are written directly to the local project
folder; there is no upload service or paid voice API. Microphone recording
requires localhost or HTTPS.

The 26 animal pictures are bundled in `public/animals` and work without an image
service. They are openly licensed Wikimedia Commons images, with a public-domain
unicorn illustration. Each game page links its creator, source, and license.
The full metadata is in `public/animals/credits.json` and
`src/data/animalImages.json`. Fredoka and Nunito are bundled under the SIL Open
Font License; their license files are in `public/fonts`.

To fetch the image set again (internet required):

```sh
npm run images:download
```

The downloader preserves completed downloads and checks licenses. To replace an
image, update its article selection in the script and remove that letter's entry
from `public/animals/credits.json` before rerunning it. Individual Commons images
retain their listed licenses; the application code does not grant additional
rights to those images.

Build and check:

```sh
npm run build
npm run lint
npx playwright install chromium
npm test
```

Browser tests use a simulated microphone to check hold/release recording,
playback, persistence, backup import/export, permission errors, local images,
and mobile layout. They do not record from your real microphone.
